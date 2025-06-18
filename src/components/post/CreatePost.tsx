import React, { useState, useRef } from 'react';
import { Image, Smile, MapPin, Calendar, X, Upload } from 'lucide-react';
import { Card } from '../ui/Card';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { useAuthStore } from '../../store/auth';
import { usePostsStore } from '../../store/posts';

interface CreatePostProps {
  placeholder?: string;
}

export function CreatePost({ placeholder = "What's on your mind?" }: CreatePostProps) {
  const { user } = useAuthStore();
  const { addPost } = usePostsStore();
  const [content, setContent] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isPosting, setIsPosting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    if (!content.trim() && attachments.length === 0) return;
    
    setIsPosting(true);
    try {
      await addPost(content, attachments);
      setContent('');
      setAttachments([]);
      setIsExpanded(false);
    } catch (error) {
      console.error('Failed to create post:', error);
    } finally {
      setIsPosting(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleCancel = () => {
    setContent('');
    setAttachments([]);
    setIsExpanded(false);
  };

  if (!user) return null;

  return (
    <Card className="space-y-4">
      <div className="flex space-x-3">
        <Avatar
          src={user.avatar}
          alt={user.displayName}
          size="md"
          fallback={user.displayName.charAt(0)}
        />
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            placeholder={placeholder}
            className="w-full p-3 border border-secondary-200 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-800 text-secondary-900 dark:text-secondary-100 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            rows={isExpanded ? 4 : 2}
          />
        </div>
      </div>

      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 ml-12">
          {attachments.map((file, index) => (
            <div key={index} className="relative group">
              {file.type.startsWith('image/') ? (
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="w-full h-24 object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-24 bg-secondary-100 dark:bg-secondary-800 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Upload className="w-6 h-6 mx-auto mb-1 text-secondary-400" />
                    <p className="text-xs text-secondary-500 truncate px-2">
                      {file.name}
                    </p>
                  </div>
                </div>
              )}
              <button
                onClick={() => removeAttachment(index)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-error-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {isExpanded && (
        <div className="flex items-center justify-between ml-12">
          <div className="flex items-center space-x-4">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*,.pdf,.doc,.docx"
              onChange={handleFileSelect}
              className="hidden"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-secondary-500 hover:text-primary-500"
            >
              <Image className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm" className="p-2 text-secondary-500 hover:text-primary-500">
              <Smile className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm" className="p-2 text-secondary-500 hover:text-primary-500">
              <MapPin className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm" className="p-2 text-secondary-500 hover:text-primary-500">
              <Calendar className="w-5 h-5" />
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              disabled={isPosting}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={(!content.trim() && attachments.length === 0) || isPosting}
              isLoading={isPosting}
            >
              Post
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}