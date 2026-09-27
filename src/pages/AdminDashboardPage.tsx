import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { HeroVideoManagement } from '../components/admin/HeroVideoManagement';
import { FestiveManagement } from '../components/admin/FestiveManagement';
import { VoucherManagement } from '../components/admin/VoucherManagement';
import { OutletsManagement } from '../components/admin/OutletsManagement';
import { CategoryManagement } from '../components/admin/CategoryManagement';
import { PromocodeManagement } from '../components/admin/PromocodeManagement';
import { SettingsManagement } from '../components/admin/SettingsManagement';
import { OrdersManagement } from '../components/admin/OrdersManagement';
import { ProductsManagement } from '../components/admin/ProductsManagement';
import { CustomersManagement } from '../components/admin/CustomersManagement';
import { PagesManagement } from '../components/admin/PagesManagement';
import { BlogManagement } from '../components/admin/BlogManagement';
import {
  LayoutDashboard, ShoppingBag, Package, Users, Video, FolderOpen,
  Tag, Settings, LogOut, Menu, X, TrendingUp, TrendingDown, Clock,
  CheckCircle2, Truck, XCircle, AlertTriangle, ArrowUpRight, ExternalLink,
  RefreshCw, BarChart2, Star, Sparkles, Ticket, MapPin, FileText, BookOpen
} from 'lucide-react';

type TabType = 'overview' | 'orders' | 'products' | 'customers' | 'hero-video' | 'festive' | 'voucher' | 'outlets' | 'categories' | 'promocodes' | 'pages' | 'blogs' | 'settings';

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  totalCustomers: number;
  todayOrders: number;
  todayRevenue: number;
  statusBreakdown: Record<string, number>;
}

interface MonthlyData { month: string; revenue: number; orders: number; }
interface TopProduct { id: number; name: string; price: number; image_url: string | null; total_sold: number; total_revenue: number; }
interface LowStockProduct { id: number; name: string; stock_quantity: number; }
interface RecentOrder { id: number; order_number: string; total_amount: number; status: string; payment_status: string; shipping_city: string; created_at: string; customer_name: string; customer_phone: string; }

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://efashionbd.rf.gd/backend/api';

