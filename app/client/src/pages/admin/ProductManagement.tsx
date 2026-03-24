import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Plus, X, RefreshCw, Upload, Edit2, 
    Trash2, Package, Sparkles, Eye, 
    CheckCircle2
} from 'lucide-react';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import ConfirmationDialog from '../../components/ui/ConfirmationDialog';
import { toast } from 'sonner';

interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    subtext: string;
    description: string;
    image: string;
    cssFilter: string;
    isPopular: boolean;
    isVibrant: boolean;
}

const ProductManagement = () => {
    const { user } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        category: 'detox',
        subtext: '',
        image: '/assets/brand/bottle-base.png',
        cssFilter: '',
        isPopular: false,
        isVibrant: false
    });
    const [uploading, setUploading] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const fetchProducts = async () => {
        try {
            const { data } = await api.get('/products');
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = { ...formData, price: Number(formData.price) };

            if (editingId) {
                await api.put(`/products/${editingId}`, payload);
            } else {
                await api.post('/products', payload);
            }

            setShowAddForm(false);
            setEditingId(null);
            fetchProducts();
            resetForm();
        } catch (error) {
            alert('Error saving product');
        }
    };

    const resetForm = () => {
        setFormData({ name: '', price: '', description: '', category: 'detox', subtext: '', image: '/assets/brand/bottle-base.png', cssFilter: '', isPopular: false, isVibrant: false });
    };

    const handleEdit = (product: Product) => {
        setFormData({
            name: product.name,
            price: product.price.toString(),
            description: product.description,
            category: product.category,
            subtext: product.subtext,
            image: product.image,
            cssFilter: product.cssFilter || '',
            isPopular: product.isPopular || false,
            isVibrant: product.isVibrant || false
        });
        setEditingId(product.id);
        setShowAddForm(true);
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            await api.delete(`/products/${deleteId}`);
            toast.success('Aura Dissolved', {
                description: 'Product successfully removed from existence.'
            });
            fetchProducts();
        } catch (error) {
            toast.error('Dissolution Failed');
        } finally {
            setDeleteId(null);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formDataUpload = new FormData();
        formDataUpload.append('image', file);

        try {
            setUploading(true);
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            };
            const { data } = await api.post('/upload', formDataUpload, config);
            setFormData(prev => ({ ...prev, image: data.url }));
        } catch (error) {
            console.error('Upload Error', error);
            alert('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    return (
        <section className="space-y-6 pb-40">
            <div className="flex items-center justify-between gap-4">
                <h2 className="text-xl font-black text-white flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20">
                        <Package className="w-5 h-5 text-emerald-500" />
                    </div>
                    Products
                </h2>
                <button
                    onClick={() => {
                        if (showAddForm) {
                            setShowAddForm(false);
                            setEditingId(null);
                            resetForm();
                        } else {
                            setShowAddForm(true);
                        }
                    }}
                    className={`admin-btn px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] flex items-center gap-2 transition-all active:scale-95 ${showAddForm ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20'}`}
                >
                    {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    {showAddForm ? 'Close' : 'Add Product'}
                </button>
            </div>

            <AnimatePresence>
                {showAddForm && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="overflow-hidden"
                    >
                        <form onSubmit={handleSubmit} className="bento-card p-8 space-y-6 border border-primary/20 bg-primary/[0.02] backdrop-blur-3xl shadow-2xl shadow-primary/5">
                            <div className="flex items-center gap-2 mb-2">
                                <Sparkles className="w-5 h-5 text-primary" />
                                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white">{editingId ? 'Edit Product' : 'New Product'}</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest ml-1">Name</label>
                                    <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full aura-input" placeholder="e.g. Neon Mango" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest ml-1">Price (₦)</label>
                                    <input required type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} className="w-full aura-input font-black" placeholder="Price" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest ml-1">Category</label>
                                    <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full aura-input">
                                        <option value="detox">Detox Matrix</option>
                                        <option value="energy">High Voltage</option>
                                        <option value="immunity">Shield Layer</option>
                                        <option value="glow">Luminous Glow</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest ml-1">Summary Info</label>
                                    <input value={formData.subtext} onChange={e => setFormData({ ...formData, subtext: e.target.value })} className="w-full aura-input" placeholder="e.g. Pure Extraction" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest ml-1">Product Image</label>
                                <div className="flex gap-3">
                                    <input value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} className="flex-1 aura-input" placeholder="URL Link" />
                                    <label className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center cursor-pointer hover:bg-white/10 transition-all active:scale-95 text-slate-400 hover:text-white">
                                        {uploading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                                        <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*" />
                                    </label>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest ml-1">Chromatic Aberration (CSS Filter)</label>
                                <input value={formData.cssFilter} onChange={e => setFormData({ ...formData, cssFilter: e.target.value })} className="w-full aura-input font-mono text-xs" placeholder="hue-rotate(90deg) brightness(1.2)" />
                                <div className="mt-4 flex items-center gap-4 p-4 bg-black/40 rounded-2xl border border-white/5">
                                    <div className="w-16 h-16 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center p-2 relative overflow-hidden group">
                                        <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <img src={formData.image} style={{ filter: formData.cssFilter }} className="w-full h-full object-contain relative z-10" alt="Preview" />
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest block">Live Aura Preview</span>
                                        <span className="text-[8px] text-primary font-bold uppercase block tracking-tighter opacity-60">Real-time Rendering Enabled</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest ml-1">Description</label>
                                <textarea required value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full aura-input h-24 pt-4" placeholder="Product description..." />
                            </div>

                            <div className="flex items-center gap-4 py-4 px-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${formData.isPopular ? 'bg-primary/20 border-primary/40' : 'bg-white/5 border-white/10'} border`}>
                                    <Eye className={`w-5 h-5 ${formData.isPopular ? 'text-primary' : 'text-slate-700'}`} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[10px] text-white font-black uppercase tracking-widest">Mainstream Frequency</p>
                                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest opacity-60">Render in Home Showreel</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={formData.isPopular}
                                    onChange={e => setFormData({ ...formData, isPopular: e.target.checked })}
                                    className="w-6 h-6 accent-primary rounded-lg border-white/10 bg-transparent"
                                />
                            </div>

                            <div className="flex items-center gap-4 py-4 px-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${formData.isVibrant ? 'bg-secondary/20 border-secondary/40' : 'bg-white/5 border-white/10'} border`}>
                                    <Sparkles className={`w-5 h-5 ${formData.isVibrant ? 'text-secondary' : 'text-slate-700'}`} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[10px] text-white font-black uppercase tracking-widest">Vibrant Velocity</p>
                                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest opacity-60">Featured in Vibrant Picks</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={formData.isVibrant}
                                    onChange={e => setFormData({ ...formData, isVibrant: e.target.checked })}
                                    className="w-6 h-6 accent-secondary rounded-lg border-white/10 bg-transparent"
                                />
                            </div>

                            <motion.button 
                                whileTap={{ scale: 0.98 }}
                                type="submit" 
                                className="w-full bg-gradient-to-r from-primary to-orange-600 text-white font-black py-5 rounded-2xl shadow-2xl shadow-primary/20 uppercase tracking-[0.2em] text-[10px] mt-4"
                            >
                                {editingId ? 'Update Product' : 'Save Product'}
                            </motion.button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        key={product.id} 
                        className="bento-card p-5 flex flex-col justify-between border border-white/5 bg-white/[0.02] group hover:border-primary/20 transition-all shadow-xl"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 overflow-hidden p-3 relative group/img">
                                    <div className="absolute inset-0 bg-primary/10 blur-xl opacity-0 group-hover/img:opacity-100 transition-opacity" />
                                    <img src={product.image} style={{ filter: product.cssFilter }} className="w-full h-full object-contain relative z-10" alt={product.name} />
                                </div>
                                <div>
                                    <div className="flex flex-col">
                                        <h4 className="font-black text-sm text-white leading-tight">{product.name}</h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[10px] text-primary font-black">₦{product.price.toLocaleString()}</span>
                                            {product.isPopular && (
                                                <div className="flex items-center gap-1 text-[7px] bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/20 font-black uppercase tracking-tighter shadow-sm">
                                                    <Sparkles className="w-2 h-2" />
                                                    Hot
                                                </div>
                                            )}
                                            {product.isVibrant && (
                                                <div className="flex items-center gap-1 text-[7px] bg-secondary/10 text-secondary px-2 py-0.5 rounded-full border border-secondary/20 font-black uppercase tracking-tighter shadow-sm">
                                                    <Sparkles className="w-2 h-2" />
                                                    Vibrant
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex items-center justify-between pt-4 border-t border-white/5">
                            <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest opacity-60">{product.category}</span>
                            <div className="flex items-center gap-2">
                                <button onClick={() => handleEdit(product)} className="admin-btn w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 transition-all border border-transparent hover:border-blue-400/20">
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button onClick={() => setDeleteId(product.id)} className="admin-btn w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
            <ConfirmationDialog 
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="Erase Aura?"
                description="This action will permanently dissolve this juice frequency from the inventory matrix. This protocol cannot be reversed."
                variant="danger"
            />
        </section>
    );
};

export default ProductManagement;
