import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const SCRIPT_ID = 'AKfycbwNqK5eLUc5N2DOCCTIoodxCKQbAVwRkfIW6rUclteh_QKRrw1JPcGOPUVbK_54hf3_qw';
const SCRIPT_URL = import.meta.env.DEV 
  ? `/google-api/macros/s/${SCRIPT_ID}/exec`
  : `https://script.google.com/macros/s/${SCRIPT_ID}/exec`;

export interface Barang {
  id: string;
  nama_barang: string;
  varian: string;
  stok_awal: number;
  harga_beli: number;
  laba: number;
  harga_jual: number;
}

export const useBarang = () => {
  const [items, setItems] = useState<Barang[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBarang = async () => {
    try {
      setIsLoading(true);
      const url = new URL(SCRIPT_URL, window.location.href);
      url.searchParams.append('action', 'getBarang');

      const response = await fetch(url.toString());
      const data = await response.json();
      
      if (data.error) {
        setItems([]);
        return;
      }
      
      setItems(data.data || []);
    } catch (error) {
      console.error('Error fetching barang:', error);
      toast.error('Gagal memuat data barang');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBarang();
  }, []);

  const addBarang = async (formData: Omit<Barang, 'id'>) => {
    try {
      setIsLoading(true);
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: import.meta.env.DEV ? 'cors' : 'no-cors',
        body: JSON.stringify({ 
          ...formData, 
          action: 'addBarang' 
        }),
      });
      toast.success('Barang berhasil ditambahkan!');
      setTimeout(fetchBarang, 1500); 
    } catch (error) {
      toast.error('Gagal menambah barang');
    } finally {
      setIsLoading(false);
    }
  };

  const updateBarang = async (id: string, formData: Omit<Barang, 'id'>) => {
    try {
      setIsLoading(true);
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: import.meta.env.DEV ? 'cors' : 'no-cors',
        body: JSON.stringify({ 
          ...formData, 
          id,
          action: 'updateBarang' 
        }),
      });
      toast.success('Data barang berhasil diperbarui!');
      setTimeout(fetchBarang, 1500); 
    } catch (error) {
      toast.error('Gagal memperbarui barang');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteBarang = async (id: string) => {
    try {
      setIsLoading(true);
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: import.meta.env.DEV ? 'cors' : 'no-cors',
        body: JSON.stringify({ 
          id,
          action: 'deleteBarang' 
        }),
      });
      toast.success('Barang berhasil dihapus!');
      setTimeout(fetchBarang, 1500); 
    } catch (error) {
      toast.error('Gagal menghapus barang');
    } finally {
      setIsLoading(false);
    }
  };

  return { items, isLoading, fetchBarang, addBarang, updateBarang, deleteBarang };
};
