import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AIAssistantContextType {
  isOpen: boolean;
  isMinimized: boolean;
  openAssistant: () => void;
  closeAssistant: () => void;
  toggleMinimize: () => void;
}

const AIAssistantContext = createContext<AIAssistantContextType | undefined>(undefined);

export function useAIAssistant() {
  const context = useContext(AIAssistantContext);
  if (!context) {
    throw new Error('useAIAssistant must be used within an AIAssistantProvider');
  }
  return context;
}

interface AIAssistantProviderProps {
  children: ReactNode;
}

export function AIAssistantProvider({ children }: AIAssistantProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const openAssistant = () => {
    setIsOpen(true);
    setIsMinimized(false);
  };

  const closeAssistant = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  const toggleMinimize = () => {
    if (isMinimized) {
      setIsMinimized(false);
    } else {
      setIsMinimized(true);
    }
  };

  return (
    <AIAssistantContext.Provider value={{
      isOpen,
      isMinimized,
      openAssistant,
      closeAssistant,
      toggleMinimize,
    }}>
      {children}
    </AIAssistantContext.Provider>
  );
}