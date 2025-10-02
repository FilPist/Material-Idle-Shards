import React, { useState, useRef, useEffect } from 'react';

interface BuyAmountSelectorProps {
  amount: 1 | 10 | 'Max';
  setAmount: (amount: 1 | 10 | 'Max') => void;
  t: (key: string, replacements?: { [key: string]: string | number }) => string;
}

export const BuyAmountSelector: React.FC<BuyAmountSelectorProps> = ({ amount, setAmount, t }) => {
    const options: (1 | 10 | 'Max')[] = [1, 10, 'Max'];
    const selectorRef = useRef<HTMLDivElement>(null);
    const [pillStyle, setPillStyle] = useState({});

    useEffect(() => {
        if (selectorRef.current) {
            const selectedIndex = options.indexOf(amount);
            const selectedButton = selectorRef.current.children[selectedIndex + 1] as HTMLElement; // +1 to skip the pill div
            if (selectedButton) {
                setPillStyle({
                    left: `${selectedButton.offsetLeft}px`,
                    width: `${selectedButton.offsetWidth}px`,
                });
            }
        }
    }, [amount, options]);

    return (
        <div ref={selectorRef} className="buy-amount-selector bg-slate-200/80 dark:bg-slate-800/50 rounded-full p-1 flex items-center justify-center gap-1">
            <div className="buy-amount-selector-pill" style={pillStyle}></div>
            {options.map(opt => (
                <button 
                    key={opt} 
                    onClick={() => setAmount(opt)} 
                    className={`px-4 py-1.5 rounded-full text-sm font-bold transition-colors duration-300 w-full ${amount === opt ? 'text-violet-700 dark:text-slate-100' : 'text-slate-600 dark:text-slate-300'}`}
                >
                    {t('buy_amount', { amount: opt })}
                </button>
            ))}
        </div>
    );
};
