import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Bot, 
  User, 
  Lightbulb, 
  Code, 
  Palette, 
  TrendingUp, 
  MessageCircle,
  Sparkles,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  Minimize2,
  Maximize2,
  X,
  Mic,
  MicOff,
  FileText,
  Image,
  Link
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Avatar } from '../ui/Avatar';
import { useAuthStore } from '../../store/auth';
import { formatRelativeTime } from '../../lib/utils';
import { slideUp, fadeIn } from '../../lib/animations';

interface AIMessage {
  id: string;
  content: string;
  type: 'user' | 'ai';
  timestamp: Date;
  category?: 'business' | 'technical' | 'design' | 'general';
  suggestions?: string[];
  attachments?: {
    type: 'code' | 'image' | 'link';
    content: string;
    title?: string;
  }[];
  feedback?: 'helpful' | 'not_helpful' | null;
}

interface AIAssistantProps {
  isMinimized?: boolean;
  onToggleMinimize?: () => void;
  onClose?: () => void;
}

const quickPrompts = [
  {
    category: 'business',
    icon: TrendingUp,
    title: 'Business Strategy',
    prompts: [
      'Help me validate my startup idea',
      'Review my pitch deck structure',
      'Analyze my target market',
      'Suggest growth strategies'
    ]
  },
  {
    category: 'technical',
    icon: Code,
    title: 'Technical Guidance',
    prompts: [
      'Review my system architecture',
      'Recommend tech stack for my project',
      'Best practices for scalability',
      'Code optimization suggestions'
    ]
  },
  {
    category: 'design',
    icon: Palette,
    title: 'Design Feedback',
    prompts: [
      'Evaluate my UI design',
      'Improve user experience flow',
      'Design system recommendations',
      'Accessibility audit'
    ]
  }
];

const aiResponses = {
  business: [
    "Great question about business strategy! Let me break this down into actionable steps:\n\n**Immediate Actions:**\n• Validate your core assumptions with potential customers\n• Analyze 3-5 direct competitors and their positioning\n• Define your unique value proposition clearly\n\n**Market Research:**\n• Conduct 10-15 customer interviews\n• Survey your target demographic\n• Test pricing sensitivity\n\n**Next Steps:**\n• Create an MVP to test core features\n• Establish key metrics to track\n• Build a go-to-market strategy\n\nWould you like me to dive deeper into any of these areas?",
    
    "Excellent pitch deck question! Here's a proven structure that resonates with investors:\n\n**Essential Slides (10-12 total):**\n1. Problem - Clear, relatable pain point\n2. Solution - Your unique approach\n3. Market Size - TAM, SAM, SOM breakdown\n4. Product Demo - Show, don't just tell\n5. Business Model - Revenue streams\n6. Traction - Key metrics and growth\n7. Competition - Competitive advantage\n8. Team - Why you'll win\n9. Financials - 3-year projections\n10. Funding Ask - Specific use of funds\n\n**Pro Tips:**\n• Keep slides visual and minimal text\n• Tell a compelling story\n• Practice the 2-minute elevator version\n\nNeed help with any specific slide?"
  ],
  
  technical: [
    "Great technical question! Let me provide a comprehensive analysis:\n\n**Architecture Recommendations:**\n• **Frontend:** React/Next.js for scalability\n• **Backend:** Node.js with Express or Python with FastAPI\n• **Database:** PostgreSQL for relational data, Redis for caching\n• **Infrastructure:** AWS/Vercel for deployment\n\n**Best Practices:**\n• Implement microservices for complex systems\n• Use TypeScript for better code quality\n• Set up CI/CD pipelines early\n• Monitor performance with tools like Sentry\n\n**Scalability Considerations:**\n• Design for horizontal scaling\n• Implement proper caching strategies\n• Use CDN for static assets\n• Plan for database sharding if needed\n\nWhat's your current tech stack and main challenges?",
    
    "Excellent code review question! Here's my systematic approach:\n\n**Code Quality Checklist:**\n• **Readability:** Clear variable names, proper comments\n• **Performance:** Efficient algorithms, minimal re-renders\n• **Security:** Input validation, authentication checks\n• **Testing:** Unit tests, integration tests coverage\n\n**Architecture Review:**\n• Separation of concerns\n• DRY principle adherence\n• Proper error handling\n• Consistent coding standards\n\n**Optimization Opportunities:**\n• Bundle size reduction\n• Database query optimization\n• Caching implementation\n• Memory leak prevention\n\nShare your code and I'll provide specific feedback!"
  ],
  
  design: [
    "Fantastic design question! Let me provide a comprehensive UX evaluation:\n\n**Visual Hierarchy Analysis:**\n• **Typography:** Ensure clear heading structure (H1-H6)\n• **Color:** Use contrast ratios of 4.5:1 minimum\n• **Spacing:** Consistent 8px grid system\n• **Layout:** F-pattern or Z-pattern for content flow\n\n**User Experience Flow:**\n• Reduce cognitive load with progressive disclosure\n• Implement clear call-to-action buttons\n• Ensure intuitive navigation patterns\n• Add loading states and error handling\n\n**Accessibility Considerations:**\n• WCAG 2.1 AA compliance\n• Keyboard navigation support\n• Screen reader compatibility\n• Motion sensitivity options\n\n**Design System Recommendations:**\n• Create reusable component library\n• Establish consistent color palette\n• Define typography scale\n• Document interaction patterns\n\nWould you like me to review specific screens or components?",
    
    "Great accessibility question! Here's a comprehensive audit approach:\n\n**Technical Accessibility:**\n• **Semantic HTML:** Proper heading structure, landmarks\n• **ARIA Labels:** Descriptive labels for interactive elements\n• **Keyboard Navigation:** Tab order, focus indicators\n• **Color Contrast:** 4.5:1 for normal text, 3:1 for large text\n\n**User Experience Accessibility:**\n• **Motion:** Respect prefers-reduced-motion\n• **Text:** Scalable fonts, readable line height\n• **Interactive Elements:** 44px minimum touch targets\n• **Error Handling:** Clear, actionable error messages\n\n**Testing Tools:**\n• axe-core for automated testing\n• WAVE browser extension\n• Screen reader testing (NVDA, JAWS)\n• Keyboard-only navigation testing\n\n**Implementation Priority:**\n1. Fix critical issues (color contrast, keyboard nav)\n2. Add semantic markup\n3. Implement ARIA where needed\n4. Test with real users\n\nNeed help with specific accessibility challenges?"
  ]
};

