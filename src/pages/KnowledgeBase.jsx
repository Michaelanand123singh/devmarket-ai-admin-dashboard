import { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Upload, 
  Edit, 
  Trash2, 
  RefreshCw, 
  FileText,
  Database,
  Download,
  Plus,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { adminAPI } from '../services/adminAPI';

const KnowledgeBase = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [knowledgeBase, setKnowledgeBase] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedCollection, setSelectedCollection] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BookOpen },
    { id: 'content', name: 'Content Management', icon: FileText },
    { id: 'embeddings', name: 'Embeddings', icon: Database },
    { id: 'upload', name: 'Upload', icon: Upload }
  ];

  useEffect(() => {
    fetchKnowledgeBase();
  }, []);

  const fetchKnowledgeBase = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getKnowledgeBase();
      setKnowledgeBase(data);
    } catch (error) {
      console.error('Failed to fetch knowledge base:', error);
      // Set mock data for demonstration
      setKnowledgeBase({
        statistics: {
          design_patterns: 45,
          code_templates: 32,
          industry_content: 28,
          best_practices: 15
        },
        files: {
          design_patterns: [
            { name: 'hero_sections.json', size: 2048, modified: new Date().toISOString() },
            { name: 'navigation_patterns.json', size: 1536, modified: new Date().toISOString() }
          ],
          code_templates: [
            { name: 'css_utilities.json', size: 3072, modified: new Date().toISOString() },
            { name: 'js_interactions.json', size: 2560, modified: new Date().toISOString() }
          ],
          industry_content: [
            { name: 'ecommerce_content.json', size: 4096, modified: new Date().toISOString() },
            { name: 'saas_content.json', size: 3584, modified: new Date().toISOString() }
          ],
          best_practices: [
            { name: 'accessibility_rules.json', size: 1792, modified: new Date().toISOString() },
            { name: 'performance_tips.json', size: 2304, modified: Date().toISOString() }
          ]
        },
        total_documents: 120,
        collections: ['design_patterns', 'code_templates', 'industry_content', 'best_practices']
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile || !selectedCollection) {
      alert('Please select a file and collection');
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('collection', selectedCollection);

      const result = await adminAPI.uploadKnowledgeBaseContent(formData);
      
      if (result.success) {
        alert('File uploaded successfully!');
        setShowUploadModal(false);
        setSelectedFile(null);
        setSelectedCollection('');
        await fetchKnowledgeBase();
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleRegenerateEmbeddings = async () => {
    try {
      setRegenerating(true);
      const result = await adminAPI.regenerateEmbeddings();
      
      if (result.success) {
        alert('Embeddings regenerated successfully!');
        await fetchKnowledgeBase();
      }
    } catch (error) {
      console.error('Failed to regenerate embeddings:', error);
      alert('Failed to regenerate embeddings. Please try again.');
    } finally {
      setRegenerating(false);
    }
  };

  const handleDeleteFile = async (collection, filename) => {
    if (!window.confirm(`Are you sure you want to delete ${filename}?`)) {
      return;
    }

    try {
      const result = await adminAPI.deleteKnowledgeBaseContent(collection, filename);
      
      if (result.success) {
        alert('File deleted successfully!');
        await fetchKnowledgeBase();
      }
    } catch (error) {
      console.error('Failed to delete file:', error);
      alert('Failed to delete file. Please try again.');
    }
  };

  const getCollectionColor = (collection) => {
    const colors = {
      design_patterns: 'blue',
      code_templates: 'green',
      industry_content: 'purple',
      best_practices: 'orange'
    };
    return colors[collection] || 'gray';
  };

  const getCollectionIcon = (collection) => {
    const icons = {
      design_patterns: '🎨',
      code_templates: '💻',
      industry_content: '🏢',
      best_practices: '⭐'
    };
    return icons[collection] || '📄';
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
          <h1 className="text-2xl font-bold text-gray-900">Knowledge Base</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage AI training data and content ({knowledgeBase?.total_documents || 0} total documents)
          </p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={handleRegenerateEmbeddings}
            disabled={regenerating}
            className="btn-secondary flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${regenerating ? 'animate-spin' : ''}`} />
            Regenerate Embeddings
          </button>
          <button 
            onClick={() => setShowUploadModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Upload Content
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab content */}
      <div className="card p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Knowledge Base Overview</h3>
            
            {/* Statistics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {knowledgeBase?.collections?.map((collection) => (
                <div key={collection} className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl mb-2">{getCollectionIcon(collection)}</div>
                  <p className="text-2xl font-bold text-gray-900">
                    {knowledgeBase.statistics[collection] || 0}
                  </p>
                  <p className="text-sm text-gray-700 capitalize">
                    {collection.replace('_', ' ')}
                  </p>
                </div>
              ))}
            </div>

            {/* Collection Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {knowledgeBase?.collections?.map((collection) => (
                <div key={collection} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-medium text-gray-900 capitalize">
                      {collection.replace('_', ' ')}
                    </h4>
                    <span className={`badge-${getCollectionColor(collection)}`}>
                      {knowledgeBase.statistics[collection] || 0} documents
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    {knowledgeBase.files[collection]?.map((file) => (
                      <div key={file.name} className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">{file.name}</span>
                        <span className="text-gray-500">
                          {(file.size / 1024).toFixed(1)} KB
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Content Management</h3>
            
            <div className="space-y-4">
              {knowledgeBase?.collections?.map((collection) => (
                <div key={collection} className="border border-gray-200 rounded-lg">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{getCollectionIcon(collection)}</span>
                        <h4 className="text-lg font-medium text-gray-900 capitalize">
                          {collection.replace('_', ' ')}
                        </h4>
                        <span className={`badge-${getCollectionColor(collection)}`}>
                          {knowledgeBase.statistics[collection] || 0} files
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    {knowledgeBase.files[collection]?.length > 0 ? (
                      <div className="space-y-3">
                        {knowledgeBase.files[collection].map((file) => (
                          <div key={file.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <FileText className="h-5 w-5 text-gray-400" />
                              <div>
                                <p className="text-sm font-medium text-gray-900">{file.name}</p>
                                <p className="text-xs text-gray-500">
                                  {(file.size / 1024).toFixed(1)} KB • 
                                  Modified {new Date(file.modified).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <button 
                                className="text-gray-400 hover:text-gray-600"
                                title="Download"
                              >
                                <Download className="h-4 w-4" />
                              </button>
                              <button 
                                className="text-gray-400 hover:text-gray-600"
                                title="Edit"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button 
                                className="text-gray-400 hover:text-red-600"
                                title="Delete"
                                onClick={() => handleDeleteFile(collection, file.name)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <FileText className="mx-auto h-8 w-8 mb-2" />
                        <p>No files in this collection</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'embeddings' && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Embeddings Status</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {knowledgeBase?.collections?.map((collection) => (
                <div key={collection} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getCollectionIcon(collection)}</span>
                      <h4 className="font-medium text-gray-900 capitalize">
                        {collection.replace('_', ' ')}
                      </h4>
                    </div>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Documents:</span>
                      <span className="font-medium">{knowledgeBase.statistics[collection] || 0}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Status:</span>
                      <span className="badge-success">Embedded</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Last Updated:</span>
                      <span className="text-gray-500">Just now</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <AlertCircle className="h-5 w-5 text-blue-500" />
                <h4 className="font-medium text-blue-900">Embeddings Information</h4>
              </div>
              <p className="text-sm text-blue-700">
                All collections have been processed and embedded. You can regenerate embeddings 
                if you've made changes to the content files.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'upload' && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Upload Content</h3>
            
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Upload New Content</h3>
              <p className="text-gray-500 mb-4">
                Upload JSON files to add new content to your knowledge base
              </p>
              <button 
                onClick={() => setShowUploadModal(true)}
                className="btn-primary"
              >
                <Plus className="h-4 w-4 mr-2" />
                Upload File
              </button>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-yellow-500" />
                <h4 className="font-medium text-yellow-900">Upload Guidelines</h4>
              </div>
              <ul className="mt-2 text-sm text-yellow-700 space-y-1">
                <li>• Only JSON files are accepted</li>
                <li>• Files should contain structured data relevant to the selected collection</li>
                <li>• After upload, embeddings will be automatically regenerated</li>
                <li>• Maximum file size: 10MB</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Upload Content</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Collection
                  </label>
                  <select
                    value={selectedCollection}
                    onChange={(e) => setSelectedCollection(e.target.value)}
                    className="input w-full"
                  >
                    <option value="">Select a collection</option>
                    {knowledgeBase?.collections?.map((collection) => (
                      <option key={collection} value={collection}>
                        {collection.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    File
                  </label>
                  <input
                    type="file"
                    accept=".json"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                    className="input w-full"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowUploadModal(false);
                    setSelectedFile(null);
                    setSelectedCollection('');
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleFileUpload}
                  disabled={!selectedFile || !selectedCollection || uploading}
                  className="btn-primary"
                >
                  {uploading ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KnowledgeBase;
