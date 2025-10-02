import React from 'react';
import { useGameHook } from '../hooks/useGame';
import { formatNumber, formatDuration } from '../utils/format';
import { PrestigeIcon, AutomationIcon, SingularityIcon, BoltIcon, StarIcon } from './icons';
import { Challenge, Generator } from '../types';

interface ModalProps {
  game: useGameHook;
  t: (key: string, replacements?: { [key: string]: string | number }) => string;
}

export const PrestigeModal: React.FC<ModalProps> = ({ game, t }) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 modal-backdrop p-4">
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl max-w-md w-full text-center modal-content">
      <PrestigeIcon className="w-16 h-16 text-amber-500 mx-auto mb-4" />
      <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">{t('modal.prestige_title')}</h2>
      <p className="text-slate-600 dark:text-slate-300 mt-2">{t('modal.prestige_desc')}</p>
      <div className="bg-violet-50 dark:bg-violet-900/30 border border-violet-200 dark:border-violet-800/50 rounded-xl p-4 mt-6">
        <p className="text-slate-600 dark:text-slate-300">{t('modal.prestige_gain')}</p>
        <p className="text-4xl font-extrabold text-violet-600 dark:text-violet-400 my-1">{formatNumber(game.relicsOnPrestige)}</p>
        <p className="font-bold text-violet-600 dark:text-violet-400">{t('modal.prestige_relics')}</p>
      </div>
      <div className="flex gap-3 mt-8">
        <button onClick={() => game.setShowPrestigeModal(false)} className="flex-1 px-6 py-3 rounded-full text-slate-700 dark:text-slate-200 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 font-bold transition-all active:scale-95">{t('modal.cancel')}</button>
        <button onClick={game.handlePrestige} className="flex-1 px-6 py-3 rounded-full text-white bg-violet-600 hover:bg-violet-700 font-bold transition-all active:scale-95">{t('modal.confirm')}</button>
      </div>
    </div>
  </div>
);

export const AscensionModal: React.FC<ModalProps> = ({ game, t }) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 modal-backdrop p-4">
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl max-w-md w-full text-center modal-content">
      <SingularityIcon className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
      <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">{t('modal.ascension_title')}</h2>
      <p className="text-slate-600 dark:text-slate-300 mt-2">{t('modal.ascension_desc')}</p>
      <div className="bg-cyan-50 dark:bg-cyan-900/30 border border-cyan-200 dark:border-cyan-800/50 rounded-xl p-4 mt-6">
        <p className="text-slate-600 dark:text-slate-300">{t('modal.ascension_gain')}</p>
        <p className="text-4xl font-extrabold text-cyan-600 dark:text-cyan-400 my-1">{formatNumber(game.essenceOnAscension)}</p>
        <p className="font-bold text-cyan-600 dark:text-cyan-400">{t('modal.ascension_essence')}</p>
      </div>
      <div className="flex gap-3 mt-8">
        <button onClick={() => game.setShowAscensionModal(false)} className="flex-1 px-6 py-3 rounded-full text-slate-700 dark:text-slate-200 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 font-bold transition-all active:scale-95">{t('modal.cancel')}</button>
        <button onClick={game.handleAscend} className="flex-1 px-6 py-3 rounded-full text-white bg-cyan-600 hover:bg-cyan-700 font-bold transition-all active:scale-95">{t('modal.confirm')}</button>
      </div>
    </div>
  </div>
);

export const OfflineProgressModal: React.FC<ModalProps> = ({ game, t }) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 modal-backdrop p-4">
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl max-w-md w-full text-center modal-content">
      <AutomationIcon className="w-16 h-16 text-teal-500 mx-auto mb-4" />
      <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">{t('modal.offline_title')}</h2>
      <p className="text-slate-600 dark:text-slate-300 mt-2">{t('modal.offline_desc', { time: formatDuration(game.offlineProgress?.time ?? 0) })}</p>
      <div className="bg-teal-50 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-800/50 rounded-xl p-4 mt-6 text-left space-y-2">
        <div>
            <p className="text-sm font-semibold text-teal-700 dark:text-teal-300">{t('modal.offline_sps_rate')}</p>
            <p className="text-xl font-bold text-teal-600 dark:text-teal-400">
                {formatNumber((game.offlineProgress?.shards ?? 0) / ((game.offlineProgress?.time ?? 1) / 1000))}/s
            </p>
        </div>
        <div>
            <p className="text-sm font-semibold text-teal-700 dark:text-teal-300">{t('modal.offline_total_gain')}</p>
            <p className="text-4xl font-extrabold text-teal-600 dark:text-teal-400">
                +{formatNumber(game.offlineProgress?.shards ?? 0)}
            </p>
        </div>
      </div>
      <button onClick={() => game.setOfflineProgress(null)} className="mt-8 w-full px-6 py-3 rounded-full text-white bg-teal-500 hover:bg-teal-600 font-bold transition-all active:scale-95">{t('modal.continue')}</button>
    </div>
  </div>
);

