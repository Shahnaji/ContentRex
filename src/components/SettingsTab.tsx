import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  Mail, 
  Lock, 
  Bell,
  Globe,
  Trash2,
  Save,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { Input } from './ui/input';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { useAuth } from './AuthContext';

interface SettingsTabProps {
  user?: any;
  onSignOut?: () => void;
}

export function SettingsTab({ user, onSignOut }: SettingsTabProps) {
  const { getAccessToken, signOut } = useAuth();
  
  // Profile Settings
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // Password Settings
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  // Notification Settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [productUpdates, setProductUpdates] = useState(true);

  // Preferences
  const [language, setLanguage] = useState('en');
  const [timezone, setTimezone] = useState('America/New_York');

  // Delete Account
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    // Load user data from user prop
    if (user) {
      setName(user.name || user.user_metadata?.name || '');
      setEmail(user.email || '');
    }
    
    // Fetch preferences and notifications
    fetchUserPreferences();
    fetchNotifications();
  }, [user]);

  const fetchUserPreferences = async () => {
    try {
      const accessToken = await getAccessToken();
      if (!accessToken) return;

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c658ea3d/settings/preferences`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setLanguage(data.language || 'en');
        setTimezone(data.timezone || 'America/New_York');
      }
    } catch (error) {
      console.error('Failed to fetch preferences:', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const accessToken = await getAccessToken();
      if (!accessToken) return;

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c658ea3d/settings/notifications`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setEmailNotifications(data.emailNotifications !== undefined ? data.emailNotifications : true);
        setMarketingEmails(data.marketingEmails !== undefined ? data.marketingEmails : false);
        setProductUpdates(data.productUpdates !== undefined ? data.productUpdates : true);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!name.trim()) {
      toast.error('Name is required');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      toast.error('Valid email is required');
      return;
    }

    setSaving(true);
    try {
      const accessToken = await getAccessToken();
      if (!accessToken) {
        toast.error('Please sign in');
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c658ea3d/settings/profile`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name, email })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update profile');
      }

      toast.success('Profile updated successfully');
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('All password fields are required');
      return;
    }

    if (newPassword.length < 8) {
      toast.error('New password must be at least 8 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    setChangingPassword(true);
    try {
      const accessToken = await getAccessToken();
      if (!accessToken) {
        toast.error('Please sign in');
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c658ea3d/settings/password`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ currentPassword, newPassword })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to change password');
      }

      toast.success('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      console.error('Failed to change password:', error);
      toast.error(error.message || 'Failed to change password');
    } finally {
      setChangingPassword(false);
    }
  };

  const handleSaveNotifications = async () => {
    try {
      const accessToken = await getAccessToken();
      if (!accessToken) return;

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c658ea3d/settings/notifications`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            emailNotifications,
            marketingEmails,
            productUpdates
          })
        }
      );

      if (response.ok) {
        toast.success('Notification preferences saved');
      }
    } catch (error) {
      console.error('Failed to save notifications:', error);
      toast.error('Failed to save preferences');
    }
  };

  const handleSavePreferences = async () => {
    try {
      const accessToken = await getAccessToken();
      if (!accessToken) return;

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c658ea3d/settings/preferences`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            language,
            timezone
          })
        }
      );

      if (response.ok) {
        toast.success('Preferences saved');
      }
    } catch (error) {
      console.error('Failed to save preferences:', error);
      toast.error('Failed to save preferences');
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'DELETE') {
      toast.error('Please type DELETE to confirm');
      return;
    }

    setDeleting(true);
    try {
      const accessToken = await getAccessToken();
      if (!accessToken) {
        toast.error('Please sign in');
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c658ea3d/settings/delete-account`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete account');
      }

      toast.success('Account deleted successfully');
      await signOut();
      if (onSignOut) onSignOut();
    } catch (error: any) {
      console.error('Failed to delete account:', error);
      toast.error(error.message || 'Failed to delete account');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl text-[#001524] mb-2 tracking-tight">Settings</h1>
        <p className="text-[#15616d]">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Profile Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white border-2 border-[#15616d] rounded-2xl p-8 shadow-xl"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-[#ff7d00] to-[#78290f] rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl text-[#001524]">Profile Information</h2>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm text-[#15616d] mb-2">
              Full Name
            </label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className="border-2 border-[#15616d] focus:border-[#ff7d00] focus:ring-2 focus:ring-[#ff7d00]"
            />
          </div>

          <div>
            <label className="block text-sm text-[#15616d] mb-2">
              Email Address
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="border-2 border-[#15616d] focus:border-[#ff7d00] focus:ring-2 focus:ring-[#ff7d00]"
            />
          </div>

          <button
            onClick={handleSaveProfile}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#ff7d00] to-[#78290f] text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </motion.div>

      {/* Password Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white border-2 border-[#15616d] rounded-2xl p-8 shadow-xl"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-[#15616d] to-[#001524] rounded-full flex items-center justify-center">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl text-[#001524]">Change Password</h2>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm text-[#15616d] mb-2">
              Current Password
            </label>
            <div className="relative">
              <Input
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="border-2 border-[#15616d] focus:border-[#ff7d00] focus:ring-2 focus:ring-[#ff7d00] pr-10"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#15616d] hover:text-[#ff7d00]"
              >
                {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm text-[#15616d] mb-2">
              New Password
            </label>
            <div className="relative">
              <Input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password (min. 8 characters)"
                className="border-2 border-[#15616d] focus:border-[#ff7d00] focus:ring-2 focus:ring-[#ff7d00] pr-10"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#15616d] hover:text-[#ff7d00]"
              >
                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm text-[#15616d] mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="border-2 border-[#15616d] focus:border-[#ff7d00] focus:ring-2 focus:ring-[#ff7d00] pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#15616d] hover:text-[#ff7d00]"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            onClick={handleChangePassword}
            disabled={changingPassword}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#ff7d00] to-[#78290f] text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <Lock className="w-4 h-4" />
            {changingPassword ? 'Changing...' : 'Change Password'}
          </button>
        </div>
      </motion.div>

      {/* Notification Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white border-2 border-[#15616d] rounded-2xl p-8 shadow-xl"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-[#ff7d00] to-[#78290f] rounded-full flex items-center justify-center">
            <Bell className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl text-[#001524]">Notifications</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-[#ffecd1] rounded-lg">
            <div>
              <p className="text-[#001524] font-medium">Email Notifications</p>
              <p className="text-sm text-[#15616d]">Receive notifications about your account activity</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) => {
                  setEmailNotifications(e.target.checked);
                  handleSaveNotifications();
                }}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#ff7d00]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ff7d00]"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-[#ffecd1] rounded-lg">
            <div>
              <p className="text-[#001524] font-medium">Marketing Emails</p>
              <p className="text-sm text-[#15616d]">Receive tips, guides, and promotional content</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={marketingEmails}
                onChange={(e) => {
                  setMarketingEmails(e.target.checked);
                  handleSaveNotifications();
                }}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#ff7d00]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ff7d00]"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-[#ffecd1] rounded-lg">
            <div>
              <p className="text-[#001524] font-medium">Product Updates</p>
              <p className="text-sm text-[#15616d]">Get notified about new features and improvements</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={productUpdates}
                onChange={(e) => {
                  setProductUpdates(e.target.checked);
                  handleSaveNotifications();
                }}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#ff7d00]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ff7d00]"></div>
            </label>
          </div>
        </div>
      </motion.div>

      {/* Preferences */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white border-2 border-[#15616d] rounded-2xl p-8 shadow-xl"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-[#15616d] to-[#001524] rounded-full flex items-center justify-center">
            <Globe className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl text-[#001524]">Preferences</h2>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm text-[#15616d] mb-2">
              Language
            </label>
            <select
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value);
                handleSavePreferences();
              }}
              className="w-full px-4 py-2 border-2 border-[#15616d] rounded-lg focus:border-[#ff7d00] focus:ring-2 focus:ring-[#ff7d00]"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-[#15616d] mb-2">
              Timezone
            </label>
            <select
              value={timezone}
              onChange={(e) => {
                setTimezone(e.target.value);
                handleSavePreferences();
              }}
              className="w-full px-4 py-2 border-2 border-[#15616d] rounded-lg focus:border-[#ff7d00] focus:ring-2 focus:ring-[#ff7d00]"
            >
              <option value="America/New_York">Eastern Time (ET)</option>
              <option value="America/Chicago">Central Time (CT)</option>
              <option value="America/Denver">Mountain Time (MT)</option>
              <option value="America/Los_Angeles">Pacific Time (PT)</option>
              <option value="Europe/London">London (GMT)</option>
              <option value="Europe/Paris">Paris (CET)</option>
              <option value="Asia/Tokyo">Tokyo (JST)</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-white border-2 border-red-600 rounded-2xl p-8 shadow-xl"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <h2 className="text-2xl text-[#001524]">Danger Zone</h2>
        </div>

        <div className="bg-red-50 rounded-lg p-6 border-2 border-red-200">
          <h3 className="text-lg text-[#001524] mb-2">Delete Account</h3>
          <p className="text-sm text-[#15616d] mb-4">
            Once you delete your account, there is no going back. This action is permanent and will delete all your data.
          </p>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete Account
          </button>
        </div>
      </motion.div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-2xl text-[#001524]">Delete Account?</h3>
            </div>
            
            <div className="bg-red-50 rounded-lg p-4 mb-6 border-2 border-red-200">
              <p className="text-sm text-[#001524] mb-2">
                <strong>This action cannot be undone. This will permanently:</strong>
              </p>
              <ul className="space-y-1 text-sm text-[#15616d]">
                <li>• Delete your account and profile</li>
                <li>• Remove all your generated content</li>
                <li>• Cancel your subscription</li>
                <li>• Delete all your history and data</li>
              </ul>
            </div>

            <div className="mb-6">
              <label className="block text-sm text-[#15616d] mb-2">
                Type <strong>DELETE</strong> to confirm
              </label>
              <Input
                type="text"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                placeholder="Type DELETE here"
                className="border-2 border-red-600 focus:border-red-700 focus:ring-2 focus:ring-red-600"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmation('');
                }}
                disabled={deleting}
                className="flex-1 px-6 py-3 border-2 border-[#15616d] text-[#15616d] rounded-lg hover:bg-[#15616d] hover:text-white transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleting || deleteConfirmation !== 'DELETE'}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete Account'
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}