import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Code, Palette, TrendingUp, Lightbulb, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Avatar } from '../components/ui/Avatar';
import { useAuthStore } from '../store/auth';
import { formatRelativeTime } from '../lib/utils';
import { slideUp, fadeIn } from '../lib/animations';
import type { ChatMessage } from '../types';

// Enhanced AI responses with specialized knowledge
const aiKnowledgeBase = {
  business: {
    responses: [
      {
        trigger: ['startup', 'business idea', 'validate'],
        response: "Great question about startup validation! Here's a systematic approach:\n\n**Customer Discovery (Week 1-2):**\n• Interview 15-20 potential customers\n• Ask about their current pain points\n• Understand their existing solutions\n• Validate problem-solution fit\n\n**Market Research (Week 3-4):**\n• Analyze 3-5 direct competitors\n• Study pricing models in your space\n• Calculate Total Addressable Market (TAM)\n• Identify market gaps and opportunities\n\n**MVP Testing (Week 5-8):**\n• Build minimum viable product\n• Test with early adopters\n• Measure key metrics (retention, engagement)\n• Iterate based on feedback\n\n**Key Validation Metrics:**\n• Problem-solution fit: 40%+ say they'd be 'very disappointed' without your solution\n• Product-market fit: Organic growth, low churn, strong engagement\n• Business model validation: Customers willing to pay\n\nWould you like me to dive deeper into any of these validation steps?"
      },
      {
        trigger: ['pitch deck', 'investor', 'funding'],
        response: "Excellent pitch deck question! Here's the proven structure that gets investor attention:\n\n**The 10-Slide Framework:**\n1. **Problem** (30 seconds) - Clear, relatable pain point\n2. **Solution** (60 seconds) - Your unique approach\n3. **Market Size** (30 seconds) - TAM, SAM, SOM with bottom-up analysis\n4. **Product Demo** (90 seconds) - Show, don't just tell\n5. **Business Model** (45 seconds) - Clear revenue streams\n6. **Traction** (60 seconds) - Key metrics showing growth\n7. **Competition** (30 seconds) - Competitive advantages\n8. **Team** (45 seconds) - Why you'll execute successfully\n9. **Financials** (60 seconds) - 3-year realistic projections\n10. **Funding Ask** (45 seconds) - Specific use of funds\n\n**Pro Tips for Success:**\n• Tell a compelling story, not just facts\n• Use visuals over text (6x6 rule max)\n• Practice the 2-minute elevator version\n• Prepare for the 'So what?' question on every slide\n• Have detailed appendix for follow-up questions\n\n**Common Mistakes to Avoid:**\n• Overestimating market size\n• Underestimating competition\n• Vague financial projections\n• Too much text on slides\n\nNeed help with any specific slide or pitch strategy?"
      }
    ]
  },
  technical: {
    responses: [
      {
        trigger: ['architecture', 'system design', 'scalability'],
        response: "Great system architecture question! Let me break down a scalable approach:\n\n**Frontend Architecture:**\n• **Framework:** React/Next.js for SSR and performance\n• **State Management:** Zustand for simple state, Redux Toolkit for complex\n• **Styling:** Tailwind CSS for consistency and speed\n• **Build Tool:** Vite for fast development\n\n**Backend Architecture:**\n• **API Layer:** Node.js with Express or Python with FastAPI\n• **Database:** PostgreSQL for ACID compliance, Redis for caching\n• **Authentication:** JWT with refresh tokens, OAuth for social login\n• **File Storage:** AWS S3 or Cloudinary for media\n\n**Infrastructure & DevOps:**\n• **Hosting:** Vercel/Netlify for frontend, AWS/Railway for backend\n• **CI/CD:** GitHub Actions for automated testing and deployment\n• **Monitoring:** Sentry for error tracking, Analytics for user behavior\n• **CDN:** CloudFlare for global content delivery\n\n**Scalability Patterns:**\n• **Horizontal Scaling:** Load balancers, microservices architecture\n• **Caching Strategy:** Redis for sessions, CDN for static assets\n• **Database Optimization:** Indexing, query optimization, read replicas\n• **API Design:** RESTful with GraphQL for complex queries\n\n**Security Best Practices:**\n• Input validation and sanitization\n• Rate limiting and DDoS protection\n• HTTPS everywhere with proper headers\n• Regular security audits and updates\n\nWhat's your current tech stack and main scaling challenges?"
      },
      {
        trigger: ['code review', 'best practices', 'optimization'],
        response: "Excellent code review question! Here's my comprehensive checklist:\n\n**Code Quality Assessment:**\n• **Readability:** Clear variable names, consistent formatting\n• **Maintainability:** DRY principle, single responsibility\n• **Performance:** Efficient algorithms, minimal complexity\n• **Security:** Input validation, SQL injection prevention\n\n**Architecture Review:**\n• **Separation of Concerns:** Clear layer boundaries\n• **Design Patterns:** Appropriate pattern usage\n• **Error Handling:** Graceful failure management\n• **Testing:** Unit tests, integration tests, coverage\n\n**Performance Optimization:**\n• **Frontend:** Bundle size, lazy loading, image optimization\n• **Backend:** Database queries, caching, API efficiency\n• **Network:** Minimize requests, compression, CDN usage\n• **Memory:** Leak prevention, garbage collection optimization\n\n**Security Checklist:**\n• Authentication and authorization\n• Data encryption (at rest and in transit)\n• Input sanitization and validation\n• Dependency vulnerability scanning\n\n**Code Review Process:**\n1. **Automated Checks:** Linting, testing, security scans\n2. **Manual Review:** Logic, architecture, edge cases\n3. **Performance Testing:** Load testing, profiling\n4. **Documentation:** Code comments, API documentation\n\n**Tools I Recommend:**\n• **Static Analysis:** ESLint, Prettier, SonarQube\n• **Testing:** Jest, Cypress, Playwright\n• **Performance:** Lighthouse, WebPageTest\n• **Security:** Snyk, OWASP ZAP\n\nShare your code and I'll provide specific, actionable feedback!"
      }
    ]
  },
  design: {
    responses: [
      {
        trigger: ['ui design', 'user interface', 'visual design'],
        response: "Fantastic UI design question! Let me provide a comprehensive evaluation framework:\n\n**Visual Hierarchy Analysis:**\n• **Typography:** Clear heading structure (H1-H6), readable font sizes (16px+ for body)\n• **Color System:** Consistent palette with proper contrast ratios (4.5:1 minimum)\n• **Spacing:** 8px grid system for consistent rhythm\n• **Layout:** F-pattern or Z-pattern for optimal content flow\n\n**Design System Components:**\n• **Buttons:** Primary, secondary, ghost variants with clear states\n• **Forms:** Consistent input styling, clear validation states\n• **Navigation:** Intuitive hierarchy, breadcrumbs for deep content\n• **Cards:** Consistent padding, shadows, and border radius\n\n**User Experience Principles:**\n• **Cognitive Load:** Progressive disclosure, chunking information\n• **Feedback:** Loading states, success/error messages, hover effects\n• **Consistency:** Reusable patterns, predictable interactions\n• **Accessibility:** WCAG 2.1 AA compliance, keyboard navigation\n\n**Mobile-First Considerations:**\n• **Touch Targets:** 44px minimum for interactive elements\n• **Responsive Breakpoints:** 320px, 768px, 1024px, 1440px\n• **Performance:** Optimized images, minimal animations\n• **Thumb-Friendly:** Important actions within easy reach\n\n**Design Tools & Workflow:**\n• **Design:** Figma for collaborative design and prototyping\n• **Handoff:** Design tokens, component documentation\n• **Testing:** User testing, A/B testing for key flows\n• **Iteration:** Analytics-driven design improvements\n\n**Common UI Improvements:**\n• Increase white space for better readability\n• Improve button hierarchy and calls-to-action\n• Add micro-interactions for better feedback\n• Optimize form design for higher conversion\n\nWould you like me to review specific screens or components?"
      },
      {
        trigger: ['accessibility', 'a11y', 'wcag'],
        response: "Excellent accessibility question! Here's a comprehensive audit approach:\n\n**Technical Accessibility (WCAG 2.1 AA):**\n• **Semantic HTML:** Proper heading structure, landmarks, lists\n• **ARIA Labels:** Descriptive labels for interactive elements\n• **Keyboard Navigation:** Logical tab order, visible focus indicators\n• **Color Contrast:** 4.5:1 for normal text, 3:1 for large text (18px+)\n\n**Screen Reader Compatibility:**\n• **Alt Text:** Descriptive for informative images, empty for decorative\n• **Form Labels:** Explicit labels for all form controls\n• **Error Messages:** Clear, actionable error descriptions\n• **Dynamic Content:** Proper ARIA live regions for updates\n\n**Motor Accessibility:**\n• **Touch Targets:** 44px minimum size with adequate spacing\n• **Click Areas:** Generous clickable areas for links and buttons\n• **Timeouts:** Sufficient time limits or ability to extend\n• **Motion:** Respect prefers-reduced-motion for animations\n\n**Cognitive Accessibility:**\n• **Clear Language:** Simple, jargon-free content\n• **Consistent Navigation:** Predictable layout and interactions\n• **Error Prevention:** Input validation with helpful suggestions\n• **Help Text:** Context-sensitive assistance\n\n**Testing Tools & Methods:**\n• **Automated:** axe-core, WAVE browser extension, Lighthouse\n• **Manual:** Keyboard-only navigation, screen reader testing\n• **Real Users:** Testing with people who use assistive technology\n• **Color Blindness:** Sim Daltonism, Stark plugin for Figma\n\n**Implementation Priority:**\n1. **Critical Issues:** Color contrast, keyboard navigation\n2. **Semantic Structure:** Headings, landmarks, form labels\n3. **ARIA Enhancement:** Where semantic HTML isn't sufficient\n4. **User Testing:** Validate with real assistive technology users\n\n**Quick Wins:**\n• Add alt text to all images\n• Ensure all interactive elements are keyboard accessible\n• Fix color contrast issues\n• Add focus indicators to interactive elements\n\nNeed help auditing specific components or implementing accessibility features?"
      }
    ]
  }
};

