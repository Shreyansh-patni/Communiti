import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/HomePage';
import { GroupsPage } from './pages/GroupsPage';
import { GroupDetailPage } from './pages/GroupDetailPage';
import { CreateGroupPage } from './pages/CreateGroupPage';
import { ChatPage } from './pages/ChatPage';
import { EventsPage } from './pages/EventsPage';
import { EventDetailPage } from './pages/EventDetailPage';
import { CreateEventPage } from './pages/CreateEventPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { BookmarksPage } from './pages/BookmarksPage';
import { TrendingPage } from './pages/TrendingPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { LoginPage } from './pages/LoginPage';
import { SignUpPage } from './pages/SignUpPage';
import { SearchPage } from './pages/SearchPage';
import { ImplementationPlanPage } from './pages/ImplementationPlanPage';
import { AIAssistantProvider } from './components/ai/AIAssistantProvider';
import { AIAssistant } from './components/ai/AIAssistant';
import { useAIAssistant } from './components/ai/AIAssistantProvider';
import { useAuthStore } from './store/auth';

// Mock user for demo
const mockUser = {
  id: '1',
  username: 'johndoe',
  email: 'john@example.com',
  displayName: 'John Doe',
  avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
  bio: 'Full-stack developer passionate about building great user experiences.',
  location: 'San Francisco, CA',
  website: 'https://johndoe.dev',
  joinedAt: new Date('2023-01-15'),
  isVerified: true,
  followersCount: 1250,
  followingCount: 340,
  postsCount: 89,
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 10, // 10 minutes
    },
  },
});

function AppContent() {
  const { login, isAuthenticated } = useAuthStore();
  const { isOpen, isMinimized, closeAssistant, toggleMinimize } = useAIAssistant();

  // Auto-login for demo purposes (remove in production)
  React.useEffect(() => {
    if (!isAuthenticated) {
      // Uncomment the line below to auto-login for demo
      // login(mockUser);
    }
  }, [isAuthenticated, login]);

  return (
    <>
      <Router>
        <div className="min-h-screen bg-dark-950">
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="groups" element={<GroupsPage />} />
              <Route path="groups/:id" element={<GroupDetailPage />} />
              <Route path="groups/create" element={<CreateGroupPage />} />
              <Route path="events" element={<EventsPage />} />
              <Route path="events/:id" element={<EventDetailPage />} />
              <Route path="events/create" element={<CreateEventPage />} />
              <Route path="chat" element={<ChatPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="bookmarks" element={<BookmarksPage />} />
              <Route path="trending" element={<TrendingPage />} />
              <Route path="profile/:username" element={<ProfilePage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="search" element={<SearchPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="signup" element={<SignUpPage />} />
              <Route path="implementation-plan" element={<ImplementationPlanPage />} />
            </Route>
          </Routes>
        </div>
      </Router>

      {/* AI Assistant */}
      {isOpen && (
        <AIAssistant
          isMinimized={isMinimized}
          onToggleMinimize={toggleMinimize}
          onClose={closeAssistant}
        />
      )}
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AIAssistantProvider>
        <AppContent />
      </AIAssistantProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;