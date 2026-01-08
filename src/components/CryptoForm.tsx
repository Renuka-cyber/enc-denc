import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Lock, Unlock, ShieldCheck } from 'lucide-react';

import { generateSalt, securityLog } from '@/utils/security';
import { deriveKeyPBKDF2 } from '@/modules/KeyDerivation';
import { generateDataEncryptionKey, deriveMasterKey, wrapDataKey, unwrapDataKey } from '@/modules/KeyManagement';
import { packageMetadata, parseMetadata, ParsedMetadata } from '@/modules/Metadata';
import { encryptFileStream } from '@/modules/EncryptionStream';
import { decryptFileStream } from '@/modules/DecryptionStream';
import { downloadFile } from '@/utils/download';

const ENCRYPTED_FILE_EXTENSION = '.dyadenc';
const MIN_PASSWORD_LENGTH = 7; // Define minimum password length

type Mode = 'encrypt' | 'decrypt';

interface CryptoFormProps {
  defaultMode?: Mode;
}

export const CryptoForm = ({ defaultMode = 'encrypt' }: CryptoFormProps) => {
  const { toast } = useToast();
  const [mode, setMode] = useState<Mode>(defaultMode);
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [receiverEmail, setReceiverEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setMode(defaultMode);
  }, [defaultMode]);

  const getMissingInputsMessage = () => {
    const missing: string[] = [];
    if (!file) missing.push('File');
    if (!password) missing.push('Password');
    if (!receiverEmail) missing.push('Receiver Email');

    if (missing.length === 0) return '';
    if (missing.length === 1) return `Missing: ${missing[0]}.`;
    
    const last = missing.pop();
    return `Missing: ${missing.join(', ')} and ${last}.`;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    if (selectedFile) {
      // Automatically switch mode based on file extension if defaultMode is not explicitly set
      // or if the user selects a file that clearly indicates a different mode.
      if (defaultMode === 'encrypt' && selectedFile.name.endsWith(ENCRYPTED_FILE_EXTENSION)) {
        setMode('decrypt');
      } else if (defaultMode === 'decrypt' && !selectedFile.name.endsWith(ENCRYPTED_FILE_EXTENSION)) {
        setMode('encrypt');
      } else {
        setMode(defaultMode); // Revert to default mode if no clear indication from file
      }
    }
  };

  const handleEncrypt = useCallback(async () => {
    const missingMessage = getMissingInputsMessage();
    if (missingMessage) {
      toast({
        title: 'Missing Inputs',
        description: missingMessage,
        variant: 'destructive',
      });
      return;
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      toast({
        title: 'Password Too Short',
        description: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`,
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    securityLog('Starting encryption process.');

    try {
      // 1. Salt Generation
      const sp = generateSalt(); // Password Salt
      const se = generateSalt(); // Email Salt

      // 2. Key Derivation (PBKDF2)
      const kp = await deriveKeyPBKDF2(password, sp);
      const ke = await deriveKeyPBKDF2(receiverEmail, se);

      // 3. Master Key Derivation (HKDF)
      const km = await deriveMasterKey(kp, ke);

      // 4. Data Key Generation
      const dek = await generateDataEncryptionKey();

      // 5. Key Wrapping (AES-GCM)
      const { wrappedKey, iv: wiv } = await wrapDataKey(dek, km);

      // 6. File Encryption (AES-256-GCM)
      const encryptedContentBlob = await encryptFileStream(file, dek);

      // 7. Metadata Packaging
      const header = packageMetadata(file.name, sp, se, wiv, wrappedKey);

      // 8. Final Output Blob: Header + Encrypted Content
      const finalBlob = new Blob([header, encryptedContentBlob], {
        type: 'application/octet-stream',
      });

      const encryptedFileName = `${file.name}${ENCRYPTED_FILE_EXTENSION}`;
      downloadFile(finalBlob, encryptedFileName);

      toast({
        title: 'Encryption Successful',
        description: `File saved as ${encryptedFileName}.`,
      });
    } catch (error) {
      securityLog(`Encryption failed: ${error}`, 'ERROR');
      toast({
        title: 'Encryption Failed',
        description: error instanceof Error ? error.message : 'An unknown error occurred during encryption.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [file, password, receiverEmail, toast, getMissingInputsMessage]);

  const handleDecrypt = useCallback(async () => {
    const missingMessage = getMissingInputsMessage();
    if (missingMessage) {
      toast({
        title: 'Missing Inputs',
        description: missingMessage,
        variant: 'destructive',
      });
      return;
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      toast({
        title: 'Password Too Short',
        description: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`,
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    securityLog('Starting decryption process.');

    try {
      // 1. Metadata Extraction
      const metadata: ParsedMetadata = await parseMetadata(file);
      const encryptedContentBlob = file.slice(metadata.headerLength);

      // 2. Key Derivation (PBKDF2)
      const sp = metadata.sp;
      const se = metadata.se;

      const kp = await deriveKeyPBKDF2(password, sp);
      const ke = await deriveKeyPBKDF2(receiverEmail, se);

      // 3. Master Key Derivation (HKDF)
      const km = await deriveMasterKey(kp, ke);

      // 4. Key Unwrapping (AES-GCM) & Access Control
      // This step verifies both password and email correctness via the AES-GCM tag check.
      const dek = await unwrapDataKey(metadata.wdek, metadata.wiv, km);

      // 5. File Decryption & Integrity Verification
      const decryptedBlob = await decryptFileStream(encryptedContentBlob, dek);

      // 6. Download
      const originalFileName = metadata.fileName;
      downloadFile(decryptedBlob, originalFileName);

      toast({
        title: 'Decryption Successful',
        description: `File recovered as ${originalFileName}.`,
      });
    } catch (error) {
      securityLog(`Decryption failed: ${error}`, 'ERROR');
      toast({
        title: 'Decryption Failed',
        description: error instanceof Error ? error.message : 'Authentication failed: Invalid password or receiver email.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [file, password, receiverEmail, toast, getMissingInputsMessage]);

  const actionButton = mode === 'encrypt' ? (
    <Button
      onClick={handleEncrypt}
      disabled={isLoading || !file}
      className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground hover:from-primary/90 hover:to-accent/90 transition-all duration-300 ease-in-out shadow-lg"
    >
      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lock className="mr-2 h-4 w-4" />}
      Encrypt File
    </Button>
  ) : (
    <Button
      onClick={handleDecrypt}
      disabled={isLoading || !file}
      className="w-full bg-gradient-to-r from-secondary to-accent text-secondary-foreground hover:from-secondary/90 hover:to-accent/90 transition-all duration-300 ease-in-out shadow-lg"
    >
      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Unlock className="mr-2 h-4 w-4" />}
      Decrypt File
    </Button>
  );

  const title = mode === 'encrypt' ? 'Encrypt a File' : 'Decrypt a File';

  return (
    <Card className="w-full mx-auto shadow-xl rounded-xl border-border/50 dark:border-border/30">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center text-primary dark:text-primary-foreground">
          <ShieldCheck className="mr-3 h-7 w-7 text-secondary dark:text-accent" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="file" className="text-foreground">File Input / Upload</Label>
          <Input id="file" type="file" onChange={handleFileChange} className="file:text-primary file:font-medium file:bg-muted file:border-muted-foreground/20 file:rounded-md file:mr-2 file:py-1 file:px-3 hover:file:bg-muted-foreground/10 transition-colors" />
          {file && <p className="text-sm text-muted-foreground">Selected: {file.name} ({Math.round(file.size / 1024 / 1024)} MB)</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-foreground">Password Input</Label>
          <Input
            id="password"
            type="password"
            placeholder={`Enter strong password (min ${MIN_PASSWORD_LENGTH} chars)`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-foreground">Receiver Email ID (Access Control)</Label>
          <Input
            id="email"
            type="email"
            placeholder="receiver@example.com"
            value={receiverEmail}
            onChange={(e) => setReceiverEmail(e.target.value)}
            className="focus-visible:ring-ring focus-visible:ring-offset-2"
          />
          <p className="text-xs text-muted-foreground">
            Both the password and this email are required for decryption.
          </p>
        </div>

        {actionButton}
      </CardContent>
    </Card>
  );
};