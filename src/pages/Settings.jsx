import { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, 
  Save, 
  RefreshCw, 
  Shield, 
  Database, 
  Mail,
  Bell,
  Globe,
  Palette,
  Key,
  User,
  Server
} from 'lucide-react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    general: {
      siteName: 'DevMarket AI Admin',
      siteDescription: 'AI-powered website generation platform',
      timezone: 'UTC',
      dateFormat: 'MM/DD/YYYY',
      language: 'en'
    },
    security: {
      sessionTimeout: 30,
      require2FA: false,
      passwordMinLength: 8,
      maxLoginAttempts: 5,
      lockoutDuration: 15
    },
    email: {
      smtpHost: 'smtp.gmail.com',
      smtpPort: 587,
      smtpUsername: '',
      smtpPassword: '',
      fromEmail: 'noreply@devmarket.ai',
      fromName: 'DevMarket AI'
    },
    notifications: {
      emailNotifications: true,
      slackNotifications: false,
      slackWebhook: '',
      systemAlerts: true,
      userActivity: false
    },
    system: {
      maintenanceMode: false,
      debugMode: false,
      logLevel: 'INFO',
      backupFrequency: 'daily',
      maxFileSize: 10
    }
  });

  const tabs = [
    { id: 'general', name: 'General', icon: SettingsIcon },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'email', name: 'Email', icon: Mail },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'system', name: 'System', icon: Server }
  ];

  const handleSettingChange = (section, key, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const handleSave = async (section) => {
    setSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert(`${section} settings saved successfully!`);
    } catch (error) {
      alert('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = (section) => {
    if (window.confirm(`Are you sure you want to reset ${section} settings to default?`)) {
      // Reset to default values
      const defaults = {
        general: {
          siteName: 'DevMarket AI Admin',
          siteDescription: 'AI-powered website generation platform',
          timezone: 'UTC',
          dateFormat: 'MM/DD/YYYY',
          language: 'en'
        },
        security: {
          sessionTimeout: 30,
          require2FA: false,
          passwordMinLength: 8,
          maxLoginAttempts: 5,
          lockoutDuration: 15
        },
        email: {
          smtpHost: 'smtp.gmail.com',
          smtpPort: 587,
          smtpUsername: '',
          smtpPassword: '',
          fromEmail: 'noreply@devmarket.ai',
          fromName: 'DevMarket AI'
        },
        notifications: {
          emailNotifications: true,
          slackNotifications: false,
          slackWebhook: '',
          systemAlerts: true,
          userActivity: false
        },
        system: {
          maintenanceMode: false,
          debugMode: false,
          logLevel: 'INFO',
          backupFrequency: 'daily',
          maxFileSize: 10
        }
      };
      
      setSettings(prev => ({
        ...prev,
        [section]: defaults[section]
      }));
    }
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Site Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Site Name
            </label>
            <input
              type="text"
              value={settings.general.siteName}
              onChange={(e) => handleSettingChange('general', 'siteName', e.target.value)}
              className="input w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Site Description
            </label>
            <input
              type="text"
              value={settings.general.siteDescription}
              onChange={(e) => handleSettingChange('general', 'siteDescription', e.target.value)}
              className="input w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Timezone
            </label>
            <select
              value={settings.general.timezone}
              onChange={(e) => handleSettingChange('general', 'timezone', e.target.value)}
              className="input w-full"
            >
              <option value="UTC">UTC</option>
              <option value="America/New_York">Eastern Time</option>
              <option value="America/Chicago">Central Time</option>
              <option value="America/Denver">Mountain Time</option>
              <option value="America/Los_Angeles">Pacific Time</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Format
            </label>
            <select
              value={settings.general.dateFormat}
              onChange={(e) => handleSettingChange('general', 'dateFormat', e.target.value)}
              className="input w-full"
            >
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Authentication & Security</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Session Timeout (minutes)
            </label>
            <input
              type="number"
              value={settings.security.sessionTimeout}
              onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
              className="input w-full"
              min="5"
              max="480"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password Minimum Length
            </label>
            <input
              type="number"
              value={settings.security.passwordMinLength}
              onChange={(e) => handleSettingChange('security', 'passwordMinLength', parseInt(e.target.value))}
              className="input w-full"
              min="6"
              max="20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maximum Login Attempts
            </label>
            <input
              type="number"
              value={settings.security.maxLoginAttempts}
              onChange={(e) => handleSettingChange('security', 'maxLoginAttempts', parseInt(e.target.value))}
              className="input w-full"
              min="3"
              max="10"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lockout Duration (minutes)
            </label>
            <input
              type="number"
              value={settings.security.lockoutDuration}
              onChange={(e) => handleSettingChange('security', 'lockoutDuration', parseInt(e.target.value))}
              className="input w-full"
              min="5"
              max="60"
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.security.require2FA}
              onChange={(e) => handleSettingChange('security', 'require2FA', e.target.checked)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-gray-700">Require Two-Factor Authentication for all users</span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderEmailSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">SMTP Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SMTP Host
            </label>
            <input
              type="text"
              value={settings.email.smtpHost}
              onChange={(e) => handleSettingChange('email', 'smtpHost', e.target.value)}
              className="input w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SMTP Port
            </label>
            <input
              type="number"
              value={settings.email.smtpPort}
              onChange={(e) => handleSettingChange('email', 'smtpPort', parseInt(e.target.value))}
              className="input w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SMTP Username
            </label>
            <input
              type="text"
              value={settings.email.smtpUsername}
              onChange={(e) => handleSettingChange('email', 'smtpUsername', e.target.value)}
              className="input w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SMTP Password
            </label>
            <input
              type="password"
              value={settings.email.smtpPassword}
              onChange={(e) => handleSettingChange('email', 'smtpPassword', e.target.value)}
              className="input w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              From Email
            </label>
            <input
              type="email"
              value={settings.email.fromEmail}
              onChange={(e) => handleSettingChange('email', 'fromEmail', e.target.value)}
              className="input w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              From Name
            </label>
            <input
              type="text"
              value={settings.email.fromName}
              onChange={(e) => handleSettingChange('email', 'fromName', e.target.value)}
              className="input w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Preferences</h3>
        <div className="space-y-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.notifications.emailNotifications}
              onChange={(e) => handleSettingChange('notifications', 'emailNotifications', e.target.checked)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-gray-700">Enable email notifications</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.notifications.slackNotifications}
              onChange={(e) => handleSettingChange('notifications', 'slackNotifications', e.target.checked)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-gray-700">Enable Slack notifications</span>
          </label>
          
          {settings.notifications.slackNotifications && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Slack Webhook URL
              </label>
              <input
                type="url"
                value={settings.notifications.slackWebhook}
                onChange={(e) => handleSettingChange('notifications', 'slackWebhook', e.target.value)}
                className="input w-full"
                placeholder="https://hooks.slack.com/services/..."
              />
            </div>
          )}
          
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.notifications.systemAlerts}
              onChange={(e) => handleSettingChange('notifications', 'systemAlerts', e.target.checked)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-gray-700">System alerts and warnings</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.notifications.userActivity}
              onChange={(e) => handleSettingChange('notifications', 'userActivity', e.target.checked)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-gray-700">User activity notifications</span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderSystemSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">System Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Log Level
            </label>
            <select
              value={settings.system.logLevel}
              onChange={(e) => handleSettingChange('system', 'logLevel', e.target.value)}
              className="input w-full"
            >
              <option value="DEBUG">DEBUG</option>
              <option value="INFO">INFO</option>
              <option value="WARNING">WARNING</option>
              <option value="ERROR">ERROR</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Backup Frequency
            </label>
            <select
              value={settings.system.backupFrequency}
              onChange={(e) => handleSettingChange('system', 'backupFrequency', e.target.value)}
              className="input w-full"
            >
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maximum File Size (MB)
            </label>
            <input
              type="number"
              value={settings.system.maxFileSize}
              onChange={(e) => handleSettingChange('system', 'maxFileSize', parseInt(e.target.value))}
              className="input w-full"
              min="1"
              max="100"
            />
          </div>
        </div>
        
        <div className="mt-6 space-y-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.system.maintenanceMode}
              onChange={(e) => handleSettingChange('system', 'maintenanceMode', e.target.checked)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-gray-700">Enable maintenance mode</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.system.debugMode}
              onChange={(e) => handleSettingChange('system', 'debugMode', e.target.checked)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-gray-700">Enable debug mode</span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings();
      case 'security':
        return renderSecuritySettings();
      case 'email':
        return renderEmailSettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'system':
        return renderSystemSettings();
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Configure system settings and preferences
        </p>
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
        {renderTabContent()}
        
        {/* Action buttons */}
        <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
          <button
            onClick={() => handleReset(activeTab)}
            className="btn-secondary flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Reset to Default
          </button>
          <button
            onClick={() => handleSave(activeTab)}
            disabled={saving}
            className="btn-primary flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
