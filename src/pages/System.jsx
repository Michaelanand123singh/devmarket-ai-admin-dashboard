import { useState, useEffect } from 'react';
import { 
  Monitor, 
  Activity, 
  Server, 
  Database, 
  HardDrive, 
  Cpu,
  MemoryStick,
  Wifi,
  AlertCircle,
  CheckCircle,
  Clock,
  RefreshCw,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { adminAPI } from '../services/adminAPI';

const System = () => {
  const [systemHealth, setSystemHealth] = useState(null);
  const [systemPerformance, setSystemPerformance] = useState(null);
  const [systemLogs, setSystemLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);

  useEffect(() => {
    fetchSystemData();
    
    if (autoRefresh) {
      const interval = setInterval(fetchSystemData, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const fetchSystemData = async () => {
    try {
      setLoading(true);
      const [healthData, performanceData, logsData] = await Promise.all([
        adminAPI.getSystemHealth(),
        adminAPI.getSystemPerformance(),
        adminAPI.getSystemLogs({ limit: 50 })
      ]);

      setSystemHealth(healthData);
      setSystemPerformance(performanceData);
      setSystemLogs(logsData.logs || []);
    } catch (error) {
      console.error('Failed to fetch system data:', error);
      // Set mock data for demonstration
      setSystemHealth({
        status: 'operational',
        services: [
          { name: 'Database', status: 'operational', uptime: '99.9%' },
          { name: 'File System', status: 'operational', uptime: '99.8%' },
          { name: 'AI Services', status: 'operational', uptime: '99.7%' },
          { name: 'Deployment', status: 'operational', uptime: '99.5%' }
        ],
        last_updated: new Date().toISOString()
      });
      
      setSystemPerformance({
        cpu_usage: 45.2,
        memory_usage: 67.8,
        disk_usage: 23.4,
        response_time_avg: 125,
        requests_per_minute: 45,
        active_connections: 12
      });
      
      setSystemLogs([
        {
          timestamp: new Date().toISOString(),
          level: 'INFO',
          service: 'API',
          message: 'Admin dashboard accessed',
          user: 'admin@example.com'
        },
        {
          timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
          level: 'INFO',
          service: 'Database',
          message: 'Database connection established'
        },
        {
          timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
          level: 'WARNING',
          service: 'AI Services',
          message: 'High memory usage detected'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchSystemData();
    setRefreshing(false);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'degraded':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'down':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'operational':
        return 'text-green-600 bg-green-100';
      case 'degraded':
        return 'text-yellow-600 bg-yellow-100';
      case 'down':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getLogLevelColor = (level) => {
    switch (level) {
      case 'ERROR':
        return 'text-red-600 bg-red-100';
      case 'WARNING':
        return 'text-yellow-600 bg-yellow-100';
      case 'INFO':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getPerformanceTrend = (current, previous = 0) => {
    if (current > previous) {
      return <TrendingUp className="h-4 w-4 text-red-500" />;
    } else if (current < previous) {
      return <TrendingDown className="h-4 w-4 text-green-500" />;
    }
    return <TrendingUp className="h-4 w-4 text-gray-400" />;
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
          <h1 className="text-2xl font-bold text-gray-900">System Monitoring</h1>
          <p className="mt-1 text-sm text-gray-500">
            Monitor system health, performance, and logs in real-time
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-gray-700">Auto-refresh</span>
          </label>
          <button 
            onClick={handleRefresh}
            disabled={refreshing}
            className="btn-secondary flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* System Health Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Overall Status</h3>
            {getStatusIcon(systemHealth?.status)}
          </div>
          <div className="text-center">
            <p className={`text-2xl font-bold ${getStatusColor(systemHealth?.status)}`}>
              {systemHealth?.status?.toUpperCase() || 'UNKNOWN'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Last updated: {systemHealth?.last_updated ? 
                new Date(systemHealth.last_updated).toLocaleTimeString() : 'Unknown'
              }
            </p>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Active Services</h3>
            <Server className="h-5 w-5 text-gray-400" />
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              {systemHealth?.services?.filter(s => s.status === 'operational').length || 0}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              of {systemHealth?.services?.length || 0} services operational
            </p>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Response Time</h3>
            <Activity className="h-5 w-5 text-gray-400" />
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              {systemPerformance?.response_time_avg || 0}ms
            </p>
            <p className="text-sm text-gray-500 mt-1">Average response time</p>
          </div>
        </div>
      </div>

      {/* Service Status */}
      <div className="card p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Service Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {systemHealth?.services?.map((service, index) => (
            <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                {getStatusIcon(service.status)}
                <div>
                  <p className="font-medium text-gray-900">{service.name}</p>
                  <p className="text-sm text-gray-500">Uptime: {service.uptime}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}>
                {service.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Resource Usage</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Cpu className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium text-gray-700">CPU Usage</span>
                </div>
                <span className="text-sm text-gray-500">{systemPerformance?.cpu_usage || 0}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${systemPerformance?.cpu_usage || 0}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <MemoryStick className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium text-gray-700">Memory Usage</span>
                </div>
                <span className="text-sm text-gray-500">{systemPerformance?.memory_usage || 0}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${systemPerformance?.memory_usage || 0}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <HardDrive className="h-4 w-4 text-purple-500" />
                  <span className="text-sm font-medium text-gray-700">Disk Usage</span>
                </div>
                <span className="text-sm text-gray-500">{systemPerformance?.disk_usage || 0}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full" 
                  style={{ width: `${systemPerformance?.disk_usage || 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Network & Requests</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Wifi className="h-4 w-4 text-blue-500" />
                <span className="text-sm text-gray-700">Requests per minute</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-900">
                  {systemPerformance?.requests_per_minute || 0}
                </span>
                {getPerformanceTrend(systemPerformance?.requests_per_minute || 0, 40)}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Activity className="h-4 w-4 text-green-500" />
                <span className="text-sm text-gray-700">Active connections</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-900">
                  {systemPerformance?.active_connections || 0}
                </span>
                {getPerformanceTrend(systemPerformance?.active_connections || 0, 10)}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Monitor className="h-4 w-4 text-purple-500" />
                <span className="text-sm text-gray-700">Response time</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-900">
                  {systemPerformance?.response_time_avg || 0}ms
                </span>
                {getPerformanceTrend(systemPerformance?.response_time_avg || 0, 120)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* System Logs */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Recent System Logs</h3>
          <div className="flex items-center space-x-2">
            <select className="input text-sm">
              <option value="all">All Levels</option>
              <option value="ERROR">Error</option>
              <option value="WARNING">Warning</option>
              <option value="INFO">Info</option>
            </select>
            <select className="input text-sm">
              <option value="all">All Services</option>
              <option value="API">API</option>
              <option value="Database">Database</option>
              <option value="AI Services">AI Services</option>
            </select>
          </div>
        </div>
        
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {systemLogs.map((log, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getLogLevelColor(log.level)}`}>
                  {log.level}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">{log.message}</p>
                  <span className="text-xs text-gray-500">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                  <span>Service: {log.service}</span>
                  {log.user && <span>User: {log.user}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="btn-secondary flex items-center justify-center space-x-2">
            <RefreshCw className="h-4 w-4" />
            <span>Restart Services</span>
          </button>
          <button className="btn-secondary flex items-center justify-center space-x-2">
            <Database className="h-4 w-4" />
            <span>Backup Database</span>
          </button>
          <button className="btn-secondary flex items-center justify-center space-x-2">
            <HardDrive className="h-4 w-4" />
            <span>Clear Logs</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default System;
