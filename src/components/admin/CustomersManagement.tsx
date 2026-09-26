import React, { useState, useEffect, useCallback } from 'react';
import { Search, Users, Phone, MapPin, RefreshCw, ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://efashionbd.rf.gd/backend/api';

interface Customer {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  city?: string;
  address?: string;
  created_at: string;
}

export const CustomersManagement: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const LIMIT = 20;

  const loadCustomers = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/admin_dashboard.php?action=customers&limit=${LIMIT}&offset=${page * LIMIT}`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setCustomers(Array.isArray(data) ? data : []);
      }
    } catch { /* silent */ }
    finally { setIsLoading(false); }
  }, [page]);

  useEffect(() => { loadCustomers(); }, [loadCustomers]);

  const filtered = customers.filter(c => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (c.name || '').toLowerCase().includes(q) || (c.phone || '').includes(q) || (c.email || '').toLowerCase().includes(q) || (c.city || '').toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Customer Management</h3>
          <p className="text-sm text-gray-500">{customers.length} customers loaded</p>
        </div>
        <button onClick={loadCustomers} className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-xl hover:bg-gray-700 transition text-sm font-medium">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input type="text" placeholder="Search by name, phone, email, city..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm" />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['#', 'Customer', 'Contact', 'City', 'Joined'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i}>{Array.from({ length: 5 }).map((__, j) => (
                    <td key={j} className="px-4 py-3"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td>
                  ))}</tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-16 text-gray-400">
                  <Users className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No customers found</p>
                </td></tr>
              ) : filtered.map((customer, idx) => (
                <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-gray-400 text-xs">{page * LIMIT + idx + 1}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {customer.name ? customer.name.charAt(0).toUpperCase() : '?'}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{customer.name || '—'}</p>
                        {customer.email && <p className="text-xs text-gray-400">{customer.email}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {customer.phone && (
                      <div className="flex items-center gap-1 text-gray-600 text-sm">
                        <Phone className="w-3.5 h-3.5 text-gray-400" /> {customer.phone}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {customer.city && (
                      <div className="flex items-center gap-1 text-gray-600 text-sm">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" /> {customer.city}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                    {customer.created_at ? new Date(customer.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
          <p className="text-sm text-gray-500">Page {page + 1}</p>
          <div className="flex gap-2">
            <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition"><ChevronLeft className="w-4 h-4" /></button>
            <button onClick={() => setPage(p => p + 1)} disabled={filtered.length < LIMIT} className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      </div>
    </div>
  );
};
