import { useState, useEffect } from 'react';
import { 
  Rocket, 
  CheckCircle, 
  XCircle, 
  Clock, 
  RefreshCw, 
  Eye,
  Download,
  Trash2,
  Play,
  Pause,
  Settings,
  Globe,
  Activity
} from 'lucide-react';
import { adminAPI } from '../services/adminAPI';

const Deployments = () => {
  const [deployments, setDeployments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDeployment, setSelectedDeployment] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [statistics, setStatistics] = useState({
    total: 0,
    successful: 0,
    failed: 0,
    pending: 0,
    success_rate: 0
  });

  useEffect(() => {
    fetchDeployments();
    fetchStatistics();
  }, []);

  const fetchDeployments = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getDeployments();
      setDeployments(data.deployments || []);
    } catch (error) {
      console.error('Failed to fetch deployments:', error);
      setDeployments([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const stats = await adminAPI.getDeploymentStatistics();
      setStatistics(stats);
    } catch (error) {
      console.error('Failed to fetch deployment statistics:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchDeployments(), fetchStatistics()]);
    setRefreshing(false);
  };

  const handleDeploymentAction = async (deploymentId, action) => {
    try {
      let result;
      switch (action) {
        case 'redeploy':
          result = await adminAPI.redeployDeployment(deploymentId);
          break;
        case 'delete':
          if (window.confirm('Are you sure you want to delete this deployment?')) {
            result = await adminAPI.deleteDeployment(deploymentId);
          } else {
            return;
          }
          break;
        default:
          return;
      }
      
      if (result?.success) {
        await Promise.all([fetchDeployments(), fetchStatistics()]);
      }
    } catch (error) {
      console.error(`Failed to ${action} deployment:`, error);
      alert(`Failed to ${action} deployment. Please try again.`);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'deployed':
        return <span className="badge-success">Deployed</span>;
      case 'deploying':
        return <span className="badge-warning">Deploying</span>;
      case 'failed':
        return <span className="badge-danger">Failed</span>;
      case 'pending':
        return <span className="badge-secondary">Pending</span>;
      default:
        return <span className="badge-secondary">Unknown</span>;
    }
  };

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'netlify':
        return <Globe className="h-5 w-5 text-green-500" />;
      case 'vercel':
        return <Globe className="h-5 w-5 text-black" />;
      case 'railway':
        return <Rocket className="h-5 w-5 text-blue-500" />;
      default:
        return <Globe className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'deployed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'deploying':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
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
          <h1 className="text-2xl font-bold text-gray-900">Deployments</h1>
          <p className="mt-1 text-sm text-gray-500">
            Monitor and manage all project deployments
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={handleRefresh}
            disabled={refreshing}
            className="btn-secondary flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button className="btn-primary flex items-center gap-2">
            <Rocket className="h-4 w-4" />
            New Deployment
          </button>
        </div>
      </div>

      {/* Deployment Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Successful</p>
              <p className="text-2xl font-semibold text-gray-900">
                {statistics.successful}
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">In Progress</p>
              <p className="text-2xl font-semibold text-gray-900">
                {statistics.pending}
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Failed</p>
              <p className="text-2xl font-semibold text-gray-900">
                {statistics.failed}
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Activity className="h-8 w-8 text-blue-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total</p>
              <p className="text-2xl font-semibold text-gray-900">
                {statistics.total}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Deployments List */}
      <div className="card">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Deployments</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Project</th>
                <th>Platform</th>
                <th>Status</th>
                <th>Environment</th>
                <th>Created</th>
                <th>Build Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {deployments.map((deployment) => (
                <tr key={deployment.id} className="hover:bg-gray-50">
                  <td>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{deployment.project_name}</p>
                      <p className="text-xs text-gray-500">ID: {deployment.project_id}</p>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center space-x-2">
                      {getPlatformIcon(deployment.platform)}
                      <span className="text-sm text-gray-900 capitalize">{deployment.platform}</span>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(deployment.status)}
                      {getStatusBadge(deployment.status)}
                    </div>
                  </td>
                  <td>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      deployment.environment === 'production' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {deployment.environment}
                    </span>
                  </td>
                  <td className="text-sm text-gray-500">
                    {new Date(deployment.created_at).toLocaleDateString()}
                  </td>
                  <td className="text-sm text-gray-900">
                    {deployment.build_time > 0 ? `${deployment.build_time}s` : '-'}
                  </td>
                  <td>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => {
                          setSelectedDeployment(deployment);
                          setShowDetails(true);
                        }}
                        className="text-gray-400 hover:text-gray-600"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      
                      {deployment.status === 'deployed' && (
                        <a 
                          href={deployment.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-blue-600"
                          title="Visit Site"
                        >
                          <Globe className="h-4 w-4" />
                        </a>
                      )}
                      
                      <button 
                        onClick={() => handleDeploymentAction(deployment.id, 'redeploy')}
                        className="text-gray-400 hover:text-green-600"
                        title="Redeploy"
                      >
                        <Play className="h-4 w-4" />
                      </button>
                      
                      <button 
                        onClick={() => handleDeploymentAction(deployment.id, 'delete')}
                        className="text-gray-400 hover:text-red-600"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Deployment Details Modal */}
      {showDetails && selectedDeployment && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-4/5 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Deployment Details: {selectedDeployment.project_name}
                </h3>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="text-md font-medium text-gray-700 mb-3">Deployment Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      {getStatusBadge(selectedDeployment.status)}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Platform:</span>
                      <span className="text-gray-900 capitalize">{selectedDeployment.platform}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Environment:</span>
                      <span className="text-gray-900 capitalize">{selectedDeployment.environment}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Branch:</span>
                      <span className="text-gray-900">{selectedDeployment.branch}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Commit Hash:</span>
                      <span className="text-gray-900 font-mono">{selectedDeployment.commit_hash}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-md font-medium text-gray-700 mb-3">Build Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Created:</span>
                      <span className="text-gray-900">
                        {new Date(selectedDeployment.created_at).toLocaleString()}
                      </span>
                    </div>
                    {selectedDeployment.deployed_at && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Deployed:</span>
                        <span className="text-gray-900">
                          {new Date(selectedDeployment.deployed_at).toLocaleString()}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Build Time:</span>
                      <span className="text-gray-900">
                        {selectedDeployment.build_time > 0 ? `${selectedDeployment.build_time}s` : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Size:</span>
                      <span className="text-gray-900">{selectedDeployment.size}</span>
                    </div>
                    {selectedDeployment.url && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">URL:</span>
                        <a 
                          href={selectedDeployment.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700"
                        >
                          {selectedDeployment.url}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-md font-medium text-gray-700 mb-3">Build Logs</h4>
                <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
                  {selectedDeployment.logs.map((log, index) => (
                    <div key={index} className="flex items-start space-x-3 mb-2 text-sm">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        log.level === 'ERROR' ? 'bg-red-100 text-red-800' :
                        log.level === 'WARNING' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {log.level}
                      </span>
                      <span className="text-gray-900">{log.message}</span>
                      <span className="text-gray-500 text-xs">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowDetails(false)}
                  className="btn-secondary"
                >
                  Close
                </button>
                <button
                  onClick={() => handleDeploymentAction(selectedDeployment.id, 'redeploy')}
                  className="btn-primary"
                >
                  Redeploy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Deployments;
