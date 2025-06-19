import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  MapPin, 
  Briefcase, 
  Star, 
  Users, 
  Grid, 
  List, 
  X, 
  Bookmark, 
  BookmarkCheck,
  UserPlus,
  Eye,
  ChevronDown,
  Building,
  Calendar,
  Award,
  Loader2
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Avatar } from '../components/ui/Avatar';
import { useConnectionsStore } from '../store/connections';
import { debounce } from '../lib/utils';
import type { User } from '../types';

interface SearchFilters {
  location: string;
  skills: string[];
  industry: string;
  experience: string;
  role: string;
  company: string;
}

interface ExtendedUser extends User {
  role: string;
  company: string;
  industry: string;
  experience: string;
  skills: string[];
  rating: number;
}

// Mock extended user data
const mockUsers: ExtendedUser[] = [
  {
    id: '1',
    username: 'sarah_dev',
    email: 'sarah@example.com',
    displayName: 'Sarah Johnson',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
    bio: 'Passionate frontend developer with expertise in React and modern web technologies. Love building user-centric applications.',
    location: 'San Francisco, CA',
    website: 'https://sarahdev.com',
    isVerified: true,
    joinedAt: new Date('2023-01-15'),
    followersCount: 1250,
    followingCount: 340,
    postsCount: 89,
    role: 'Senior Frontend Developer',
    company: 'TechCorp Inc.',
    industry: 'Technology',
    experience: '5-7 years',
    skills: ['React', 'TypeScript', 'Node.js', 'GraphQL', 'AWS'],
    rating: 4.8,
  },
  {
    id: '2',
    username: 'alex_design',
    email: 'alex@example.com',
    displayName: 'Alex Chen',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
    bio: 'Creative UI/UX designer focused on creating beautiful and intuitive digital experiences for users worldwide.',
    location: 'New York, NY',
    isVerified: false,
    joinedAt: new Date('2023-02-20'),
    followersCount: 890,
    followingCount: 210,
    postsCount: 156,
    role: 'Lead UX Designer',
    company: 'Design Studio',
    industry: 'Design',
    experience: '3-5 years',
    skills: ['Figma', 'Sketch', 'Prototyping', 'User Research', 'Design Systems'],
    rating: 4.6,
  },
  {
    id: '3',
    username: 'mike_data',
    email: 'mike@example.com',
    displayName: 'Mike Wilson',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150',
    bio: 'Data scientist and machine learning engineer helping businesses make data-driven decisions.',
    location: 'Austin, TX',
    isVerified: true,
    joinedAt: new Date('2023-03-10'),
    followersCount: 567,
    followingCount: 234,
    postsCount: 78,
    role: 'Data Scientist',
    company: 'DataTech Solutions',
    industry: 'Technology',
    experience: '7-10 years',
    skills: ['Python', 'Machine Learning', 'SQL', 'TensorFlow', 'Statistics'],
    rating: 4.9,
  },
  {
    id: '4',
    username: 'emma_product',
    email: 'emma@example.com',
    displayName: 'Emma Rodriguez',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
    bio: 'Product manager with a passion for building products that solve real user problems and drive business growth.',
    location: 'Seattle, WA',
    isVerified: false,
    joinedAt: new Date('2023-04-05'),
    followersCount: 445,
    followingCount: 189,
    postsCount: 92,
    role: 'Senior Product Manager',
    company: 'InnovateCorp',
    industry: 'Technology',
    experience: '5-7 years',
    skills: ['Product Strategy', 'Analytics', 'Agile', 'User Research', 'Roadmapping'],
    rating: 4.7,
  },
  {
    id: '5',
    username: 'david_marketing',
    email: 'david@example.com',
    displayName: 'David Kim',
    avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150',
    bio: 'Digital marketing strategist specializing in growth hacking and performance marketing for SaaS companies.',
    location: 'Los Angeles, CA',
    isVerified: true,
    joinedAt: new Date('2023-05-12'),
    followersCount: 723,
    followingCount: 156,
    postsCount: 134,
    role: 'Marketing Director',
    company: 'GrowthLab',
    industry: 'Marketing',
    experience: '3-5 years',
    skills: ['Digital Marketing', 'SEO', 'Analytics', 'Growth Hacking', 'Content Strategy'],
    rating: 4.5,
  },
  {
    id: '6',
    username: 'lisa_finance',
    email: 'lisa@example.com',
    displayName: 'Lisa Thompson',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150',
    bio: 'Financial analyst with expertise in investment banking and corporate finance. Passionate about fintech innovation.',
    location: 'Chicago, IL',
    isVerified: false,
    joinedAt: new Date('2023-06-18'),
    followersCount: 334,
    followingCount: 278,
    postsCount: 67,
    role: 'Senior Financial Analyst',
    company: 'FinanceFirst',
    industry: 'Finance',
    experience: '5-7 years',
    skills: ['Financial Modeling', 'Excel', 'Bloomberg', 'Risk Analysis', 'Investment Strategy'],
    rating: 4.4,
  },
];

