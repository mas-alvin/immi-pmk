import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ComboboxProps {
  options: string[];
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export const Combobox = ({ options, value, onChange, placeholder }: ComboboxProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter(opt => 
    opt.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-6 py-4 rounded-lg bg-slate-50 border border-slate-100 cursor-pointer flex items-center justify-between group transition-all ${isOpen ? 'ring-4 ring-primary-500/10 border-primary-500' : ''}`}
      >
        <span className={`font-bold ${value ? 'text-slate-800' : 'text-slate-400'}`}>
          {value || placeholder}
        </span>
        <ChevronDown className={`text-slate-400 group-hover:text-primary-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} size={20} />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute z-[60] left-0 right-0 mt-2 bg-white rounded-lg shadow-2xl border border-slate-100 overflow-hidden"
          >
            <div className="p-4 border-b border-slate-50 flex items-center gap-3">
              <Search className="text-slate-400" size={18} />
              <input
                autoFocus
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari nama..."
                className="w-full bg-transparent border-none focus:outline-none font-medium text-slate-700"
              />
            </div>
            <div className="max-h-60 overflow-y-auto p-2 scrollbar-thin">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt) => (
                  <div
                    key={opt}
                    onClick={() => {
                      onChange(opt);
                      setIsOpen(false);
                      setSearch('');
                    }}
                    className={`px-4 py-3 rounded-lg cursor-pointer font-bold text-sm transition-colors ${
                      value === opt ? 'bg-primary-50 text-primary-600' : 'hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    {opt}
                  </div>
                ))
              ) : (
                <div className="px-4 py-8 text-center text-slate-400 text-sm font-medium">
                  Nama tidak ditemukan
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
