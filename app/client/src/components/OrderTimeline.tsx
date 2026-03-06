import { motion } from 'framer-motion';

interface OrderTimelineProps {
    status: 'PLACED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
    date: string;
}

const OrderTimeline: React.FC<OrderTimelineProps> = ({ status, date }) => {
    const steps = [
        { id: 'PLACED', label: 'Order Placed', icon: 'shopping_bag' },
        { id: 'PROCESSING', label: 'In the Brewery', icon: 'local_cafe' },
        { id: 'SHIPPED', label: 'Out for Delivery', icon: 'delivery_dining' },
        { id: 'DELIVERED', label: 'Aura Delivered', icon: 'verified' },
    ];

    if (status === 'CANCELLED') {
        return (
            <div className="flex items-center gap-4 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
                <span className="material-symbols-outlined text-red-500">cancel</span>
                <div>
                    <p className="text-xs font-black text-red-500 uppercase tracking-widest">Order Cancelled</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Refund processed where applicable.</p>
                </div>
            </div>
        );
    }

    const currentStepIndex = steps.findIndex(s => s.id === status);

    return (
        <div className="space-y-4 py-2">
            {steps.map((step, index) => {
                const isCompleted = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;

                return (
                    <div key={step.id} className="relative flex gap-4">
                        {/* Vertical line connector */}
                        {index < steps.length - 1 && (
                            <div className={`absolute left-[18px] top-8 w-0.5 h-8 ${index < currentStepIndex ? 'bg-primary' : 'bg-white/10'}`} />
                        )}

                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center relative z-10 
                            ${isCompleted ? 'bg-primary shadow-lg shadow-primary/20' : 'bg-white/5 border border-white/10'}`}
                        >
                            <span className={`material-symbols-outlined text-lg ${isCompleted ? 'text-white' : 'text-slate-600'}`}>
                                {step.icon}
                            </span>
                            {isCurrent && (
                                <motion.div
                                    layoutId="pulse"
                                    className="absolute inset-0 rounded-xl border-2 border-primary"
                                    animate={{ scale: [1, 1.2, 1], opacity: [1, 0, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                />
                            )}
                        </div>

                        <div className="flex-1 pt-1.5">
                            <div className="flex items-center gap-2">
                                <p className={`text-[11px] font-black uppercase tracking-wider ${isCompleted ? 'text-white' : 'text-slate-600'}`}>
                                    {step.label}
                                </p>
                                {isCurrent && (
                                    <span className="flex h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                                )}
                            </div>
                            {isCurrent && (
                                <p className="text-[9px] text-slate-500 mt-0.5 leading-relaxed">
                                    {status === 'PLACED' && 'We have received your order.'}
                                    {status === 'PROCESSING' && 'Your bottles are being freshly brewed and sealed.'}
                                    {status === 'SHIPPED' && 'Our delivery aura is on its way to you.'}
                                    {status === 'DELIVERED' && `Received on ${new Date(date).toLocaleDateString()}.`}
                                </p>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default OrderTimeline;
