import React, { useState } from 'react';
import { 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Code, 
  CreditCard, 
  FileText, 
  Filter, 
  Flag, 
  Layers, 
  MessageCircle, 
  BarChart3, 
  Search, 
  Settings, 
  Users, 
  Video, 
  Zap,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  ArrowLeft,
  Globe,
  HelpCircle,
  Palette,
  Bell
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

// Feature types and interfaces
interface Feature {
  id: string;
  name: string;
  description: string;
  priority: number;
  status: 'planning' | 'in-progress' | 'testing' | 'completed';
  timeline: string;
  complexity: 'low' | 'medium' | 'high';
  businessValue: 'low' | 'medium' | 'high';
  dependencies: string[];
  resources: string[];
  risks: {
    description: string;
    severity: 'low' | 'medium' | 'high';
    mitigation: string;
  }[];
  icon: React.ElementType;
  category: 'core' | 'monetization' | 'communication' | 'analytics' | 'content';
}

interface Sprint {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  features: string[];
}

interface Milestone {
  id: string;
  name: string;
  date: string;
  description: string;
  features: string[];
}

// Mock data for features
const features: Feature[] = [
  {
    id: 'feature-1',
    name: 'Language & Region Settings',
    description: 'Allow users to customize language preferences and regional settings.',
    priority: 1,
    status: 'planning',
    timeline: '2 weeks',
    complexity: 'medium',
    businessValue: 'medium',
    dependencies: [],
    resources: ['1 Frontend developer', '1 QA tester'],
    risks: [
      {
        description: 'Text expansion in different languages breaking UI',
        severity: 'medium',
        mitigation: 'Design with flexible containers, test with longest translations'
      }
    ],
    icon: Globe,
    category: 'core'
  },
  {
    id: 'feature-2',
    name: 'Help & Support Center',
    description: 'Comprehensive help documentation and support request system.',
    priority: 1,
    status: 'planning',
    timeline: '3 weeks',
    complexity: 'medium',
    businessValue: 'medium',
    dependencies: [],
    resources: ['1 Frontend developer', '1 Content writer'],
    risks: [
      {
        description: 'Content maintenance overhead',
        severity: 'low',
        mitigation: 'Implement CMS for easy updates'
      }
    ],
    icon: HelpCircle,
    category: 'core'
  },
  {
    id: 'feature-3',
    name: 'Payment Processing Integration',
    description: 'Enable paid features including premium groups, event tickets, and subscription tiers.',
    priority: 2,
    status: 'planning',
    timeline: '4 weeks',
    complexity: 'high',
    businessValue: 'high',
    dependencies: ['Supabase database schema updates'],
    resources: ['1 Frontend developer', '1 Backend developer', '1 Security specialist'],
    risks: [
      {
        description: 'Payment security concerns',
        severity: 'high',
        mitigation: 'Use established payment provider, implement proper encryption'
      },
      {
        description: 'Compliance requirements',
        severity: 'medium',
        mitigation: 'Consult legal team for regional requirements'
      }
    ],
    icon: CreditCard,
    category: 'monetization'
  },
  {
    id: 'feature-4',
    name: 'Premium Group Memberships',
    description: 'Allow group creators to charge for membership access.',
    priority: 2,
    status: 'planning',
    timeline: '3 weeks',
    complexity: 'medium',
    businessValue: 'high',
    dependencies: ['Payment Processing Integration'],
    resources: ['1 Frontend developer', '1 Backend developer'],
    risks: [
      {
        description: 'User resistance to paid features',
        severity: 'medium',
        mitigation: 'Clear value proposition, freemium model'
      }
    ],
    icon: Users,
    category: 'monetization'
  },
  {
    id: 'feature-5',
    name: 'Video Conferencing for Virtual Events',
    description: 'Native video conferencing for virtual events and group meetings.',
    priority: 3,
    status: 'planning',
    timeline: '5 weeks',
    complexity: 'high',
    businessValue: 'high',
    dependencies: [],
    resources: ['2 Frontend developers', '1 Backend developer'],
    risks: [
      {
        description: 'Browser compatibility issues',
        severity: 'medium',
        mitigation: 'Extensive cross-browser testing'
      },
      {
        description: 'Performance with many participants',
        severity: 'high',
        mitigation: 'Implement participant limits, optimize for performance'
      }
    ],
    icon: Video,
    category: 'communication'
  },
  {
    id: 'feature-6',
    name: 'Direct Messaging System',
    description: 'Private messaging between users with rich media support.',
    priority: 3,
    status: 'planning',
    timeline: '4 weeks',
    complexity: 'medium',
    businessValue: 'high',
    dependencies: [],
    resources: ['1 Frontend developer', '1 Backend developer'],
    risks: [
      {
        description: 'Message delivery reliability',
        severity: 'medium',
        mitigation: 'Implement retry logic and offline queue'
      },
      {
        description: 'Content moderation challenges',
        severity: 'medium',
        mitigation: 'Reporting system, automated content scanning'
      }
    ],
    icon: MessageCircle,
    category: 'communication'
  },
  {
    id: 'feature-7',
    name: 'Trending People Feature',
    description: 'Highlight users with growing influence and engagement.',
    priority: 4,
    status: 'planning',
    timeline: '2 weeks',
    complexity: 'low',
    businessValue: 'medium',
    dependencies: [],
    resources: ['1 Data analyst', '1 Frontend developer'],
    risks: [
      {
        description: 'Algorithm bias',
        severity: 'medium',
        mitigation: 'Regular review and adjustment of scoring factors'
      },
      {
        description: 'Gaming the system',
        severity: 'low',
        mitigation: 'Anti-spam measures, activity verification'
      }
    ],
    icon: Users,
    category: 'analytics'
  },
  {
    id: 'feature-8',
    name: 'Advanced Analytics Dashboard',
    description: 'Comprehensive analytics for user engagement, content performance, and platform health.',
    priority: 4,
    status: 'planning',
    timeline: '4 weeks',
    complexity: 'high',
    businessValue: 'high',
    dependencies: [],
    resources: ['1 Data engineer', '1 Frontend developer'],
    risks: [
      {
        description: 'Performance impact of complex queries',
        severity: 'medium',
        mitigation: 'Implement data aggregation and caching'
      },
      {
        description: 'Data privacy concerns',
        severity: 'medium',
        mitigation: 'Anonymize sensitive data, clear permissions'
      }
    ],
    icon: BarChart3,
    category: 'analytics'
  },
  {
    id: 'feature-9',
    name: 'Content Recommendation Engine',
    description: 'Personalized content recommendations based on user interests and behavior.',
    priority: 5,
    status: 'planning',
    timeline: '6 weeks',
    complexity: 'high',
    businessValue: 'high',
    dependencies: [],
    resources: ['1 ML engineer', '1 Frontend developer', '1 Backend developer'],
    risks: [
      {
        description: 'Cold start problem for new users',
        severity: 'medium',
        mitigation: 'Interest-based onboarding, popular content fallback'
      },
      {
        description: 'Filter bubbles',
        severity: 'medium',
        mitigation: 'Diversity metrics in recommendation algorithm'
      }
    ],
    icon: Zap,
    category: 'content'
  },
  {
    id: 'feature-10',
    name: 'Enhanced Media Gallery',
    description: 'Improved media management with albums, collections, and advanced search.',
    priority: 5,
    status: 'planning',
    timeline: '3 weeks',
    complexity: 'medium',
    businessValue: 'medium',
    dependencies: [],
    resources: ['1 Frontend developer'],
    risks: [
      {
        description: 'Storage limitations',
        severity: 'medium',
        mitigation: 'Implement compression, storage quotas'
      },
      {
        description: 'Upload performance',
        severity: 'low',
        mitigation: 'Chunked uploads, progress indicators'
      }
    ],
    icon: FileText,
    category: 'content'
  }
];

// Sprint data
const sprints: Sprint[] = [
  {
    id: 'sprint-1',
    name: 'Sprint 1',
    startDate: '2025-01-01',
    endDate: '2025-01-14',
    features: ['feature-1', 'feature-2']
  },
  {
    id: 'sprint-2',
    name: 'Sprint 2',
    startDate: '2025-01-15',
    endDate: '2025-01-28',
    features: ['feature-2', 'feature-3', 'feature-7']
  },
  {
    id: 'sprint-3',
    name: 'Sprint 3',
    startDate: '2025-01-29',
    endDate: '2025-02-11',
    features: ['feature-3', 'feature-4', 'feature-6']
  },
  {
    id: 'sprint-4',
    name: 'Sprint 4',
    startDate: '2025-02-12',
    endDate: '2025-02-25',
    features: ['feature-4', 'feature-6', 'feature-5']
  },
  {
    id: 'sprint-5',
    name: 'Sprint 5',
    startDate: '2025-02-26',
    endDate: '2025-03-11',
    features: ['feature-5', 'feature-8', 'feature-10']
  },
  {
    id: 'sprint-6',
    name: 'Sprint 6',
    startDate: '2025-03-12',
    endDate: '2025-03-25',
    features: ['feature-5', 'feature-8', 'feature-10']
  },
  {
    id: 'sprint-7',
    name: 'Sprint 7',
    startDate: '2025-03-26',
    endDate: '2025-04-08',
    features: ['feature-9']
  },
  {
    id: 'sprint-8',
    name: 'Sprint 8',
    startDate: '2025-04-09',
    endDate: '2025-04-22',
    features: ['feature-9']
  }
];

// Milestone data
const milestones: Milestone[] = [
  {
    id: 'milestone-1',
    name: 'Core Experience Enhancement',
    date: '2025-01-28',
    description: 'Improve the fundamental user experience with language settings, help center, and trending features',
    features: ['feature-1', 'feature-2', 'feature-7']
  },
  {
    id: 'milestone-2',
    name: 'Monetization Launch',
    date: '2025-02-25',
    description: 'Introduce revenue-generating features with payment processing and premium groups',
    features: ['feature-3', 'feature-4']
  },
  {
    id: 'milestone-3',
    name: 'Communication Platform Expansion',
    date: '2025-03-25',
    description: 'Enhance user interaction with direct messaging, video conferencing, and media management',
    features: ['feature-5', 'feature-6', 'feature-10']
  },
  {
    id: 'milestone-4',
    name: 'Intelligence & Insights Release',
    date: '2025-04-22',
    description: 'Deliver personalized experiences and data-driven insights',
    features: ['feature-8', 'feature-9']
  }
];

// Resource allocation data
const resources = [
  { role: 'Frontend Developer', count: 2, allocation: 'UI implementation across all features' },
  { role: 'Backend Developer', count: 1, allocation: 'API development, database integration' },
  { role: 'Data Engineer/Analyst', count: 1, allocation: 'Analytics, recommendation engine' },
  { role: 'ML Engineer', count: 1, allocation: 'Content recommendation algorithms (part-time)' },
  { role: 'QA Tester', count: 1, allocation: 'Testing across all features' },
  { role: 'Content Writer', count: 1, allocation: 'Help center documentation (part-time)' },
  { role: 'Security Specialist', count: 1, allocation: 'Payment integration security (part-time)' }
];

// QA checkpoints
const qaCheckpoints = [
  {
    name: 'Pre-Development Review',
    timing: 'Before each feature',
    tasks: [
      'Requirements validation',
      'Technical approach review',
      'Security assessment'
    ]
  },
  {
    name: 'Development Milestones',
    timing: 'During implementation',
    tasks: [
      'Code reviews at 50% and 90% completion',
      'Performance testing',
      'Security scanning'
    ]
  },
  {
    name: 'Pre-Release Testing',
    timing: 'After implementation',
    tasks: [
      'Functional testing',
      'Integration testing',
      'User acceptance testing',
      'Accessibility compliance'
    ]
  },
  {
    name: 'Post-Release Monitoring',
    timing: 'After deployment',
    tasks: [
      'Error tracking',
      'Performance monitoring',
      'User feedback collection'
    ]
  }
];

// Helper function to get features for a specific category
const getFeaturesByCategory = (category: string) => {
  return features.filter(feature => feature.category === category);
};

// Helper function to get features for a specific sprint
const getFeaturesBySprint = (sprintId: string) => {
  const sprint = sprints.find(s => s.id === sprintId);
  if (!sprint) return [];
  return sprint.features.map(featureId => features.find(f => f.id === featureId)).filter(Boolean) as Feature[];
};

// Helper function to get features for a specific milestone
const getFeaturesByMilestone = (milestoneId: string) => {
  const milestone = milestones.find(m => m.id === milestoneId);
  if (!milestone) return [];
  return milestone.features.map(featureId => features.find(f => f.id === featureId)).filter(Boolean) as Feature[];
};

// Helper function to get color for priority
const getPriorityColor = (priority: number) => {
  switch (priority) {
    case 1: return 'bg-red-500';
    case 2: return 'bg-orange-500';
    case 3: return 'bg-yellow-500';
    case 4: return 'bg-blue-500';
    case 5: return 'bg-green-500';
    default: return 'bg-gray-500';
  }
};

// Helper function to get color for status
const getStatusColor = (status: string) => {
  switch (status) {
    case 'planning': return 'bg-blue-500/10 text-blue-400';
    case 'in-progress': return 'bg-yellow-500/10 text-yellow-400';
    case 'testing': return 'bg-purple-500/10 text-purple-400';
    case 'completed': return 'bg-green-500/10 text-green-400';
    default: return 'bg-gray-500/10 text-gray-400';
  }
};

// Helper function to get color for complexity
const getComplexityColor = (complexity: string) => {
  switch (complexity) {
    case 'low': return 'bg-green-500/10 text-green-400';
    case 'medium': return 'bg-yellow-500/10 text-yellow-400';
    case 'high': return 'bg-red-500/10 text-red-400';
    default: return 'bg-gray-500/10 text-gray-400';
  }
};

// Helper function to get color for business value
const getBusinessValueColor = (value: string) => {
  switch (value) {
    case 'low': return 'bg-blue-500/10 text-blue-400';
    case 'medium': return 'bg-purple-500/10 text-purple-400';
    case 'high': return 'bg-pink-500/10 text-pink-400';
    default: return 'bg-gray-500/10 text-gray-400';
  }
};

// Helper function to get color for risk severity
const getRiskSeverityColor = (severity: string) => {
  switch (severity) {
    case 'low': return 'bg-green-500/10 text-green-400';
    case 'medium': return 'bg-yellow-500/10 text-yellow-400';
    case 'high': return 'bg-red-500/10 text-red-400';
    default: return 'bg-gray-500/10 text-gray-400';
  }
};

export function ImplementationPlanPage() {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<'features' | 'timeline' | 'resources' | 'qa'>('features');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedFeature, setExpandedFeature] = useState<string | null>(null);
  const [expandedSprint, setExpandedSprint] = useState<string | null>(null);
  const [expandedMilestone, setExpandedMilestone] = useState<string | null>(null);

  // Filter features based on category and search query
  const filteredFeatures = features.filter(feature => {
    const matchesCategory = selectedCategory === 'all' || feature.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      feature.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feature.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Toggle feature expansion
  const toggleFeatureExpansion = (featureId: string) => {
    if (expandedFeature === featureId) {
      setExpandedFeature(null);
    } else {
      setExpandedFeature(featureId);
    }
  };

  // Toggle sprint expansion
  const toggleSprintExpansion = (sprintId: string) => {
    if (expandedSprint === sprintId) {
      setExpandedSprint(null);
    } else {
      setExpandedSprint(sprintId);
    }
  };

  // Toggle milestone expansion
  const toggleMilestoneExpansion = (milestoneId: string) => {
    if (expandedMilestone === milestoneId) {
      setExpandedMilestone(null);
    } else {
      setExpandedMilestone(milestoneId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-white">
              Feature Implementation Plan
            </h1>
            <p className="text-dark-400">
              Comprehensive roadmap for upcoming platform features
            </p>
          </div>
        </div>
      </div>

      {/* View Selector */}
      <div className="flex space-x-1 bg-dark-800 rounded-xl p-1">
        <Button
          variant={activeView === 'features' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setActiveView('features')}
          className="flex items-center space-x-2"
        >
          <Layers className="w-4 h-4" />
          <span>Features</span>
        </Button>
        <Button
          variant={activeView === 'timeline' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setActiveView('timeline')}
          className="flex items-center space-x-2"
        >
          <Calendar className="w-4 h-4" />
          <span>Timeline</span>
        </Button>
        <Button
          variant={activeView === 'resources' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setActiveView('resources')}
          className="flex items-center space-x-2"
        >
          <Users className="w-4 h-4" />
          <span>Resources</span>
        </Button>
        <Button
          variant={activeView === 'qa' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setActiveView('qa')}
          className="flex items-center space-x-2"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>QA Process</span>
        </Button>
      </div>

      {/* Features View */}
      {activeView === 'features' && (
        <div className="space-y-6">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-dark-400" />
                <input
                  type="text"
                  placeholder="Search features..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-dark-700 rounded-xl bg-dark-800 text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-2 overflow-x-auto">
              <Button
                variant={selectedCategory === 'all' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('all')}
              >
                All Features
              </Button>
              <Button
                variant={selectedCategory === 'core' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('core')}
              >
                Core Experience
              </Button>
              <Button
                variant={selectedCategory === 'monetization' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('monetization')}
              >
                Monetization
              </Button>
              <Button
                variant={selectedCategory === 'communication' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('communication')}
              >
                Communication
              </Button>
              <Button
                variant={selectedCategory === 'analytics' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('analytics')}
              >
                Analytics
              </Button>
              <Button
                variant={selectedCategory === 'content' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('content')}
              >
                Content
              </Button>
            </div>
          </div>

          {/* Features List */}
          <div className="space-y-4">
            {filteredFeatures.map((feature) => (
              <Card key={feature.id} className="overflow-hidden">
                <div 
                  className="p-6 cursor-pointer"
                  onClick={() => toggleFeatureExpansion(feature.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-xl bg-${feature.category === 'core' ? 'primary' : feature.category === 'monetization' ? 'green' : feature.category === 'communication' ? 'blue' : feature.category === 'analytics' ? 'purple' : 'orange'}-500/10`}>
                        <feature.icon className={`w-6 h-6 text-${feature.category === 'core' ? 'primary' : feature.category === 'monetization' ? 'green' : feature.category === 'communication' ? 'blue' : feature.category === 'analytics' ? 'purple' : 'orange'}-400`} />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-lg font-semibold text-white">{feature.name}</h3>
                          <div className={`w-2 h-2 rounded-full ${getPriorityColor(feature.priority)}`} title={`Priority ${feature.priority}`}></div>
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(feature.status)}`}>
                            {feature.status.replace('-', ' ')}
                          </span>
                        </div>
                        <p className="text-dark-300">{feature.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-dark-400" />
                          <span className="text-dark-300">{feature.timeline}</span>
                        </div>
                      </div>
                      {expandedFeature === feature.id ? (
                        <ChevronUp className="w-5 h-5 text-dark-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-dark-400" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Feature Details */}
                {expandedFeature === feature.id && (
                  <div className="px-6 pb-6 pt-2 border-t border-dark-800 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-4">
                        <h4 className="text-sm font-medium text-dark-300">Details</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-dark-400">Priority:</span>
                            <span className="text-white">P{feature.priority}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-dark-400">Timeline:</span>
                            <span className="text-white">{feature.timeline}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-dark-400">Complexity:</span>
                            <span className={`text-xs px-2 py-1 rounded-full ${getComplexityColor(feature.complexity)}`}>
                              {feature.complexity}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-dark-400">Business Value:</span>
                            <span className={`text-xs px-2 py-1 rounded-full ${getBusinessValueColor(feature.businessValue)}`}>
                              {feature.businessValue}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-sm font-medium text-dark-300">Resources & Dependencies</h4>
                        <div className="space-y-2">
                          <div>
                            <span className="text-dark-400">Resources:</span>
                            <ul className="mt-1 space-y-1">
                              {feature.resources.map((resource, index) => (
                                <li key={index} className="text-white text-sm">• {resource}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <span className="text-dark-400">Dependencies:</span>
                            {feature.dependencies.length > 0 ? (
                              <ul className="mt-1 space-y-1">
                                {feature.dependencies.map((dependency, index) => (
                                  <li key={index} className="text-white text-sm">• {dependency}</li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-white text-sm mt-1">None</p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-sm font-medium text-dark-300">Risks & Mitigation</h4>
                        <div className="space-y-3">
                          {feature.risks.map((risk, index) => (
                            <div key={index} className="bg-dark-800/50 rounded-lg p-3">
                              <div className="flex items-start space-x-2">
                                <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5" />
                                <div>
                                  <div className="flex items-center space-x-2">
                                    <p className="text-white text-sm">{risk.description}</p>
                                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${getRiskSeverityColor(risk.severity)}`}>
                                      {risk.severity}
                                    </span>
                                  </div>
                                  <p className="text-dark-400 text-xs mt-1">Mitigation: {risk.mitigation}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>

          {filteredFeatures.length === 0 && (
            <div className="text-center py-12">
              <Layers className="w-12 h-12 text-dark-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">
                No features found
              </h3>
              <p className="text-dark-400">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>
      )}

      {/* Timeline View */}
      {activeView === 'timeline' && (
        <div className="space-y-8">
          {/* Sprints */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white">Implementation Schedule</h2>
            <div className="space-y-4">
              {sprints.map((sprint) => (
                <Card key={sprint.id} className="overflow-hidden">
                  <div 
                    className="p-6 cursor-pointer"
                    onClick={() => toggleSprintExpansion(sprint.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 rounded-xl bg-primary-500/10">
                          <Calendar className="w-6 h-6 text-primary-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">{sprint.name}</h3>
                          <p className="text-dark-400">{sprint.startDate} to {sprint.endDate}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-dark-300">{sprint.features.length} features</span>
                        {expandedSprint === sprint.id ? (
                          <ChevronUp className="w-5 h-5 text-dark-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-dark-400" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Sprint Details */}
                  {expandedSprint === sprint.id && (
                    <div className="px-6 pb-6 pt-2 border-t border-dark-800">
                      <div className="space-y-4">
                        <h4 className="text-sm font-medium text-dark-300">Features in this sprint</h4>
                        <div className="space-y-3">
                          {getFeaturesBySprint(sprint.id).map((feature) => (
                            <div key={feature.id} className="bg-dark-800/50 rounded-lg p-4">
                              <div className="flex items-start space-x-3">
                                <feature.icon className="w-5 h-5 text-primary-400 mt-0.5" />
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                      <h5 className="font-medium text-white">{feature.name}</h5>
                                      <div className={`w-2 h-2 rounded-full ${getPriorityColor(feature.priority)}`} title={`Priority ${feature.priority}`}></div>
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(feature.status)}`}>
                                      {feature.status.replace('-', ' ')}
                                    </span>
                                  </div>
                                  <p className="text-dark-300 text-sm mt-1">{feature.description}</p>
                                  <div className="flex items-center space-x-4 mt-2 text-sm">
                                    <div className="flex items-center space-x-1">
                                      <Clock className="w-3 h-3 text-dark-400" />
                                      <span className="text-dark-400">{feature.timeline}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <Users className="w-3 h-3 text-dark-400" />
                                      <span className="text-dark-400">{feature.resources.length} resources</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>

          {/* Milestones */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white">Major Milestones</h2>
            <div className="space-y-4">
              {milestones.map((milestone) => (
                <Card key={milestone.id} className="overflow-hidden">
                  <div 
                    className="p-6 cursor-pointer"
                    onClick={() => toggleMilestoneExpansion(milestone.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 rounded-xl bg-accent-500/10">
                          <Flag className="w-6 h-6 text-accent-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">{milestone.name}</h3>
                          <p className="text-dark-400">Target: {milestone.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-dark-300">{milestone.features.length} features</span>
                        {expandedMilestone === milestone.id ? (
                          <ChevronUp className="w-5 h-5 text-dark-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-dark-400" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Milestone Details */}
                  {expandedMilestone === milestone.id && (
                    <div className="px-6 pb-6 pt-2 border-t border-dark-800">
                      <div className="space-y-4">
                        <p className="text-dark-300">{milestone.description}</p>
                        <h4 className="text-sm font-medium text-dark-300">Features in this milestone</h4>
                        <div className="space-y-3">
                          {getFeaturesByMilestone(milestone.id).map((feature) => (
                            <div key={feature.id} className="bg-dark-800/50 rounded-lg p-4">
                              <div className="flex items-start space-x-3">
                                <feature.icon className="w-5 h-5 text-accent-400 mt-0.5" />
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                      <h5 className="font-medium text-white">{feature.name}</h5>
                                      <div className={`w-2 h-2 rounded-full ${getPriorityColor(feature.priority)}`} title={`Priority ${feature.priority}`}></div>
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(feature.status)}`}>
                                      {feature.status.replace('-', ' ')}
                                    </span>
                                  </div>
                                  <p className="text-dark-300 text-sm mt-1">{feature.description}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Resources View */}
      {activeView === 'resources' && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-white">Resource Allocation</h2>
          <Card className="p-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {resources.map((resource, index) => (
                  <div key={index} className="bg-dark-800/50 rounded-xl p-5">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="p-2 bg-primary-500/10 rounded-lg">
                        <Users className="w-5 h-5 text-primary-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{resource.role}</h3>
                        <p className="text-dark-400 text-sm">{resource.count} {resource.count > 1 ? 'people' : 'person'}</p>
                      </div>
                    </div>
                    <p className="text-dark-300 text-sm">{resource.allocation}</p>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-dark-800">
                <h3 className="text-lg font-semibold text-white mb-4">Resource Distribution by Feature</h3>
                <div className="space-y-4">
                  {features.map((feature) => (
                    <div key={feature.id} className="flex items-center space-x-4">
                      <div className="w-8 h-8 rounded-lg bg-dark-800 flex items-center justify-center">
                        <feature.icon className="w-4 h-4 text-dark-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-white">{feature.name}</h4>
                          <span className="text-dark-400 text-sm">{feature.timeline}</span>
                        </div>
                        <div className="mt-1 flex flex-wrap gap-2">
                          {feature.resources.map((resource, index) => (
                            <span key={index} className="text-xs px-2 py-1 bg-dark-800 text-dark-300 rounded-full">
                              {resource}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* QA Process View */}
      {activeView === 'qa' && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-white">Quality Assurance Checkpoints</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {qaCheckpoints.map((checkpoint, index) => (
              <Card key={index} className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 rounded-xl bg-primary-500/10">
                      <CheckCircle2 className="w-6 h-6 text-primary-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{checkpoint.name}</h3>
                      <p className="text-dark-400">{checkpoint.timing}</p>
                    </div>
                  </div>
                  <ul className="space-y-2 pl-4">
                    {checkpoint.tasks.map((task, taskIndex) => (
                      <li key={taskIndex} className="text-dark-300 flex items-start space-x-2">
                        <span className="text-primary-400 text-lg leading-none">•</span>
                        <span>{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            ))}
          </div>

          <Card className="p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Feature Testing Requirements</h3>
              <div className="space-y-6">
                {features.slice(0, 5).map((feature) => (
                  <div key={feature.id} className="border-b border-dark-800 pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center space-x-3 mb-3">
                      <feature.icon className="w-5 h-5 text-primary-400" />
                      <h4 className="font-medium text-white">{feature.name}</h4>
                    </div>
                    <div className="pl-8">
                      <ul className="space-y-2">
                        {feature.id === 'feature-1' && (
                          <>
                            <li className="text-dark-300 text-sm">• Verify all UI elements display correctly in each supported language</li>
                            <li className="text-dark-300 text-sm">• Test date/time formatting across regions</li>
                            <li className="text-dark-300 text-sm">• Validate language persistence across sessions</li>
                          </>
                        )}
                        {feature.id === 'feature-2' && (
                          <>
                            <li className="text-dark-300 text-sm">• Verify search functionality returns relevant results</li>
                            <li className="text-dark-300 text-sm">• Test ticket submission workflow</li>
                            <li className="text-dark-300 text-sm">• Validate mobile responsiveness</li>
                          </>
                        )}
                        {feature.id === 'feature-3' && (
                          <>
                            <li className="text-dark-300 text-sm">• Test complete payment flows</li>
                            <li className="text-dark-300 text-sm">• Verify subscription lifecycle (creation, billing, cancellation)</li>
                            <li className="text-dark-300 text-sm">• Test error handling and recovery</li>
                          </>
                        )}
                        {feature.id === 'feature-4' && (
                          <>
                            <li className="text-dark-300 text-sm">• Test access control for paid vs free users</li>
                            <li className="text-dark-300 text-sm">• Verify payment allocation to group owners</li>
                            <li className="text-dark-300 text-sm">• Test subscription renewal and cancellation</li>
                          </>
                        )}
                        {feature.id === 'feature-5' && (
                          <>
                            <li className="text-dark-300 text-sm">• Test across different network conditions</li>
                            <li className="text-dark-300 text-sm">• Verify multi-participant functionality</li>
                            <li className="text-dark-300 text-sm">• Test screen sharing and controls</li>
                          </>
                        )}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}