const industries = ['Technology', 'Design', 'Marketing', 'Finance', 'Healthcare', 'Education', 'Consulting'];
const experienceLevels = ['0-2 years', '3-5 years', '5-7 years', '7-10 years', '10+ years'];
const popularSkills = ['React', 'Python', 'JavaScript', 'Figma', 'SQL', 'AWS', 'Node.js', 'TypeScript', 'Machine Learning', 'Product Management'];

export function SearchPage() {
  const { followUser, unfollowUser, isFollowing } = useConnectionsStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [isLoading, setIsLoading] = useState(false);
  const [savedFilters, setSavedFilters] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const [filters, setFilters] = useState<SearchFilters>({
    location: '',
    skills: [],
    industry: '',
    experience: '',
    role: '',
    company: '',
  });

  const resultsPerPage = 12;

  // Debounced search function
  const debouncedSearch = useMemo(
    () => debounce((query: string) => {
      if (query.length > 2) {
        // Generate suggestions based on query
        const userSuggestions = mockUsers
          .filter(user => 
            user.displayName.toLowerCase().includes(query.toLowerCase()) ||
            user.role.toLowerCase().includes(query.toLowerCase()) ||
            user.company.toLowerCase().includes(query.toLowerCase()) ||
            user.location.toLowerCase().includes(query.toLowerCase()) ||
            user.skills.some(skill => skill.toLowerCase().includes(query.toLowerCase()))
          )
          .slice(0, 5)
          .map(user => user.displayName);
        
        setSuggestions(userSuggestions);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [searchQuery, debouncedSearch]);

  // Filter and search logic
  const filteredUsers = useMemo(() => {
    return mockUsers.filter(user => {
      const matchesSearch = !searchQuery || 
        user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesLocation = !filters.location || 
        user.location.toLowerCase().includes(filters.location.toLowerCase());

      const matchesIndustry = !filters.industry || user.industry === filters.industry;

      const matchesExperience = !filters.experience || user.experience === filters.experience;

      const matchesRole = !filters.role || 
        user.role.toLowerCase().includes(filters.role.toLowerCase());

      const matchesCompany = !filters.company || 
        user.company.toLowerCase().includes(filters.company.toLowerCase());

      const matchesSkills = filters.skills.length === 0 || 
        filters.skills.some(skill => 
          user.skills.some(userSkill => 
            userSkill.toLowerCase().includes(skill.toLowerCase())
          )
        );

      return matchesSearch && matchesLocation && matchesIndustry && 
             matchesExperience && matchesRole && matchesCompany && matchesSkills;
    });
  }, [searchQuery, filters]);

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / resultsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    setShowSuggestions(false);
  };

  const handleFilterChange = (key: keyof SearchFilters, value: string | string[]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleSkillToggle = (skill: string) => {
    setFilters(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      location: '',
      skills: [],
      industry: '',
      experience: '',
      role: '',
      company: '',
    });
    setSearchQuery('');
    setCurrentPage(1);
  };

  const saveCurrentFilters = () => {
    const filterString = `${searchQuery} ${Object.values(filters).join(' ')}`.trim();
    if (filterString && !savedFilters.includes(filterString)) {
      setSavedFilters(prev => [...prev, filterString]);
    }
  };

  const handleConnect = (userId: string) => {
    const following = isFollowing(userId);
    if (following) {
      unfollowUser(userId);
    } else {
      followUser(userId);
    }
  };

  const hasActiveFilters = searchQuery || Object.values(filters).some(value => 
    Array.isArray(value) ? value.length > 0 : value !== ''
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Find People</h1>
          <p className="text-dark-400">
            Discover and connect with professionals in your network
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
            {hasActiveFilters && (
              <span className="ml-2 w-2 h-2 bg-primary-500 rounded-full"></span>
            )}
          </Button>
          
          <div className="flex space-x-1 bg-dark-800 rounded-lg p-1">
            <Button
              variant={viewMode === 'list' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="p-2"
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="p-2"
            >
              <Grid className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <Card className="p-6">
        <div className="relative">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-400" />
            <input
              type="text"
              placeholder="Search by name, location, or skills..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => setShowSuggestions(suggestions.length > 0)}
              className="w-full pl-12 pr-4 py-4 bg-dark-800 border border-dark-700 rounded-xl text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg transition-all duration-200"
            />
          </div>

          {/* Search Suggestions */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-dark-800 border border-dark-700 rounded-xl shadow-2xl z-10">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(suggestion)}
                  className="w-full px-4 py-3 text-left text-white hover:bg-dark-700 first:rounded-t-xl last:rounded-b-xl transition-colors"
                >
                  <Search className="w-4 h-4 inline mr-3 text-dark-400" />
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Advanced Filters */}
      {showFilters && (
        <div>
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Advanced Filters</h3>
              <div className="flex items-center space-x-3">
                <Button variant="outline" size="sm" onClick={saveCurrentFilters}>
                  <Bookmark className="w-4 h-4 mr-2" />
                  Save Filters
                </Button>
                <Button variant="outline" size="sm" onClick={clearAllFilters}>
                  <X className="w-4 h-4 mr-2" />
                  Clear All
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Location Filter */}
              <div>
                <label className="block text-sm font-medium text-dark-200 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Location
                </label>
                <input
                  type="text"
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  placeholder="City, State, Country"
                  className="w-full px-4 py-2.5 bg-dark-800 border border-dark-700 rounded-xl text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
                />
              </div>

              {/* Industry Filter */}
              <div>
                <label className="block text-sm font-medium text-dark-200 mb-2">
                  <Building className="w-4 h-4 inline mr-2" />
                  Industry
                </label>
                <select
                  value={filters.industry}
                  onChange={(e) => handleFilterChange('industry', e.target.value)}
                  className="w-full px-4 py-2.5 bg-dark-800 border border-dark-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
                >
                  <option value="">All Industries</option>
                  {industries.map(industry => (
                    <option key={industry} value={industry}>{industry}</option>
                  ))}
                </select>
              </div>

              {/* Experience Filter */}
              <div>
                <label className="block text-sm font-medium text-dark-200 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Experience
                </label>
                <select
                  value={filters.experience}
                  onChange={(e) => handleFilterChange('experience', e.target.value)}
                  className="w-full px-4 py-2.5 bg-dark-800 border border-dark-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
                >
                  <option value="">Any Experience</option>
                  {experienceLevels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>

              {/* Role Filter */}
              <div>
                <label className="block text-sm font-medium text-dark-200 mb-2">
                  <Briefcase className="w-4 h-4 inline mr-2" />
                  Role/Title
                </label>
                <input
                  type="text"
                  value={filters.role}
                  onChange={(e) => handleFilterChange('role', e.target.value)}
                  placeholder="e.g. Software Engineer"
                  className="w-full px-4 py-2.5 bg-dark-800 border border-dark-700 rounded-xl text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
                />
              </div>

              {/* Company Filter */}
              <div>
                <label className="block text-sm font-medium text-dark-200 mb-2">
                  <Building className="w-4 h-4 inline mr-2" />
                  Company
                </label>
                <input
                  type="text"
                  value={filters.company}
                  onChange={(e) => handleFilterChange('company', e.target.value)}
                  placeholder="Company name"
                  className="w-full px-4 py-2.5 bg-dark-800 border border-dark-700 rounded-xl text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
                />
              </div>
            </div>

            {/* Skills Filter */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-dark-200 mb-3">
                <Award className="w-4 h-4 inline mr-2" />
                Skills & Expertise
              </label>
              <div className="flex flex-wrap gap-2">
                {popularSkills.map((skill, index) => (
                  <button
                    key={skill}
                    onClick={() => handleSkillToggle(skill)}
                    className={`px-3 py-1.5 text-sm rounded-full transition-all duration-200 ${
                      filters.skills.includes(skill)
                        ? 'bg-primary-500 text-white shadow-lg'
                        : 'bg-dark-800 text-dark-300 hover:bg-dark-700 hover:text-white'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>

            {/* Saved Filters */}
            {savedFilters.length > 0 && (
              <div className="mt-6">
                <label className="block text-sm font-medium text-dark-200 mb-3">
                  <BookmarkCheck className="w-4 h-4 inline mr-2" />
                  Saved Filters
                </label>
                <div className="flex flex-wrap gap-2">
                  {savedFilters.map((filter, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        // Apply saved filter logic here
                        console.log('Applying saved filter:', filter);
                      }}
                      className="px-3 py-1.5 text-sm bg-dark-800 text-dark-300 hover:bg-dark-700 hover:text-white rounded-full transition-colors"
                    >
                      {filter.substring(0, 30)}...
                    </button>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white">
            {filteredUsers.length} {filteredUsers.length === 1 ? 'person' : 'people'} found
          </p>
          {hasActiveFilters && (
            <p className="text-sm text-dark-400 mt-1">
              Showing results for your search and filters
            </p>
          )}
        </div>
      </div>

      {/* Search Results */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
        </div>
      ) : filteredUsers.length === 0 ? (
        <Card className="p-12 text-center">
          <Users className="w-16 h-16 text-dark-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No people found</h3>
          <p className="text-dark-400 mb-6">
            Try adjusting your search terms or filters to find more people.
          </p>
          <div className="space-y-2">
            <p className="text-sm text-dark-500">Suggestions:</p>
            <ul className="text-sm text-dark-400 space-y-1">
              <li>• Try broader search terms</li>
              <li>• Remove some filters</li>
              <li>• Check for typos in your search</li>
              <li>• Search for skills instead of specific roles</li>
            </ul>
          </div>
          <Button variant="outline" onClick={clearAllFilters} className="mt-6">
            Clear All Filters
          </Button>
        </Card>
      ) : (
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
          : 'space-y-4'
        }>
          {paginatedUsers.map((user) => (
            <div key={user.id}>
              <Card 
                className={`p-6 hover:bg-dark-800/50 transition-colors ${
                  viewMode === 'list' ? 'flex items-center space-x-6' : 'text-center'
                }`}
              >
                <div className={viewMode === 'list' ? 'flex-shrink-0' : 'mb-4'}>
                  <Avatar
                    src={user.avatar}
                    alt={user.displayName}
                    size={viewMode === 'list' ? 'lg' : 'xl'}
                    fallback={user.displayName.charAt(0)}
                  />
                </div>

                <div className={`flex-1 ${viewMode === 'list' ? 'min-w-0' : ''}`}>
                  <div className={`flex items-center ${viewMode === 'list' ? 'justify-between' : 'justify-center mb-2'}`}>
                    <div className={viewMode === 'list' ? 'min-w-0 flex-1' : ''}>
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-white truncate">
                          {user.displayName}
                        </h3>
                        {user.isVerified && (
                          <div className="w-4 h-4 bg-primary-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        )}
                      </div>
                      <p className="text-primary-400 text-sm font-medium mb-1">
                        {user.role}
                      </p>
                      <p className="text-dark-400 text-sm mb-2">
                        {user.company}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-dark-500 mb-3">
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3" />
                          <span>{user.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 fill-current text-yellow-500" />
                          <span>{user.rating}</span>
                        </div>
                      </div>
                    </div>

                    {viewMode === 'list' && (
                      <div className="flex items-center space-x-3 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(`/profile/${user.username}`, '_blank')}
                          className="flex items-center"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                        <Button
                          variant={isFollowing(user.id) ? 'secondary' : 'primary'}
                          size="sm"
                          onClick={() => handleConnect(user.id)}
                          className="flex items-center"
                        >
                          <UserPlus className="w-4 h-4 mr-2" />
                          {isFollowing(user.id) ? 'Following' : 'Connect'}
                        </Button>
                      </div>
                    )}
                  </div>

                  <p className="text-dark-300 text-sm mb-4 line-clamp-2">
                    {user.bio}
                  </p>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {user.skills.slice(0, 3).map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-1 text-xs bg-dark-800 text-dark-300 rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                    {user.skills.length > 3 && (
                      <span className="px-2 py-1 text-xs text-dark-500">
                        +{user.skills.length - 3} more
                      </span>
                    )}
                  </div>

                  {viewMode === 'grid' && (
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`/profile/${user.username}`, '_blank')}
                        className="flex-1 flex items-center justify-center"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                      <Button
                        variant={isFollowing(user.id) ? 'secondary' : 'primary'}
                        size="sm"
                        onClick={() => handleConnect(user.id)}
                        className="flex-1 flex items-center justify-center"
                      >
                        <UserPlus className="w-4 h-4 mr-2" />
                        {isFollowing(user.id) ? 'Following' : 'Connect'}
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          
          <div className="flex items-center space-x-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = i + 1;
              return (
                <Button
                  key={page}
                  variant={currentPage === page ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className="w-10 h-10"
                >
                  {page}
                </Button>
              );
            })}
            {totalPages > 5 && (
              <>
                <span className="text-dark-400">...</span>
                <Button
                  variant={currentPage === totalPages ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentPage(totalPages)}
                  className="w-10 h-10"
                >
                  {totalPages}
                </Button>
              </>
            )}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}