import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const SCRIPT_ID = 'AKfycbwNqK5eLUc5N2DOCCTIoodxCKQbAVwRkfIW6rUclteh_QKRrw1JPcGOPUVbK_54hf3_qw';
const SCRIPT_URL = import.meta.env.DEV
  ? `/google-api/macros/s/${SCRIPT_ID}/exec`
  : `https://script.google.com/macros/s/${SCRIPT_ID}/exec`;

export interface User {
  username: string;
  nama: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('immi_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch {
      localStorage.removeItem('immi_user');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);

      // Use GET for login so we can always read the response body (avoids CORS preflight issues with GAS)
      const url = new URL(SCRIPT_URL, window.location.href);
      url.searchParams.append('action', 'login');
      url.searchParams.append('username', username.trim());
      url.searchParams.append('password', password);

      const response = await fetch(url.toString());

      if (!response.ok) {
        toast.error('Gagal terhubung ke server. Coba lagi.');
        return false;
      }

      const data = await response.json();

      if (data.status === 'success') {
        const userData: User = { username: data.username, nama: data.nama };
        setUser(userData);
        localStorage.setItem('immi_user', JSON.stringify(userData));
        toast.success(`Selamat datang, ${data.nama}! 👋`);
        return true;
      } else {
        toast.error(data.message || 'Username atau password salah.');
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Gagal terhubung ke server.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('immi_user');
    toast.info('Anda telah keluar dari sistem.');
  };

  return { user, isLoading, login, logout, isAuthenticated: !!user };
};
