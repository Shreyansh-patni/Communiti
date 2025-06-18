import React, { useEffect } from 'react';
import { Users } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { UserCard } from '../user/UserCard';
import { useConnectionsStore } from '../../store/connections';
import { useDemoDataStore } from '../../store/demoDataStore';

export function SuggestedUsers() {
  const { suggestedUsers } = useConnectionsStore();
  const { users, initializeDemoData } = useDemoDataStore();
  
  // Use demo data if no suggested users are available
  const displayUsers = suggestedUsers.length > 0 
    ? suggestedUsers 
    : users.slice(0, 3);
  
  useEffect(() => {
    // Initialize demo data if needed
    if (users.length === 0) {
      initializeDemoData();
    }
  }, [users.length, initializeDemoData]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Users className="w-5 h-5 text-primary-500" />
          <h3 className="font-semibold text-secondary-900 dark:text-secondary-100">
            Suggested for you
          </h3>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {displayUsers.slice(0, 3).map((user) => (
            <UserCard key={user.id} user={user} compact />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}