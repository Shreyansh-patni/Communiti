import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Share2, 
  Download, 
  MessageCircle, 
  ArrowLeft,
  ExternalLink,
  User,
  Mail,
  Phone,
  Globe,
  Plus,
  Heart,
  Bookmark,
  Send
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Avatar } from '../components/ui/Avatar';
import { formatDate, formatRelativeTime } from '../lib/utils';
import { useAuthStore } from '../store/auth';
import type { Event, User as UserType, Comment } from '../types';

// Mock data for event details
const mockEventData: Event & {
  attendees: UserType[];
  comments: Comment[];
  relatedEvents: Event[];
  documents: { id: string; name: string; url: string; type: string }[];
} = {
  id: '1',
  title: 'React Hooks Deep Dive Workshop',
  description: 'Join us for an intensive workshop on React Hooks! We\'ll cover everything from basic hooks like useState and useEffect to advanced patterns with useReducer, useContext, and custom hooks.\n\nWhat you\'ll learn:\n• Understanding the React Hooks lifecycle\n• Building custom hooks for reusable logic\n• Performance optimization with useMemo and useCallback\n• Advanced patterns and best practices\n• Real-world examples and hands-on exercises\n\nThis workshop is perfect for developers who want to master React Hooks and take their React skills to the next level.',
  startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000),
  location: 'Tech Hub Conference Center, 123 Innovation Drive, Downtown',
  isVirtual: false,
  meetingUrl: 'https://zoom.us/j/123456789',
  organizerId: '1',
  organizer: {
    id: '1',
    username: 'sarah_dev',
    email: 'sarah@example.com',
    displayName: 'Sarah Johnson',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
    bio: 'Senior React Developer & Workshop Instructor',
    website: 'https://sarahdev.com',
    location: 'San Francisco, CA',
    isVerified: true,
    joinedAt: new Date(),
    followersCount: 1250,
    followingCount: 340,
    postsCount: 89,
  },
  attendeesCount: 45,
  maxAttendees: 60,
  isAttending: false,
  tags: ['React', 'Hooks', 'Workshop', 'Advanced', 'JavaScript'],
  createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
  attendees: [
    {
      id: '2',
      username: 'alex_dev',
      email: 'alex@example.com',
      displayName: 'Alex Chen',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
      bio: 'Full-stack developer',
      isVerified: false,
      joinedAt: new Date(),
      followersCount: 890,
      followingCount: 210,
      postsCount: 156,
    },
    {
      id: '3',
      username: 'mike_wilson',
      email: 'mike@example.com',
      displayName: 'Mike Wilson',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150',
      bio: 'React enthusiast',
      isVerified: false,
      joinedAt: new Date(),
      followersCount: 234,
      followingCount: 567,
      postsCount: 45,
    },
  ],
  comments: [
    {
      id: '1',
      content: 'Really excited for this workshop! Will there be any materials provided beforehand?',
      authorId: '2',
      author: {
        id: '2',
        username: 'alex_dev',
        email: 'alex@example.com',
        displayName: 'Alex Chen',
        avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
        isVerified: false,
        joinedAt: new Date(),
        followersCount: 890,
        followingCount: 210,
        postsCount: 156,
      },
      postId: '1',
      likesCount: 3,
      isLiked: false,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
  ],
  relatedEvents: [
    {
      id: '2',
      title: 'Advanced React Patterns',
      description: 'Learn advanced React patterns and architectural decisions',
      startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
      location: 'Virtual Event',
      isVirtual: true,
      organizerId: '1',
      organizer: {
        id: '1',
        username: 'sarah_dev',
        email: 'sarah@example.com',
        displayName: 'Sarah Johnson',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
        isVerified: true,
        joinedAt: new Date(),
        followersCount: 1250,
        followingCount: 340,
        postsCount: 89,
      },
      attendeesCount: 32,
      isAttending: false,
      tags: ['React', 'Advanced', 'Patterns'],
      createdAt: new Date(),
    },
  ],
  documents: [
    {
      id: '1',
      name: 'Workshop Prerequisites.pdf',
      url: '#',
      type: 'pdf',
    },
    {
      id: '2',
      name: 'React Hooks Cheat Sheet.pdf',
      url: '#',
      type: 'pdf',
    },
    {
      id: '3',
      name: 'Code Examples Repository',
      url: 'https://github.com/example/react-hooks-workshop',
      type: 'link',
    },
  ],
};

