import React from 'react';
import { ShardIcon } from '../icons';
import { formatNumber } from '../../utils/format';

interface PurchaseButtonProps { 
    cost: number; 
    currency: number; 
    onPurchase: () => void;
    t: (key: string, replacements?: { [key: string]: string | number }) => string;
    buyAmount?: number;
    isPurchased?: boolean;
    currencyIcon?: React.ReactNode;
    className?: string;
}
export const PurchaseButton: React.FC<PurchaseButtonProps> = ({ cost, currency, onPurchase, t, buyAmount, isPurchased, currencyIcon, className }) => {
  const canAfford = currency >= cost;

  if (isPurchased) {
    return (
        <div className={`h-14 px-6 rounded-full text-lg font-bold bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-center flex items-center justify-center ${className}`}>
            {t('owned')}
        </div>
    );
  }
  
  const defaultIcon = <ShardIcon className="w-6 h-6" />;

  return (
    <button
      onClick={onPurchase}
      disabled={!canAfford || (buyAmount !== undefined && buyAmount <= 0)}
      className={`h-14 px-4 rounded-full text-lg font-bold transition-all duration-200 flex items-center justify-center gap-2 transform active:scale-95
        ${canAfford && (buyAmount === undefined || buyAmount > 0)
          ? 'bg-violet-600 hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600 text-white shadow-md'
          : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
        } ${className}`} >
      {buyAmount && buyAmount > 0 && <span className="font-bold text-sm bg-black/10 dark:bg-white/10 rounded-md px-2 py-0.5">{t('buy_amount', {amount: formatNumber(buyAmount)})}</span>}
      {currencyIcon || defaultIcon}
      <span className="font-bold tracking-tight">{formatNumber(cost)}</span>
    </button>
  );
};
