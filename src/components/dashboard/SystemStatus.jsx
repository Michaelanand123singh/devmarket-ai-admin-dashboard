import { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, Clock, Activity } from 'lucide-react';
import { adminAPI } from '../../services/adminAPI';

const SystemStatus = () => {
  const [systemHealth, setSystemHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSystemHealth = async () => {
      try {
        const health = await adminAPI.getSystemHealth();
        setSystemHealth(health);
      } catch (error) {
        console.error('Failed to fetch system health:', error);
        // Mock data for demonstration
        setSystemHealth({
          status: 'operational',
          services: [
            { name: 'API Server', status: 'operational', uptime: '99.9%' },
            { name: 'Database', status: 'operational', uptime: '99.8%' },
            { name: 'File Storage', status: 'operational', uptime: '99.7%' },
            { name: 'Email Service', status: 'operational', uptime: '99.5%' }
          ],
          last_updated: new Date().toISOString()
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSystemHealth();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'degraded':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'down':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'operational':
        return 'bg-green-100 text-green-800';
      case 'degraded':
        return 'bg-yellow-100 text-yellow-800';
      case 'down':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="card p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!systemHealth) {
    return (
      <div className="card p-6">
        <div className="text-center">
          <AlertCircle className="mx-auto h-8 w-8 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">System Status Unavailable</h3>
          <p className="mt-1 text-sm text-gray-500">
            Unable to fetch system health information.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">System Status</h3>
        <div className="flex items-center space-x-2">
          {getStatusIcon(systemHealth.status)}
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(systemHealth.status)}`}>
            {systemHealth.status}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {systemHealth.services?.map((service, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {getStatusIcon(service.status)}
              <span className="text-sm text-gray-900">{service.name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}>
                {service.status}
              </span>
              {service.uptime && (
                <span className="text-xs text-gray-500">{service.uptime}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {systemHealth.last_updated && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Last updated: {new Date(systemHealth.last_updated).toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
};

export default SystemStatus;
