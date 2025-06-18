import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Image, 
  Smile, 
  MapPin, 
  Calendar, 
  Send,
  Paperclip,
  Globe,
  Users,
  Lock
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { useAuthStore } from '../../store/auth';
import { modalBackdrop, modalContent, slideUp, buttonPress } from '../../lib/animations';

interface PostComposerProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (content: string, attachments: File[]) => void;
  placeholder?: string;
  replyTo?: {
    id: string;
    author: string;
    content: string;
  };
}

export function PostComposer({ 
  isOpen, 
  onClose, 
  onSubmit, 
  placeholder = "What's happening?",
  replyTo 
}: PostComposerProps) {
  const { user } = useAuthStore();
  const [content, setContent] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [privacy, setPrivacy] = useState<'public' | 'followers' | 'private'>('public');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const privacyOptions = [
    { value: 'public', icon: Globe, label: 'Public', description: 'Anyone can see' },
    { value: 'followers', icon: Users, label: 'Followers', description: 'Only followers' },
    { value: 'private', icon: Lock, label: 'Private', description: 'Only you' }
  ];

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
      // Auto-resize textarea
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    
    // Auto-resize textarea
    e.target.style.height = 'auto';
    e.target.style.height = e.target.scrollHeight + 'px';
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!content.trim() && attachments.length === 0) return;

    setIsSubmitting(true);
    try {
      await onSubmit(content, attachments);
      setContent('');
      setAttachments([]);
      onClose();
    } catch (error) {
      console.error('Failed to submit post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setContent('');
    setAttachments([]);
    onClose();
  };

  const characterLimit = 280;
  const remainingChars = characterLimit - content.length;
  const isOverLimit = remainingChars < 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            variants={modalBackdrop}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed inset-0 bg-dark-950/80 backdrop-blur-sm z-50"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            variants={modalContent}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed inset-x-4 top-20 bottom-20 md:inset-x-auto md:left-1/2 md:top-1/2 md:w-full md:max-w-2xl md:h-auto z-50 bg-dark-900 border border-dark-800 rounded-2xl shadow-2xl overflow-hidden"
            style={{ 
              transform: 'translate(-50%, -50%)',
              maxHeight: '80vh'
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-dark-800">
              <div className="flex items-center space-x-3">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={buttonPress}
                  onClick={handleClose}
                  className="p-2 text-dark-400 hover:text-white hover:bg-dark-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </motion.button>
                <h2 className="text-lg font-semibold text-white">
                  {replyTo ? 'Reply' : 'Create Post'}
                </h2>
              </div>
              
              {/* Privacy Selector */}
              <div className="relative">
                <select
                  value={privacy}
                  onChange={(e) => setPrivacy(e.target.value as any)}
                  className="appearance-none bg-dark-800 border border-dark-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
                >
                  {privacyOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Reply Context */}
            {replyTo && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-dark-800/50 border-b border-dark-800"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-dark-700 rounded-full flex items-center justify-center">
                    <span className="text-xs text-dark-300">{replyTo.author.charAt(0)}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-dark-300">
                      Replying to <span className="text-primary-400">@{replyTo.author}</span>
                    </p>
                    <p className="text-sm text-dark-400 mt-1 line-clamp-2">{replyTo.content}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-4">
                <div className="flex space-x-3">
                  {user && (
                    <Avatar
                      src={user.avatar}
                      alt={user.displayName}
                      size="md"
                      fallback={user.displayName.charAt(0)}
                    />
                  )}
                  
                  <div className="flex-1">
                    <textarea
                      ref={textareaRef}
                      value={content}
                      onChange={handleContentChange}
                      placeholder={placeholder}
                      className="w-full bg-transparent text-white placeholder-dark-400 text-lg resize-none focus:outline-none min-h-[120px] max-h-[300px] transition-all duration-200"
                      style={{ lineHeight: '1.5' }}
                    />
                    
                    {/* Attachments Preview */}
                    {attachments.length > 0 && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 grid grid-cols-2 gap-2"
                      >
                        {attachments.map((file, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.2, delay: index * 0.1 }}
                            className="relative group"
                          >
                            {file.type.startsWith('image/') ? (
                              <img
                                src={URL.createObjectURL(file)}
                                alt={file.name}
                                className="w-full h-24 object-cover rounded-lg"
                              />
                            ) : (
                              <div className="w-full h-24 bg-dark-800 rounded-lg flex items-center justify-center">
                                <div className="text-center">
                                  <Paperclip className="w-6 h-6 text-dark-400 mx-auto mb-1" />
                                  <p className="text-xs text-dark-400 truncate px-2">
                                    {file.name}
                                  </p>
                                </div>
                              </div>
                            )}
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => removeAttachment(index)}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-3 h-3" />
                            </motion.button>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-dark-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,video/*,.pdf,.doc,.docx"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={buttonPress}
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 text-dark-400 hover:text-primary-400 hover:bg-primary-500/10 rounded-lg transition-colors"
                  >
                    <Image className="w-5 h-5" />
                  </motion.button>
                  
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={buttonPress}
                    className="p-2 text-dark-400 hover:text-primary-400 hover:bg-primary-500/10 rounded-lg transition-colors"
                  >
                    <Smile className="w-5 h-5" />
                  </motion.button>
                  
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={buttonPress}
                    className="p-2 text-dark-400 hover:text-primary-400 hover:bg-primary-500/10 rounded-lg transition-colors"
                  >
                    <MapPin className="w-5 h-5" />
                  </motion.button>
                  
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={buttonPress}
                    className="p-2 text-dark-400 hover:text-primary-400 hover:bg-primary-500/10 rounded-lg transition-colors"
                  >
                    <Calendar className="w-5 h-5" />
                  </motion.button>
                </div>

                <div className="flex items-center space-x-3">
                  {/* Character Count */}
                  <div className="flex items-center space-x-2">
                    <motion.div 
                      animate={{ 
                        scale: remainingChars < 20 ? [1, 1.1, 1] : 1,
                        color: isOverLimit ? '#ef4444' : remainingChars < 20 ? '#f59e0b' : '#71717a'
                      }}
                      transition={{ duration: 0.3 }}
                      className={cn(
                        'w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium',
                        remainingChars < 20 ? 'bg-red-500/20 text-red-400' :
                        remainingChars < 50 ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-dark-700 text-dark-400'
                      )}
                    >
                      {remainingChars < 20 ? remainingChars : ''}
                    </motion.div>
                    
                    {remainingChars < 20 && (
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={cn(
                          'w-6 h-6 rounded-full border-2',
                          isOverLimit ? 'border-red-500' : 'border-yellow-500'
                        )}
                      >
                        <svg className="w-full h-full transform -rotate-90">
                          <circle
                            cx="12"
                            cy="12"
                            r="10"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeDasharray={`${Math.max(0, (remainingChars / characterLimit) * 62.8)} 62.8`}
                            className={isOverLimit ? 'text-red-500' : 'text-yellow-500'}
                          />
                        </svg>
                      </motion.div>
                    )}
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={buttonPress}
                  >
                    <Button
                      onClick={handleSubmit}
                      disabled={(!content.trim() && attachments.length === 0) || isOverLimit || isSubmitting}
                      isLoading={isSubmitting}
                      className="flex items-center"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      {replyTo ? 'Reply' : 'Post'}
                    </Button>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}