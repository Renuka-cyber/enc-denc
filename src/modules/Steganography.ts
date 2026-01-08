// Helper to convert text to binary string
function textToBinary(text: string): string {
  return text.split('').map(char => {
    return char.charCodeAt(0).toString(2).padStart(8, '0');
  }).join('');
}

// Helper to convert binary string to text
function binaryToText(binary: string): string {
  let text = '';
  for (let i = 0; i < binary.length; i += 8) {
    const byte = binary.substring(i, i + 8);
    text += String.fromCharCode(parseInt(byte, 2));
  }
  return text;
}

// Helper to get the least significant bit
function getLSB(byte: number): number {
  return byte & 1;
}

// Helper to set the least significant bit
function setLSB(byte: number, bit: number): number {
  return (byte & 0xFE) | (bit & 1);
}

/**
 * Embeds text into the least significant bits of an image's pixel data.
 * Assumes RGBA format.
 * @param imageData The ImageData object of the image.
 * @param text The text to embed.
 * @returns A new ImageData object with the text embedded.
 */
export function embedTextInImage(imageData: ImageData, text: string): ImageData {
  const data = new Uint8ClampedArray(imageData.data); // Work on a copy
  const binaryText = textToBinary(text);
  const binaryTextLength = binaryText.length;

  // We need to embed the length of the binary text first, so we know when to stop extracting.
  // Let's use 32 bits (4 bytes) for the length. Max length 2^32 - 1 bits.
  const lengthBinary = binaryTextLength.toString(2).padStart(32, '0');
  const fullBinaryData = lengthBinary + binaryText;

  // We use R, G, B channels for embedding, skipping the A (alpha) channel.
  // So, available bits are (data.length / 4) * 3.
  if (fullBinaryData.length > (data.length / 4) * 3) {
    throw new Error('Text is too long to embed in this image. Try a larger image or shorter text.');
  }

  let dataIndex = 0;
  for (let i = 0; i < fullBinaryData.length; i++) {
    // Skip alpha channel (index + 3)
    while ((dataIndex + 1) % 4 === 0) { 
      dataIndex++;
    }
    data[dataIndex] = setLSB(data[dataIndex], parseInt(fullBinaryData[i], 10));
    dataIndex++;
  }

  return new ImageData(data, imageData.width, imageData.height);
}

/**
 * Extracts text from the least significant bits of an image's pixel data.
 * Assumes RGBA format.
 * @param imageData The ImageData object of the image.
 * @returns The extracted text.
 */
export function extractTextFromImage(imageData: ImageData): string {
  const data = imageData.data;
  let extractedBinaryLength = '';
  let dataIndex = 0;

  // First, extract the 32 bits representing the length of the hidden text
  for (let i = 0; i < 32; i++) {
    while ((dataIndex + 1) % 4 === 0) {
      dataIndex++;
    }
    if (dataIndex >= data.length) {
      throw new Error('Image is too small or corrupted to extract length information.');
    }
    extractedBinaryLength += getLSB(data[dataIndex]);
    dataIndex++;
  }

  const textLength = parseInt(extractedBinaryLength, 2);
  if (isNaN(textLength) || textLength < 0) {
    throw new Error('Could not determine hidden text length. Image may not contain hidden data or is corrupted.');
  }

  let extractedBinaryText = '';
  for (let i = 0; i < textLength; i++) {
    while ((dataIndex + 1) % 4 === 0) {
      dataIndex++;
    }
    if (dataIndex >= data.length) {
      throw new Error('Incomplete hidden data found. Image may be corrupted or text was not fully embedded.');
    }
    extractedBinaryText += getLSB(data[dataIndex]);
    dataIndex++;
  }

  return binaryToText(extractedBinaryText);
}

// Utility to load image and get ImageData
export async function loadImageData(file: File): Promise<ImageData> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return reject(new Error('Could not get 2D context from canvas.'));
      }
      ctx.drawImage(img, 0, 0);
      resolve(ctx.getImageData(0, 0, img.width, img.height));
    };
    img.onerror = (e) => reject(new Error(`Failed to load image: ${e.type}`));
    img.src = URL.createObjectURL(file);
  });
}

// Utility to convert ImageData to Blob
export async function imageDataToBlob(imageData: ImageData): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    canvas.width = imageData.width;
    canvas.height = imageData.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return reject(new Error('Could not get 2D context from canvas.'));
    }
    ctx.putImageData(imageData, 0, 0);
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('Failed to convert canvas to Blob.'));
      }
    }, 'image/png'); // Always save as PNG to preserve LSB changes
  });
}