import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Upload, 
  Image, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Lock, 
  Globe, 
  Plus, 
  X, 
  Save,
  Eye,
  EyeOff,
  Video,
  Repeat,
  Bell
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuthStore } from '../store/auth';

interface EventFormData {
  title: string;
  description: string;
  category: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  timezone: string;
  locationType: 'physical' | 'virtual' | 'hybrid';
  location: string;
  virtualLink: string;
  privacy: 'public' | 'private' | 'invite-only';
  capacity: string;
  isCapacityLimited: boolean;
  bannerImage: File | null;
  isRecurring: boolean;
  recurringPattern: 'daily' | 'weekly' | 'monthly';
  recurringEnd: string;
  reminderSettings: {
    email: boolean;
    push: boolean;
    reminderTimes: string[];
  };
}

const categories = [
  'Conference',
  'Workshop',
  'Meetup',
  'Webinar',
  'Networking',
  'Training',
  'Social',
  'Sports',
  'Arts & Culture',
  'Business',
  'Technology',
  'Education',
  'Other'
];

const timezones = [
  'UTC',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Australia/Sydney'
];

const reminderOptions = [
  { value: '15m', label: '15 minutes before' },
  { value: '1h', label: '1 hour before' },
  { value: '1d', label: '1 day before' },
  { value: '1w', label: '1 week before' }
];

