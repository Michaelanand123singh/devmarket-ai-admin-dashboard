import { useState, useEffect } from 'react';
import { 
  FolderOpen, 
  Search, 
  Filter, 
  Eye, 
  Trash2, 
  Download, 
  RefreshCw,
  Plus,
  ExternalLink,
  Code,
  Globe
} from 'lucide-react';
import { adminAPI } from '../services/adminAPI';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [industryFilter, setIndustryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProjects, setTotalProjects] = useState(0);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'

  const projectsPerPage = 20;

  useEffect(() => {
    fetchProjects();
  }, [currentPage, searchTerm, industryFilter, statusFilter]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const params = {
        skip: (currentPage - 1) * projectsPerPage,
        limit: projectsPerPage,
        search: searchTerm || undefined,
        industry: industryFilter || undefined
      };
      
      const data = await adminAPI.getProjects(params);
      setProjects(data.projects || []);
      setTotalProjects(data.total || 0);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      // Set empty data on error
      setProjects([]);
      setTotalProjects(0);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchProjects();
    setRefreshing(false);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleIndustryFilter = (industry) => {
    setIndustryFilter(industry);
    setCurrentPage(1);
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleProjectAction = async (projectId, action) => {
    try {
      let result;
      switch (action) {
        case 'delete':
          if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
            result = await adminAPI.deleteProject(projectId);
          } else {
            return;
          }
          break;
        default:
          return;
      }
      
      if (result?.success) {
        await fetchProjects();
        setSelectedProjects([]);
        setShowBulkActions(false);
      }
    } catch (error) {
      console.error(`Failed to ${action} project:`, error);
      alert(`Failed to ${action} project. Please try again.`);
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedProjects.length === 0) return;
    
    try {
      const promises = selectedProjects.map(projectId => {
        switch (action) {
          case 'delete':
            return adminAPI.deleteProject(projectId);
          default:
            return Promise.resolve();
        }
      });
      
      await Promise.all(promises);
      await fetchProjects();
      setSelectedProjects([]);
      setShowBulkActions(false);
      alert(`Bulk ${action} completed successfully`);
    } catch (error) {
      console.error(`Bulk ${action} failed:`, error);
      alert(`Bulk ${action} failed. Please try again.`);
    }
  };

  const handleSelectProject = (projectId) => {
    setSelectedProjects(prev => 
      prev.includes(projectId) 
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProjects.length === projects.length) {
      setSelectedProjects([]);
    } else {
      setSelectedProjects(projects.map(project => project.id));
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.industry.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry = !industryFilter || project.industry === industryFilter;
    const matchesStatus = !statusFilter || project.status === statusFilter;
    
    return matchesSearch && matchesIndustry && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'deployed':
        return <span className="badge-success">Deployed</span>;
      case 'generated':
        return <span className="badge-secondary">Generated</span>;
      case 'failed':
        return <span className="badge-danger">Failed</span>;
      default:
        return <span className="badge-secondary">Unknown</span>;
    }
  };

  const getIndustryIcon = (industry) => {
    switch (industry) {
      case 'ecommerce':
        return <Globe className="h-5 w-5 text-blue-500" />;
      case 'saas':
        return <Code className="h-5 w-5 text-green-500" />;
      case 'restaurant':
        return <Globe className="h-5 w-5 text-orange-500" />;
      case 'agency':
        return <Code className="h-5 w-5 text-purple-500" />;
      case 'startup':
        return <Code className="h-5 w-5 text-indigo-500" />;
      default:
        return <FolderOpen className="h-5 w-5 text-gray-500" />;
    }
  };

  const totalPages = Math.ceil(totalProjects / projectsPerPage);

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
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="mt-1 text-sm text-gray-500">
            View and manage all generated projects ({totalProjects} total projects)
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
            New Project
          </button>
        </div>
      </div>

      {/* Bulk Actions */}
      {showBulkActions && selectedProjects.length > 0 && (
        <div className="card p-4 bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-blue-900">
                {selectedProjects.length} project(s) selected
              </span>
              <div className="flex space-x-2">
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
                setSelectedProjects([]);
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
              placeholder="Search projects by name or industry..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="input pl-10"
            />
          </div>
          <select
            value={industryFilter}
            onChange={(e) => handleIndustryFilter(e.target.value)}
            className="input min-w-[150px]"
          >
            <option value="">All Industries</option>
            <option value="ecommerce">E-commerce</option>
            <option value="saas">SaaS</option>
            <option value="restaurant">Restaurant</option>
            <option value="agency">Agency</option>
            <option value="startup">Startup</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => handleStatusFilter(e.target.value)}
            className="input min-w-[150px]"
          >
            <option value="">All Statuses</option>
            <option value="generated">Generated</option>
            <option value="deployed">Deployed</option>
            <option value="failed">Failed</option>
          </select>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <FolderOpen className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded ${viewMode === 'table' ? 'bg-primary-100 text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <Code className="h-4 w-4" />
            </button>
          </div>
          <button className="btn-secondary">
            <Download className="h-4 w-4 mr-2" />
            Export All
          </button>
        </div>
      </div>

      {/* Projects Grid/Table */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div key={project.id} className="card p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-2">
                  {getIndustryIcon(project.industry)}
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">{project.business_name}</h3>
                    <p className="text-sm text-gray-500 capitalize">{project.industry}</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={selectedProjects.includes(project.id)}
                  onChange={() => handleSelectProject(project.id)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
              </div>
              
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{project.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-500">
                  <span>Created: {new Date(project.created_at).toLocaleDateString()}</span>
                </div>
                {project.deployed_url && (
                  <div className="flex items-center text-sm">
                    <span className="text-gray-500 mr-2">Deployed:</span>
                    <a 
                      href={project.deployed_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700 truncate flex items-center"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      {project.deployed_url}
                    </a>
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex-1 mr-3">
                  {getStatusBadge(project.status)}
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    className="btn-secondary text-sm px-3 py-1"
                    title="View Project"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button 
                    className="btn-secondary text-sm px-3 py-1"
                    title="Download Project"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  <button 
                    className="btn-danger text-sm px-3 py-1"
                    title="Delete Project"
                    onClick={() => handleProjectAction(project.id, 'delete')}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card">
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th className="w-12">
                    <input
                      type="checkbox"
                      checked={selectedProjects.length === projects.length && projects.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                  </th>
                  <th>Project</th>
                  <th>Industry</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Deployed URL</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-50">
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedProjects.includes(project.id)}
                        onChange={() => handleSelectProject(project.id)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                    </td>
                    <td>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{project.business_name}</p>
                        <p className="text-sm text-gray-500 line-clamp-1">{project.description}</p>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center space-x-2">
                        {getIndustryIcon(project.industry)}
                        <span className="text-sm text-gray-900 capitalize">{project.industry}</span>
                      </div>
                    </td>
                    <td>{getStatusBadge(project.status)}</td>
                    <td className="text-sm text-gray-500">
                      {new Date(project.created_at).toLocaleDateString()}
                    </td>
                    <td>
                      {project.deployed_url ? (
                        <a 
                          href={project.deployed_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:text-primary-700 text-sm flex items-center"
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          View
                        </a>
                      ) : (
                        <span className="text-gray-400 text-sm">Not deployed</span>
                      )}
                    </td>
                    <td>
                      <div className="flex items-center space-x-2">
                        <button 
                          className="text-gray-400 hover:text-gray-600"
                          title="View Project"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button 
                          className="text-gray-400 hover:text-gray-600"
                          title="Download Project"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                        <button 
                          className="text-gray-400 hover:text-red-600"
                          title="Delete Project"
                          onClick={() => handleProjectAction(project.id, 'delete')}
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
                  Showing {((currentPage - 1) * projectsPerPage) + 1} to {Math.min(currentPage * projectsPerPage, totalProjects)} of {totalProjects} results
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
      )}

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <FolderOpen className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No projects found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || industryFilter || statusFilter ? 'Try adjusting your search terms or filters.' : 'No projects have been generated yet.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default Projects;
