import React from 'react';
import { cn } from "@/lib/utils";

interface CyberCardProps {
    title: string;
    description?: string;
    icon?: React.ReactNode;
    children?: React.ReactNode;
    className?: string;
    onClick?: () => void;
    variant?: 'cyan' | 'purple' | 'blue';
}

export function CyberCard({
    title,
    description,
    icon,
    children,
    className,
    onClick,
    variant = 'cyan'
}: CyberCardProps) {
    const glowColors = {
        cyan: "hover:shadow-neon-cyan border-primary/50 text-primary hover:border-primary",
        purple: "hover:shadow-neon-purple border-secondary/50 text-secondary hover:border-secondary",
        blue: "hover:shadow-neon-blue border-accent/50 text-accent hover:border-accent",
    };

    const gradientColors = {
        cyan: "from-primary/10",
        purple: "from-secondary/10",
        blue: "from-accent/10",
    };

    return (
        <div
            onClick={onClick}
            className={cn(
                "relative group bg-card/80 border transition-all duration-500 rounded-xl p-6 cursor-pointer overflow-hidden backdrop-blur-md",
                "hover:-translate-y-2 hover:scale-[1.03] hover:bg-card/90",
                glowColors[variant],
                className
            )}
        >
            {/* Background Gradient */}
            <div className={cn("absolute inset-0 bg-gradient-to-br to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500", gradientColors[variant])} />

            {/* Scanline / Grid Effect (Optional - keeps it clean for now) */}

            <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center gap-4 mb-4">
                    {icon && (
                        <div className={cn(
                            "p-3 rounded-lg bg-background/50 border border-current shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6",
                            "shadow-[0_0_10px_rgba(0,0,0,0.5)]"
                        )}>
                            {icon}
                        </div>
                    )}
                    <h3 className="text-2xl font-mono font-bold tracking-tight uppercase glow-text">
                        {title}
                    </h3>
                </div>

                {description && (
                    <p className="text-muted-foreground font-sans text-sm leading-relaxed mb-6 group-hover:text-foreground/90 transition-colors">
                        {description}
                    </p>
                )}

                <div className="mt-auto pl-1 border-l-2 border-current/30">
                    {children}
                </div>
            </div>

            {/* Corner Accents */}
            <div className="absolute top-0 right-0 p-2 opacity-50">
                <div className="w-2 h-2 bg-current rounded-full" />
            </div>
        </div>
    );
}
