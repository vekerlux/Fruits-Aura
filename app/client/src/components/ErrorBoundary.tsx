import React, { Component, ErrorInfo, ReactNode } from 'react';

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
                    <div className="bento-card p-10 border border-red-500/20 max-w-md space-y-6">
                        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
                            <span className="material-symbols-outlined text-red-500 text-4xl">warning</span>
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-xl font-black text-white uppercase tracking-tight">System Aura Disrupted</h2>
                            <p className="text-sm text-slate-400 font-medium">Something went wrong while rendering the interface. We've logged the error.</p>
                        </div>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-primary text-white font-black px-8 py-4 rounded-xl shadow-lg shadow-primary/20 uppercase tracking-widest text-xs active:scale-95 transition-all"
                        >
                            Restore Aura
                        </button>
                        <details className="text-left py-4 opacity-30">
                            <summary className="text-[10px] font-black uppercase cursor-pointer">Error Details</summary>
                            <p className="text-[8px] font-mono mt-2 break-all">{this.state.error?.message}</p>
                        </details>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
