import { useState, useEffect } from 'react';
import { 
  Users as UsersIcon, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  UserCheck, 
  UserX,
  Plus,
  Download,
  RefreshCw,
  Eye
} from 'lucide-react';
import { adminAPI } from '../services/adminAPI';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const usersPerPage = 20;

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm, statusFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = {
        skip: (currentPage - 1) * usersPerPage,
        limit: usersPerPage,
        search: searchTerm || undefined,
        status: statusFilter || undefined
      };
      
      const data = await adminAPI.getUsers(params);
      setUsers(data.users || []);
      setTotalUsers(data.total || 0);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      // Set empty data on error
      setUsers([]);
      setTotalUsers(0);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchUsers();
    setRefreshing(false);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleUserAction = async (userId, action) => {
    try {
      let result;
      switch (action) {
        case 'suspend':
          result = await adminAPI.suspendUser(userId);
          break;
        case 'activate':
          result = await adminAPI.activateUser(userId);
          break;
        case 'delete':
          if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            result = await adminAPI.deleteUser(userId);
          } else {
            return;
          }
          break;
        default:
          return;
      }
      
      if (result?.success) {
        // Refresh users list
        await fetchUsers();
        // Clear selection
        setSelectedUsers([]);
        setShowBulkActions(false);
      }
    } catch (error) {
      console.error(`Failed to ${action} user:`, error);
      alert(`Failed to ${action} user. Please try again.`);
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedUsers.length === 0) return;
    
    try {
      const promises = selectedUsers.map(userId => {
        switch (action) {
          case 'suspend':
            return adminAPI.suspendUser(userId);
          case 'activate':
            return adminAPI.activateUser(userId);
          case 'delete':
            return adminAPI.deleteUser(userId);
          default:
            return Promise.resolve();
        }
      });
      
      await Promise.all(promises);
      await fetchUsers();
      setSelectedUsers([]);
      setShowBulkActions(false);
      alert(`Bulk ${action} completed successfully`);
    } catch (error) {
      console.error(`Bulk ${action} failed:`, error);
      alert(`Bulk ${action} failed. Please try again.`);
    }
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map(user => user.id));
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status, emailVerified) => {
    if (status === 'suspended') {
      return <span className="badge-danger">Suspended</span>;
    }
    return emailVerified ? 
      <span className="badge-success">Active</span> : 
      <span className="badge-warning">Pending</span>;
  };

  const totalPages = Math.ceil(totalUsers / usersPerPage);

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
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage user accounts and permissions ({totalUsers} total users)
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
            <Plus className="h-4 w-4" />
            Add User
          </button>
        </div>
      </div>

      {/* Bulk Actions */}
      {showBulkActions && selectedUsers.length > 0 && (
        <div className="card p-4 bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-blue-900">
                {selectedUsers.length} user(s) selected
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleBulkAction('activate')}
                  className="btn-success text-sm px-3 py-1"
                >
                  Activate All
                </button>
                <button
                  onClick={() => handleBulkAction('suspend')}
                  className="btn-warning text-sm px-3 py-1"
                >
                  Suspend All
                </button>
                <button
                  onClick={() => handleBulkAction('delete')}
                  className="btn-danger text-sm px-3 py-1"
                >
                  Delete All
                </button>
              </div>
            </div>
            <button
              onClick={() => {
                setSelectedUsers([]);
                setShowBulkActions(false);
              }}
              className="text-blue-600 hover:text-blue-800"
            >
              Clear Selection
            </button>
          </div>
        </div>
      )}

      {/* Search and filters */}
      <div className="card p-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="input pl-10"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => handleStatusFilter(e.target.value)}
            className="input min-w-[150px]"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="pending">Pending</option>
          </select>
          <button className="btn-secondary">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Users table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th className="w-12">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === users.length && users.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </th>
                <th>User</th>
                <th>Email</th>
                <th>Status</th>
                <th>Projects</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleSelectUser(user.id)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                  </td>
                  <td>
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                        <span className="text-sm font-medium text-primary-700">
                          {user.name.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">
                          {user.email_verified ? 'Verified' : 'Unverified'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="text-sm text-gray-900">{user.email}</td>
                  <td>{getStatusBadge(user.status, user.email_verified)}</td>
                  <td className="text-sm text-gray-900">{user.projects_count}</td>
                  <td className="text-sm text-gray-500">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td>
                    <div className="flex items-center space-x-2">
                      <button 
                        className="text-gray-400 hover:text-gray-600"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        className="text-gray-400 hover:text-gray-600"
                        title="Edit User"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      {user.status === 'active' ? (
                        <button 
                          className="text-gray-400 hover:text-red-600"
                          title="Suspend User"
                          onClick={() => handleUserAction(user.id, 'suspend')}
                        >
                          <UserX className="h-4 w-4" />
                        </button>
                      ) : (
                        <button 
                          className="text-gray-400 hover:text-green-600"
                          title="Activate User"
                          onClick={() => handleUserAction(user.id, 'activate')}
                        >
                          <UserCheck className="h-4 w-4" />
                        </button>
                      )}
                      <button 
                        className="text-gray-400 hover:text-red-600"
                        title="Delete User"
                        onClick={() => handleUserAction(user.id, 'delete')}
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {((currentPage - 1) * usersPerPage) + 1} to {Math.min(currentPage * usersPerPage, totalUsers)} of {totalUsers} results
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="btn-secondary px-3 py-1 disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="btn-secondary px-3 py-1 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <UsersIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || statusFilter ? 'Try adjusting your search terms or filters.' : 'Get started by adding your first user.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default Users;
