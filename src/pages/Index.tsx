import { MadeWithDyad } from "@/components/made-with-dyad";
import { CryptoForm } from "@/components/CryptoForm";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Argon2id + AES-256-GCM Hybrid Encryption System
      </h1>
      <CryptoForm />
      <div className="mt-8">
        <MadeWithDyad />
      </div>
    </div>
  );
};

export default Index;