const NAV_ITEMS: { id: TabType; label: string; icon: React.ReactNode; badge?: string }[] = [
  { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-5 h-5" /> },
  { id: 'orders', label: 'Orders', icon: <ShoppingBag className="w-5 h-5" /> },
  { id: 'products', label: 'Products', icon: <Package className="w-5 h-5" /> },
  { id: 'customers', label: 'Customers', icon: <Users className="w-5 h-5" /> },
  { id: 'hero-video', label: 'Hero Video', icon: <Video className="w-5 h-5" />, badge: 'Home' },
  { id: 'festive', label: 'Festive Section', icon: <Sparkles className="w-5 h-5" />, badge: 'Home' },
  { id: 'voucher', label: 'VIP Voucher', icon: <Ticket className="w-5 h-5" />, badge: 'Home' },
  { id: 'outlets', label: 'Store Outlets', icon: <MapPin className="w-5 h-5" />, badge: 'Home' },
  { id: 'categories', label: 'Categories', icon: <FolderOpen className="w-5 h-5" /> },
  { id: 'promocodes', label: 'Promocodes', icon: <Tag className="w-5 h-5" /> },
  { id: 'pages',      label: 'Pages Content', icon: <FileText className="w-5 h-5 text-violet-500" />, badge: 'Content' },
  { id: 'blogs',      label: 'Blog Posts',    icon: <BookOpen className="w-5 h-5 text-indigo-500" />, badge: 'Blog' },
  { id: 'settings',   label: 'Settings',    icon: <Settings className="w-5 h-5" /> },
];

const STATUS_COLORS: Record<string, { dot: string; label: string }> = {
  pending: { dot: 'bg-amber-400', label: 'Pending' },
  processing: { dot: 'bg-blue-500', label: 'Processing' },
  shipped: { dot: 'bg-purple-500', label: 'Shipped' },
  delivered: { dot: 'bg-emerald-500', label: 'Delivered' },
  cancelled: { dot: 'bg-red-500', label: 'Cancelled' },
};

export const AdminDashboardPage: React.FC = () => {
  const { adminUser, logout, isAdmin, isLoading: authLoading } = useAdmin();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [monthlyRevenue, setMonthlyRevenue] = useState<MonthlyData[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<LowStockProduct[]>([]);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAdmin) navigate('/admin/login');
  }, [isAdmin, authLoading, navigate]);

  const loadDashboardData = async (showRefresh = false) => {
    if (showRefresh) setIsRefreshing(true);
    else if (!stats) setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/admin_dashboard.php?action=stats`, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats || null);
        setMonthlyRevenue(data.monthlyRevenue || []);
        setTopProducts(data.topProducts || []);
        setLowStockProducts(data.lowStockProducts || []);
        setRecentOrders(data.recentOrders || []);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadDashboardData();
    }
  }, [isAdmin]);

  const handleLogout = () => { logout(); navigate('/admin/login'); };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setIsSidebarOpen(false);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Verifying session...</p>
        </div>
      </div>
    );
  }

  const maxRevenue = Math.max(...monthlyRevenue.map(m => Number(m.revenue)), 1);

  return (
    <div className="min-h-screen bg-gray-50 flex" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* ── Sidebar Overlay (mobile) ── */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* ── Sidebar ── */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-gray-950 text-white z-40 flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
      `}>
        {/* Brand */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-extrabold tracking-tight">ARISTO FASHION</h1>
              <p className="text-gray-400 text-xs mt-0.5 tracking-widest uppercase">Admin Console</p>
            </div>
            <button className="lg:hidden text-gray-400 hover:text-white" onClick={() => setIsSidebarOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleTabChange(item.id)}
              className={`
                w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer
                ${activeTab === item.id
                  ? 'bg-white text-gray-950 shadow-sm font-semibold'
                  : 'text-gray-400 hover:bg-white/10 hover:text-white'}
              `}
            >
              {item.icon}
              {item.label}
              {item.id === 'orders' && stats?.pendingOrders ? (
                <span className="ml-auto bg-amber-400 text-gray-900 text-xs font-bold px-2 py-0.5 rounded-full">{stats.pendingOrders}</span>
              ) : null}
            </button>
          ))}
        </nav>

        {/* Admin Profile + Logout */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {adminUser?.name ? adminUser.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm truncate">{adminUser?.name || 'Admin'}</p>
              <p className="text-gray-400 text-xs truncate">{adminUser?.email || ''}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white py-2.5 px-4 rounded-xl transition text-sm font-medium"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <div className="flex-1 lg:ml-64 min-w-0 flex flex-col">

        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition" onClick={() => setIsSidebarOpen(true)}>
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h2 className="text-lg font-bold text-gray-900 capitalize">
                  {NAV_ITEMS.find(n => n.id === activeTab)?.label || activeTab}
                </h2>
                <p className="text-xs text-gray-500 hidden sm:block">Welcome back, {adminUser?.name}!</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {activeTab === 'overview' && (
                <button onClick={() => loadDashboardData(true)} disabled={isRefreshing}
                  className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-xl transition font-medium disabled:opacity-50">
                  <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} /> Refresh
                </button>
              )}
              <a href="/" target="_blank" rel="noreferrer"
                className="flex items-center gap-1.5 text-xs bg-gray-900 text-white px-3 py-2 rounded-xl hover:bg-gray-700 transition font-medium">
                <ExternalLink className="w-3.5 h-3.5" /> View Site
              </a>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 overflow-auto">

          {/* ── OVERVIEW ── */}
          {activeTab === 'overview' && (
            isLoading && !stats ? (
              <div className="flex flex-col items-center justify-center py-24">
                <div className="w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mb-3" />
                <p className="text-gray-400 text-sm">Loading dashboard...</p>
              </div>
            ) : (
              <div className="space-y-5">

                {/* ── Stat Cards (classic flat style) ── */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    {
                      label: 'Total Revenue',
                      value: `৳${(stats?.totalRevenue || 0).toLocaleString()}`,
                      sub: `Today ৳${(stats?.todayRevenue || 0).toLocaleString()}`,
                      icon: <BarChart2 className="w-4 h-4" />,
                      accent: 'border-l-blue-600',
                      iconBg: 'bg-blue-50 text-blue-600',
                    },
                    {
                      label: 'Total Orders',
                      value: (stats?.totalOrders || 0).toString(),
                      sub: `${stats?.todayOrders || 0} today`,
                      icon: <ShoppingBag className="w-4 h-4" />,
                      accent: 'border-l-indigo-500',
                      iconBg: 'bg-indigo-50 text-indigo-600',
                    },
                    {
                      label: 'Pending Orders',
                      value: (stats?.pendingOrders || 0).toString(),
                      sub: 'Needs attention',
                      icon: <Clock className="w-4 h-4" />,
                      accent: 'border-l-amber-500',
                      iconBg: 'bg-amber-50 text-amber-600',
                    },
                    {
                      label: 'Customers',
                      value: (stats?.totalCustomers || 0).toString(),
                      sub: `${stats?.totalProducts || 0} products`,
                      icon: <Users className="w-4 h-4" />,
                      accent: 'border-l-emerald-500',
                      iconBg: 'bg-emerald-50 text-emerald-600',
                    },
                  ].map((card, i) => (
                    <div key={i} className={`bg-white border border-gray-200 border-l-4 ${card.accent} rounded-lg p-4 flex items-start gap-3`}>
                      <div className={`w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 ${card.iconBg}`}>
                        {card.icon}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-gray-500 font-medium">{card.label}</p>
                        <p className="text-xl font-bold text-gray-900 leading-tight mt-0.5">{card.value}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{card.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* ── Main Grid ── */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

                  {/* Revenue Bar Chart */}
                  <div className="xl:col-span-2 bg-white border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">Monthly Revenue</p>
                        <p className="text-xs text-gray-400 mt-0.5">Last 6 months</p>
                      </div>
                      <span className="text-sm font-bold text-gray-700">৳{(stats?.totalRevenue || 0).toLocaleString()}</span>
                    </div>
                    <div className="px-5 py-5">
                      {monthlyRevenue.length === 0 ? (
                        <div className="flex items-center justify-center h-40 text-gray-300">
                          <div className="text-center">
                            <BarChart2 className="w-8 h-8 mx-auto mb-1 opacity-30" />
                            <p className="text-xs">No data yet</p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-end gap-2 h-40">
                          {monthlyRevenue.map((m, i) => {
                            const pct = (Number(m.revenue) / maxRevenue) * 100;
                            const monthLabel = m.month
                              ? new Date(m.month + '-01').toLocaleDateString('en-BD', { month: 'short' })
                              : m.month;
                            return (
                              <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                                <div className="relative w-full flex flex-col items-center justify-end" style={{ height: '128px' }}>
                                  <div
                                    className="w-full bg-blue-600 hover:bg-blue-700 rounded-sm transition-all duration-300 cursor-default"
                                    style={{ height: `${Math.max(pct, 3)}%` }}
                                    title={`৳${Number(m.revenue).toLocaleString()} — ${m.orders} orders`}
                                  />
                                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap">
                                    ৳{Number(m.revenue).toLocaleString()}
                                  </div>
                                </div>
                                <p className="text-[10px] text-gray-400">{monthLabel}</p>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Order Status */}
                  <div className="bg-white border border-gray-200 rounded-lg">
                    <div className="px-5 py-4 border-b border-gray-100">
                      <p className="font-semibold text-gray-800 text-sm">Order Status</p>
                      <p className="text-xs text-gray-400 mt-0.5">All-time breakdown</p>
                    </div>
                    <div className="px-5 py-4 space-y-3">
                      {Object.entries(STATUS_COLORS).map(([key, cfg]) => {
                        const count = stats?.statusBreakdown?.[key] || 0;
                        const total = stats?.totalOrders || 1;
                        const pct = Math.round((count / total) * 100);
                        return (
                          <div key={key}>
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                                <span className="text-xs text-gray-600">{cfg.label}</span>
                              </div>
                              <span className="text-xs font-semibold text-gray-700">{count} <span className="font-normal text-gray-400">({pct}%)</span></span>
                            </div>
                            <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                              <div className={`h-full rounded-full ${cfg.dot} transition-all duration-500`} style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="px-5 pb-4 pt-2 border-t border-gray-100 flex gap-2">
                      <button onClick={() => handleTabChange('orders')}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded text-xs font-medium text-gray-600 transition">
                        <ShoppingBag className="w-3.5 h-3.5" /> Orders
                      </button>
                      <button onClick={() => handleTabChange('products')}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded text-xs font-medium text-gray-600 transition">
                        <Package className="w-3.5 h-3.5" /> Products
                      </button>
                    </div>
                  </div>
                </div>

                {/* ── Bottom Row ── */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

                  {/* Recent Orders Table */}
                  <div className="xl:col-span-2 bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                      <p className="font-semibold text-gray-800 text-sm">Recent Orders</p>
                      <button onClick={() => handleTabChange('orders')}
                        className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-0.5 font-medium transition">
                        View all <ArrowUpRight className="w-3 h-3" />
                      </button>
                    </div>
                    {recentOrders.length === 0 ? (
                      <div className="text-center py-10 text-gray-300">
                        <ShoppingBag className="w-7 h-7 mx-auto mb-1 opacity-30" />
                        <p className="text-xs">No recent orders</p>
                      </div>
                    ) : (
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-100">
                            <th className="text-left px-5 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Order</th>
                            <th className="text-left px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Customer</th>
                            <th className="text-left px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Status</th>
                            <th className="text-right px-5 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Amount</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {recentOrders.slice(0, 8).map(order => {
                            const statusCfg = STATUS_COLORS[order.status] || STATUS_COLORS.pending;
                            return (
                              <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-5 py-2.5">
                                  <p className="font-medium text-gray-800 text-xs">#{order.order_number}</p>
                                  <p className="text-gray-400 text-[10px]">{order.created_at ? new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : ''}</p>
                                </td>
                                <td className="px-3 py-2.5 hidden sm:table-cell">
                                  <p className="text-xs text-gray-600 truncate max-w-[120px]">{order.customer_name || 'Guest'}</p>
                                  <p className="text-[10px] text-gray-400">{order.shipping_city || '—'}</p>
                                </td>
                                <td className="px-3 py-2.5 hidden md:table-cell">
                                  <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded`}
                                    style={{ background: 'transparent' }}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
                                    <span className="text-gray-600">{statusCfg.label}</span>
                                  </span>
                                </td>
                                <td className="px-5 py-2.5 text-right">
                                  <p className="font-semibold text-gray-800 text-xs">৳{(order.total_amount || 0).toLocaleString()}</p>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    )}
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">

                    {/* Top Products */}
                    <div className="bg-white border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
                        <Star className="w-3.5 h-3.5 text-amber-400" />
                        <p className="font-semibold text-gray-800 text-sm">Top Products</p>
                      </div>
                      <div className="px-5 py-3">
                        {topProducts.length === 0 ? (
                          <p className="text-xs text-gray-400 text-center py-5">No sales data</p>
                        ) : (
                          <div className="space-y-3">
                            {topProducts.slice(0, 4).map((p, i) => (
                              <div key={p.id} className="flex items-center gap-3">
                                <span className="text-xs text-gray-400 font-semibold w-4 flex-shrink-0 text-center">{i + 1}</span>
                                <div className="w-7 h-7 rounded bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200">
                                  {p.image_url
                                    ? <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                                    : <Package className="w-3.5 h-3.5 text-gray-300 m-auto mt-1.5" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-medium text-gray-700 truncate">{p.name}</p>
                                  <p className="text-[10px] text-gray-400">{p.total_sold} sold</p>
                                </div>
                                <p className="text-xs font-semibold text-gray-700 flex-shrink-0">৳{Number(p.total_revenue).toLocaleString()}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Low Stock */}
                    {lowStockProducts.length > 0 && (
                      <div className="bg-white border border-amber-200 rounded-lg">
                        <div className="flex items-center gap-2 px-5 py-3.5 border-b border-amber-100 bg-amber-50 rounded-t-lg">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                          <p className="font-semibold text-amber-800 text-sm">Low Stock</p>
                        </div>
                        <div className="px-5 py-3 space-y-2">
                          {lowStockProducts.map(p => (
                            <div key={p.id} className="flex items-center justify-between">
                              <p className="text-xs text-gray-700 truncate flex-1">{p.name}</p>
                              <span className={`ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded flex-shrink-0 ${p.stock_quantity === 0 ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                                {p.stock_quantity === 0 ? 'Out' : `${p.stock_quantity}`}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          )}

          {/* ── OTHER TABS ── */}
          {activeTab === 'orders' && <OrdersManagement />}
          {activeTab === 'products' && <ProductsManagement />}
          {activeTab === 'customers' && <CustomersManagement />}
          {activeTab === 'hero-video' && <HeroVideoManagement />}
          {activeTab === 'festive' && <FestiveManagement />}
          {activeTab === 'voucher' && <VoucherManagement />}
          {activeTab === 'outlets' && <OutletsManagement />}
          {activeTab === 'categories' && <CategoryManagement />}
          {activeTab === 'promocodes' && <PromocodeManagement />}
          {activeTab === 'pages' && <PagesManagement />}
          {activeTab === 'blogs' && <BlogManagement />}
          {activeTab === 'settings' && <SettingsManagement />}

        </main>
      </div>
    </div>
  );
};
