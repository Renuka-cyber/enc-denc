import { CyberCard } from "@/components/CyberCard";
import Header from "@/components/Header";
import { Lock, Unlock, Image as ImageIcon, ShieldCheck, Activity, Server, Database } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans selection:bg-primary/30 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(0,243,255,0.05),_transparent_60%)] pointer-events-none" />
      <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <Header />

      <main className="flex-grow container max-w-7xl mx-auto px-4 py-8 flex flex-col gap-8 z-10">

        {/* Dashboard Title & Stats Row */}
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              Security Dashboard
            </h1>
            <p className="text-muted-foreground mt-1 text-sm md:text-base">
              Hybrid Encryption & Steganography System (HESS)
            </p>
          </div>

          {/* Quick Stats - Dashboard Vibe */}
          <div className="flex gap-4">
            <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-card/50 border border-border/50 backdrop-blur-sm">
              <Activity className="w-5 h-5 text-green-400 animate-pulse" />
              <div className="flex flex-col">
                <span className="text-[10px] uppercase text-muted-foreground font-mono">System Status</span>
                <span className="text-sm font-bold">OPERATIONAL</span>
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-card/50 border border-border/50 backdrop-blur-sm">
              <Server className="w-5 h-5 text-blue-400" />
              <div className="flex flex-col">
                <span className="text-[10px] uppercase text-muted-foreground font-mono">Server Load</span>
                <span className="text-sm font-bold">12%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 flex-grow items-start mt-4">
          <Link to="/encrypt" className="contents">
            <CyberCard
              title="Encrypt Files"
              description="Secure sensitive data using advanced hybrid AES + RSA encryption algorithms."
              icon={<Lock className="w-8 h-8" />}
              variant="cyan"
              className="h-full border-t-4 border-t-primary"
            >
              <div className="mt-4 flex items-center justify-between text-xs font-mono text-muted-foreground bg-black/20 p-2 rounded">
                <span>Argon2id Protected</span>
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              </div>
            </CyberCard>
          </Link>

          <Link to="/decrypt" className="contents">
            <CyberCard
              title="Decrypt Files"
              description="Restore encrypted data to its original state using your private key."
              icon={<Unlock className="w-8 h-8" />}
              variant="purple"
              className="h-full border-t-4 border-t-secondary"
            >
              <div className="mt-4 flex items-center justify-between text-xs font-mono text-muted-foreground bg-black/20 p-2 rounded">
                <span>RSA-2048 Required</span>
                <span className="w-2 h-2 rounded-full bg-purple-400" />
              </div>
            </CyberCard>
          </Link>

          <Link to="/steganography/embed" className="contents">
            <CyberCard
              title="Steganography"
              description="Conceal messages within images using Least Significant Bit (LSB) encoding."
              icon={<ImageIcon className="w-8 h-8" />}
              variant="blue"
              className="h-full border-t-4 border-t-accent"
            >
              <div className="mt-4 flex items-center justify-between text-xs font-mono text-muted-foreground bg-black/20 p-2 rounded">
                <span>LSB Encoding</span>
                <span className="w-2 h-2 rounded-full bg-blue-400" />
              </div>
            </CyberCard>
          </Link>
        </div>

        {/* Recent Activity / Logs Placeholder */}
        {/* Recent Activity / Logs Placeholder - HIDDEN
        <div className="mt-8 p-6 rounded-xl bg-card/40 border border-border/50 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-4">
            <Database className="w-5 h-5 text-muted-foreground" />
            <h3 className="text-lg font-semibold tracking-tight">System Logs</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">Real-time</span>
          </div>
          <div className="space-y-2 font-mono text-xs md:text-sm text-muted-foreground">
            <div className="flex justify-between items-center p-2 hover:bg-white/5 rounded transition-colors border-l-2 border-green-500 pl-4 bg-gradient-to-r from-green-500/5 to-transparent">
              <span>[SYS_INIT] Security protocols initialized successfully.</span>
              <span className="opacity-50">10:42:05 AM</span>
            </div>
            <div className="flex justify-between items-center p-2 hover:bg-white/5 rounded transition-colors border-l-2 border-blue-500 pl-4">
              <span>[NET_SEC] Connected to secure gateway via TLS 1.3.</span>
              <span className="opacity-50">10:42:06 AM</span>
            </div>
            <div className="flex justify-between items-center p-2 hover:bg-white/5 rounded transition-colors border-l-2 border-purple-500 pl-4">
              <span>[MODULE] Steganography engine loaded.</span>
              <span className="opacity-50">10:42:08 AM</span>
            </div>
          </div>
        </div>
        */}

      </main>

      {/* Footer System Bar */}
      <footer className="w-full py-2 px-6 bg-background border-t border-border/40 flex justify-between items-center text-[10px] uppercase font-mono text-muted-foreground">
        <div className="flex gap-4">
          <span>CPU: Optimal</span>
          <span>Mem: 42%</span>
        </div>
        <span>HESS v2.1.0 // SECURE</span>
      </footer>
    </div>
  );
};

export default Index;