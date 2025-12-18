
import React, { useState } from 'react';
import { Language } from '../types';
import { Mail, Bug, Lightbulb, MessageSquare, TrendingUp, Send, CheckCircle, User, MessageCircle } from 'lucide-react';
import { UniversalPageHeader } from './UniversalPageHeader';
import { useToast } from '../contexts/ToastContext';

interface ContactUsProps {
  language: Language;
}

export const ContactUs: React.FC<ContactUsProps> = ({ language }) => {
  const isZh = language === 'zh-TW';
  const { addToast } = useToast();
  
  const [formData, setFormData] = useState({
    category: 'bug',
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pageData = {
      title: { zh: '與我們聯繫', en: 'Contact Us' },
      desc: { zh: '問題回報、功能建議與合作洽談', en: 'Bug reporting, feature requests, and partnership inquiries' },
      tag: { zh: '聯繫核心', en: 'Contact Core' }
  };

  const categories = [
    { id: 'bug', label: isZh ? '錯誤除錯 (Bug Report)' : 'Bug Report', icon: Bug, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30' },
    { id: 'feature', label: isZh ? '增加功能 (Feature Request)' : 'Feature Request', icon: Lightbulb, color: 'text-celestial-gold', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
    { id: 'feedback', label: isZh ? '反映意見 (Feedback)' : 'Feedback', icon: MessageSquare, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
    { id: 'invest', label: isZh ? '投資合作 (Investment)' : 'Investment', icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
        addToast('error', isZh ? '請填寫所有必填欄位' : 'Please fill in all required fields', 'Form Error');
        return;
    }

    setIsSubmitting(true);

    // Simulate sending process
    setTimeout(() => {
        setIsSubmitting(false);
        addToast('success', isZh ? '訊息已發送！我們會盡快回覆您。' : 'Message sent! We will reply shortly.', 'System');
        
        // Optional: Open mail client for real submission feeling
        const subject = `[${formData.category.toUpperCase()}] ${formData.name} - ESGss Contact`;
        const body = `Name: ${formData.name}\nEmail: ${formData.email}\nCategory: ${formData.category}\n\nMessage:\n${formData.message}`;
        window.location.href = `mailto:contact@esgss.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        
        // Reset form
        setFormData({ category: 'bug', name: '', email: '', message: '' });
    }, 1500);
  };

  const selectedCategory = categories.find(c => c.id === formData.category);

  return (
    <div className="space-y-8 animate-fade-in pb-12 max-w-4xl mx-auto">
        <UniversalPageHeader 
            icon={Mail}
            title={pageData.title}
            description={pageData.desc}
            language={language}
            tag={pageData.tag}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Category Selection Sidebar */}
            <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">{isZh ? '選擇主題' : 'Select Topic'}</h3>
                {categories.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setFormData({...formData, category: cat.id})}
                        className={`w-full p-4 rounded-xl border flex items-center gap-3 transition-all text-left group
                            ${formData.category === cat.id 
                                ? `${cat.bg} ${cat.border} ring-1 ring-white/20` 
                                : 'bg-slate-900/50 border-white/5 hover:bg-white/5'}
                        `}
                    >
                        <div className={`p-2 rounded-lg bg-slate-900 ${cat.color}`}>
                            <cat.icon className="w-5 h-5" />
                        </div>
                        <span className={`font-bold text-sm ${formData.category === cat.id ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>
                            {cat.label}
                        </span>
                        {formData.category === cat.id && <CheckCircle className={`w-4 h-4 ml-auto ${cat.color}`} />}
                    </button>
                ))}
            </div>

            {/* Form Area */}
            <div className="md:col-span-2 glass-panel p-8 rounded-2xl border border-white/10 relative overflow-hidden">
                {/* Background Accent */}
                <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-[100px] opacity-20 pointer-events-none transition-colors duration-500
                    ${selectedCategory?.id === 'bug' ? 'bg-red-500' : 
                      selectedCategory?.id === 'feature' ? 'bg-amber-500' : 
                      selectedCategory?.id === 'feedback' ? 'bg-blue-500' : 'bg-emerald-500'}
                `} />

                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2 relative z-10">
                    <MessageCircle className="w-5 h-5 text-gray-400" />
                    {isZh ? '填寫訊息內容' : 'Compose Message'}
                </h3>

                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 ml-1">{isZh ? '您的姓名' : 'Your Name'}</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <input 
                                    type="text" 
                                    value={formData.name}
                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                    className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-white/30 transition-colors"
                                    placeholder={isZh ? "請輸入姓名" : "Enter your name"}
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 ml-1">{isZh ? '電子郵件' : 'Email Address'}</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <input 
                                    type="email" 
                                    value={formData.email}
                                    onChange={e => setFormData({...formData, email: e.target.value})}
                                    className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-white/30 transition-colors"
                                    placeholder="name@company.com"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 ml-1">{isZh ? '訊息內容' : 'Message'}</label>
                        <textarea 
                            value={formData.message}
                            onChange={e => setFormData({...formData, message: e.target.value})}
                            className="w-full h-40 bg-slate-950/50 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-white/30 transition-colors resize-none leading-relaxed"
                            placeholder={isZh ? "請詳細描述您的需求或遇到的問題..." : "Please describe your request or issue in detail..."}
                            required
                        />
                    </div>

                    <div className="flex justify-end pt-2">
                        <button 
                            type="submit"
                            disabled={isSubmitting}
                            className={`px-8 py-3 rounded-xl font-bold text-white shadow-lg flex items-center gap-2 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
                                ${selectedCategory?.id === 'bug' ? 'bg-red-500 hover:bg-red-400 shadow-red-500/20' : 
                                  selectedCategory?.id === 'feature' ? 'bg-amber-500 hover:bg-amber-400 shadow-amber-500/20 text-black' : 
                                  selectedCategory?.id === 'feedback' ? 'bg-blue-500 hover:bg-blue-400 shadow-blue-500/20' : 
                                  'bg-emerald-500 hover:bg-emerald-400 shadow-emerald-500/20'}
                            `}
                        >
                            {isSubmitting ? (
                                <>Processing...</>
                            ) : (
                                <>
                                    <Send className="w-4 h-4" />
                                    {isZh ? '發送訊息' : 'Send Message'}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
  );
};
