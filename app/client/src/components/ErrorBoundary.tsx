import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertOctagon, RotateCw } from 'lucide-react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-background-dark flex items-center justify-center p-6 text-center">
                    <div className="bento-card p-10 border border-red-500/20 max-w-md space-y-8 backdrop-blur-3xl">
                        <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mx-auto relative">
                            <div className="absolute inset-0 bg-red-500/20 blur-2xl rounded-full animate-pulse" />
                            <AlertOctagon className="w-10 h-10 text-red-500 relative z-10" />
                        </div>
                        
                        <div className="space-y-3">
                            <h2 className="text-3xl font-black text-white uppercase tracking-tight leading-none">Aura <span className="text-red-500">Disrupted</span></h2>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-[0.1em] opacity-80 leading-relaxed">Something went wrong while rendering the interface. The neural bridge has collapsed.</p>
                        </div>

                        <button
                            onClick={() => window.location.reload()}
                            className="w-full bg-white/5 border border-white/10 text-white font-black px-8 py-5 rounded-2xl hover:bg-white/10 transition-all flex items-center justify-center gap-3 active:scale-[0.98] group"
                        >
                            <RotateCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                            <span className="uppercase tracking-[0.2em] text-[10px]">Restore Aura Bridge</span>
                        </button>

                        <details className="text-left py-4 opacity-20 hover:opacity-100 transition-opacity">
                            <summary className="text-[10px] font-black uppercase cursor-pointer list-none flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                Diagnostics Port
                            </summary>
                            <div className="mt-4 p-4 bg-black/40 rounded-xl border border-white/5">
                                <p className="text-[8px] font-mono text-red-400 break-all leading-relaxed uppercase">{this.state.error?.message}</p>
                            </div>
                        </details>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
