import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Upload, 
  Image, 
  Users, 
  Lock, 
  Globe, 
  Plus, 
  X, 
  Crown,
  Shield,
  User,
  Save,
  Eye,
  EyeOff
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Avatar } from '../components/ui/Avatar';
import { useAuthStore } from '../store/auth';

interface GroupFormData {
  name: string;
  description: string;
  category: string;
  privacy: 'public' | 'private';
  rules: string[];
  profileImage: File | null;
  coverImage: File | null;
}

interface Member {
  id: string;
  email: string;
  role: 'admin' | 'moderator' | 'member';
}

const categories = [
  'Technology',
  'Design',
  'Business',
  'Education',
  'Health & Fitness',
  'Arts & Culture',
  'Gaming',
  'Sports',
  'Travel',
  'Food & Cooking',
  'Music',
  'Photography',
  'Other'
];

export function CreateGroupPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [showPreview, setShowPreview] = useState(false);
  
  const profileImageRef = useRef<HTMLInputElement>(null);
  const coverImageRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<GroupFormData>({
    name: '',
    description: '',
    category: '',
    privacy: 'public',
    rules: ['Be respectful and professional', 'Stay on topic', 'No spam or self-promotion'],
    profileImage: null,
    coverImage: null,
  });

  const [members, setMembers] = useState<Member[]>([]);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState<'moderator' | 'member'>('member');
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const steps = [
    { id: 1, name: 'Basic Info', description: 'Group details and category' },
    { id: 2, name: 'Appearance', description: 'Images and branding' },
    { id: 3, name: 'Settings', description: 'Privacy and rules' },
    { id: 4, name: 'Members', description: 'Invite team members' },
  ];

  const handleInputChange = (field: keyof GroupFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleImageUpload = (type: 'profile' | 'cover', file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, [`${type}Image`]: 'Image must be less than 5MB' }));
      return;
    }

    const preview = URL.createObjectURL(file);
    
    if (type === 'profile') {
      setFormData(prev => ({ ...prev, profileImage: file }));
      setProfileImagePreview(preview);
    } else {
      setFormData(prev => ({ ...prev, coverImage: file }));
      setCoverImagePreview(preview);
    }
    
    setErrors(prev => ({ ...prev, [`${type}Image`]: '' }));
  };

  const addRule = () => {
    setFormData(prev => ({
      ...prev,
      rules: [...prev.rules, '']
    }));
  };

  const updateRule = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      rules: prev.rules.map((rule, i) => i === index ? value : rule)
    }));
  };

  const removeRule = (index: number) => {
    setFormData(prev => ({
      ...prev,
      rules: prev.rules.filter((_, i) => i !== index)
    }));
  };

  const addMember = () => {
    if (!newMemberEmail.trim()) return;
    
    const newMember: Member = {
      id: Date.now().toString(),
      email: newMemberEmail,
      role: newMemberRole,
    };
    
    setMembers(prev => [...prev, newMember]);
    setNewMemberEmail('');
  };

  const removeMember = (id: string) => {
    setMembers(prev => prev.filter(member => member.id !== id));
  };

  const updateMemberRole = (id: string, role: 'admin' | 'moderator' | 'member') => {
    setMembers(prev => prev.map(member => 
      member.id === id ? { ...member, role } : member
    ));
  };

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = 'Group name is required';
      if (!formData.description.trim()) newErrors.description = 'Description is required';
      if (!formData.category) newErrors.category = 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setActiveStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(activeStep)) return;

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, you would upload images and create the group
      console.log('Creating group:', formData);
      console.log('Members:', members);
      
      navigate('/groups');
    } catch (error) {
      console.error('Failed to create group:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Crown className="w-4 h-4 text-yellow-400" />;
      case 'moderator': return <Shield className="w-4 h-4 text-blue-400" />;
      default: return <User className="w-4 h-4 text-dark-400" />;
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Basic Information</h3>
              <div className="space-y-4">
                <Input
                  label="Group Name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter group name"
                  error={errors.name}
                />
                
                <div>
                  <label className="block text-sm font-medium text-dark-200 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe your group's purpose and goals..."
                    rows={4}
                    className="w-full px-4 py-2.5 border border-dark-700 rounded-xl bg-dark-800 text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 resize-none"
                  />
                  {errors.description && (
                    <p className="text-sm text-error-400 mt-1">{errors.description}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-200 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-4 py-2.5 border border-dark-700 rounded-xl bg-dark-800 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="text-sm text-error-400 mt-1">{errors.category}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Group Appearance</h3>
              
              {/* Cover Image */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-dark-200 mb-2">
                    Cover Image
                  </label>
                  <div className="relative">
                    <div className="h-32 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl overflow-hidden border border-dark-700">
                      {coverImagePreview ? (
                        <img
                          src={coverImagePreview}
                          alt="Cover preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-center">
                            <Image className="w-8 h-8 text-white/60 mx-auto mb-2" />
                            <p className="text-white/60 text-sm">Cover Image</p>
                          </div>
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => coverImageRef.current?.click()}
                      className="absolute bottom-2 right-2 p-2 bg-dark-900/80 text-white rounded-lg hover:bg-dark-800 transition-colors"
                    >
                      <Upload className="w-4 h-4" />
                    </button>
                    <input
                      ref={coverImageRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handleImageUpload('cover', e.target.files[0])}
                      className="hidden"
                    />
                  </div>
                  {errors.coverImage && (
                    <p className="text-sm text-error-400 mt-1">{errors.coverImage}</p>
                  )}
                </div>

                {/* Profile Image */}
                <div>
                  <label className="block text-sm font-medium text-dark-200 mb-2">
                    Profile Picture
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Avatar
                        src={profileImagePreview || undefined}
                        alt="Group profile"
                        size="xl"
                        fallback={formData.name.charAt(0) || 'G'}
                      />
                      <button
                        type="button"
                        onClick={() => profileImageRef.current?.click()}
                        className="absolute bottom-0 right-0 p-1.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                      >
                        <Upload className="w-3 h-3" />
                      </button>
                    </div>
                    <div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => profileImageRef.current?.click()}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Image
                      </Button>
                      <p className="text-sm text-dark-400 mt-1">
                        JPG, PNG or GIF. Max size 5MB.
                      </p>
                    </div>
                    <input
                      ref={profileImageRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handleImageUpload('profile', e.target.files[0])}
                      className="hidden"
                    />
                  </div>
                  {errors.profileImage && (
                    <p className="text-sm text-error-400 mt-1">{errors.profileImage}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Privacy & Rules</h3>
              
              {/* Privacy Settings */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-dark-200 mb-3">
                    Privacy Setting
                  </label>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <input
                        type="radio"
                        id="public"
                        name="privacy"
                        value="public"
                        checked={formData.privacy === 'public'}
                        onChange={(e) => handleInputChange('privacy', e.target.value)}
                        className="mt-1 w-4 h-4 text-primary-600 bg-dark-800 border-dark-600 focus:ring-primary-500"
                      />
                      <div>
                        <label htmlFor="public" className="flex items-center font-medium text-white">
                          <Globe className="w-4 h-4 mr-2" />
                          Public
                        </label>
                        <p className="text-sm text-dark-400">Anyone can find and join this group</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <input
                        type="radio"
                        id="private"
                        name="privacy"
                        value="private"
                        checked={formData.privacy === 'private'}
                        onChange={(e) => handleInputChange('privacy', e.target.value)}
                        className="mt-1 w-4 h-4 text-primary-600 bg-dark-800 border-dark-600 focus:ring-primary-500"
                      />
                      <div>
                        <label htmlFor="private" className="flex items-center font-medium text-white">
                          <Lock className="w-4 h-4 mr-2" />
                          Private
                        </label>
                        <p className="text-sm text-dark-400">Only invited members can join</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Group Rules */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-dark-200">
                      Group Rules
                    </label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addRule}
                      className="text-xs"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Add Rule
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {formData.rules.map((rule, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <span className="text-dark-400 text-sm">{index + 1}.</span>
                        <input
                          type="text"
                          value={rule}
                          onChange={(e) => updateRule(index, e.target.value)}
                          placeholder="Enter group rule"
                          className="flex-1 px-3 py-2 border border-dark-700 rounded-lg bg-dark-800 text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                        />
                        {formData.rules.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeRule(index)}
                            className="p-1 text-dark-400 hover:text-error-400 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Invite Members</h3>
              
              {/* Add Member Form */}
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <input
                    type="email"
                    value={newMemberEmail}
                    onChange={(e) => setNewMemberEmail(e.target.value)}
                    placeholder="Enter email address"
                    className="flex-1 px-4 py-2.5 border border-dark-700 rounded-xl bg-dark-800 text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <select
                    value={newMemberRole}
                    onChange={(e) => setNewMemberRole(e.target.value as 'moderator' | 'member')}
                    className="px-3 py-2.5 border border-dark-700 rounded-xl bg-dark-800 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="member">Member</option>
                    <option value="moderator">Moderator</option>
                  </select>
                  <Button onClick={addMember} disabled={!newMemberEmail.trim()}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {/* Members List */}
                {members.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-dark-200">Invited Members</h4>
                    {members.map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-3 bg-dark-800 rounded-lg">
                        <div className="flex items-center space-x-3">
                          {getRoleIcon(member.role)}
                          <div>
                            <p className="text-sm font-medium text-white">{member.email}</p>
                            <p className="text-xs text-dark-400 capitalize">{member.role}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <select
                            value={member.role}
                            onChange={(e) => updateMemberRole(member.id, e.target.value as any)}
                            className="text-xs px-2 py-1 border border-dark-600 rounded bg-dark-700 text-white"
                          >
                            <option value="member">Member</option>
                            <option value="moderator">Moderator</option>
                            <option value="admin">Admin</option>
                          </select>
                          <button
                            onClick={() => removeMember(member.id)}
                            className="p-1 text-dark-400 hover:text-error-400 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="text-sm text-dark-400">
                  <p>• Members will receive an email invitation to join the group</p>
                  <p>• You can always invite more members after creating the group</p>
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/groups')}
            className="flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-white">Create Group</h1>
            <p className="text-dark-400">Build your community</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center"
          >
            {showPreview ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
            {showPreview ? 'Hide Preview' : 'Preview'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Steps Sidebar */}
        <div className="lg:col-span-1">
          <Card className="p-4">
            <div className="space-y-4">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className={`flex items-start space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    activeStep === step.id
                      ? 'bg-primary-500/10 border border-primary-500/20'
                      : activeStep > step.id
                      ? 'bg-dark-800/50'
                      : 'hover:bg-dark-800/30'
                  }`}
                  onClick={() => activeStep > step.id && setActiveStep(step.id)}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                    activeStep === step.id
                      ? 'bg-primary-500 text-white'
                      : activeStep > step.id
                      ? 'bg-primary-500/20 text-primary-400'
                      : 'bg-dark-700 text-dark-400'
                  }`}>
                    {step.id}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${
                      activeStep >= step.id ? 'text-white' : 'text-dark-400'
                    }`}>
                      {step.name}
                    </p>
                    <p className="text-xs text-dark-500">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Card className="p-6">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderStepContent()}
            </motion.div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-dark-800">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={activeStep === 1}
              >
                Previous
              </Button>
              
              <div className="flex items-center space-x-2">
                {steps.map((step) => (
                  <div
                    key={step.id}
                    className={`w-2 h-2 rounded-full ${
                      activeStep >= step.id ? 'bg-primary-500' : 'bg-dark-700'
                    }`}
                  />
                ))}
              </div>

              {activeStep < 4 ? (
                <Button onClick={nextStep}>
                  Next
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  isLoading={isLoading}
                  className="flex items-center"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Create Group
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-dark-950/80 backdrop-blur-sm" onClick={() => setShowPreview(false)} />
            <div className="relative w-full max-w-2xl bg-dark-900 border border-dark-800 rounded-xl shadow-2xl">
              <div className="flex items-center justify-between p-6 border-b border-dark-800">
                <h3 className="text-lg font-semibold text-white">Group Preview</h3>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-dark-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6">
                {/* Preview Content */}
                <div className="space-y-4">
                  {/* Cover Image */}
                  <div className="h-32 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl overflow-hidden">
                    {coverImagePreview && (
                      <img src={coverImagePreview} alt="Cover" className="w-full h-full object-cover" />
                    )}
                  </div>
                  
                  {/* Group Info */}
                  <div className="flex items-start space-x-4 -mt-8">
                    <Avatar
                      src={profileImagePreview || undefined}
                      alt={formData.name}
                      size="lg"
                      fallback={formData.name.charAt(0) || 'G'}
                      className="border-4 border-dark-900"
                    />
                    <div className="flex-1 pt-8">
                      <div className="flex items-center space-x-2">
                        <h2 className="text-xl font-bold text-white">
                          {formData.name || 'Group Name'}
                        </h2>
                        {formData.privacy === 'private' && (
                          <Lock className="w-4 h-4 text-dark-400" />
                        )}
                      </div>
                      <p className="text-dark-400 mt-1">
                        {formData.description || 'Group description will appear here...'}
                      </p>
                      {formData.category && (
                        <span className="inline-block mt-2 px-3 py-1 text-xs bg-primary-500/10 text-primary-400 rounded-full">
                          {formData.category}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}