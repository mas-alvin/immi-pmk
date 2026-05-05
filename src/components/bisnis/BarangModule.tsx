import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Package, 
  X, 
  Save, 
  Loader2,
  Tag,
  Settings2
} from 'lucide-react';
import { useBarang, type Barang } from '../../hooks/useBarang';
import { useVariants } from '../../hooks/useVariants';

export const BarangModule = () => {
  const { items: products, isLoading: isFetchingBarang, addBarang, updateBarang, deleteBarang } = useBarang();
  const { variants, isLoading: isFetchingVariants, addVariant, deleteVariant } = useVariants();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Barang | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [newVariantName, setNewVariantName] = useState('');

  // Form State
  const [formData, setFormData] = useState<Omit<Barang, 'id'>>({
    nama_barang: '',
    varian: '',
    stok_awal: 0,
    harga_beli: 0,
    laba: 0,
    harga_jual: 0
  });

  const handleOpenModal = (product?: Barang) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        nama_barang: product.nama_barang,
        varian: product.varian,
        stok_awal: product.stok_awal,
        harga_beli: product.harga_beli,
        laba: product.laba,
        harga_jual: product.harga_jual
      });
    } else {
      setEditingProduct(null);
      setFormData({
        nama_barang: '',
        varian: variants.length > 0 ? variants[0].nama : '',
        stok_awal: 0,
        harga_beli: 0,
        laba: 0,
        harga_jual: 0
      });
    }
    setIsModalOpen(true);
  };

  const handleFormChange = (field: keyof Omit<Barang, 'id'>, value: any) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      if (field === 'harga_beli' || field === 'laba') {
        newData.harga_jual = Number(newData.harga_beli || 0) + Number(newData.laba || 0);
      } else if (field === 'harga_jual') {
        newData.laba = Number(newData.harga_jual || 0) - Number(newData.harga_beli || 0);
      }
      return newData;
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingProduct) {
        await updateBarang(editingProduct.id, formData);
      } else {
        await addBarang(formData);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Save error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddMasterVariant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVariantName.trim()) return;
    await addVariant(newVariantName.trim());
    setNewVariantName('');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  };

  const filteredProducts = (products || []).filter(p => 
    (p.nama_barang || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.varian || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isLoading = isFetchingBarang || isFetchingVariants || isSubmitting;

  return (
    <div className="space-y-6">
      {/* Actions Header */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Cari barang atau varian..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-slate-100 shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-slate-800"
          />
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setIsVariantModalOpen(true)}
            className="bg-slate-100 text-slate-600 px-6 py-3 rounded-xl font-black uppercase tracking-widest text-xs flex items-center gap-2 hover:bg-slate-200 transition-all"
          >
            <Settings2 size={16} /> Kelola Varian
          </button>
          <button
            onClick={() => handleOpenModal()}
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-black uppercase tracking-widest text-xs flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
          >
            <Plus size={16} /> Tambah Barang
          </button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.length === 0 && !isLoading && (
          <div className="col-span-full py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
            Tidak ada barang ditemukan
          </div>
        )}
        {filteredProducts.map((product) => (
          <motion.div 
            key={product.id}
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden flex flex-col"
          >
            <div className="p-6 border-b border-slate-50">
              <div className="flex items-start justify-between mb-4">
                <div className="bg-indigo-50 p-3 rounded-2xl text-indigo-600">
                  <Package size={24} />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleOpenModal(product)} className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-xl transition-colors">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => deleteBarang(product.id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <h4 className="text-lg font-black text-slate-800 uppercase tracking-tighter leading-tight mb-1">{product.nama_barang}</h4>
              <span className="px-3 py-1 bg-slate-100 text-slate-400 rounded-xl text-[9px] font-black uppercase tracking-widest">{product.varian}</span>
            </div>
            <div className="p-6 bg-slate-50/50 flex-1 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Harga Jual</p>
                  <p className="text-xl font-black text-indigo-600 tracking-tight">{formatCurrency(product.harga_jual)}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Stok</p>
                  <p className="text-lg font-black text-slate-700 tracking-tight">{product.stok_awal}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Harga Beli</p>
                  <p className="text-xs font-bold text-slate-600">{formatCurrency(product.harga_beli)}</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest leading-none mb-1">Laba</p>
                  <p className="text-xs font-black text-emerald-600">{formatCurrency(product.laba)}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 40 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 40 }} className="relative w-full max-w-lg bg-white rounded-xl p-10 shadow-3xl overflow-hidden max-h-[90vh] flex flex-col" >
              <div className="flex items-center justify-between mb-8 flex-shrink-0">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic">{editingProduct ? 'Edit Barang' : 'Tambah Barang'}</h3>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Lengkapi Detail Inventaris</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="bg-slate-50 p-2 rounded-xl text-slate-400 hover:text-slate-600 transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-6 overflow-y-auto pr-2 custom-scrollbar">
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Nama Barang</label>
                    <div className="relative">
                      <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      <input type="text" required value={formData.nama_barang} onChange={(e) => handleFormChange('nama_barang', e.target.value)} className="w-full pl-12 pr-6 py-4 rounded-xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-slate-800" placeholder="Nama produk..." />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Varian (Pilih Master)</label>
                      <select 
                        required 
                        value={formData.varian} 
                        onChange={(e) => handleFormChange('varian', e.target.value)} 
                        className="w-full px-6 py-4 rounded-xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-slate-800"
                      >
                        <option value="">-- Pilih Varian --</option>
                        {variants.map(v => (
                          <option key={v.id} value={v.nama}>{v.nama}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Stok Awal</label>
                      <input type="number" required value={formData.stok_awal} onChange={(e) => handleFormChange('stok_awal', Number(e.target.value))} className="w-full px-6 py-4 rounded-xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-slate-800" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Harga Beli</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[9px] font-black text-slate-300">Rp</span>
                        <input type="number" required value={formData.harga_beli} onChange={(e) => handleFormChange('harga_beli', Number(e.target.value))} className="w-full pl-8 pr-4 py-4 rounded-xl bg-slate-50 border border-slate-100 focus:outline-none font-bold text-slate-800" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-1">Laba</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[9px] font-black text-emerald-300">Rp</span>
                        <input type="number" required value={formData.laba} onChange={(e) => handleFormChange('laba', Number(e.target.value))} className="w-full pl-8 pr-4 py-4 rounded-xl bg-slate-50 border border-emerald-100 focus:outline-none font-bold text-slate-800" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[9px] font-black text-indigo-500 uppercase tracking-widest mb-1">Harga Jual</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[9px] font-black text-indigo-300">Rp</span>
                        <input type="number" required value={formData.harga_jual} onChange={(e) => handleFormChange('harga_jual', Number(e.target.value))} className="w-full pl-8 pr-4 py-4 rounded-xl bg-slate-50 border border-indigo-100 focus:outline-none font-bold text-slate-800" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-50">
                  <button type="submit" disabled={isLoading} className="w-full py-5 bg-indigo-600 text-white rounded-xl font-black text-lg shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all hover:translate-y-[-2px] active:translate-y-0 flex items-center justify-center gap-3 disabled:opacity-70" >
                    {isLoading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                    {editingProduct ? 'UPDATE BARANG' : 'SIMPAN BARANG'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Variant Management Modal */}
      <AnimatePresence>
        {isVariantModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsVariantModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 40 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 40 }} className="relative w-full max-w-md bg-white rounded-xl p-10 shadow-3xl flex flex-col" >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter italic">Master Varian</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Atur Daftar Pilihan Varian</p>
                </div>
                <button onClick={() => setIsVariantModalOpen(false)} className="bg-slate-50 p-2 rounded-xl text-slate-400 hover:text-slate-600">
                  <X size={20} />
                </button>
              </div>

              {/* Add New Variant */}
              <form onSubmit={handleAddMasterVariant} className="flex gap-2 mb-8">
                <input 
                  type="text" 
                  placeholder="Nama varian baru..." 
                  value={newVariantName}
                  onChange={(e) => setNewVariantName(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 font-bold text-sm focus:outline-none focus:border-indigo-500"
                />
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50"
                >
                  <Plus size={20} />
                </button>
              </form>

              {/* Variant List */}
              <div className="space-y-3 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
                {variants.length === 0 ? (
                  <p className="text-center py-10 text-slate-400 text-xs font-bold uppercase tracking-widest">Belum ada varian</p>
                ) : (
                  variants.map(v => (
                    <div key={v.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 group">
                      <span className="font-black text-slate-700 text-sm">{v.nama}</span>
                      <button 
                        onClick={() => deleteVariant(v.id)}
                        className="p-2 text-rose-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