export function CreateEventPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [showPreview, setShowPreview] = useState(false);
  
  const bannerImageRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    category: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    timezone: 'UTC',
    locationType: 'physical',
    location: '',
    virtualLink: '',
    privacy: 'public',
    capacity: '',
    isCapacityLimited: false,
    bannerImage: null,
    isRecurring: false,
    recurringPattern: 'weekly',
    recurringEnd: '',
    reminderSettings: {
      email: true,
      push: true,
      reminderTimes: ['1d', '1h']
    }
  });

  const [bannerImagePreview, setBannerImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const steps = [
    { id: 1, name: 'Basic Info', description: 'Event details and timing' },
    { id: 2, name: 'Location', description: 'Where it happens' },
    { id: 3, name: 'Settings', description: 'Privacy and capacity' },
    { id: 4, name: 'Advanced', description: 'Recurring and reminders' },
  ];

  const handleInputChange = (field: keyof EventFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleImageUpload = (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, bannerImage: 'Image must be less than 10MB' }));
      return;
    }

    const preview = URL.createObjectURL(file);
    setFormData(prev => ({ ...prev, bannerImage: file }));
    setBannerImagePreview(preview);
    setErrors(prev => ({ ...prev, bannerImage: '' }));
  };

  const handleReminderToggle = (time: string) => {
    setFormData(prev => ({
      ...prev,
      reminderSettings: {
        ...prev.reminderSettings,
        reminderTimes: prev.reminderSettings.reminderTimes.includes(time)
          ? prev.reminderSettings.reminderTimes.filter(t => t !== time)
          : [...prev.reminderSettings.reminderTimes, time]
      }
    }));
  };

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.title.trim()) newErrors.title = 'Event title is required';
      if (!formData.description.trim()) newErrors.description = 'Description is required';
      if (!formData.category) newErrors.category = 'Category is required';
      if (!formData.startDate) newErrors.startDate = 'Start date is required';
      if (!formData.startTime) newErrors.startTime = 'Start time is required';
      if (!formData.endDate) newErrors.endDate = 'End date is required';
      if (!formData.endTime) newErrors.endTime = 'End time is required';
    }

    if (step === 2) {
      if (formData.locationType === 'physical' && !formData.location.trim()) {
        newErrors.location = 'Location is required for physical events';
      }
      if ((formData.locationType === 'virtual' || formData.locationType === 'hybrid') && !formData.virtualLink.trim()) {
        newErrors.virtualLink = 'Virtual link is required';
      }
    }

    if (step === 3) {
      if (formData.isCapacityLimited && (!formData.capacity || parseInt(formData.capacity) <= 0)) {
        newErrors.capacity = 'Valid capacity is required when limited';
      }
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
      
      // In a real app, you would upload images and create the event
      console.log('Creating event:', formData);
      
      navigate('/events');
    } catch (error) {
      console.error('Failed to create event:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Event Information</h3>
              <div className="space-y-4">
                <Input
                  label="Event Title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter event title"
                  error={errors.title}
                />
                
                <div>
                  <label className="block text-sm font-medium text-dark-200 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe your event..."
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

                {/* Date and Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-dark-200 mb-2">
                      <Calendar className="w-4 h-4 inline mr-2" />
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => handleInputChange('startDate', e.target.value)}
                      className="w-full px-4 py-2.5 border border-dark-700 rounded-xl bg-dark-800 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                    />
                    {errors.startDate && (
                      <p className="text-sm text-error-400 mt-1">{errors.startDate}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-dark-200 mb-2">
                      <Clock className="w-4 h-4 inline mr-2" />
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => handleInputChange('startTime', e.target.value)}
                      className="w-full px-4 py-2.5 border border-dark-700 rounded-xl bg-dark-800 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                    />
                    {errors.startTime && (
                      <p className="text-sm text-error-400 mt-1">{errors.startTime}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-dark-200 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => handleInputChange('endDate', e.target.value)}
                      className="w-full px-4 py-2.5 border border-dark-700 rounded-xl bg-dark-800 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                    />
                    {errors.endDate && (
                      <p className="text-sm text-error-400 mt-1">{errors.endDate}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-dark-200 mb-2">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => handleInputChange('endTime', e.target.value)}
                      className="w-full px-4 py-2.5 border border-dark-700 rounded-xl bg-dark-800 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                    />
                    {errors.endTime && (
                      <p className="text-sm text-error-400 mt-1">{errors.endTime}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-200 mb-2">
                    Timezone
                  </label>
                  <select
                    value={formData.timezone}
                    onChange={(e) => handleInputChange('timezone', e.target.value)}
                    className="w-full px-4 py-2.5 border border-dark-700 rounded-xl bg-dark-800 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                  >
                    {timezones.map(tz => (
                      <option key={tz} value={tz}>{tz}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Event Location</h3>
              
              {/* Location Type */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-dark-200 mb-3">
                    Location Type
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="flex items-start space-x-3">
                      <input
                        type="radio"
                        id="physical"
                        name="locationType"
                        value="physical"
                        checked={formData.locationType === 'physical'}
                        onChange={(e) => handleInputChange('locationType', e.target.value)}
                        className="mt-1 w-4 h-4 text-primary-600 bg-dark-800 border-dark-600 focus:ring-primary-500"
                      />
                      <div>
                        <label htmlFor="physical" className="flex items-center font-medium text-white">
                          <MapPin className="w-4 h-4 mr-2" />
                          Physical
                        </label>
                        <p className="text-sm text-dark-400">In-person event</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <input
                        type="radio"
                        id="virtual"
                        name="locationType"
                        value="virtual"
                        checked={formData.locationType === 'virtual'}
                        onChange={(e) => handleInputChange('locationType', e.target.value)}
                        className="mt-1 w-4 h-4 text-primary-600 bg-dark-800 border-dark-600 focus:ring-primary-500"
                      />
                      <div>
                        <label htmlFor="virtual" className="flex items-center font-medium text-white">
                          <Video className="w-4 h-4 mr-2" />
                          Virtual
                        </label>
                        <p className="text-sm text-dark-400">Online event</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <input
                        type="radio"
                        id="hybrid"
                        name="locationType"
                        value="hybrid"
                        checked={formData.locationType === 'hybrid'}
                        onChange={(e) => handleInputChange('locationType', e.target.value)}
                        className="mt-1 w-4 h-4 text-primary-600 bg-dark-800 border-dark-600 focus:ring-primary-500"
                      />
                      <div>
                        <label htmlFor="hybrid" className="flex items-center font-medium text-white">
                          <Globe className="w-4 h-4 mr-2" />
                          Hybrid
                        </label>
                        <p className="text-sm text-dark-400">Both options</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Physical Location */}
                {(formData.locationType === 'physical' || formData.locationType === 'hybrid') && (
                  <Input
                    label="Physical Location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="Enter venue address"
                    error={errors.location}
                  />
                )}

                {/* Virtual Link */}
                {(formData.locationType === 'virtual' || formData.locationType === 'hybrid') && (
                  <Input
                    label="Virtual Meeting Link"
                    value={formData.virtualLink}
                    onChange={(e) => handleInputChange('virtualLink', e.target.value)}
                    placeholder="https://zoom.us/j/..."
                    error={errors.virtualLink}
                  />
                )}

                {/* Banner Image */}
                <div>
                  <label className="block text-sm font-medium text-dark-200 mb-2">
                    Event Banner (Optional)
                  </label>
                  <div className="relative">
                    <div className="h-40 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl overflow-hidden border border-dark-700">
                      {bannerImagePreview ? (
                        <img
                          src={bannerImagePreview}
                          alt="Banner preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-center">
                            <Image className="w-8 h-8 text-white/60 mx-auto mb-2" />
                            <p className="text-white/60 text-sm">Event Banner</p>
                          </div>
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => bannerImageRef.current?.click()}
                      className="absolute bottom-2 right-2 p-2 bg-dark-900/80 text-white rounded-lg hover:bg-dark-800 transition-colors"
                    >
                      <Upload className="w-4 h-4" />
                    </button>
                    <input
                      ref={bannerImageRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                      className="hidden"
                    />
                  </div>
                  {errors.bannerImage && (
                    <p className="text-sm text-error-400 mt-1">{errors.bannerImage}</p>
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
              <h3 className="text-lg font-semibold text-white mb-4">Event Settings</h3>
              
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
                        <p className="text-sm text-dark-400">Anyone can find and join this event</p>
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
                        <p className="text-sm text-dark-400">Only you can see this event</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <input
                        type="radio"
                        id="invite-only"
                        name="privacy"
                        value="invite-only"
                        checked={formData.privacy === 'invite-only'}
                        onChange={(e) => handleInputChange('privacy', e.target.value)}
                        className="mt-1 w-4 h-4 text-primary-600 bg-dark-800 border-dark-600 focus:ring-primary-500"
                      />
                      <div>
                        <label htmlFor="invite-only" className="flex items-center font-medium text-white">
                          <Users className="w-4 h-4 mr-2" />
                          Invite Only
                        </label>
                        <p className="text-sm text-dark-400">Only invited people can join</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Capacity Settings */}
                <div>
                  <div className="flex items-center space-x-3 mb-3">
                    <input
                      type="checkbox"
                      id="limitCapacity"
                      checked={formData.isCapacityLimited}
                      onChange={(e) => handleInputChange('isCapacityLimited', e.target.checked)}
                      className="w-4 h-4 text-primary-600 bg-dark-800 border-dark-600 rounded focus:ring-primary-500"
                    />
                    <label htmlFor="limitCapacity" className="text-sm font-medium text-dark-200">
                      Limit event capacity
                    </label>
                  </div>
                  
                  {formData.isCapacityLimited && (
                    <Input
                      label="Maximum Attendees"
                      type="number"
                      value={formData.capacity}
                      onChange={(e) => handleInputChange('capacity', e.target.value)}
                      placeholder="Enter maximum number of attendees"
                      error={errors.capacity}
                      min="1"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Advanced Settings</h3>
              
              {/* Recurring Event */}
              <div className="space-y-4">
                <div>
                  <div className="flex items-center space-x-3 mb-3">
                    <input
                      type="checkbox"
                      id="isRecurring"
                      checked={formData.isRecurring}
                      onChange={(e) => handleInputChange('isRecurring', e.target.checked)}
                      className="w-4 h-4 text-primary-600 bg-dark-800 border-dark-600 rounded focus:ring-primary-500"
                    />
                    <label htmlFor="isRecurring" className="flex items-center text-sm font-medium text-dark-200">
                      <Repeat className="w-4 h-4 mr-2" />
                      Recurring Event
                    </label>
                  </div>
                  
                  {formData.isRecurring && (
                    <div className="space-y-3 ml-7">
                      <div>
                        <label className="block text-sm font-medium text-dark-200 mb-2">
                          Repeat Pattern
                        </label>
                        <select
                          value={formData.recurringPattern}
                          onChange={(e) => handleInputChange('recurringPattern', e.target.value)}
                          className="w-full px-4 py-2.5 border border-dark-700 rounded-xl bg-dark-800 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                        >
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                        </select>
                      </div>
                      
                      <Input
                        label="End Date"
                        type="date"
                        value={formData.recurringEnd}
                        onChange={(e) => handleInputChange('recurringEnd', e.target.value)}
                      />
                    </div>
                  )}
                </div>

                {/* Reminder Settings */}
                <div>
                  <h4 className="flex items-center text-sm font-medium text-dark-200 mb-3">
                    <Bell className="w-4 h-4 mr-2" />
                    Reminder Settings
                  </h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="emailReminders"
                        checked={formData.reminderSettings.email}
                        onChange={(e) => handleInputChange('reminderSettings', {
                          ...formData.reminderSettings,
                          email: e.target.checked
                        })}
                        className="w-4 h-4 text-primary-600 bg-dark-800 border-dark-600 rounded focus:ring-primary-500"
                      />
                      <label htmlFor="emailReminders" className="text-sm text-dark-200">
                        Email reminders
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="pushReminders"
                        checked={formData.reminderSettings.push}
                        onChange={(e) => handleInputChange('reminderSettings', {
                          ...formData.reminderSettings,
                          push: e.target.checked
                        })}
                        className="w-4 h-4 text-primary-600 bg-dark-800 border-dark-600 rounded focus:ring-primary-500"
                      />
                      <label htmlFor="pushReminders" className="text-sm text-dark-200">
                        Push notifications
                      </label>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-dark-200 mb-2">
                        Reminder Times
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {reminderOptions.map((option) => (
                          <div key={option.value} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={`reminder-${option.value}`}
                              checked={formData.reminderSettings.reminderTimes.includes(option.value)}
                              onChange={() => handleReminderToggle(option.value)}
                              className="w-4 h-4 text-primary-600 bg-dark-800 border-dark-600 rounded focus:ring-primary-500"
                            />
                            <label htmlFor={`reminder-${option.value}`} className="text-sm text-dark-300">
                              {option.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/events')}
            className="flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-white">Create Event</h1>
            <p className="text-dark-400">Organize your community</p>
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
                  Create Event
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
                <h3 className="text-lg font-semibold text-white">Event Preview</h3>
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
                  {/* Banner Image */}
                  <div className="h-40 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl overflow-hidden">
                    {bannerImagePreview && (
                      <img src={bannerImagePreview} alt="Banner" className="w-full h-full object-cover" />
                    )}
                  </div>
                  
                  {/* Event Info */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold text-white">
                        {formData.title || 'Event Title'}
                      </h2>
                      {formData.privacy !== 'public' && (
                        <Lock className="w-4 h-4 text-dark-400" />
                      )}
                    </div>
                    
                    <p className="text-dark-400">
                      {formData.description || 'Event description will appear here...'}
                    </p>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-dark-400">
                      {formData.startDate && (
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formData.startDate}</span>
                        </div>
                      )}
                      {formData.startTime && (
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{formData.startTime}</span>
                        </div>
                      )}
                      {formData.location && (
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{formData.location}</span>
                        </div>
                      )}
                    </div>
                    
                    {formData.category && (
                      <span className="inline-block px-3 py-1 text-xs bg-primary-500/10 text-primary-400 rounded-full">
                        {formData.category}
                      </span>
                    )}
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