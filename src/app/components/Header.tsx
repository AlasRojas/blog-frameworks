"use client";

import ReactCountryFlag from 'react-country-flag';

export default function Header() {
  const handleCountryClick = (country: string) => {
    console.log(country);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Title */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-gray-900 font-sans">
              Blog Frameworks
            </h1>
          </div>

          {/* Language/Country Selector */}
          <div className="flex space-x-3">
            <button
              onClick={() => handleCountryClick('España')}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200 border border-transparent hover:border-gray-200"
            >
              <ReactCountryFlag countryCode="ES" svg style={{ width: '1.2em', height: '1.2em' }} />
              <span>ES</span>
            </button>
            
            <button
              onClick={() => handleCountryClick('Inglaterra')}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200 border border-transparent hover:border-gray-200"
            >
              <ReactCountryFlag countryCode="GB" svg style={{ width: '1.2em', height: '1.2em' }} />
              <span>EN</span>
            </button>
            
            <button
              onClick={() => handleCountryClick('Francia')}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200 border border-transparent hover:border-gray-200"
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