export function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [event, setEvent] = useState(mockEventData);
  const [isAttending, setIsAttending] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState(mockEventData.comments);

  const handleAttendEvent = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsAttending(!isAttending);
      setEvent(prev => ({
        ...prev,
        attendeesCount: isAttending ? prev.attendeesCount - 1 : prev.attendeesCount + 1,
        isAttending: !isAttending
      }));
    } catch (error) {
      console.error('Failed to attend/unattend event:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShareEvent = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Event link copied to clipboard!');
    }
  };

  const handleAddToCalendar = () => {
    const startDate = event.startDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const endDate = event.endDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const details = encodeURIComponent(event.description);
    const location = encodeURIComponent(event.location || '');
    
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${startDate}/${endDate}&details=${details}&location=${location}`;
    
    window.open(googleCalendarUrl, '_blank');
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleAddComment = () => {
    if (!commentText.trim() || !user) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      content: commentText,
      authorId: user.id,
      author: user,
      postId: event.id,
      likesCount: 0,
      isLiked: false,
      createdAt: new Date(),
    };

    setComments(prev => [...prev, newComment]);
    setCommentText('');
  };

  const handleContactOrganizer = () => {
    // In a real app, this would open a message dialog or email client
    if (event.organizer.email) {
      window.location.href = `mailto:${event.organizer.email}?subject=Question about ${event.title}`;
    }
  };

  if (!event) {
    return (
      <div className="text-center py-12">
        <p className="text-secondary-600 dark:text-secondary-400">Event not found</p>
      </div>
    );
  }

  const isEventPast = event.startDate < new Date();
  const timeUntilEvent = event.startDate.getTime() - Date.now();
  const daysUntilEvent = Math.ceil(timeUntilEvent / (1000 * 60 * 60 * 24));

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => navigate('/events')}
        className="flex items-center"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Events
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Event Header */}
          <Card className="overflow-hidden">
            {/* Featured Image */}
            <div className="h-64 bg-gradient-to-r from-primary-500 to-accent-500 relative">
              <img
                src="https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
                <div className="p-6 text-white">
                  <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(event.startDate)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>
                        {event.startDate.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                    {event.location && (
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{event.isVirtual ? 'Virtual Event' : 'In Person'}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              {/* Event Status */}
              {!isEventPast && daysUntilEvent <= 7 && (
                <div className="mb-4 p-3 bg-warning-100 dark:bg-warning-900 border border-warning-200 dark:border-warning-800 rounded-lg">
                  <p className="text-warning-800 dark:text-warning-200 text-sm font-medium">
                    {daysUntilEvent === 0 ? 'Event is today!' : `Event starts in ${daysUntilEvent} day${daysUntilEvent > 1 ? 's' : ''}`}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 mb-6">
                <Button
                  onClick={handleAttendEvent}
                  disabled={isLoading || isEventPast}
                  isLoading={isLoading}
                  variant={isAttending ? 'secondary' : 'primary'}
                  className="flex items-center"
                >
                  <Users className="w-4 h-4 mr-2" />
                  {isAttending ? 'Attending' : 'Attend Event'}
                </Button>
                <Button variant="outline" onClick={handleShareEvent} className="flex items-center">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" onClick={handleAddToCalendar} className="flex items-center">
                  <Plus className="w-4 h-4 mr-2" />
                  Add to Calendar
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleBookmark}
                  className={`flex items-center ${isBookmarked ? 'text-primary-600' : ''}`}
                >
                  <Bookmark className={`w-4 h-4 mr-2 ${isBookmarked ? 'fill-current' : ''}`} />
                  {isBookmarked ? 'Bookmarked' : 'Bookmark'}
                </Button>
              </div>

              {/* Event Description */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100">
                  About This Event
                </h2>
                <div className="prose prose-secondary dark:prose-invert max-w-none">
                  <p className="text-secondary-700 dark:text-secondary-300 whitespace-pre-line">
                    {event.description}
                  </p>
                </div>
              </div>

              {/* Tags */}
              <div className="mt-6">
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-sm bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Event Details */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
              Event Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Calendar className="w-5 h-5 text-secondary-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-secondary-900 dark:text-secondary-100">Date & Time</p>
                    <p className="text-secondary-600 dark:text-secondary-400">
                      {formatDate(event.startDate)}
                    </p>
                    <p className="text-secondary-600 dark:text-secondary-400">
                      {event.startDate.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })} - {event.endDate.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-secondary-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-secondary-900 dark:text-secondary-100">Location</p>
                    {event.isVirtual ? (
                      <div>
                        <p className="text-secondary-600 dark:text-secondary-400">Virtual Event</p>
                        {event.meetingUrl && (
                          <a
                            href={event.meetingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-600 dark:text-primary-400 hover:underline flex items-center mt-1"
                          >
                            Join Meeting <ExternalLink className="w-3 h-3 ml-1" />
                          </a>
                        )}
                      </div>
                    ) : (
                      <p className="text-secondary-600 dark:text-secondary-400">{event.location}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Users className="w-5 h-5 text-secondary-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-secondary-900 dark:text-secondary-100">Attendance</p>
                    <p className="text-secondary-600 dark:text-secondary-400">
                      {event.attendeesCount} attending
                      {event.maxAttendees && ` / ${event.maxAttendees} max`}
                    </p>
                    {event.maxAttendees && (
                      <div className="w-full bg-secondary-200 dark:bg-secondary-700 rounded-full h-2 mt-2">
                        <div
                          className="bg-primary-500 h-2 rounded-full"
                          style={{ width: `${(event.attendeesCount / event.maxAttendees) * 100}%` }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-secondary-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-secondary-900 dark:text-secondary-100">Duration</p>
                    <p className="text-secondary-600 dark:text-secondary-400">
                      {Math.round((event.endDate.getTime() - event.startDate.getTime()) / (1000 * 60 * 60))} hours
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Documents & Links */}
          {event.documents.length > 0 && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
                Resources & Documents
              </h3>
              <div className="space-y-3">
                {event.documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 bg-secondary-50 dark:bg-secondary-800 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded flex items-center justify-center">
                        {doc.type === 'link' ? (
                          <ExternalLink className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                        ) : (
                          <Download className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                        )}
                      </div>
                      <span className="font-medium text-secondary-900 dark:text-secondary-100">
                        {doc.name}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(doc.url, '_blank')}
                      className="flex items-center"
                    >
                      {doc.type === 'link' ? 'Visit' : 'Download'}
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Comments Section */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
              Discussion ({comments.length})
            </h3>

            {/* Add Comment */}
            {user && (
              <div className="mb-6">
                <div className="flex space-x-3">
                  <Avatar
                    src={user.avatar}
                    alt={user.displayName}
                    size="sm"
                    fallback={user.displayName.charAt(0)}
                  />
                  <div className="flex-1">
                    <textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Ask a question or share your thoughts..."
                      className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-800 text-secondary-900 dark:text-secondary-100 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                      rows={3}
                    />
                    <div className="flex justify-end mt-2">
                      <Button
                        size="sm"
                        onClick={handleAddComment}
                        disabled={!commentText.trim()}
                        className="flex items-center"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Post Comment
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Comments List */}
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex space-x-3">
                  <Avatar
                    src={comment.author.avatar}
                    alt={comment.author.displayName}
                    size="sm"
                    fallback={comment.author.displayName.charAt(0)}
                  />
                  <div className="flex-1">
                    <div className="bg-secondary-50 dark:bg-secondary-800 rounded-lg px-4 py-3">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-medium text-secondary-900 dark:text-secondary-100">
                          {comment.author.displayName}
                        </span>
                        <span className="text-sm text-secondary-500">
                          {formatRelativeTime(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-secondary-700 dark:text-secondary-300">
                        {comment.content}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4 mt-2">
                      <button className="flex items-center space-x-1 text-sm text-secondary-500 hover:text-primary-600">
                        <Heart className="w-4 h-4" />
                        <span>{comment.likesCount}</span>
                      </button>
                      <button className="text-sm text-secondary-500 hover:text-primary-600">
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {comments.length === 0 && (
                <div className="text-center py-8">
                  <MessageCircle className="w-8 h-8 text-secondary-400 mx-auto mb-2" />
                  <p className="text-secondary-600 dark:text-secondary-400">
                    No comments yet. Be the first to start the discussion!
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Organizer Info */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
              Organizer
            </h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Avatar
                  src={event.organizer.avatar}
                  alt={event.organizer.displayName}
                  size="lg"
                  fallback={event.organizer.displayName.charAt(0)}
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium text-secondary-900 dark:text-secondary-100">
                      {event.organizer.displayName}
                    </h4>
                    {event.organizer.isVerified && (
                      <div className="w-4 h-4 bg-primary-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-secondary-500">@{event.organizer.username}</p>
                </div>
              </div>

              {event.organizer.bio && (
                <p className="text-sm text-secondary-600 dark:text-secondary-400">
                  {event.organizer.bio}
                </p>
              )}

              <div className="space-y-2">
                {event.organizer.location && (
                  <div className="flex items-center space-x-2 text-sm text-secondary-500">
                    <MapPin className="w-4 h-4" />
                    <span>{event.organizer.location}</span>
                  </div>
                )}
                {event.organizer.website && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Globe className="w-4 h-4 text-secondary-500" />
                    <a
                      href={event.organizer.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 dark:text-primary-400 hover:underline"
                    >
                      {event.organizer.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}
              </div>

              <Button
                variant="outline"
                className="w-full flex items-center justify-center"
                onClick={handleContactOrganizer}
              >
                <Mail className="w-4 h-4 mr-2" />
                Contact Organizer
              </Button>
            </div>
          </Card>

          {/* Attendees */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
              Attendees ({event.attendeesCount})
            </h3>
            <div className="space-y-3">
              {event.attendees.slice(0, 5).map((attendee) => (
                <div key={attendee.id} className="flex items-center space-x-3">
                  <Avatar
                    src={attendee.avatar}
                    alt={attendee.displayName}
                    size="sm"
                    fallback={attendee.displayName.charAt(0)}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-secondary-900 dark:text-secondary-100 truncate">
                      {attendee.displayName}
                    </p>
                    <p className="text-sm text-secondary-500 truncate">
                      @{attendee.username}
                    </p>
                  </div>
                </div>
              ))}
              {event.attendeesCount > 5 && (
                <p className="text-sm text-secondary-500 text-center">
                  +{event.attendeesCount - 5} more attendees
                </p>
              )}
            </div>
          </Card>

          {/* Related Events */}
          {event.relatedEvents.length > 0 && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
                Similar Events
              </h3>
              <div className="space-y-4">
                {event.relatedEvents.map((relatedEvent) => (
                  <div
                    key={relatedEvent.id}
                    className="p-3 border border-secondary-200 dark:border-secondary-700 rounded-lg cursor-pointer hover:bg-secondary-50 dark:hover:bg-secondary-800 transition-colors"
                    onClick={() => navigate(`/events/${relatedEvent.id}`)}
                  >
                    <h4 className="font-medium text-secondary-900 dark:text-secondary-100 mb-1">
                      {relatedEvent.title}
                    </h4>
                    <div className="flex items-center space-x-2 text-sm text-secondary-500 mb-2">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(relatedEvent.startDate)}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-secondary-500">
                      <Users className="w-3 h-3" />
                      <span>{relatedEvent.attendeesCount} attending</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}