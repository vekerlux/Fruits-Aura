import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';

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
        isPopular: false
    });
    const [uploading, setUploading] = useState(false);

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
            const config = { headers: { Authorization: `Bearer ${user?.token}` } };
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
        setFormData({ name: '', price: '', description: '', category: 'detox', subtext: '', image: '/assets/brand/bottle-base.png', cssFilter: '', isPopular: false });
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
            isPopular: product.isPopular || false
        });
        setEditingId(product.id);
        setShowAddForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await api.delete(`/products/${id}`);
            fetchProducts();
        } catch (error) {
            alert('Error deleting product');
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
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-white flex items-center gap-3">
                    <span className="w-2 h-8 bg-green-500 rounded-full"></span>
                    Manage Inventory
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
                    className="bg-primary/20 text-primary border border-primary/30 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 active:scale-95 transition-all"
                >
                    <span className="material-symbols-outlined text-sm">{showAddForm ? 'close' : 'add'}</span>
                    {showAddForm ? 'Cancel' : 'Add Juice'}
                </button>
            </div>

            <AnimatePresence>
                {showAddForm && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <form onSubmit={handleSubmit} className="bento-card p-6 space-y-4 border border-primary/20 bg-primary/5">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Name</label>
                                    <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full aura-input" placeholder="e.g. Mango Glow" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Price (₦)</label>
                                    <input required type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} className="w-full aura-input" placeholder="1500" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Category</label>
                                    <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full aura-input">
                                        <option value="detox">Detox</option>
                                        <option value="energy">Energy</option>
                                        <option value="immunity">Immunity</option>
                                        <option value="glow">Glow</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Subtext</label>
                                    <input value={formData.subtext} onChange={e => setFormData({ ...formData, subtext: e.target.value })} className="w-full aura-input" placeholder="e.g. Bestseller" />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Juice Image</label>
                                <div className="flex gap-2">
                                    <input value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} className="flex-1 aura-input" placeholder="/assets/brand/base.png" />
                                    <label className="bg-white/5 border border-white/10 px-4 py-3 rounded-xl flex items-center justify-center cursor-pointer hover:bg-white/10 transition-all active:scale-95">
                                        <span className="material-symbols-outlined text-sm">{uploading ? 'sync' : 'upload'}</span>
                                        <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*" />
                                    </label>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] text-slate-400 uppercase font-black tracking-widest">CSS Filter (Aura Effect)</label>
                                <input value={formData.cssFilter} onChange={e => setFormData({ ...formData, cssFilter: e.target.value })} className="w-full aura-input font-mono" placeholder="hue-rotate(90deg) brightness(1.2)" />
                                <div className="mt-2 flex items-center gap-2">
                                    <div className="w-8 h-8 rounded bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center p-1">
                                        <img src={formData.image} style={{ filter: formData.cssFilter }} className="w-full h-full object-contain" alt="Preview" />
                                    </div>
                                    <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">Aura Preview</span>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Description</label>
                                <textarea required value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full aura-input h-24" placeholder="Describe the aura..." />
                            </div>

                            <div className="flex items-center gap-3 py-2">
                                <input
                                    type="checkbox"
                                    checked={formData.isPopular}
                                    onChange={e => setFormData({ ...formData, isPopular: e.target.checked })}
                                    className="w-5 h-5 accent-primary rounded"
                                />
                                <label className="text-[10px] text-white font-black uppercase tracking-widest">Feature in Home Carousel</label>
                            </div>

                            <button type="submit" className="w-full bg-primary text-white font-black py-4 rounded-xl shadow-lg shadow-primary/20 uppercase tracking-[0.2em] text-[10px]">
                                {editingId ? 'Update Juice Aura' : 'Create Product'}
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="space-y-3">
                {products.map((product) => (
                    <div key={product.id} className="bento-card p-5 flex items-center justify-between border border-white/5 bg-white/[0.02]">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 overflow-hidden p-2">
                                <img src={product.image} style={{ filter: product.cssFilter }} className="w-full h-full object-contain" alt={product.name} />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h4 className="font-bold text-sm text-white">{product.name}</h4>
                                    {product.isPopular && <span className="text-[8px] bg-primary/20 text-primary px-2 py-0.5 rounded-full border border-primary/20 font-black uppercase tracking-tighter">Featured</span>}
                                </div>
                                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">{product.category}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="font-black text-primary text-xs mr-2">₦{product.price.toLocaleString()}</span>
                            <button onClick={() => handleEdit(product)} className="w-8 h-8 rounded-lg flex items-center justify-center text-blue-500/50 hover:text-blue-400 hover:bg-blue-400/10 transition-all">
                                <span className="material-symbols-outlined text-lg">edit</span>
                            </button>
                            <button onClick={() => handleDelete(product.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-red-500/50 hover:text-red-500 hover:bg-red-500/10 transition-all">
                                <span className="material-symbols-outlined text-lg">delete</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default ProductManagement;