interface ChallengeConfirmationModalProps {
  challenge: Challenge;
  onConfirm: () => void;
  onCancel: () => void;
  t: (key: string, replacements?: { [key: string]: string | number }) => string;
}
export const ChallengeConfirmationModal: React.FC<ChallengeConfirmationModalProps> = ({ challenge, onConfirm, onCancel, t }) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 modal-backdrop p-4">
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl max-w-md w-full text-center modal-content">
      <BoltIcon className="w-16 h-16 text-violet-500 mx-auto mb-4" />
      <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">{t('modal.challenge_confirm_title', { name: t(challenge.nameKey) })}</h2>
      <div className="text-left space-y-3 text-slate-600 dark:text-slate-300 mt-4 bg-slate-100 dark:bg-slate-900/50 p-4 rounded-xl">
        <p>{t('modal.challenge_confirm_desc')}</p>
        <p>{t('modal.challenge_confirm_reward')}</p>
        <p className="font-semibold text-amber-600 dark:text-amber-400">{t('modal.challenge_confirm_exit')}</p>
      </div>
      <div className="flex gap-3 mt-8">
        <button onClick={onCancel} className="flex-1 px-6 py-3 rounded-full text-slate-700 dark:text-slate-200 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 font-bold transition-all active:scale-95">{t('modal.cancel')}</button>
        <button onClick={onConfirm} className="flex-1 px-6 py-3 rounded-full text-white bg-violet-600 hover:bg-violet-700 font-bold transition-all active:scale-95">{t('modal.start_challenge')}</button>
      </div>
    </div>
  </div>
);

interface EvolutionModalProps {
  generator: Generator;
  onEvolve: (generatorId: string, choiceId: string) => void;
  onClose: () => void;
  t: (key: string, replacements?: { [key: string]: string | number }) => string;
  isPreview?: boolean;
}

export const EvolutionModal: React.FC<EvolutionModalProps> = ({ generator, onEvolve, onClose, t, isPreview }) => {
  const evolution = generator.evolutions?.[0];
  if (!evolution) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 modal-backdrop p-4">
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl max-w-2xl w-full text-center modal-content">
        <StarIcon className="w-16 h-16 text-amber-400 mx-auto mb-4" />
        <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">{isPreview ? t('modal.evolve_preview_title') : t('modal.evolve_title')}</h2>
        <p className="text-slate-600 dark:text-slate-300 mt-2">{t('modal.evolve_desc', { name: t(generator.nameKey) })}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 text-left">
          {evolution.choices.map(choice => (
            <div key={choice.id} className={`bg-slate-100 dark:bg-slate-900/50 rounded-2xl p-4 flex flex-col justify-between ${isPreview ? 'opacity-70' : ''}`}>
              <div>
                <h3 className="font-bold text-xl text-violet-600 dark:text-violet-400">{t(choice.nameKey)}</h3>
                <p className="text-slate-600 dark:text-slate-300 mt-1">{t(choice.descriptionKey)}</p>
              </div>
              <button 
                onClick={() => onEvolve(generator.id, choice.id)}
                disabled={isPreview}
                className="w-full mt-4 px-6 py-3 rounded-full text-white bg-violet-600 hover:bg-violet-700 font-bold transition-all active:scale-95 disabled:bg-slate-400 disabled:cursor-not-allowed"
              >
                {t('modal.evolve_choose')}
              </button>
            </div>
          ))}
        </div>
        
        {!isPreview && <p className="text-xs text-slate-500 dark:text-slate-400 mt-6">{t('modal.evolve_warning')}</p>}
        <button onClick={onClose} className="mt-2 text-sm text-slate-500 hover:underline">{isPreview ? t('modal.close') : t('modal.evolve_cancel')}</button>
      </div>
    </div>
  );
};