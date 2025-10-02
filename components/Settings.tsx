import React, { useState } from 'react';
import { useGameHook } from '../hooks/useGame';
import { SettingsIcon } from './icons';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

interface SettingsProps {
  game: useGameHook;
  t: (key: string, replacements?: { [key: string]: string | number }) => string;
}

const ToggleSwitch: React.FC<{ checked: boolean; onChange: () => void; }> = ({ checked, onChange }) => (
    <label className="ToggleSwitch">
        <input type="checkbox" checked={checked} onChange={onChange} />
        <span className="slider"></span>
    </label>
);

export const Settings: React.FC<SettingsProps> = ({ game, t }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 left-6 w-14 h-14 bg-white dark:bg-slate-800 rounded-full shadow-lg flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-violet-600 dark:hover:text-violet-500 hover:shadow-xl transition-all duration-300 transform active:scale-90 z-40"
        aria-label="Open Settings"
      >
        <SettingsIcon className="w-8 h-8" />
      </button>

      {isOpen && (
        <div 
            className="fixed bottom-24 left-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl shadow-2xl w-full max-w-xs p-4 text-slate-800 dark:text-slate-100 settings-panel z-30"
        >
             <h3 className="font-bold text-lg mb-3 px-1">{t('settings.title')}</h3>
             
             <div className="space-y-2">
                <div className="flex items-center justify-between p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5">
                    <p className="font-semibold">{t('settings.language')}</p>
                    <div className="flex items-center gap-1 bg-slate-200 dark:bg-slate-700 p-1 rounded-full">
                        <button onClick={() => setLanguage('en')} className={`px-3 py-1 text-sm font-bold rounded-full ${language === 'en' ? 'bg-violet-500 text-white' : 'hover:bg-slate-300/50 dark:hover:bg-slate-600/50'}`}>EN</button>
                        <button onClick={() => setLanguage('it')} className={`px-3 py-1 text-sm font-bold rounded-full ${language === 'it' ? 'bg-violet-500 text-white' : 'hover:bg-slate-300/50 dark:hover:bg-slate-600/50'}`}>IT</button>
                    </div>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5">
                    <p className="font-semibold">{t('settings.theme')}</p>
                    <ToggleSwitch checked={theme === 'dark'} onChange={toggleTheme} />
                </div>

                <div className="pt-2">
                    <button 
                        onClick={game.togglePause}
                        className="w-full text-left px-3 py-2.5 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 font-semibold transition-colors"
                    >
                        {game.isPaused ? t('settings.resume') : t('settings.pause')}
                    </button>
                    <button 
                        onClick={game.saveGame} 
                        className="w-full text-left mt-2 px-3 py-2.5 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 font-semibold transition-colors"
                    >
                        {t('settings.save')}
                    </button>
                    <button 
                        onClick={game.hardReset} 
                        className="w-full text-left mt-2 px-3 py-2.5 rounded-lg bg-red-500/20 dark:bg-red-500/20 hover:bg-red-500/30 dark:hover:bg-red-500/30 font-semibold transition-colors text-red-700 dark:text-red-400"
                    >
                        {t('settings.reset')}
                    </button>
                </div>
             </div>
        </div>
      )}
    </>
  );
};