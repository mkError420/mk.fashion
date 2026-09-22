import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { BannerManagement } from '../components/admin/BannerManagement';
import { CategoryManagement } from '../components/admin/CategoryManagement';
import { PromocodeManagement } from '../components/admin/PromocodeManagement';
import { SettingsManagement } from '../components/admin/SettingsManagement';

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
}

interface Order {
  id: number;
  order_number: string;
  total_amount: number;
  status: string;
  payment_status: string;
  shipping_city: string;
  created_at: string;
  customer_name: string;
  customer_phone: string;
}

export const AdminDashboardPage: React.FC<{}> = () => {
  const { adminUser, logout, isAdmin, isLoading: authLoading } = useAdmin();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products' | 'customers' | 'banners' | 'categories' | 'promocodes' | 'settings'>('overview');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate('/admin/login');
    }
  }, [isAdmin, authLoading, navigate]);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://efashionbd.rf.gd/backend/api';

  useEffect(() => {
    loadDashboardData();
  }, [activeTab]);

  const loadDashboardData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin_dashboard.php?action=stats`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.stats || null);
        setRecentOrders(data.recentOrders || []);
      } else {
        console.error('Dashboard API error:', response.status);
        setStats(null);
        setRecentOrders([]);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      setStats(null);
      setRecentOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const StatCard: React.FC<{ title: string; value: string | number; icon: string; color: string }> = ({ title, value, icon, color }) => (
    <div className={`${color} rounded-xl p-6 shadow-lg`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/80 text-sm font-medium mb-1">{title}</p>
          <p className="text-white text-3xl font-bold">{value}</p>
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-black text-white fixed h-full">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-1">Aristo Fashion</h1>
          <p className="text-gray-400 text-sm">Admin Panel</p>
        </div>

        <nav className="mt-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full text-left px-6 py-3 transition ${
              activeTab === 'overview' ? 'bg-white/10 border-l-4 border-white' : 'hover:bg-white/5'
            }`}
          >
            📊 Overview
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full text-left px-6 py-3 transition ${
              activeTab === 'orders' ? 'bg-white/10 border-l-4 border-white' : 'hover:bg-white/5'
            }`}
          >
            📦 Orders
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`w-full text-left px-6 py-3 transition ${
              activeTab === 'products' ? 'bg-white/10 border-l-4 border-white' : 'hover:bg-white/5'
            }`}
          >
            👕 Products
          </button>
          <button
            onClick={() => setActiveTab('customers')}
            className={`w-full text-left px-6 py-3 transition ${
              activeTab === 'customers' ? 'bg-white/10 border-l-4 border-white' : 'hover:bg-white/5'
            }`}
          >
            👥 Customers
          </button>
          <div className="border-t border-white/10 my-2"></div>
          <button
            onClick={() => setActiveTab('banners')}
            className={`w-full text-left px-6 py-3 transition ${
              activeTab === 'banners' ? 'bg-white/10 border-l-4 border-white' : 'hover:bg-white/5'
            }`}
          >
            🖼️ Banners
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`w-full text-left px-6 py-3 transition ${
              activeTab === 'categories' ? 'bg-white/10 border-l-4 border-white' : 'hover:bg-white/5'
            }`}
          >
            📁 Categories
          </button>
          <button
            onClick={() => setActiveTab('promocodes')}
            className={`w-full text-left px-6 py-3 transition ${
              activeTab === 'promocodes' ? 'bg-white/10 border-l-4 border-white' : 'hover:bg-white/5'
            }`}
          >
            🎟️ Promocodes
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full text-left px-6 py-3 transition ${
              activeTab === 'settings' ? 'bg-white/10 border-l-4 border-white' : 'hover:bg-white/5'
            }`}
          >
            ⚙️ Settings
          </button>
        </nav>

        <div className="absolute bottom-0 w-full p-6 border-t border-white/10">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-3">
              👤
            </div>
            <div>
              <p className="font-medium text-sm">{adminUser?.name}</p>
              <p className="text-gray-400 text-xs">{adminUser?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full bg-white/10 hover:bg-white/20 text-white py-2 px-4 rounded-lg transition text-sm"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h2>
            <p className="text-gray-600">Welcome back, {adminUser?.name}!</p>
          </div>
          <a
            href="/"
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
          >
            View Site →
          </a>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'overview' && (
          <div>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Total Products"
                value={stats?.totalProducts || 0}
                icon="👕"
                color="bg-gradient-to-br from-blue-500 to-blue-600"
              />
              <StatCard
                title="Total Orders"
                value={stats?.totalOrders || 0}
                icon="📦"
                color="bg-gradient-to-br from-green-500 to-green-600"
              />
              <StatCard
                title="Total Revenue"
                value={`৳${stats?.totalRevenue?.toLocaleString() || 0}`}
                icon="💰"
                color="bg-gradient-to-br from-purple-500 to-purple-600"
              />
              <StatCard
                title="Pending Orders"
                value={stats?.pendingOrders || 0}
                icon="⏳"
                color="bg-gradient-to-br from-orange-500 to-orange-600"
              />
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Orders</h3>
              {recentOrders && recentOrders.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-gray-600 font-medium">Order ID</th>
                        <th className="text-left py-3 px-4 text-gray-600 font-medium">Customer</th>
                        <th className="text-left py-3 px-4 text-gray-600 font-medium">Amount</th>
                        <th className="text-left py-3 px-4 text-gray-600 font-medium">Status</th>
                        <th className="text-left py-3 px-4 text-gray-600 font-medium">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order) => (
                        <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium">{order.order_number || 'N/A'}</td>
                          <td className="py-3 px-4">{order.customer_name || 'N/A'}</td>
                          <td className="py-3 px-4">৳{(order.total_amount || 0).toLocaleString()}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                              order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                              order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {order.status || 'Unknown'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-600">
                            {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No recent orders</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">All Orders</h3>
            <p className="text-gray-600">Order management will be implemented here.</p>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Product Management</h3>
            <p className="text-gray-600">Product management will be implemented here.</p>
          </div>
        )}

        {activeTab === 'customers' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Customer Management</h3>
            <p className="text-gray-600">Customer management will be implemented here.</p>
          </div>
        )}

        {activeTab === 'banners' && <BannerManagement />}

        {activeTab === 'categories' && <CategoryManagement />}

        {activeTab === 'promocodes' && <PromocodeManagement />}

        {activeTab === 'settings' && <SettingsManagement />}
      </div>
    </div>
  );
};
