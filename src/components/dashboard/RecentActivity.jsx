import { Clock, User, FolderOpen, Rocket, CheckCircle, AlertCircle } from 'lucide-react';

const RecentActivity = ({ activities = [] }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'user_registration':
        return <User className="h-4 w-4 text-blue-500" />;
      case 'project_created':
        return <FolderOpen className="h-4 w-4 text-green-500" />;
      case 'deployment':
        return <Rocket className="h-4 w-4 text-purple-500" />;
      case 'deployment_success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'deployment_failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'user_registration':
        return 'bg-blue-100 text-blue-800';
      case 'project_created':
        return 'bg-green-100 text-green-800';
      case 'deployment':
        return 'bg-purple-100 text-purple-800';
      case 'deployment_success':
        return 'bg-green-100 text-green-800';
      case 'deployment_failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getActivityBadge = (activity) => {
    if (activity.type === 'deployment') {
      const status = activity.metadata?.status;
      if (status === 'deployed') {
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Deployed
        </span>;
      } else if (status === 'failed') {
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
          Failed
        </span>;
      } else if (status === 'deploying') {
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          Deploying
        </span>;
      }
    }
    return null;
  };

  if (activities.length === 0) {
    return (
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
          <button className="text-sm text-primary-600 hover:text-primary-700">
            View all
          </button>
        </div>
        
        <div className="text-center py-8">
          <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No recent activity</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
        <button className="text-sm text-primary-600 hover:text-primary-700">
          View all
        </button>
      </div>
      
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-1">
              {getActivityIcon(activity.type)}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-900">{activity.message}</p>
                {getActivityBadge(activity)}
              </div>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-xs text-gray-500">
                  {activity.user || 'System'}
                </span>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-500">
                  {formatTime(activity.timestamp)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;