export function AIAssistant({ isMinimized = false, onToggleMinimize, onClose }: AIAssistantProps) {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: '1',
      content: "👋 Hi there! I'm your AI assistant, here to help with business strategy, technical guidance, and design feedback.\n\nI can help you with:\n• **Business Strategy** - Startup validation, market analysis, growth strategies\n• **Technical Guidance** - Architecture, tech stack, best practices\n• **Design Feedback** - UI/UX evaluation, accessibility, design systems\n\nWhat would you like to work on today?",
      type: 'ai',
      timestamp: new Date(),
      category: 'general',
      suggestions: [
        'Help me validate my startup idea',
        'Review my system architecture',
        'Evaluate my UI design',
        'Analyze my target market'
      ]
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const detectCategory = (message: string): 'business' | 'technical' | 'design' | 'general' => {
    const businessKeywords = ['startup', 'business', 'market', 'strategy', 'revenue', 'pitch', 'investor', 'growth'];
    const technicalKeywords = ['code', 'architecture', 'database', 'api', 'framework', 'performance', 'security'];
    const designKeywords = ['design', 'ui', 'ux', 'interface', 'user', 'accessibility', 'visual', 'layout'];
    
    const lowerMessage = message.toLowerCase();
    
    if (businessKeywords.some(keyword => lowerMessage.includes(keyword))) return 'business';
    if (technicalKeywords.some(keyword => lowerMessage.includes(keyword))) return 'technical';
    if (designKeywords.some(keyword => lowerMessage.includes(keyword))) return 'design';
    
    return 'general';
  };

  const generateAIResponse = (userMessage: string, category: 'business' | 'technical' | 'design' | 'general'): string => {
    if (category === 'general') {
      return "I'd be happy to help! Could you provide more specific details about what you're working on? This will help me give you more targeted and actionable advice.\n\nFor example:\n• **Business questions:** What industry, target market, or specific challenge?\n• **Technical questions:** What technology stack, specific problem, or architecture concern?\n• **Design questions:** What type of interface, user flow, or design challenge?\n\nThe more context you provide, the better I can assist you!";
    }
    
    const responses = aiResponses[category];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      content: inputValue,
      type: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const category = detectCategory(inputValue);
      const aiResponse = generateAIResponse(inputValue, category);
      
      const aiMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        type: 'ai',
        timestamp: new Date(),
        category,
        suggestions: category !== 'general' ? [
          'Can you elaborate on this?',
          'What are the next steps?',
          'Any potential challenges?',
          'How do I implement this?'
        ] : undefined,
        feedback: null
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  const handleQuickPrompt = (prompt: string) => {
    setInputValue(prompt);
    inputRef.current?.focus();
  };

  const handleSuggestion = (suggestion: string) => {
    setInputValue(suggestion);
    inputRef.current?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFeedback = (messageId: string, feedback: 'helpful' | 'not_helpful') => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, feedback } : msg
    ));
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const toggleVoiceInput = () => {
    setIsListening(!isListening);
    // Voice input implementation would go here
  };

  if (isMinimized) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="fixed bottom-4 right-4 z-50"
      >
        <Button
          onClick={onToggleMinimize}
          className="w-14 h-14 rounded-full bg-primary-500 hover:bg-primary-600 shadow-lg flex items-center justify-center"
        >
          <Bot className="w-6 h-6 text-white" />
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-4 right-4 w-96 h-[600px] z-50 flex flex-col bg-dark-900 border border-dark-800 rounded-2xl shadow-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-dark-800 bg-gradient-to-r from-primary-500 to-accent-500">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white">AI Assistant</h3>
            <p className="text-xs text-white/80">Business • Tech • Design</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleMinimize}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10"
          >
            <Minimize2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Quick Prompts */}
      {messages.length <= 1 && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 border-b border-dark-800"
        >
          <div className="grid grid-cols-3 gap-2">
            {quickPrompts.map((category, index) => (
              <motion.button
                key={category.category}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedCategory(
                  selectedCategory === category.category ? null : category.category
                )}
                className={`p-2 rounded-lg text-xs transition-colors ${
                  selectedCategory === category.category
                    ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                    : 'bg-dark-800 text-dark-300 hover:bg-dark-700 hover:text-white'
                }`}
              >
                <category.icon className="w-4 h-4 mx-auto mb-1" />
                <div className="font-medium">{category.title}</div>
              </motion.button>
            ))}
          </div>
          
          <AnimatePresence>
            {selectedCategory && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 space-y-1"
              >
                {quickPrompts
                  .find(cat => cat.category === selectedCategory)
                  ?.prompts.map((prompt, index) => (
                    <motion.button
                      key={prompt}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleQuickPrompt(prompt)}
                      className="w-full text-left p-2 text-xs bg-dark-800/50 hover:bg-dark-700 text-dark-300 hover:text-white rounded-lg transition-colors"
                    >
                      {prompt}
                    </motion.button>
                  ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              variants={slideUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: index * 0.1 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex space-x-2 max-w-[85%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className="flex-shrink-0">
                  {message.type === 'user' ? (
                    <Avatar
                      src={user?.avatar}
                      alt={user?.displayName}
                      size="sm"
                      fallback={user?.displayName?.charAt(0)}
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
                
                <div className={`rounded-2xl px-4 py-3 ${
                  message.type === 'user'
                    ? 'bg-primary-500 text-white'
                    : 'bg-dark-800 text-white'
                }`}>
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {message.content}
                  </div>
                  
                  <div className="flex items-center justify-between mt-2">
                    <span className={`text-xs ${
                      message.type === 'user' ? 'text-primary-100' : 'text-dark-400'
                    }`}>
                      {formatRelativeTime(message.timestamp)}
                    </span>
                    
                    {message.type === 'ai' && (
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(message.content)}
                          className="p-1 text-dark-400 hover:text-white"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleFeedback(message.id, 'helpful')}
                          className={`p-1 ${
                            message.feedback === 'helpful' 
                              ? 'text-green-400' 
                              : 'text-dark-400 hover:text-green-400'
                          }`}
                        >
                          <ThumbsUp className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleFeedback(message.id, 'not_helpful')}
                          className={`p-1 ${
                            message.feedback === 'not_helpful' 
                              ? 'text-red-400' 
                              : 'text-dark-400 hover:text-red-400'
                          }`}
                        >
                          <ThumbsDown className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Suggestions */}
        {messages.length > 1 && messages[messages.length - 1]?.suggestions && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-2"
          >
            {messages[messages.length - 1].suggestions!.map((suggestion, index) => (
              <motion.button
                key={suggestion}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleSuggestion(suggestion)}
                className="px-3 py-1.5 text-xs bg-dark-800 hover:bg-dark-700 text-dark-300 hover:text-white rounded-full transition-colors border border-dark-700 hover:border-dark-600"
              >
                {suggestion}
              </motion.button>
            ))}
          </motion.div>
        )}

        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="flex space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-dark-800 rounded-2xl px-4 py-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-dark-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-dark-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-dark-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-dark-800">
        <div className="flex items-end space-x-2">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about business, tech, or design..."
              className="w-full px-4 py-3 pr-12 bg-dark-800 border border-dark-700 rounded-xl text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none transition-all duration-200"
              rows={1}
              style={{ minHeight: '44px', maxHeight: '120px' }}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleVoiceInput}
              className={`absolute right-2 top-2 p-2 ${
                isListening ? 'text-red-400' : 'text-dark-400 hover:text-white'
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>
          </div>
          
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            className="p-3 bg-primary-500 hover:bg-primary-600 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex items-center justify-between mt-2 text-xs text-dark-500">
          <span>Press Enter to send, Shift+Enter for new line</span>
          <span>{inputValue.length}/2000</span>
        </div>
      </div>
    </motion.div>
  );
}