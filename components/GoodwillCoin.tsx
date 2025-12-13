
import React, { useState, useMemo } from 'react';
import { Language } from '../types';
import { Coins, ArrowUpRight, ArrowDownLeft, ShoppingBag, Package, Sparkles, AlertCircle, Loader2, Wallet, CreditCard } from 'lucide-react';
import { OmniEsgCell } from './OmniEsgCell';
import { useCompany } from './providers/CompanyProvider';
import { useToast } from '../contexts/ToastContext';
import { getEsgCards } from '../constants';
import { withUniversalProxy, InjectedProxyProps } from './hoc/withUniversalProxy';
import { UniversalPageHeader } from './UniversalPageHeader';

interface GoodwillCoinProps {
  language: Language;
}

// ----------------------------------------------------------------------
// Agent: Vault (The Treasury)
// ----------------------------------------------------------------------
interface VaultProps extends InjectedProxyProps {
    goodwillBalance: number;
    isZh: boolean;
    handleTransaction: (type: 'send' | 'receive') => void;
    isTransacting: boolean;
    openingPack: boolean;
}

const VaultBase: React.FC<VaultProps> = ({ 
    goodwillBalance, isZh, handleTransaction, isTransacting, openingPack,
    adaptiveTraits, trackInteraction, isAgentActive
}) => {
    // Agent Visuals
    // 'performance' trait usually means gaining wealth
    const isRich = adaptiveTraits?.includes('performance') || goodwillBalance > 5000;
    const isActive = isAgentActive || isTransacting;

    return (
        <div 
            onClick={() => trackInteraction?.('click')}
            className={`md:col-span-1 glass-panel p-8 rounded-3xl relative overflow-hidden group flex flex-col justify-between h-[300px] border transition-all duration-500
                ${isRich ? 'bg-gradient-to-br from-celestial-gold/20 to-transparent border-celestial-gold/50 shadow-[0_0_30px_rgba(251,191,36,0.2)]' : 'bg-gradient-to-br from-celestial-gold/10 to-transparent border-celestial-gold/30'}
            `}
        >
            <div className={`absolute top-0 right-0 w-32 h-32 bg-celestial-gold/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none transition-transform duration-1000 ${isActive ? 'scale-150 opacity-100' : 'scale-100 opacity-50'}`} />
            
            {/* Holographic Texture */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay" />

            <div>
                <div className="text-sm text-celestial-gold font-medium mb-1 tracking-wider uppercase flex items-center gap-2">
                    <Wallet className="w-4 h-4" />
                    {isZh ? '總資產' : 'Total Assets'}
                </div>
                <div className={`text-5xl font-bold text-white mb-2 tracking-tight font-mono transition-all duration-500 ${isTransacting ? 'animate-pulse' : ''}`}>
                    {goodwillBalance.toLocaleString()} <span className="text-lg text-gray-400 font-normal font-sans">GWC</span>
                </div>
                <div className="text-xs text-gray-400">≈ ${(goodwillBalance * 0.1).toFixed(2)} USD</div>
            </div>
            
            <div className="flex gap-3 relative z-10">
                <button 
                    onClick={(e) => { e.stopPropagation(); handleTransaction('send'); trackInteraction?.('edit'); }}
                    disabled={isTransacting || openingPack}
                    className="flex-1 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    {isTransacting ? <Loader2 className="w-4 h-4 animate-spin"/> : <ArrowUpRight className="w-4 h-4" />} 
                    {isZh ? '轉帳' : 'Send'}
                </button>
                <button 
                    onClick={(e) => { e.stopPropagation(); handleTransaction('receive'); trackInteraction?.('edit'); }}
                    disabled={isTransacting || openingPack}
                    className="flex-1 py-3 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-colors flex items-center justify-center gap-2 border border-white/10 disabled:opacity-50"
                >
                    {isTransacting ? <Loader2 className="w-4 h-4 animate-spin"/> : <ArrowDownLeft className="w-4 h-4" />} 
                    {isZh ? '接收' : 'Request'}
                </button>
            </div>
        </div>
    );
};

const VaultAgent = withUniversalProxy(VaultBase);

// ----------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------

export const GoodwillCoin: React.FC<GoodwillCoinProps> = ({ language }) => {
  const isZh = language === 'zh-TW';
  const { goodwillBalance, updateGoodwillBalance, addAuditLog, unlockCard, collectedCards } = useCompany();
  const { addToast } = useToast();
  const [isTransacting, setIsTransacting] = useState(false);
  const [openingPack, setOpeningPack] = useState(false);

  const pageData = {
      title: { zh: '善向幣市集', en: 'Goodwill Marketplace' },
      desc: { zh: '兌換 ESG 知識卡片與虛擬資產', en: 'Redeem ESG Knowledge Cards & Virtual Assets' },
      tag: { zh: '經濟核心', en: 'Econ Core' }
  };

  // Dynamic Cards
  const ESG_CARDS = useMemo(() => getEsgCards(language), [language]);

  const handleTransaction = (type: 'send' | 'receive') => {
      setIsTransacting(true);
      const amount = Math.floor(Math.random() * 50) + 10;
      
      setTimeout(() => {
          if (type === 'send') {
              if (goodwillBalance < amount) {
                  addToast('error', isZh ? '餘額不足' : 'Insufficient Balance', 'Transaction Failed');
              } else {
                  updateGoodwillBalance(-amount);
                  addAuditLog('GWC Transaction (Send)', `Sent ${amount} GWC to Peer.`);
                  addToast('success', isZh ? `已發送 ${amount} GWC` : `Sent ${amount} GWC`, 'Transaction');
              }
          } else {
              updateGoodwillBalance(amount);
              addAuditLog('GWC Transaction (Receive)', `Received ${amount} GWC reward.`);
              addToast('success', isZh ? `已接收 ${amount} GWC` : `Received ${amount} GWC`, 'Transaction');
          }
          setIsTransacting(false);
      }, 1000);
  };

  const handleBuyPack = (cost: number, packName: string) => {
      if (goodwillBalance < cost) {
          addToast('error', isZh ? '餘額不足' : 'Insufficient GWC', 'Marketplace');
          return;
      }

      setOpeningPack(true);
      updateGoodwillBalance(-cost);
      
      // Simulate Pack Opening Logic with 15 Cards
      setTimeout(() => {
          let unlockedNames = [];
          
          for (let i = 0; i < 15; i++) {
              const availableCards = ESG_CARDS;
              const randomCard = availableCards[Math.floor(Math.random() * availableCards.length)];
              unlockCard(randomCard.id);
              if (i < 3) unlockedNames.push(randomCard.title); // Just capture first few for toast
          }
          
          addAuditLog('Marketplace Purchase', `Bought ${packName} for ${cost} GWC. Acquired 15 cards.`);
          
          addToast('reward', isZh ? `獲得 15 張卡片！包含：${unlockedNames[0]}...` : `Acquired 15 Cards! Includes: ${unlockedNames[0]}...`, 'Pack Opened', 5000);
          setOpeningPack(false);
      }, 2500);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
        <UniversalPageHeader 
            icon={Coins}
            title={pageData.title}
            description={pageData.desc}
            language={language}
            tag={pageData.tag}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Wallet Card (Now Agent) */}
            <VaultAgent 
                id="UserVault"
                label="Digital Vault"
                goodwillBalance={goodwillBalance}
                isZh={isZh}
                handleTransaction={handleTransaction}
                isTransacting={isTransacting}
                openingPack={openingPack}
            />

            {/* Booster Packs */}
            <div className="md:col-span-2 glass-panel p-6 rounded-2xl relative overflow-hidden">
                <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-celestial-purple" />
                    {isZh ? '善向卡牌包 (15張/包)' : 'Card Booster Packs (15/pack)'}
                </h3>
                
                {openingPack && (
                    <div className="absolute inset-0 bg-slate-900/90 z-20 flex flex-col items-center justify-center backdrop-blur-sm animate-fade-in">
                        <Package className="w-16 h-16 text-celestial-gold animate-bounce" />
                        <span className="text-celestial-gold font-bold mt-4 animate-pulse">Opening Pack (15 Cards)...</span>
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Standard Pack */}
                    <div className="p-4 rounded-xl border border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10 transition-all cursor-pointer group relative" onClick={() => handleBuyPack(500, 'Standard Pack')}>
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl pointer-events-none" />
                        <div className="flex justify-between items-start mb-4">
                            <Package className="w-8 h-8 text-blue-400" />
                            <span className="px-2 py-1 bg-white/10 rounded text-xs font-bold text-white">500 GWC</span>
                        </div>
                        <h4 className="font-bold text-white mb-1">Standard Pack</h4>
                        <p className="text-xs text-gray-400">Contains 15 random ESG cards. Great value.</p>
                    </div>

                    {/* Premium Pack */}
                    <div className="p-4 rounded-xl border border-celestial-gold/30 bg-celestial-gold/5 hover:bg-celestial-gold/10 transition-all cursor-pointer group relative" onClick={() => handleBuyPack(1200, 'Premium Pack')}>
                        <div className="absolute inset-0 bg-gradient-to-br from-celestial-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl pointer-events-none" />
                        <div className="flex justify-between items-start mb-4">
                            <Sparkles className="w-8 h-8 text-celestial-gold animate-pulse" />
                            <span className="px-2 py-1 bg-celestial-gold text-black rounded text-xs font-bold">1200 GWC</span>
                        </div>
                        <h4 className="font-bold text-white mb-1 text-transparent bg-clip-text bg-gradient-to-r from-celestial-gold to-amber-200">Premium Pack</h4>
                        <p className="text-xs text-gray-400">15 Cards with higher chance for Epic & Legendary.</p>
                    </div>
                </div>
            </div>
        </div>

        {/* Individual Items */}
        <div>
            <h3 className="text-xl font-bold text-white mb-4">{isZh ? '精選單卡與商品' : 'Featured Cards & Items'}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[1,2,3,4].map(i => (
                    <div key={i} className="glass-panel p-4 rounded-xl border border-white/5 hover:border-white/20 transition-all group cursor-pointer relative" onClick={() => addToast('info', 'Feature coming soon', 'Marketplace')}>
                        <div className="aspect-[3/4] bg-slate-800 rounded-lg mb-4 overflow-hidden relative border border-white/10 group-hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-all">
                            {/* Card Art Placeholder */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                                <div className={`w-12 h-12 rounded-full mb-2 ${i===1 ? 'bg-amber-500/20' : 'bg-white/5'}`}></div>
                                <span className="text-xs font-bold text-gray-500">Mystery Card #{i+100}</span>
                            </div>
                            <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-xs font-bold text-white border border-white/10">
                                {i * 250 + 100} GWC
                            </div>
                        </div>
                        <h4 className="font-semibold text-white mb-1 text-sm truncate">Limited Edition #{i}</h4>
                        <div className="flex items-center gap-1 text-[10px] text-gray-400">
                            <span className={`w-2 h-2 rounded-full ${i===1 ? 'bg-celestial-gold' : 'bg-gray-600'}`}></span>
                            {i===1 ? 'Legendary' : 'Common'}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};
