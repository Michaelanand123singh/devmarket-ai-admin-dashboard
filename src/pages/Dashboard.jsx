import { useState, useEffect } from 'react';
import { 
  Users, 
  FolderOpen, 
  Rocket, 
  TrendingUp, 
  Activity,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Download,
  BarChart3
} from 'lucide-react';
import { adminAPI } from '../services/adminAPI';
import AnalyticsCards from '../components/dashboard/AnalyticsCards';
import RecentActivity from '../components/dashboard/RecentActivity';
import SystemStatus from '../components/dashboard/SystemStatus';
import Chart from '../components/dashboard/Chart';

const Dashboard = () => {
  const [overview, setOverview] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [overviewData, analyticsData, activityData] = await Promise.all([
        adminAPI.getDashboardOverview(),
        adminAPI.getDashboardAnalytics(30),
        adminAPI.getRecentActivity(10)
      ]);

      setOverview(overviewData);
      setAnalytics(analyticsData);
      setRecentActivity(activityData);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      // Set empty data on error
      setOverview(null);
      setAnalytics(null);
      setRecentActivity([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const stats = [
    {
      name: 'Total Users',
      value: overview?.total_users || 0,
      change: '+12%',
      changeType: 'positive',
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      name: 'Total Projects',
      value: overview?.total_projects || 0,
      change: '+8%',
      changeType: 'positive',
      icon: FolderOpen,
      color: 'bg-green-500'
    },
    {
      name: 'Active Deployments',
      value: overview?.active_deployments || 0,
      change: '+15%',
      changeType: 'positive',
      icon: Rocket,
      color: 'bg-purple-500'
    },
    {
      name: 'Success Rate',
      value: `${overview?.success_rate || 0}%`,
      change: '+2%',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'bg-yellow-500'
    }
  ];

  const quickActions = [
    {
      name: 'View Users',
      href: '/users',
      icon: Users,
      description: 'Manage user accounts'
    },
    {
      name: 'View Projects',
      href: '/projects',
      icon: FolderOpen,
      description: 'Browse all projects'
    },
    {
      name: 'System Health',
      href: '/system',
      icon: Activity,
      description: 'Check system status'
    },
    {
      name: 'Generate Report',
      href: '/reports',
      icon: TrendingUp,
      description: 'Create analytics report'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Welcome back! Here's what's happening with your platform today.
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="btn-secondary flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Analytics Cards */}
      <AnalyticsCards stats={stats} />

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <RecentActivity activities={recentActivity} />
        </div>

        {/* System Status & Quick Actions */}
        <div className="space-y-6">
          <SystemStatus />
          
          {/* Quick Actions */}
          <div className="card p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <a
                    key={action.name}
                    href={action.href}
                    className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <Icon className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{action.name}</p>
                      <p className="text-xs text-gray-500">{action.description}</p>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      {analytics && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">User Registrations</h3>
            <Chart
              data={analytics.user_registrations}
              type="line"
              title="User Growth"
              color="blue"
            />
          </div>
          <div className="card p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Project Creation</h3>
            <Chart
              data={analytics.project_creations}
              type="bar"
              title="Project Growth"
              color="green"
            />
          </div>
        </div>
      )}

      {/* Recent Activity Summary */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-8 w-8 text-blue-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Last 24 Hours</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {analytics.last_24h?.new_users || 0}
                </p>
                <p className="text-sm text-gray-500">New Users</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Successful Deployments</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {analytics.last_24h?.successful_deployments || 0}
                </p>
                <p className="text-sm text-gray-500">Last 24 Hours</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertCircle className="h-8 w-8 text-yellow-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Failed Deployments</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {analytics.last_24h?.failed_deployments || 0}
                </p>
                <p className="text-sm text-gray-500">Last 24 Hours</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Activity className="h-8 w-8 text-purple-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Sessions</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {analytics.current?.active_sessions || 0}
                </p>
                <p className="text-sm text-gray-500">Currently Online</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
