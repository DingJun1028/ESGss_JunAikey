
import React from 'react';
import { Heart, Globe, ArrowRight, Coins, Users, Target, ShieldCheck } from 'lucide-react';
import { Language } from '../types';
import { useToast } from '../contexts/ToastContext';
import { useCompany } from './providers/CompanyProvider';
import { UniversalPageHeader } from './UniversalPageHeader';

interface FundraisingProps {
  language: Language;
}

export const Fundraising: React.FC<FundraisingProps> = ({ language }) => {
  const isZh = language === 'zh-TW';
  const { addToast } = useToast();
  const { goodwillBalance, updateGoodwillBalance, addAuditLog } = useCompany();

  const pageData = {
      title: { zh: '善向募資', en: 'ESG Fundraising' },
      desc: { zh: '將善向幣轉化為真實世界的影響力', en: 'Convert Goodwill Coins into Real-world Impact' },
      tag: { zh: '社會影響力', en: 'Social Impact' }
  };

  const projects = [
      {
          id: 1,
          title: isZh ? '海洋清理計畫' : 'The Ocean Cleanup',
          org: 'Ocean Cleanup Foundation',
          desc: isZh ? '部署先進技術清除太平洋垃圾帶的塑膠廢棄物。' : 'Deploying advanced technology to rid the oceans of plastic.',
          target: 50000,
          current: 32450,
          image: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=500&q=80',
          color: 'text-blue-400',
          bgColor: 'bg-blue-500',
          verified: true
      },
      {
          id: 2,
          title: isZh ? '亞馬遜雨林復育' : 'Amazon Reforestation',
          org: 'Rainforest Alliance',
          desc: isZh ? '每捐贈 100 GWC 可種植一棵原生樹木。結合衛星監測確保存活率，修復地球之肺。' : 'Plant native trees with satellite monitoring. 100 GWC = 1 Tree. Restoring the Earth\'s lungs.',
          target: 100000,
          current: 68900,
          image: 'https://images.unsplash.com/photo-1596396263076-24ee82877b63?w=800&q=80',
          color: 'text-emerald-400',
          bgColor: 'bg-emerald-500',
          verified: true
      },
      {
          id: 3,
          title: isZh ? '偏鄉綠能教育' : 'Rural Green Education',
          org: 'Teach For Taiwan',
          desc: isZh ? '為偏鄉學校提供太陽能設備與永續課程教材，賦能下一代氣候領袖。' : 'Providing solar kits and sustainability curriculum to rural schools.',
          target: 25000,
          current: 12050,
          image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=500&q=80',
          color: 'text-celestial-gold',
          bgColor: 'bg-celestial-gold',
          verified: true
      }
  ];

  const handleDonate = (projectTitle: string) => {
      const amount = 100;
      if (goodwillBalance >= amount) {
          updateGoodwillBalance(-amount);
          addAuditLog('Donation', `Donated ${amount} GWC to ${projectTitle}`);
          addToast('success', isZh ? `感謝您的愛心！已捐贈 ${amount} GWC` : `Thank you! Donated ${amount} GWC`, 'Fundraising');
      } else {
          addToast('error', isZh ? '餘額不足' : 'Insufficient GWC', 'System');
      }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
        <UniversalPageHeader 
            icon={Heart}
            title={pageData.title}
            description={pageData.desc}
            language={language}
            tag={pageData.tag}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => {
                const progress = (project.current / project.target) * 100;
                return (
                    <div key={project.id} className="glass-panel rounded-2xl overflow-hidden flex flex-col group border-white/10 hover:border-white/20 transition-all">
                        <div className="h-48 relative overflow-hidden">
                            <img src={project.image} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60" />
                            
                            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white flex items-center gap-1 border border-white/10">
                                <Globe className="w-3 h-3" /> NGO
                            </div>
                            
                            {project.verified && (
                                <div className="absolute bottom-4 left-4 flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-1 rounded-full border border-emerald-500/30 backdrop-blur-sm">
                                    <ShieldCheck className="w-3 h-3" />
                                    {isZh ? '區塊鏈驗證' : 'Verified Impact'}
                                </div>
                            )}
                        </div>
                        <div className="p-6 flex-1 flex flex-col">
                            <div className="text-xs text-gray-400 mb-1 flex justify-between items-center">
                                {project.org}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                            <p className="text-sm text-gray-300 mb-6 flex-1 leading-relaxed">
                                {project.desc}
                            </p>
                            
                            <div className="space-y-2 mb-6">
                                <div className="flex justify-between text-xs font-bold">
                                    <span className={project.color}>{project.current.toLocaleString()} GWC</span>
                                    <span className="text-gray-500">{project.target.toLocaleString()} GWC</span>
                                </div>
                                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                                    <div className={`h-full ${project.bgColor} transition-all duration-1000`} style={{ width: `${progress}%` }} />
                                </div>
                                <div className="text-right text-[10px] text-gray-500">{progress.toFixed(1)}% {isZh ? '已達成' : 'Funded'}</div>
                            </div>

                            <button 
                                onClick={() => handleDonate(project.title)}
                                className={`w-full py-3 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 ${project.bgColor}`}
                            >
                                <Coins className="w-4 h-4" />
                                {isZh ? '捐贈 100 GWC' : 'Donate 100 GWC'}
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>

        {/* Impact Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-white/10">
            <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
                <div className="p-3 bg-celestial-gold/10 rounded-full text-celestial-gold"><Coins className="w-6 h-6"/></div>
                <div>
                    <div className="text-2xl font-bold text-white">1.2M</div>
                    <div className="text-xs text-gray-400">{isZh ? '總捐贈 GWC' : 'Total GWC Donated'}</div>
                </div>
            </div>
            <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
                <div className="p-3 bg-emerald-500/10 rounded-full text-emerald-400"><Users className="w-6 h-6"/></div>
                <div>
                    <div className="text-2xl font-bold text-white">8,450</div>
                    <div className="text-xs text-gray-400">{isZh ? '參與捐贈人數' : 'Unique Donors'}</div>
                </div>
            </div>
            <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
                <div className="p-3 bg-blue-500/10 rounded-full text-blue-400"><Target className="w-6 h-6"/></div>
                <div>
                    <div className="text-2xl font-bold text-white">24</div>
                    <div className="text-xs text-gray-400">{isZh ? '完成專案' : 'Projects Completed'}</div>
                </div>
            </div>
        </div>
    </div>
  );
};
