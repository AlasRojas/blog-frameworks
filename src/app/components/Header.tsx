"use client";

import ReactCountryFlag from 'react-country-flag';
import { useLanguage } from '../contexts/LanguageContext';

export default function Header() {
  const { texts, loading, changeLanguage, currentLanguage } = useLanguage();
  
  const handleLanguageChange = (language: 'es' | 'en' | 'fr') => {
    changeLanguage(language);
  };

  if (loading || !texts) {
    return (
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-gray-900 font-sans">
                Cargando...
              </h1>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Title */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-gray-900 font-sans">
              {texts.header.title}
            </h1>
          </div>

          {/* Language/Country Selector */}
          <div className="flex space-x-3">
            <button
              onClick={() => handleLanguageChange('es')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border ${
                currentLanguage === 'es'
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50 border-transparent hover:border-gray-200'
              }`}
            >
              <ReactCountryFlag countryCode="ES" svg style={{ width: '1.2em', height: '1.2em' }} />
              <span>ES</span>
            </button>
            
            <button
              onClick={() => handleLanguageChange('en')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border ${
                currentLanguage === 'en'
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50 border-transparent hover:border-gray-200'
              }`}
            >
              <ReactCountryFlag countryCode="GB" svg style={{ width: '1.2em', height: '1.2em' }} />
              <span>EN</span>
            </button>
            
            <button
              onClick={() => handleLanguageChange('fr')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border ${
                currentLanguage === 'fr'
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50 border-transparent hover:border-gray-200'
              }`}
            >
              <ReactCountryFlag countryCode="FR" svg style={{ width: '1.2em', height: '1.2em' }} />
              <span>FR</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}