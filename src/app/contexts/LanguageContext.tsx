"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface LanguageData {
  header: {
    title: string;
    flags: {
      england: string;
      france: string;
      spain: string;
    };
  };
  home: {
    carousel: {
      title: string;
      frameworks: {
        angular: string;
        react: string;
        vue: string;
      };
    };
    explanation: {
      subtitle: string;
      description: string;
    };
    example: {
      title: string;
      description: string;
    };
    topics: {
      loading: string;
      error: string;
      empty: string;
    };
  };
  topic: {
    navigation: {
      back: string;
    };
    error: {
      title: string;
      notFound: string;
      backButton: string;
    };
    sections: {
      technicalExplanation: string;
      practicalExample: string;
      codeComparison: string;
      similarities: string;
      differences: string;
    };
  };
  modal: {
    title: string;
  };
  metadata: {
    title: string;
    description: string;
  };
}

type Language = 'es' | 'en' | 'fr';

interface LanguageContextType {
  currentLanguage: Language;
  texts: LanguageData | null;
  loading: boolean;
  error: string | null;
  changeLanguage: (language: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('es');
  const [texts, setTexts] = useState<LanguageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadLanguage = async (language: Language) => {
    try {
      setLoading(true);
      const response = await fetch(`/json/language/${language}.json`);
      if (!response.ok) {
        throw new Error(`Failed to load ${language} language file`);
      }
      const data = await response.json();
      setTexts(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      // Fallback to Spanish if other language fails
      if (language !== 'es') {
        try {
          const fallbackResponse = await fetch('/json/language/es.json');
          if (fallbackResponse.ok) {
            const fallbackData = await fallbackResponse.json();
            setTexts(fallbackData);
            setCurrentLanguage('es');
          }
        } catch {
          setTexts(null);
        }
      } else {
        setTexts(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const changeLanguage = (language: Language) => {
    setCurrentLanguage(language);
    loadLanguage(language);
  };

  useEffect(() => {
    loadLanguage(currentLanguage);
  }, []);

  const value: LanguageContextType = {
    currentLanguage,
    texts,
    loading,
    error,
    changeLanguage,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};