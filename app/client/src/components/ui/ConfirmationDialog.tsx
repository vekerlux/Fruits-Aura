import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmationDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: 'danger' | 'warning' | 'info';
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    variant = 'danger'
}) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-md liquid-glass border border-white/10 p-8 shadow-2xl"
                    >
                        <button 
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 text-slate-500 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className={`p-4 rounded-2xl ${variant === 'danger' ? 'bg-red-500/10 text-red-500' : 'bg-primary/10 text-primary'} border border-current/20`}>
                                <AlertTriangle className="w-8 h-8" />
                            </div>
                            
                            <div className="space-y-2">
                                <h3 className="text-xl font-black italic uppercase tracking-tighter text-white">{title}</h3>
                                <p className="text-sm text-slate-400 font-medium leading-relaxed">{description}</p>
                            </div>

                            <div className="flex gap-4 w-full pt-4">
                                <button
                                    onClick={onClose}
                                    className="flex-1 px-6 py-4 rounded-2xl border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:bg-white/5 transition-all"
                                >
                                    {cancelLabel}
                                </button>
                                <button
                                    onClick={() => {
                                        onConfirm();
                                        onClose();
                                    }}
                                    className={`flex-1 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-white transition-all shadow-lg ${
                                        variant === 'danger' 
                                            ? 'bg-red-600 hover:bg-red-500 shadow-red-900/20' 
                                            : 'bg-primary hover:bg-primary/90 shadow-primary/20'
                                    }`}
                                >
                                    {confirmLabel}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ConfirmationDialog;
