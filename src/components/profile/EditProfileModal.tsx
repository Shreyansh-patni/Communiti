import React, { useState, useRef } from 'react';
import { X, Camera, Upload, Save, User as UserIcon, MapPin, Link as LinkIcon, FileText, Globe, Mail, Phone, Twitter, Github, Linkedin, Instagram } from 'lucide-react';
import { motion } from 'framer-motion';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Avatar } from '../ui/Avatar';
import { useAuthStore } from '../../store/auth';
import type { User } from '../../types';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}

interface SocialLinks {
  twitter: string;
  github: string;
  linkedin: string;
  instagram: string;
  website: string;
}

export function EditProfileModal({ isOpen, onClose, user }: EditProfileModalProps) {
  const { updateUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  
  const profileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    displayName: user.displayName || '',
    bio: user.bio || '',
    location: user.location || '',
    website: user.website || '',
    email: user.email || '',
    phone: '',
  });

  const [socialLinks, setSocialLinks] = useState<SocialLinks>({
    twitter: '',
    github: '',
    linkedin: '',
    instagram: '',
    website: user.website || '',
  });

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public',
    showEmail: false,
    showPhone: false,
    showLocation: true,
    allowMessages: true,
    showActivity: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const tabs = [
    { id: 'basic', name: 'Basic Info', icon: UserIcon },
    { id: 'social', name: 'Social Links', icon: LinkIcon },
    { id: 'privacy', name: 'Privacy', icon: Globe },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSocialLinkChange = (platform: keyof SocialLinks, value: string) => {
    setSocialLinks(prev => ({ ...prev, [platform]: value }));
  };

  const handlePrivacyChange = (setting: string, value: boolean | string) => {
    setPrivacySettings(prev => ({ ...prev, [setting]: value }));
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, profileImage: 'Image must be less than 5MB' }));
        return;
      }
      setProfileImage(file);
      setProfileImagePreview(URL.createObjectURL(file));
      setErrors(prev => ({ ...prev, profileImage: '' }));
    }
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, coverImage: 'Image must be less than 10MB' }));
        return;
      }
      setCoverImage(file);
      setCoverImagePreview(URL.createObjectURL(file));
      setErrors(prev => ({ ...prev, coverImage: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.displayName.trim()) {
      newErrors.displayName = 'Display name is required';
    } else if (formData.displayName.length > 50) {
      newErrors.displayName = 'Display name must be less than 50 characters';
    }

    if (formData.bio.length > 160) {
      newErrors.bio = 'Bio must be less than 160 characters';
    }

    if (formData.website && !isValidUrl(formData.website)) {
      newErrors.website = 'Please enter a valid URL';
    }

    if (formData.email && !isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url.startsWith('http') ? url : `https://${url}`);
      return true;
    } catch {
      return false;
    }
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const uploadImage = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(URL.createObjectURL(file));
      }, 1000);
    });
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      let avatarUrl = user.avatar;
      let coverUrl = user.coverPhoto;

      if (profileImage) {
        avatarUrl = await uploadImage(profileImage);
      }
      if (coverImage) {
        coverUrl = await uploadImage(coverImage);
      }

      const updatedUser = {
        ...formData,
        avatar: avatarUrl,
        coverPhoto: coverUrl,
        website: formData.website ? (formData.website.startsWith('http') ? formData.website : `https://${formData.website}`) : undefined,
      };

      updateUser(updatedUser);
      onClose();
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      displayName: user.displayName || '',
      bio: user.bio || '',
      location: user.location || '',
      website: user.website || '',
      email: user.email || '',
      phone: '',
    });
    setProfileImage(null);
    setCoverImage(null);
    setProfileImagePreview(null);
    setCoverImagePreview(null);
    setErrors({});
    setActiveTab('basic');
    onClose();
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'basic':
        return (
          <div className="space-y-6">
            {/* Cover Photo Section */}
            <div>
              <h3 className="text-lg font-medium text-white mb-4">Cover Photo</h3>
              <div className="relative">
                <div className="h-32 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl overflow-hidden">
                  {coverImagePreview || user.coverPhoto ? (
                    <img
                      src={coverImagePreview || user.coverPhoto}
                      alt="Cover"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-r from-primary-500 to-accent-500" />
                  )}
                </div>
                <button
                  onClick={() => coverInputRef.current?.click()}
                  className="absolute bottom-2 right-2 p-2 bg-dark-900/80 text-white rounded-lg hover:bg-dark-800 transition-colors"
                >
                  <Camera className="w-4 h-4" />
                </button>
                <input
                  ref={coverInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleCoverImageChange}
                  className="hidden"
                />
              </div>
              {errors.coverImage && (
                <p className="text-sm text-error-400 mt-1">{errors.coverImage}</p>
              )}
            </div>

            {/* Profile Picture Section */}
            <div>
              <h3 className="text-lg font-medium text-white mb-4">Profile Picture</h3>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Avatar
                    src={profileImagePreview || user.avatar}
                    alt={user.displayName}
                    size="xl"
                    fallback={user.displayName.charAt(0)}
                  />
                  <button
                    onClick={() => profileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 p-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => profileInputRef.current?.click()}
                    className="flex items-center"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Photo
                  </Button>
                  <p className="text-sm text-dark-400">
                    JPG, PNG or GIF. Max size 5MB.
                  </p>
                </div>
                <input
                  ref={profileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleProfileImageChange}
                  className="hidden"
                />
              </div>
              {errors.profileImage && (
                <p className="text-sm text-error-400 mt-1">{errors.profileImage}</p>
              )}
            </div>

            {/* Profile Information */}
            <div>
              <h3 className="text-lg font-medium text-white mb-4">Profile Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Display Name *"
                  value={formData.displayName}
                  onChange={(e) => handleInputChange('displayName', e.target.value)}
                  placeholder="Your display name"
                  error={errors.displayName}
                  maxLength={50}
                />

                <Input
                  label="Location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="City, Country"
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-dark-200 mb-2">
                  <FileText className="w-4 h-4 inline mr-2" />
                  Bio
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  className="w-full px-4 py-2.5 border border-dark-700 rounded-xl bg-dark-800 text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  placeholder="Tell us about yourself..."
                  rows={3}
                  maxLength={160}
                />
                {errors.bio && (
                  <p className="text-sm text-error-400 mt-1">{errors.bio}</p>
                )}
                <p className="text-xs text-dark-400 mt-1">
                  {formData.bio.length}/160 characters
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <Input
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="your@email.com"
                  error={errors.email}
                />

                <Input
                  label="Phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
          </div>
        );

      case 'social':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-white mb-4">Social Links</h3>
              <p className="text-dark-400 mb-6">Connect your social media accounts to your profile</p>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <Twitter className="w-5 h-5 text-blue-400" />
                  </div>
                  <Input
                    label="Twitter"
                    value={socialLinks.twitter}
                    onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
                    placeholder="https://twitter.com/username"
                    className="flex-1"
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-500/10 rounded-lg flex items-center justify-center">
                    <Github className="w-5 h-5 text-gray-400" />
                  </div>
                  <Input
                    label="GitHub"
                    value={socialLinks.github}
                    onChange={(e) => handleSocialLinkChange('github', e.target.value)}
                    placeholder="https://github.com/username"
                    className="flex-1"
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-600/10 rounded-lg flex items-center justify-center">
                    <Linkedin className="w-5 h-5 text-blue-500" />
                  </div>
                  <Input
                    label="LinkedIn"
                    value={socialLinks.linkedin}
                    onChange={(e) => handleSocialLinkChange('linkedin', e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                    className="flex-1"
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-pink-500/10 rounded-lg flex items-center justify-center">
                    <Instagram className="w-5 h-5 text-pink-400" />
                  </div>
                  <Input
                    label="Instagram"
                    value={socialLinks.instagram}
                    onChange={(e) => handleSocialLinkChange('instagram', e.target.value)}
                    placeholder="https://instagram.com/username"
                    className="flex-1"
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-500/10 rounded-lg flex items-center justify-center">
                    <Globe className="w-5 h-5 text-primary-400" />
                  </div>
                  <Input
                    label="Website"
                    value={socialLinks.website}
                    onChange={(e) => handleSocialLinkChange('website', e.target.value)}
                    placeholder="https://yourwebsite.com"
                    error={errors.website}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-white mb-4">Privacy Settings</h3>
              <p className="text-dark-400 mb-6">Control who can see your information and interact with you</p>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-white mb-3">Profile Visibility</h4>
                  <div className="space-y-3">
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
                          checked={privacySettings.profileVisibility === option.id}
                          onChange={() => handlePrivacyChange('profileVisibility', option.id)}
                          className="mt-1 w-4 h-4 text-primary-600 bg-dark-800 border-dark-600 focus:ring-primary-500"
                        />
                        <div>
                          <label htmlFor={option.id} className="font-medium text-white">
                            {option.label}
                          </label>
                          <p className="text-sm text-dark-400">{option.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-white mb-3">Information Visibility</h4>
                  <div className="space-y-3">
                    {[
                      { id: 'showEmail', label: 'Show email address', description: 'Others can see your email' },
                      { id: 'showPhone', label: 'Show phone number', description: 'Others can see your phone' },
                      { id: 'showLocation', label: 'Show location', description: 'Others can see your location' },
                      { id: 'showActivity', label: 'Show activity status', description: 'Others can see when you\'re active' },
                    ].map((setting) => (
                      <div key={setting.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-white">{setting.label}</p>
                          <p className="text-sm text-dark-400">{setting.description}</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={privacySettings[setting.id as keyof typeof privacySettings] as boolean}
                          onChange={(e) => handlePrivacyChange(setting.id, e.target.checked)}
                          className="w-4 h-4 text-primary-600 bg-dark-800 border-dark-600 rounded focus:ring-primary-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-white mb-3">Communication</h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-white">Allow direct messages</p>
                      <p className="text-sm text-dark-400">Others can send you private messages</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={privacySettings.allowMessages}
                      onChange={(e) => handlePrivacyChange('allowMessages', e.target.checked)}
                      className="w-4 h-4 text-primary-600 bg-dark-800 border-dark-600 rounded focus:ring-primary-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Edit Profile" size="xl">
      <div className="space-y-6">
        {/* Tabs */}
        <div className="flex space-x-1 bg-dark-800 rounded-xl p-1">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center space-x-2 flex-1"
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.name}</span>
            </Button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderTabContent()}
        </motion.div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-dark-800">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading}
            isLoading={isLoading}
            className="flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>
    </Modal>
  );
}