import React from 'react';
import { UserPlus, UserCheck, MessageCircle } from 'lucide-react';
import { Card } from '../ui/Card';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { useConnectionsStore } from '../../store/connections';
import type { User } from '../../types';

interface UserCardProps {
  user: User;
  showFollowButton?: boolean;
  compact?: boolean;
}

export function UserCard({ user, showFollowButton = true, compact = false }: UserCardProps) {
  const { followUser, unfollowUser, isFollowing } = useConnectionsStore();
  const following = isFollowing(user.id);

  const handleFollowToggle = () => {
    if (following) {
      unfollowUser(user.id);
    } else {
      followUser(user.id);
    }
  };

  if (compact) {
    return (
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center space-x-3">
          <Avatar
            src={user.avatar}
            alt={user.displayName}
            size="md"
            fallback={user.displayName.charAt(0)}
          />
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-secondary-900 dark:text-secondary-100">
                {user.displayName}
              </h3>
              {user.isVerified && (
                <div className="w-4 h-4 bg-primary-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
            </div>
            <p className="text-sm text-secondary-500">@{user.username}</p>
          </div>
        </div>
        
        {showFollowButton && (
          <Button
            variant={following ? 'secondary' : 'primary'}
            size="sm"
            onClick={handleFollowToggle}
            className="flex items-center"
          >
            {following ? (
              <>
                <UserCheck className="w-4 h-4 mr-1" />
                Following
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4 mr-1" />
                Follow
              </>
            )}
          </Button>
        )}
      </div>
    );
  }

  return (
    <Card className="space-y-4" hover>
      <div className="flex items-start space-x-4">
        <Avatar
          src={user.avatar}
          alt={user.displayName}
          size="lg"
          fallback={user.displayName.charAt(0)}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="font-semibold text-secondary-900 dark:text-secondary-100 truncate">
              {user.displayName}
            </h3>
            {user.isVerified && (
              <div className="w-4 h-4 bg-primary-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
            )}
          </div>
          <p className="text-sm text-secondary-500 mb-2">@{user.username}</p>
          {user.bio && (
            <p className="text-sm text-secondary-700 dark:text-secondary-300 mb-3 line-clamp-2">
              {user.bio}
            </p>
          )}
          
          <div className="flex items-center space-x-4 text-sm text-secondary-500 mb-4">
            <span>{user.followersCount.toLocaleString()} followers</span>
            <span>{user.postsCount} posts</span>
          </div>
        </div>
      </div>

      {showFollowButton && (
        <div className="flex space-x-2">
          <Button
            variant={following ? 'secondary' : 'primary'}
            size="sm"
            onClick={handleFollowToggle}
            className="flex-1 flex items-center justify-center"
          >
            {following ? (
              <>
                <UserCheck className="w-4 h-4 mr-2" />
                Following
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4 mr-2" />
                Follow
              </>
            )}
          </Button>
          <Button variant="outline" size="sm" className="flex items-center">
            <MessageCircle className="w-4 h-4 mr-2" />
            Message
          </Button>
        </div>
      )}
    </Card>
  );
}