import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const SCRIPT_ID = 'AKfycbwNqK5eLUc5N2DOCCTIoodxCKQbAVwRkfIW6rUclteh_QKRrw1JPcGOPUVbK_54hf3_qw';
const SCRIPT_URL = import.meta.env.DEV 
  ? `/google-api/macros/s/${SCRIPT_ID}/exec`
  : `https://script.google.com/macros/s/${SCRIPT_ID}/exec`;

export interface VariantMaster {
  id: string;
  nama: string;
}

export const useVariants = () => {
  const [variants, setVariants] = useState<VariantMaster[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchVariants = async () => {
    try {
      setIsLoading(true);
      const url = new URL(SCRIPT_URL, window.location.href);
      url.searchParams.append('action', 'getVariants');

      const response = await fetch(url.toString());
      const data = await response.json();
      
      if (data.error) {
        setVariants([]);
        return;
      }
      
      setVariants(data.data || []);
    } catch (error) {
      console.error('Error fetching variants:', error);
      toast.error('Gagal memuat data varian');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVariants();
  }, []);

  const addVariant = async (nama: string) => {
    try {
      setIsLoading(true);
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: import.meta.env.DEV ? 'cors' : 'no-cors',
        body: JSON.stringify({ 
          nama,
          action: 'addVariant' 
        }),
      });
      toast.success('Varian berhasil ditambahkan!');
      setTimeout(fetchVariants, 1500); 
    } catch (error) {
      toast.error('Gagal menambah varian');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteVariant = async (id: string) => {
    try {
      setIsLoading(true);
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: import.meta.env.DEV ? 'cors' : 'no-cors',
        body: JSON.stringify({ 
          id,
          action: 'deleteVariant' 
        }),
      });
      toast.success('Varian berhasil dihapus!');
      setTimeout(fetchVariants, 1500); 
    } catch (error) {
      toast.error('Gagal menghapus varian');
    } finally {
      setIsLoading(false);
    }
  };

  return { variants, isLoading, fetchVariants, addVariant, deleteVariant };
};
