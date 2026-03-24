import { motion } from 'framer-motion';
import { 
    ShoppingBag, FlaskConical, Truck, CheckCircle2, 
    XCircle, Clock
} from 'lucide-react';

interface OrderTimelineProps {
    status: 'PLACED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
    date: string;
}

const OrderTimeline: React.FC<OrderTimelineProps> = ({ status, date }) => {
    const steps = [
        { id: 'PLACED', label: 'Order Placed', icon: ShoppingBag },
        { id: 'PROCESSING', label: 'In the Brewery', icon: FlaskConical },
        { id: 'SHIPPED', label: 'Out for Delivery', icon: Truck },
        { id: 'DELIVERED', label: 'Aura Delivered', icon: CheckCircle2 },
    ];

    if (status === 'CANCELLED') {
        return (
            <div className="flex items-center gap-4 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
                <XCircle className="w-6 h-6 text-red-500" />
                <div>
                    <p className="text-xs font-black text-red-500 uppercase tracking-widest">Order Cancelled</p>
                    <p className="text-[10px] text-slate-500 mt-0.5 font-medium">Refund processed where applicable.</p>
                </div>
            </div>
        );
    }

    const currentStepIndex = steps.findIndex(s => s.id === status);

    return (
        <div className="space-y-6 py-2">
            {steps.map((step, index) => {
                const isCompleted = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;
                const Icon = step.icon;

                return (
                    <div key={step.id} className="relative flex gap-5">
                        {/* Vertical line connector */}
                        {index < steps.length - 1 && (
                            <div className={`absolute left-[18px] top-9 w-0.5 h-10 ${index < currentStepIndex ? 'bg-primary' : 'bg-white/5'}`} />
                        )}

                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center relative z-10 
                            ${isCompleted ? 'bg-primary shadow-lg shadow-primary/20' : 'bg-white/5 border border-white/5'}`}
                        >
                            <Icon className={`w-5 h-5 ${isCompleted ? 'text-white' : 'text-slate-700'}`} />
                            {isCurrent && (
                                <motion.div
                                    layoutId="pulse"
                                    className="absolute inset-0 rounded-xl border-2 border-primary"
                                    animate={{ scale: [1, 1.4, 1], opacity: [1, 0, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                />
                            )}
                        </div>

                        <div className="flex-1 pt-1.5">
                            <div className="flex items-center gap-2">
                                <p className={`text-[11px] font-black uppercase tracking-[0.15em] ${isCompleted ? 'text-white' : 'text-slate-600'}`}>
                                    {step.label}
                                </p>
                                {isCurrent && (
                                    <Clock className="w-3 h-3 text-primary animate-pulse" />
                                )}
                            </div>
                            {isCurrent && (
                                <motion.p 
                                    initial={{ opacity: 0, x: -5 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="text-[9px] text-slate-500 mt-1 leading-relaxed font-medium"
                                >
                                    {status === 'PLACED' && 'We have received your order.'}
                                    {status === 'PROCESSING' && 'Your bottles are being freshly brewed and sealed.'}
                                    {status === 'SHIPPED' && 'Our delivery aura is on its way to you.'}
                                    {status === 'DELIVERED' && `Received on ${new Date(date).toLocaleDateString()}.`}
                                </motion.p>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default OrderTimeline;