// Enhanced AI response generation
const generateEnhancedAIResponse = (userMessage: string): string => {
  const lowerMessage = userMessage.toLowerCase();
  
  // Check each knowledge area for matching triggers
  for (const [area, knowledge] of Object.entries(aiKnowledgeBase)) {
    for (const responseData of knowledge.responses) {
      if (responseData.trigger.some(trigger => lowerMessage.includes(trigger))) {
        return responseData.response;
      }
    }
  }
  
  // Default helpful response
  return "I'd be happy to help! I specialize in three key areas:\n\n🚀 **Business Strategy**\n• Startup validation and market analysis\n• Pitch deck optimization and investor readiness\n• Growth strategies and business model design\n• Competitive analysis and positioning\n\n💻 **Technical Guidance**\n• System architecture and scalability\n• Code review and best practices\n• Technology stack recommendations\n• Performance optimization strategies\n\n🎨 **Design Feedback**\n• UI/UX evaluation and improvement\n• Design system development\n• Accessibility audits and compliance\n• User experience optimization\n\nCould you provide more specific details about what you're working on? The more context you share, the more targeted and actionable my advice can be!";
};

export function ChatPage() {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: "👋 Welcome to your AI Assistant! I'm here to help founders, tech enthusiasts, and designers succeed.\n\nI can provide expert guidance on:\n• **Business Strategy** - Startup validation, pitch decks, growth strategies\n• **Technical Architecture** - System design, code review, best practices\n• **Design Excellence** - UI/UX evaluation, accessibility, design systems\n\nWhat challenge are you working on today?",
      isAI: true,
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      type: 'text',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputValue,
      senderId: user?.id,
      sender: user || undefined,
      isAI: false,
      timestamp: new Date(),
      type: 'text',
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI thinking time with more realistic delay
    setTimeout(() => {
      const aiResponse = generateEnhancedAIResponse(inputValue);
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        isAI: true,
        timestamp: new Date(),
        type: 'text',
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500 + Math.random() * 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickPrompts = [
    { icon: TrendingUp, text: "Help me validate my startup idea", category: "business" },
    { icon: Code, text: "Review my system architecture", category: "technical" },
    { icon: Palette, text: "Evaluate my UI design", category: "design" },
    { icon: Lightbulb, text: "Optimize my pitch deck", category: "business" },
  ];

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between p-6 border-b border-dark-800 bg-gradient-to-r from-primary-500/10 to-accent-500/10">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">
              AI Assistant
            </h2>
            <p className="text-sm text-dark-400">
              Expert guidance for Business • Tech • Design
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 px-3 py-1 bg-green-500/10 rounded-full">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-400 font-medium">Online</span>
          </div>
        </div>
      </div>

      {/* Quick Prompts */}
      {messages.length <= 1 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 border-b border-dark-800"
        >
          <h3 className="text-sm font-medium text-dark-300 mb-3">Quick Start</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {quickPrompts.map((prompt, index) => (
              <motion.button
                key={prompt.text}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setInputValue(prompt.text)}
                className="flex items-center space-x-3 p-4 bg-dark-800/50 hover:bg-dark-700 rounded-xl transition-colors text-left group"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  prompt.category === 'business' ? 'bg-green-500/10 text-green-400' :
                  prompt.category === 'technical' ? 'bg-blue-500/10 text-blue-400' :
                  'bg-purple-500/10 text-purple-400'
                }`}>
                  <prompt.icon className="w-4 h-4" />
                </div>
                <span className="text-white group-hover:text-primary-400 transition-colors">
                  {prompt.text}
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              variants={slideUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: index * 0.1 }}
              className={`flex ${message.isAI ? 'justify-start' : 'justify-end'}`}
            >
              <div className={`flex space-x-3 max-w-4xl ${message.isAI ? '' : 'flex-row-reverse space-x-reverse'}`}>
                <div className="flex-shrink-0">
                  {message.isAI ? (
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-lg">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                  ) : (
                    <Avatar
                      src={message.sender?.avatar}
                      alt={message.sender?.displayName}
                      size="md"
                      fallback={message.sender?.displayName?.charAt(0)}
                    />
                  )}
                </div>
                
                <div className={`rounded-2xl px-6 py-4 shadow-lg ${
                  message.isAI
                    ? 'bg-dark-800 text-white border border-dark-700'
                    : 'bg-gradient-to-r from-primary-500 to-primary-600 text-white'
                }`}>
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {message.content}
                  </div>
                  <div className={`text-xs mt-3 ${
                    message.isAI ? 'text-dark-400' : 'text-primary-100'
                  }`}>
                    {formatRelativeTime(message.timestamp)}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="flex space-x-3 max-w-4xl">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-lg">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-dark-800 border border-dark-700 rounded-2xl px-6 py-4 shadow-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Enhanced Input */}
      <div className="p-6 border-t border-dark-800 bg-dark-900/50">
        <div className="flex items-end space-x-4">
          <div className="flex-1 relative">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about business strategy, technical architecture, or design..."
              className="w-full px-6 py-4 bg-dark-800 border border-dark-700 rounded-2xl text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none transition-all duration-200 shadow-lg"
              rows={1}
              style={{ minHeight: '56px', maxHeight: '120px' }}
            />
            <div className="absolute bottom-2 right-2 text-xs text-dark-500">
              {inputValue.length}/2000
            </div>
          </div>
          
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            className="px-6 py-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 disabled:opacity-50 shadow-lg"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
        
        <div className="flex items-center justify-between mt-3 text-xs text-dark-500">
          <span>Press Enter to send, Shift+Enter for new line</span>
          <span>Powered by AI • Always learning</span>
        </div>
      </div>
    </div>
  );
}