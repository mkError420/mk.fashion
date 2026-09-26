import React, { useState, useEffect, useCallback } from 'react';
import {
  Search, Filter, Eye, RefreshCw, ChevronLeft, ChevronRight,
  Package, Truck, CheckCircle2, XCircle, Clock, X
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://efashionbd.rf.gd/backend/api';

interface Order {
  id: number;
  order_number: string;
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'failed';
  payment_method: string;
  shipping_city: string;
  shipping_address: string;
  shipping_phone: string;
  created_at: string;
  customer_name: string;
  customer_phone: string;
  notes?: string;
}

interface OrderDetail extends Order {
  items: Array<{
    id: number;
    product_id: number;
    product_name: string;
    quantity: number;
    price: number;
    size: string;
  }>;
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  pending:    { label: 'Pending',    color: 'bg-amber-100 text-amber-800 border-amber-200' },
  processing: { label: 'Processing', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  shipped:    { label: 'Shipped',    color: 'bg-purple-100 text-purple-800 border-purple-200' },
  delivered:  { label: 'Delivered',  color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  cancelled:  { label: 'Cancelled',  color: 'bg-red-100 text-red-800 border-red-200' },
};

const PAYMENT_STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700' },
  paid:    { label: 'Paid',    color: 'bg-green-100 text-green-700' },
  failed:  { label: 'Failed',  color: 'bg-red-100 text-red-700' },
};

export const OrdersManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const LIMIT = 20;

  const loadOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ action: 'orders', limit: LIMIT.toString(), offset: (page * LIMIT).toString() });
      if (statusFilter) params.append('status', statusFilter);
      const res = await fetch(`${API_BASE_URL}/admin_dashboard.php?${params}`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      }
    } catch { /* silent */ }
    finally { setIsLoading(false); }
  }, [page, statusFilter]);

  useEffect(() => { loadOrders(); }, [loadOrders]);

  const handleStatusUpdate = async (orderId: number, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`${API_BASE_URL}/admin_dashboard.php?action=order`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, status: newStatus }),
      });
      if (res.ok) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus as Order['status'] } : o));
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(prev => prev ? { ...prev, status: newStatus as Order['status'] } : null);
        }
      }
    } catch { /* silent */ }
    finally { setUpdatingId(null); }
  };

  const loadOrderDetail = async (order: Order) => {
    setIsDetailLoading(true);
    setSelectedOrder({ ...order, items: [] });
    try {
      const res = await fetch(`${API_BASE_URL}/orders.php?order_number=${order.order_number}`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setSelectedOrder({ ...order, ...data });
      }
    } catch { /* silent */ }
    finally { setIsDetailLoading(false); }
  };

  const filteredOrders = orders.filter(o => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (o.order_number || '').toLowerCase().includes(q) ||
      (o.customer_name || '').toLowerCase().includes(q) ||
      (o.customer_phone || '').toLowerCase().includes(q) ||
      (o.shipping_city || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Order Management</h3>
          <p className="text-sm text-gray-500">{orders.length} orders loaded</p>
        </div>
        <button onClick={loadOrders} className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-xl hover:bg-gray-700 transition text-sm font-medium">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search by order #, customer..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm" />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(0); }}
            className="px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm bg-white">
            <option value="">All Status</option>
            {Object.entries(STATUS_CONFIG).map(([key, cfg]) => <option key={key} value={key}>{cfg.label}</option>)}
          </select>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
          const count = orders.filter(o => o.status === key).length;
          return (
            <button key={key} onClick={() => setStatusFilter(statusFilter === key ? '' : key)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition ${cfg.color} ${statusFilter === key ? 'ring-2 ring-offset-1 ring-gray-900' : 'hover:opacity-80'}`}>
              {cfg.label} <span className="font-bold">({count})</span>
            </button>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Order #', 'Customer', 'Amount', 'Status', 'Payment', 'City', 'Date', 'Action'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>{Array.from({ length: 8 }).map((__, j) => (
                    <td key={j} className="px-4 py-3"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td>
                  ))}</tr>
                ))
              ) : filteredOrders.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-16 text-gray-400">
                  <Package className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No orders found</p>
                </td></tr>
              ) : filteredOrders.map(order => {
                const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
                const payStatus = PAYMENT_STATUS_CONFIG[order.payment_status] || PAYMENT_STATUS_CONFIG.pending;
                return (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-semibold text-gray-900 whitespace-nowrap">#{order.order_number || order.id}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-800">{order.customer_name || 'Guest'}</div>
                      <div className="text-xs text-gray-400">{order.customer_phone || '—'}</div>
                    </td>
                    <td className="px-4 py-3 font-semibold whitespace-nowrap">৳{(order.total_amount || 0).toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <select value={order.status} onChange={e => handleStatusUpdate(order.id, e.target.value)} disabled={updatingId === order.id}
                        className={`text-xs font-semibold px-2 py-1 rounded-full border cursor-pointer focus:outline-none ${status.color}`}>
                        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => <option key={key} value={key}>{cfg.label}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${payStatus.color}`}>{payStatus.label}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{order.shipping_city || '—'}</td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap text-xs">
                      {order.created_at ? new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => loadOrderDetail(order)} className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition" title="View details">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
          <p className="text-sm text-gray-500">Page {page + 1}</p>
          <div className="flex gap-2">
            <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={() => setPage(p => p + 1)} disabled={filteredOrders.length < LIMIT}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedOrder(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h4 className="text-lg font-bold text-gray-900">Order #{selectedOrder.order_number}</h4>
                <p className="text-sm text-gray-500">{selectedOrder.created_at ? new Date(selectedOrder.created_at).toLocaleString('en-BD') : ''}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-100 rounded-xl transition"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Customer</p>
                  <p className="font-semibold text-gray-800">{selectedOrder.customer_name || 'Guest'}</p>
                  <p className="text-sm text-gray-600">{selectedOrder.customer_phone || selectedOrder.shipping_phone || '—'}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Delivery Address</p>
                  <p className="font-semibold text-gray-800">{selectedOrder.shipping_city || '—'}</p>
                  <p className="text-sm text-gray-600 line-clamp-2">{selectedOrder.shipping_address || '—'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <div className="flex-1">
                  <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Update Status</label>
                  <select value={selectedOrder.status} onChange={e => handleStatusUpdate(selectedOrder.id, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white">
                    {Object.entries(STATUS_CONFIG).map(([key, cfg]) => <option key={key} value={key}>{cfg.label}</option>)}
                  </select>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Payment</p>
                  <span className={`text-sm px-3 py-2 rounded-lg font-medium block ${PAYMENT_STATUS_CONFIG[selectedOrder.payment_status]?.color || ''}`}>
                    {PAYMENT_STATUS_CONFIG[selectedOrder.payment_status]?.label || selectedOrder.payment_status}
                  </span>
                </div>
              </div>
              {isDetailLoading ? (
                <div className="text-center py-8 text-gray-400">Loading items...</div>
              ) : selectedOrder.items && selectedOrder.items.length > 0 ? (
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">Order Items</p>
                  <div className="space-y-2">
                    {selectedOrder.items.map(item => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <div>
                          <p className="font-medium text-gray-800">{item.product_name}</p>
                          <p className="text-xs text-gray-500">Qty: {item.quantity} {item.size ? `• Size: ${item.size}` : ''}</p>
                        </div>
                        <p className="font-semibold text-gray-900">৳{(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
              {selectedOrder.notes && (
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                  <p className="text-xs text-amber-600 font-semibold uppercase tracking-wider mb-1">Customer Note</p>
                  <p className="text-sm text-amber-900">{selectedOrder.notes}</p>
                </div>
              )}
              <div className="flex items-center justify-between p-4 bg-gray-900 text-white rounded-xl">
                <span className="font-semibold">Total Amount</span>
                <span className="text-xl font-bold">৳{(selectedOrder.total_amount || 0).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
