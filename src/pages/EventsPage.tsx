import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Users, Plus, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Avatar } from '../components/ui/Avatar';
import { formatDate, formatRelativeTime } from '../lib/utils';
import { useDemoDataStore } from '../store/demoDataStore';
import type { Event } from '../types';

export function EventsPage() {
  const navigate = useNavigate();
  const { events, initializeDemoData } = useDemoDataStore();
  const [selectedFilter, setSelectedFilter] = useState('upcoming');
  const [displayEvents, setDisplayEvents] = useState<Event[]>([]);

  // Initialize demo data if needed
  useEffect(() => {
    if (events.length === 0) {
      initializeDemoData();
    }
  }, [events.length, initializeDemoData]);

  // Update filtered events when events or filter changes
  useEffect(() => {
    if (events.length > 0) {
      const now = new Date();
      
      const filtered = events.filter(event => {
        // Ensure event.startDate is a Date object
        const startDate = event.startDate instanceof Date 
          ? event.startDate 
          : new Date(event.startDate);
        
        switch (selectedFilter) {
          case 'attending':
            return event.isAttending;
          case 'virtual':
            return event.isVirtual;
          case 'past':
            return startDate < now;
          default: // upcoming
            return startDate > now;
        }
      });
      
      // Sort by date
      const sorted = [...filtered].sort((a, b) => {
        // Ensure we're working with Date objects
        const aDate = a.startDate instanceof Date ? a.startDate : new Date(a.startDate);
        const bDate = b.startDate instanceof Date ? b.startDate : new Date(b.startDate);
        
        if (selectedFilter === 'past') {
          return bDate.getTime() - aDate.getTime(); // Most recent past events first
        }
        return aDate.getTime() - bDate.getTime(); // Soonest upcoming events first
      });
      
      setDisplayEvents(sorted);
    }
  }, [events, selectedFilter]);

  const filters = [
    { id: 'upcoming', name: 'Upcoming' },
    { id: 'attending', name: 'Attending' },
    { id: 'past', name: 'Past' },
    { id: 'virtual', name: 'Virtual' },
  ];

  const handleAttendEvent = (eventId: string) => {
    // In a real app, this would update the event attendance status
    // For demo purposes, we'll just navigate to the event details
    setTimeout(() => {
      navigate(`/events/${eventId}`);
    }, 500);
  };

  const handleShareEvent = (event: Event) => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.description,
        url: `${window.location.origin}/events/${event.id}`,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${window.location.origin}/events/${event.id}`);
      alert('Event link copied to clipboard!');
    }
  };

  const handleCreateEvent = () => {
    navigate('/events/create');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
            Events
          </h1>
          <p className="text-secondary-600 dark:text-secondary-400">
            Discover and join events in your community
          </p>
        </div>
        <Button className="flex items-center" onClick={handleCreateEvent}>
          <Plus className="w-4 h-4 mr-2" />
          Create Event
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto">
        {filters.map((filter) => (
          <Button
            key={filter.id}
            variant={selectedFilter === filter.id ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setSelectedFilter(filter.id)}
            className="whitespace-nowrap"
          >
            {filter.name}
          </Button>
        ))}
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {displayEvents.map((event, index) => {
          // Ensure event.startDate is a Date object
          const startDate = event.startDate instanceof Date 
            ? event.startDate 
            : new Date(event.startDate);
            
          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="space-y-4 cursor-pointer" hover onClick={() => navigate(`/events/${event.id}`)}>
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    <div>
                      <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
                        {event.title}
                      </h3>
                      <p className="text-secondary-600 dark:text-secondary-400 mt-1">
                        {event.description.split('\n')[0]}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-secondary-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(startDate)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>
                          {startDate.toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>
                      {event.location && (
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{event.location}</span>
                        </div>
                      )}
                      {event.isVirtual && (
                        <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded text-xs">
                          Virtual
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar
                          src={event.organizer.avatar}
                          alt={event.organizer.displayName}
                          size="sm"
                          fallback={event.organizer.displayName.charAt(0)}
                        />
                        <div>
                          <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100">
                            {event.organizer.displayName}
                          </p>
                          <p className="text-xs text-secondary-500">
                            Organizer
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1 text-sm text-secondary-500">
                        <Users className="w-4 h-4" />
                        <span>
                          {event.attendeesCount}
                          {event.maxAttendees && ` / ${event.maxAttendees}`} attending
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {event.tags.slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs bg-secondary-100 dark:bg-secondary-800 text-secondary-600 dark:text-secondary-400 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                      {event.tags.length > 4 && (
                        <span className="px-2 py-1 text-xs text-secondary-500">
                          +{event.tags.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="ml-4 flex flex-col space-y-2">
                    <Button
                      variant={event.isAttending ? 'secondary' : 'primary'}
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAttendEvent(event.id);
                      }}
                    >
                      {event.isAttending ? 'Attending' : 'Attend'}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShareEvent(event);
                      }}
                    >
                      Share
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {displayEvents.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-secondary-900 dark:text-secondary-100 mb-2">
            No events found
          </h3>
          <p className="text-secondary-600 dark:text-secondary-400">
            Try adjusting your filters or create a new event
          </p>
        </div>
      )}
    </div>
  );
}