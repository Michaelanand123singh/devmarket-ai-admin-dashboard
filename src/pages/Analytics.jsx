import { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  FolderOpen, 
  Rocket, 
  Activity,
  Calendar,
  Download,
  RefreshCw,
  Filter,
  Eye,
  Globe
} from 'lucide-react';
import { adminAPI } from '../services/adminAPI';
import Chart from '../components/dashboard/Chart';

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dateRange, setDateRange] = useState(30);
  const [selectedMetric, setSelectedMetric] = useState('all');

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getDashboardAnalytics(dateRange);
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      // Set mock data for demonstration
      setAnalytics({
        user_registrations: [
          { _id: '2024-01-01', count: 12 },
          { _id: '2024-01-02', count: 18 },
          { _id: '2024-01-03', count: 15 },
          { _id: '2024-01-04', count: 22 },
          { _id: '2024-01-05', count: 19 },
          { _id: '2024-01-06', count: 25 },
          { _id: '2024-01-07', count: 30 }
        ],
        project_creations: [
          { _id: '2024-01-01', count: 8 },
          { _id: '2024-01-02', count: 12 },
          { _id: '2024-01-03', count: 10 },
          { _id: '2024-01-04', count: 15 },
          { _id: '2024-01-05', count: 13 },
          { _id: '2024-01-06', count: 18 },
          { _id: '2024-01-07', count: 22 }
        ],
        last_24h: {
          new_users: 30,
          new_projects: 22,
          successful_deployments: 18,
          failed_deployments: 2
        },
        current: {
          active_sessions: 45
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAnalytics();
    setRefreshing(false);
  };

  const getMetricIcon = (metric) => {
    switch (metric) {
      case 'users':
        return <Users className="h-5 w-5 text-blue-500" />;
      case 'projects':
        return <FolderOpen className="h-5 w-5 text-green-500" />;
      case 'deployments':
        return <Rocket className="h-5 w-5 text-purple-500" />;
      default:
        return <Activity className="h-5 w-5 text-gray-500" />;
    }
  };

  const getMetricColor = (metric) => {
    switch (metric) {
      case 'users':
        return 'blue';
      case 'projects':
        return 'green';
      case 'deployments':
        return 'purple';
      default:
        return 'gray';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="mt-1 text-sm text-gray-500">
            Detailed insights into platform performance and user behavior
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(parseInt(e.target.value))}
            className="input"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
            <option value={365}>Last year</option>
          </select>
          <button 
            onClick={handleRefresh}
            disabled={refreshing}
            className="btn-secondary flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button className="btn-primary flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Data
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-8 w-8 text-blue-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">New Users (24h)</p>
              <p className="text-2xl font-semibold text-gray-900">
                {analytics?.last_24h?.new_users || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FolderOpen className="h-8 w-8 text-green-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">New Projects (24h)</p>
              <p className="text-2xl font-semibold text-gray-900">
                {analytics?.last_24h?.new_projects || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Rocket className="h-8 w-8 text-purple-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Successful Deployments</p>
              <p className="text-2xl font-semibold text-gray-900">
                {analytics?.last_24h?.successful_deployments || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Activity className="h-8 w-8 text-orange-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Sessions</p>
              <p className="text-2xl font-semibold text-gray-900">
                {analytics?.current?.active_sessions || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">User Growth</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setSelectedMetric('users')}
                className={`px-3 py-1 text-sm rounded ${
                  selectedMetric === 'users' || selectedMetric === 'all'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                Users
              </button>
            </div>
          </div>
          <Chart
            data={analytics?.user_registrations || []}
            type="line"
            title="User Registrations"
            color="blue"
          />
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Project Creation</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setSelectedMetric('projects')}
                className={`px-3 py-1 text-sm rounded ${
                  selectedMetric === 'projects' || selectedMetric === 'all'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                Projects
              </button>
            </div>
          </div>
          <Chart
            data={analytics?.project_creations || []}
            type="bar"
            title="Project Creation"
            color="green"
          />
        </div>
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Deployment Success Rate</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Successful</span>
              <span className="text-sm font-medium text-green-600">
                {analytics?.last_24h?.successful_deployments || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Failed</span>
              <span className="text-sm font-medium text-red-600">
                {analytics?.last_24h?.failed_deployments || 0}
              </span>
            </div>
            <div className="pt-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ 
                    width: `${analytics?.last_24h?.successful_deployments && analytics?.last_24h?.failed_deployments ? 
                      (analytics.last_24h.successful_deployments / (analytics.last_24h.successful_deployments + analytics.last_24h.failed_deployments)) * 100 : 0
                    }%` 
                  }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Success Rate: {
                  analytics?.last_24h?.successful_deployments && analytics?.last_24h?.failed_deployments ? 
                    Math.round((analytics.last_24h.successful_deployments / (analytics.last_24h.successful_deployments + analytics.last_24h.failed_deployments)) * 100) : 0
                }%
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Platform Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Users</span>
              <span className="text-sm font-medium text-gray-900">
                {analytics?.user_registrations?.reduce((sum, item) => sum + item.count, 0) || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Projects</span>
              <span className="text-sm font-medium text-gray-900">
                {analytics?.project_creations?.reduce((sum, item) => sum + item.count, 0) || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Active Sessions</span>
              <span className="text-sm font-medium text-gray-900">
                {analytics?.current?.active_sessions || 0}
              </span>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Insights</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Avg. Response Time</span>
              <span className="text-sm font-medium text-gray-900">125ms</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Uptime</span>
              <span className="text-sm font-medium text-green-600">99.9%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Error Rate</span>
              <span className="text-sm font-medium text-red-600">0.1%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Trend Analysis */}
      <div className="card p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Trend Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-md font-medium text-gray-700 mb-3">User Registration Trends</h4>
            <div className="space-y-2">
              {analytics?.user_registrations?.slice(-5).map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{item._id}</span>
                  <span className="font-medium text-gray-900">{item.count} users</span>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-md font-medium text-gray-700 mb-3">Project Creation Trends</h4>
            <div className="space-y-2">
              {analytics?.project_creations?.slice(-5).map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{item._id}</span>
                  <span className="font-medium text-gray-900">{item.count} projects</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="card p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Export Analytics Data</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="btn-secondary flex items-center justify-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export as CSV</span>
          </button>
          <button className="btn-secondary flex items-center justify-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export as Excel</span>
          </button>
          <button className="btn-secondary flex items-center justify-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export as PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
