import React, { useState } from 'react';
import { User, Bell, Shield, Palette, Globe, HelpCircle, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Avatar } from '../components/ui/Avatar';
import { useAuthStore } from '../store/auth';
import { useThemeStore } from '../store/theme';

const settingsSections = [
  { id: 'profile', name: 'Profile', icon: User },
  { id: 'notifications', name: 'Notifications', icon: Bell },
  { id: 'privacy', name: 'Privacy & Security', icon: Shield },
  { id: 'appearance', name: 'Appearance', icon: Palette },
  { id: 'language', name: 'Language & Region', icon: Globe },
  { id: 'help', name: 'Help & Support', icon: HelpCircle },
];

export function SettingsPage() {
  const { user, updateUser } = useAuthStore();
  const { isDark, toggleTheme } = useThemeStore();
  const [activeSection, setActiveSection] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    bio: user?.bio || '',
    location: user?.location || '',
    website: user?.website || '',
  });

  const [notifications, setNotifications] = useState({
    likes: true,
    comments: true,
    follows: true,
    mentions: true,
    events: true,
    push_messages: true,
    push_mentions: true,
    push_events: true,
  });

  const handleSave = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      await updateUser(formData);
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <Avatar
                src={user?.avatar}
                alt={user?.displayName}
                size="lg"
                fallback={user?.displayName?.charAt(0)}
              />
              <div>
                <Button variant="outline" size="sm">
                  Change Photo
                </Button>
                <p className="text-sm text-secondary-500 mt-1">
                  JPG, PNG or GIF. Max size 2MB.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Display Name"
                value={formData.displayName}
                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
              />
              <Input
                label="Username"
                value={user?.username || ''}
                disabled
                helperText="Username cannot be changed"
              />
            </div>

            <Input
              label="Bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Tell us about yourself..."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="City, Country"
              />
              <Input
                label="Website"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="https://yourwebsite.com"
              />
            </div>

            <div className="flex justify-end">
              <Button 
                onClick={handleSave}
                isLoading={isLoading}
                className="flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-medium text-secondary-900 dark:text-secondary-100">
                Email Notifications
              </h3>
              <div className="space-y-3">
                {[
                  { id: 'likes', label: 'Likes on your posts' },
                  { id: 'comments', label: 'Comments on your posts' },
                  { id: 'follows', label: 'New followers' },
                  { id: 'mentions', label: 'Mentions' },
                  { id: 'events', label: 'Event reminders' },
                ].map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <span className="text-secondary-700 dark:text-secondary-300">
                      {item.label}
                    </span>
                    <input
                      type="checkbox"
                      checked={notifications[item.id as keyof typeof notifications]}
                      onChange={(e) => handleNotificationChange(item.id, e.target.checked)}
                      className="w-4 h-4 text-primary-600 bg-white border-secondary-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-secondary-800 focus:ring-2 dark:bg-secondary-700 dark:border-secondary-600"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-secondary-900 dark:text-secondary-100">
                Push Notifications
              </h3>
              <div className="space-y-3">
                {[
                  { id: 'push_messages', label: 'Direct messages' },
                  { id: 'push_mentions', label: 'Mentions' },
                  { id: 'push_events', label: 'Event updates' },
                ].map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <span className="text-secondary-700 dark:text-secondary-300">
                      {item.label}
                    </span>
                    <input
                      type="checkbox"
                      checked={notifications[item.id as keyof typeof notifications]}
                      onChange={(e) => handleNotificationChange(item.id, e.target.checked)}
                      className="w-4 h-4 text-primary-600 bg-white border-secondary-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-secondary-800 focus:ring-2 dark:bg-secondary-700 dark:border-secondary-600"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <Button 
                onClick={() => alert('Notification settings saved!')}
                className="flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Preferences
              </Button>
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-medium text-secondary-900 dark:text-secondary-100">
                Profile Visibility
              </h3>
              <div className="space-y-2">
                {[
                  { id: 'public', label: 'Public', description: 'Anyone can see your profile' },
                  { id: 'friends', label: 'Friends only', description: 'Only people you follow can see your profile' },
                  { id: 'private', label: 'Private', description: 'Only you can see your profile' },
                ].map((option) => (
                  <div key={option.id} className="flex items-start space-x-3">
                    <input
                      type="radio"
                      name="visibility"
                      id={option.id}
                      defaultChecked={option.id === 'public'}
                      className="mt-1 w-4 h-4 text-primary-600 bg-white border-secondary-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-secondary-800 focus:ring-2 dark:bg-secondary-700 dark:border-secondary-600"
                    />
                    <div>
                      <label htmlFor={option.id} className="font-medium text-secondary-900 dark:text-secondary-100">
                        {option.label}
                      </label>
                      <p className="text-sm text-secondary-500">{option.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-secondary-900 dark:text-secondary-100">
                Data & Privacy
              </h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  Download your data
                </Button>
                <Button variant="outline" className="w-full justify-start text-error-600 hover:text-error-700">
                  Delete account
                </Button>
              </div>
            </div>

            <div className="flex justify-end">
              <Button 
                onClick={() => alert('Privacy settings saved!')}
                className="flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </Button>
            </div>
          </div>
        );

      case 'appearance':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-medium text-secondary-900 dark:text-secondary-100">
                Theme
              </h3>
              <div className="space-y-2">
                {[
                  { id: 'light', label: 'Light', description: 'Light theme' },
                  { id: 'dark', label: 'Dark', description: 'Dark theme' },
                  { id: 'system', label: 'System', description: 'Use system preference' },
                ].map((option) => (
                  <div key={option.id} className="flex items-start space-x-3">
                    <input
                      type="radio"
                      name="theme"
                      id={option.id}
                      checked={
                        (option.id === 'light' && !isDark) ||
                        (option.id === 'dark' && isDark)
                      }
                      onChange={() => {
                        if (option.id === 'light' && isDark) toggleTheme();
                        if (option.id === 'dark' && !isDark) toggleTheme();
                      }}
                      className="mt-1 w-4 h-4 text-primary-600 bg-white border-secondary-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-secondary-800 focus:ring-2 dark:bg-secondary-700 dark:border-secondary-600"
                    />
                    <div>
                      <label htmlFor={option.id} className="font-medium text-secondary-900 dark:text-secondary-100">
                        {option.label}
                      </label>
                      <p className="text-sm text-secondary-500">{option.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <Button 
                onClick={() => alert('Appearance settings saved!')}
                className="flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Preferences
              </Button>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <p className="text-secondary-600 dark:text-secondary-400">
              This section is coming soon!
            </p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
          Settings
        </h1>
        <p className="text-secondary-600 dark:text-secondary-400">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <Card padding="none">
            <nav className="space-y-1 p-2">
              {settingsSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeSection === section.id
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                      : 'text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900 dark:text-secondary-400 dark:hover:bg-secondary-800 dark:hover:text-secondary-100'
                  }`}
                >
                  <section.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  {section.name}
                </button>
              ))}
            </nav>
          </Card>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
                {settingsSections.find(s => s.id === activeSection)?.name}
              </h2>
            </CardHeader>
            <CardContent>
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                {renderSectionContent()}
              </motion.div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}