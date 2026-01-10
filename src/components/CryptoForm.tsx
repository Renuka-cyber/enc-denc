"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Lock, Unlock, ShieldCheck, Eye, EyeOff, Download, RefreshCcw, CheckCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Badge } from '@/components/ui/badge'; // Import Badge component

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
type PasswordStrength = 'none' | 'weak' | 'medium' | 'strong';

interface CryptoFormProps {
  defaultMode?: Mode;
}

// Function to evaluate password strength
const getPasswordStrength = (password: string): PasswordStrength => {
  if (password.length < MIN_PASSWORD_LENGTH) {
    return 'none'; // Or 'weak' if you want to show it even below min length
  }

  let score = 0;
  if (password.length >= MIN_PASSWORD_LENGTH) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++; // Special characters

  if (score < 3) return 'weak';
  if (score < 5) return 'medium';
  return 'strong';
};

// Utility to format file size
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const CryptoForm = ({ defaultMode = 'encrypt' }: CryptoFormProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState<Mode>(defaultMode);
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [receiverEmail, setReceiverEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>('none'); // State for password strength

  // New states for encryption results
  const [isEncryptingProcess, setIsEncryptingProcess] = useState(false);
  const [encryptionSuccessDetails, setEncryptionSuccessDetails] = useState<{
    originalFileName: string;
    encryptedFileName: string;
    encryptedFileSize: number;
    encryptedFileBlob: Blob;
  } | null>(null);

  useEffect(() => {
    setMode(defaultMode);
    // Reset results when mode changes or component mounts
    resetForm();
  }, [defaultMode]);

  useEffect(() => {
    setPasswordStrength(getPasswordStrength(password));
  }, [password]);

  const resetForm = useCallback(() => {
    setFile(null);
    setPassword('');
    setReceiverEmail('');
    setIsLoading(false);
    setShowPassword(false);
    setPasswordStrength('none');
    setIsEncryptingProcess(false);
    setEncryptionSuccessDetails(null);
    // Ensure navigation to default path if not already there
    const defaultPath = defaultMode === 'encrypt' ? '/encrypt' : '/decrypt';
    if (location.pathname !== defaultPath) {
      navigate(defaultPath);
    }
  }, [defaultMode, location.pathname, navigate]);

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
    setEncryptionSuccessDetails(null); // Clear previous results on new file selection

    if (selectedFile) {
      let newMode: Mode;
      let newPath: string;

      if (selectedFile.name.endsWith(ENCRYPTED_FILE_EXTENSION)) {
        newMode = 'decrypt';
        newPath = '/decrypt';
      } else {
        newMode = 'encrypt';
        newPath = '/encrypt';
      }

      // Only navigate if the new path is different from the current one
      if (location.pathname !== newPath) {
        navigate(newPath);
      }
      setMode(newMode); // Update internal state
    } else {
      // If no file is selected (e.g., user clears input), revert to defaultMode and navigate if needed
      setMode(defaultMode);
      const defaultPath = defaultMode === 'encrypt' ? '/encrypt' : '/decrypt';
      if (location.pathname !== defaultPath) {
        navigate(defaultPath);
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
    setIsEncryptingProcess(true); // Start processing state
    setEncryptionSuccessDetails(null); // Clear previous success details
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
      const encryptedContentBlob = await encryptFileStream(file!, dek); // file is guaranteed to exist by checks above

      // 7. Metadata Packaging
      const header = packageMetadata(file!.name, sp, se, wiv, wrappedKey);

      // 8. Final Output Blob: Header + Encrypted Content
      const finalBlob = new Blob([header, encryptedContentBlob], {
        type: 'application/octet-stream',
      });

      const encryptedFileName = `${file!.name}${ENCRYPTED_FILE_EXTENSION}`;
      
      setEncryptionSuccessDetails({
        originalFileName: file!.name,
        encryptedFileName: encryptedFileName,
        encryptedFileSize: finalBlob.size,
        encryptedFileBlob: finalBlob,
      });

      toast({
        title: 'Encryption Successful',
        description: `File ready for download.`,
      });
    } catch (error) {
      securityLog(`Encryption failed: ${error}`, 'ERROR');
      toast({
        title: 'Encryption Failed',
        description: error instanceof Error ? error.message : 'An unknown error occurred during encryption.',
        variant: 'destructive',
      });
      setEncryptionSuccessDetails(null); // Ensure no success state on error
    } finally {
      setIsLoading(false);
      setIsEncryptingProcess(false); // End processing state
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
      const metadata: ParsedMetadata = await parseMetadata(file!); // file is guaranteed to exist
      const encryptedContentBlob = file!.slice(metadata.headerLength);

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

  const getStrengthBadgeVariant = (strength: PasswordStrength) => {
    switch (strength) {
      case 'weak': return 'destructive';
      case 'medium': return 'warning';
      case 'strong': return 'default'; // Or a custom success variant
      default: return 'secondary';
    }
  };

  const getStrengthBadgeText = (strength: PasswordStrength) => {
    switch (strength) {
      case 'weak': return 'Weak';
      case 'medium': return 'Medium';
      case 'strong': return 'Strong';
      default: return 'Enter password';
    }
  };

  const renderForm = () => (
    <>
      <div className="space-y-2">
        <Label htmlFor="file" className="text-foreground">File Input / Upload</Label>
        <Input id="file" type="file" onChange={handleFileChange} className="file:text-primary file:font-medium file:bg-muted file:border-muted-foreground/20 file:rounded-md file:mr-2 file:py-1 file:px-3 hover:file:bg-muted-foreground/10 transition-colors" />
        {file && <p className="text-sm text-muted-foreground">Selected: {file.name} ({formatFileSize(file.size)})</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-foreground">Password Input</Label>
        <div className="relative flex items-center">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder={`Enter strong password (min ${MIN_PASSWORD_LENGTH} chars)`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pr-10 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-1 text-muted-foreground hover:bg-transparent"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
        {password.length > 0 && passwordStrength !== 'none' && (
          <Badge variant={getStrengthBadgeVariant(passwordStrength)} className="mt-2">
            Strength: {getStrengthBadgeText(passwordStrength)}
          </Badge>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-foreground">Receiver Email (Required for Decryption)</Label>
        <Input
          id="email"
          type="email"
          placeholder="receiver@example.com"
          value={receiverEmail}
          onChange={(e) => setReceiverEmail(e.target.value)}
          className="focus-visible:ring-ring focus-visible:ring-offset-2"
        />
        <p className="text-xs text-muted-foreground">
          This email will be verified during decryption.
        </p>
      </div>

      {mode === 'encrypt' ? (
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
      )}
    </>
  );

  const renderEncryptionResults = () => (
    <div className="text-center space-y-3 py-3"> {/* Reduced py-4 to py-3, space-y-4 to space-y-3 */}
      {isEncryptingProcess ? (
        <>
          <Loader2 className="h-16 w-16 text-primary animate-spin mx-auto" />
          <h2 className="text-2xl font-semibold text-foreground">Encrypting file...</h2>
          <p className="text-muted-foreground">Please wait</p>
        </>
      ) : encryptionSuccessDetails ? (
        <>
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
          <h2 className="text-2xl font-semibold text-foreground">Encryption Successful</h2>
          <div className="text-left mx-auto max-w-xs space-y-1">
            <p className="text-muted-foreground">
              <span className="font-medium text-foreground">File:</span> {encryptionSuccessDetails.originalFileName}
            </p>
            <p className="text-muted-foreground">
              <span className="font-medium text-foreground">Size:</span> {formatFileSize(encryptionSuccessDetails.encryptedFileSize)}
            </p>
          </div>
          <div className="flex flex-col space-y-1 mt-3"> {/* Reduced space-y-2 to space-y-1, mt-4 to mt-3 */}
            <Button
              onClick={() => downloadFile(encryptionSuccessDetails.encryptedFileBlob, encryptionSuccessDetails.encryptedFileName)}
              className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground hover:from-primary/90 hover:to-accent/90 transition-all duration-300 ease-in-out shadow-lg"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Encrypted File
            </Button>
            <Button
              onClick={resetForm}
              variant="outline"
              className="w-full border-muted-foreground/30 text-foreground hover:bg-muted"
            >
              <RefreshCcw className="mr-2 h-4 w-4" />
              Encrypt Another File
            </Button>
          </div>
        </>
      ) : null}
    </div>
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
      <CardContent className="space-y-4">
        {mode === 'encrypt' && (isEncryptingProcess || encryptionSuccessDetails) ? (
          renderEncryptionResults()
        ) : (
          renderForm()
        )}
      </CardContent>
    </Card>
  );
};