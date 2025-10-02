import React, { useMemo, useState } from 'react';
import { useGameHook } from '../../hooks/useGame';
import { SINGULARITY_GRID_NODES } from '../../data/singularity';
import { SingularityIcon } from '../icons';
import { formatNumber } from '../../utils/format';

const Tooltip: React.FC<{ node: any, purchased: boolean, canAfford: boolean, t: any, onPurchase: any }> = ({ node, purchased, canAfford, t, onPurchase }) => {
    return (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 w-64 bg-slate-800/90 backdrop-blur-sm text-white p-4 rounded-lg shadow-2xl z-20 tooltip">
            <h4 className="font-bold text-lg text-cyan-300">{t(node.nameKey)}</h4>
            <p className="text-sm opacity-90 mt-1">{t(node.descriptionKey)}</p>
            <div className="mt-3 pt-3 border-t border-cyan-300/20">
                {purchased ? (
                    <div className="text-center font-bold text-green-400">{t('unlocked')}</div>
                ) : (
                    <>
                        <div className="flex items-center justify-between text-sm">
                            <span className="font-semibold opacity-80">Cost:</span>
                            <span className="font-bold flex items-center gap-1">
                                <SingularityIcon className="w-4 h-4 text-cyan-300"/> {formatNumber(node.cost)}
                            </span>
                        </div>
                         <button 
                            onClick={() => onPurchase(node.id)} 
                            disabled={!canAfford}
                            className="w-full mt-2 px-4 py-2 rounded-lg text-white font-bold transition-all active:scale-95 bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-500 disabled:cursor-not-allowed"
                        >
                            {t('unlocked')}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export const SingularityGridPanel: React.FC<{game: useGameHook, t: (key: string) => string}> = ({ game, t }) => {
    const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
    const { purchasedSingularityNodeIds, singularityEssence } = game;

    const nodeMap = useMemo(() => new Map(SINGULARITY_GRID_NODES.map(node => [node.id, node])), []);

    return (
        <div className="relative w-full h-full min-h-[400px] bg-slate-100 dark:bg-slate-900/50 rounded-lg overflow-hidden">
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0">
                <defs>
                    <linearGradient id="lineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style={{ stopColor: '#22d3ee', stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: '#a5f3fc', stopOpacity: 1 }} />
                    </linearGradient>
                </defs>
                {/* Lines */}
                {SINGULARITY_GRID_NODES.map(node =>
                    node.prerequisites.map(prereqId => {
                        const prereqNode = nodeMap.get(prereqId);
                        if (!prereqNode) return null;

                        const isUnlocked = purchasedSingularityNodeIds.includes(node.id);
                        const prereqIsUnlocked = purchasedSingularityNodeIds.includes(prereqId);

                        return (
                            <line
                                key={`${prereqId}-${node.id}`}
                                x1={prereqNode.position.x}
                                y1={prereqNode.position.y}
                                x2={node.position.x}
                                y2={node.position.y}
                                stroke={prereqIsUnlocked ? 'url(#lineGrad)' : '#475569'}
                                strokeWidth="0.8"
                                className="grid-line"
                                strokeDasharray={isUnlocked ? "0" : "1"}
                                strokeDashoffset={isUnlocked ? "0" : "1"}
                                style={{transitionDelay: isUnlocked ? '0.3s' : '0s'}}
                            />
                        );
                    })
                )}
            </svg>

            {/* Nodes */}
            {SINGULARITY_GRID_NODES.map(node => {
                const isPurchased = purchasedSingularityNodeIds.includes(node.id);
                const canPurchase = node.cost <= singularityEssence && node.prerequisites.every(p => purchasedSingularityNodeIds.includes(p));
                const isAvailable = !isPurchased && node.prerequisites.every(p => purchasedSingularityNodeIds.includes(p));

                return (
                    <div
                        key={node.id}
                        className="absolute -translate-x-1/2 -translate-y-1/2"
                        style={{ left: `${node.position.x}%`, top: `${node.position.y}%` }}
                        onMouseEnter={() => setHoveredNodeId(node.id)}
                        onMouseLeave={() => setHoveredNodeId(null)}
                    >
                        <button 
                            disabled={!canPurchase}
                            onClick={() => game.handleBuySingularityNode(node.id)}
                            className={`w-10 h-10 flex items-center justify-center rounded-full transform transition-all duration-300 relative group
                                ${isPurchased ? 'grid-node-purchased' : ''}
                                ${canPurchase ? 'hover:scale-110' : ''}
                                ${!isPurchased && !isAvailable ? 'opacity-50' : ''}
                            `}
                        >
                            {/* Rings */}
                            <div className={`absolute w-full h-full rounded-full border-2 ${isPurchased ? 'border-cyan-400' : 'border-slate-500'} grid-node-ring`}/>
                            <div className={`absolute w-[65%] h-[65%] rounded-full border ${isPurchased ? 'border-cyan-400/80' : 'border-slate-500/80'} grid-node-ring`} style={{animationDirection: 'reverse', animationDuration: '15s'}}/>

                            {/* Core */}
                            <div className={`w-[40%] h-[40%] rounded-full grid-node-core ${isPurchased ? 'bg-cyan-300 shadow-[0_0_15px] shadow-cyan-300' : isAvailable ? 'bg-white animate-pulse' : 'bg-slate-600'}`}/>
                        </button>

                        {hoveredNodeId === node.id && (
                             <Tooltip node={node} purchased={isPurchased} canAfford={canPurchase} t={t} onPurchase={game.handleBuySingularityNode} />
                        )}
                    </div>
                );
            })}
        </div>
    );
};