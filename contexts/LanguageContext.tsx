import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

// Define the shape of the context
interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string, replacements?: { [key: string]: string | number }) => string;
}

// Create the context with a default value
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Define the props for the provider
interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState(localStorage.getItem('language') || 'en');
  const [translations, setTranslations] = useState<{ [key: string]: any }>({});

  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const response = await fetch(`./locales/${language}.json`);
        if (!response.ok) {
            console.error(`Failed to load translations for ${language}`);
            // Fallback to English if current language fails
            if (language !== 'en') {
                const enResponse = await fetch(`./locales/en.json`);
                const enData = await enResponse.json();
                setTranslations(enData);
            }
            return;
        }
        const data = await response.json();
        setTranslations(data);
      } catch (error) {
        console.error('Error loading translation file:', error);
      }
    };
    loadTranslations();
  }, [language]);

  const setLanguage = (lang: string) => {
    localStorage.setItem('language', lang);
    setLanguageState(lang);
  };

  const t = useCallback((key: string, replacements?: { [key: string]: string | number }): string => {
    let translation = key.split('.').reduce((acc, currentKey) => {
      return acc && acc[currentKey] ? acc[currentKey] : null;
    }, translations);

    if (translation === null) {
      // console.warn(`Translation not found for key: ${key}`);
      return key; // Return the key itself if not found
    }

    if (typeof translation === 'string' && replacements) {
      Object.keys(replacements).forEach(placeholder => {
        const regex = new RegExp(`{{${placeholder}}}`, 'g');
        translation = (translation as string).replace(regex, String(replacements[placeholder]));
      });
    }

    return translation as string;
  }, [translations]);

  const value = { language, setLanguage, t };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
