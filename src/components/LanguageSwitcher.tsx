'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import React from 'react';

const LanguageSwitcher = () => {
  const { lang, toggleLang } = useLanguage();

  return (
    <button onClick={toggleLang} className="language-switcher">
      {lang === 'tr' ? 'EN' : 'TR'}
    </button>
  );
};

export default LanguageSwitcher;
