"use client";

import { useState, useEffect } from 'react';

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

export const useLanguage = () => {
  const [texts, setTexts] = useState<LanguageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadLanguage = async () => {
      try {
        setLoading(true);
        const response = await fetch('/json/language/es.json');
        if (!response.ok) {
          throw new Error('Failed to load language file');
        }
        const data = await response.json();
        setTexts(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setTexts(null);
      } finally {
        setLoading(false);
      }
    };

    loadLanguage();
  }, []);

  return { texts, loading, error };
};