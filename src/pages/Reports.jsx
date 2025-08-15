import { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  Plus, 
  Calendar,
  BarChart3,
  TrendingUp,
  Users,
  FolderOpen,
  Rocket,
  RefreshCw,
  Eye,
  Trash2,
  Clock,
  CheckCircle
} from 'lucide-react';
import { adminAPI } from '../services/adminAPI';

const Reports = () => {
  const [reportTemplates, setReportTemplates] = useState([]);
  const [generatedReports, setGeneratedReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [reportParams, setReportParams] = useState({});
  const [activeTab, setActiveTab] = useState('templates');

  const tabs = [
    { id: 'templates', name: 'Report Templates', icon: FileText },
    { id: 'generated', name: 'Generated Reports', icon: Download },
    { id: 'scheduled', name: 'Scheduled Reports', icon: Calendar }
  ];

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const [templatesData] = await Promise.all([
        adminAPI.getReportTemplates()
      ]);

      setReportTemplates(templatesData.templates || []);
      
      // Mock generated reports for demonstration
      setGeneratedReports([
        {
          id: 'report_1',
          type: 'user_activity',
          name: 'User Activity Report - January 2024',
          generated_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          status: 'completed',
          size: '2.4 MB',
          format: 'PDF'
        },
        {
          id: 'report_2',
          type: 'project_analytics',
          name: 'Project Analytics - Q4 2023',
          generated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'completed',
          size: '1.8 MB',
          format: 'Excel'
        },
        {
          id: 'report_3',
          type: 'system_performance',
          name: 'System Performance - December 2023',
          generated_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'completed',
          size: '3.2 MB',
          format: 'PDF'
        }
      ]);
    } catch (error) {
      console.error('Failed to fetch report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    if (!selectedTemplate) {
      alert('Please select a report template');
      return;
    }

    try {
      setGenerating(true);
      const result = await adminAPI.generateReport(selectedTemplate.id, reportParams);
      
      if (result.success) {
        alert('Report generated successfully!');
        setShowGenerateModal(false);
        setSelectedTemplate(null);
        setReportParams({});
        
        // Add to generated reports
        const newReport = {
          id: result.report_id,
          type: selectedTemplate.id,
          name: `${selectedTemplate.name} - ${new Date().toLocaleDateString()}`,
          generated_at: result.generated_at,
          status: 'completed',
          size: 'Calculating...',
          format: 'PDF'
        };
        setGeneratedReports(prev => [newReport, ...prev]);
      }
    } catch (error) {
      console.error('Failed to generate report:', error);
      alert('Failed to generate report. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleDownloadReport = (report) => {
    // Mock download functionality
    alert(`Downloading ${report.name}...`);
  };

  const handleDeleteReport = (reportId) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      setGeneratedReports(prev => prev.filter(r => r.id !== reportId));
    }
  };

  const getReportTypeIcon = (type) => {
    switch (type) {
      case 'user_activity':
        return <Users className="h-5 w-5 text-blue-500" />;
      case 'project_analytics':
        return <FolderOpen className="h-5 w-5 text-green-500" />;
      case 'system_performance':
        return <BarChart3 className="h-5 w-5 text-purple-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const getReportTypeColor = (type) => {
    switch (type) {
      case 'user_activity':
        return 'blue';
      case 'project_analytics':
        return 'green';
      case 'system_performance':
        return 'purple';
      default:
        return 'gray';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <span className="badge-success">Completed</span>;
      case 'processing':
        return <span className="badge-warning">Processing</span>;
      case 'failed':
        return <span className="badge-danger">Failed</span>;
      default:
        return <span className="badge-secondary">Unknown</span>;
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
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="mt-1 text-sm text-gray-500">
            Generate and manage analytics reports
          </p>
        </div>
        <button 
          onClick={() => setShowGenerateModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Generate Report
        </button>
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
        {activeTab === 'templates' && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Available Report Templates</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reportTemplates.map((template) => (
                <div key={template.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-3 mb-4">
                    {getReportTypeIcon(template.type)}
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">{template.name}</h4>
                      <p className="text-sm text-gray-500">{template.description}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Parameters:</p>
                      <div className="flex flex-wrap gap-2">
                        {template.parameters.map((param) => (
                          <span key={param} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                            {param}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => {
                        setSelectedTemplate(template);
                        setShowGenerateModal(true);
                      }}
                      className="btn-primary w-full"
                    >
                      Generate Report
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'generated' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Generated Reports</h3>
              <button 
                onClick={fetchReportData}
                className="btn-secondary flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </button>
            </div>
            
            <div className="space-y-4">
              {generatedReports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    {getReportTypeIcon(report.type)}
                    <div>
                      <h4 className="font-medium text-gray-900">{report.name}</h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Generated: {new Date(report.generated_at).toLocaleDateString()}</span>
                        <span>Size: {report.size}</span>
                        <span>Format: {report.format}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {getStatusBadge(report.status)}
                    <button 
                      onClick={() => handleDownloadReport(report)}
                      className="text-gray-400 hover:text-gray-600"
                      title="Download Report"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteReport(report.id)}
                      className="text-gray-400 hover:text-red-600"
                      title="Delete Report"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {generatedReports.length === 0 && (
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No reports generated</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Generate your first report using the templates above.
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'scheduled' && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Scheduled Reports</h3>
            
            <div className="text-center py-12">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No scheduled reports</h3>
              <p className="mt-1 text-sm text-gray-500">
                Schedule reports to be generated automatically at regular intervals.
              </p>
              <button className="btn-primary mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Schedule Report
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Generate Report Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Generate Report</h3>
              
              {selectedTemplate && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Report Template
                    </label>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        {getReportTypeIcon(selectedTemplate.type)}
                        <span className="font-medium">{selectedTemplate.name}</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{selectedTemplate.description}</p>
                    </div>
                  </div>
                  
                  {selectedTemplate.parameters.map((param) => (
                    <div key={param}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {param.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </label>
                      <input
                        type="text"
                        placeholder={`Enter ${param}`}
                        value={reportParams[param] || ''}
                        onChange={(e) => setReportParams(prev => ({
                          ...prev,
                          [param]: e.target.value
                        }))}
                        className="input w-full"
                      />
                    </div>
                  ))}
                </div>
              )}
              
              <div className="flex items-center justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowGenerateModal(false);
                    setSelectedTemplate(null);
                    setReportParams({});
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleGenerateReport}
                  disabled={!selectedTemplate || generating}
                  className="btn-primary"
                >
                  {generating ? 'Generating...' : 'Generate Report'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
