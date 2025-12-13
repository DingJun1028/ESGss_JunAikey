
import React, { useState, useEffect } from 'react';
import { getMockCourses, TRANSLATIONS } from '../constants';
import { PlayCircle, Cpu, Users, Briefcase, Zap, ArrowRight, Calendar, Ticket, GraduationCap, Crown, BookOpen, CheckCircle, Globe, Scale, Award, Target, Clock } from 'lucide-react';
import { Language, Course } from '../types';
import { OmniEsgCell } from './OmniEsgCell';
import { CoursePlayer } from './CoursePlayer';
import { useToast } from '../contexts/ToastContext';
import { useCompany } from './providers/CompanyProvider';
import { UniversalPageHeader } from './UniversalPageHeader';

interface AcademyProps {
  language: Language;
}

export const Academy: React.FC<AcademyProps> = ({ language }) => {
  const t = TRANSLATIONS[language].academy;
  const isZh = language === 'zh-TW';
  const courses = getMockCourses(language);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const [activeTab, setActiveTab] = useState<'star' | 'courses' | 'sdgs' | 'trends' | 'community'>('star');
  const { addToast } = useToast();
  const { awardXp, tier } = useCompany();

  // Simulate Data Fetching
  useEffect(() => {
    const timer = setTimeout(() => {
        setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleStartCourse = (course: Course) => {
      setActiveCourse(course);
  };

  const handleCourseComplete = () => {
      if (activeCourse) {
          awardXp(500);
          addToast('reward', `Course Completed: ${activeCourse.title} (+500 XP)`, 'Academy');
      }
      setActiveCourse(null);
  };

  const handleClaimOffer = (offer: string) => {
      addToast('success', isZh ? `已領取優惠：${offer}` : `Offer Claimed: ${offer}`, 'Consulting Perks');
  };

  const handleJoinEvent = (event: string) => {
      addToast('success', isZh ? `已報名活動：${event}` : `Registered for: ${event}`, 'Community');
  };

  const handleSdgClick = (id: number) => {
      addToast('info', isZh ? `正在載入 SDG ${id} 相關課程與資源...` : `Loading SDG ${id} resources...`, 'Knowledge Retrieval');
  };

  const handleRegisterStar = () => {
      window.open('https://www.esgsunshine.com/courses/berkeley-tsisda', '_blank');
      addToast('success', isZh ? '正在前往報名頁面...' : 'Redirecting to registration...', 'System');
  };

  const pageData = {
      title: { zh: '永續學院', en: 'Sustainability Academy' },
      desc: { zh: '提升團隊 ESG 技能與知識體系', en: 'Upskill your team with curated ESG learning paths.' },
      tag: { zh: '知識核心', en: 'Knowledge Core' }
  };

  // --- MOCK DATA (Consolidated) ---
  const regulations = [
      { id: 'reg-1', title: 'IFRS S1/S2', desc: isZh ? '國際財務報導準則永續揭露準則完全解析' : 'Deep dive into IFRS Sustainability Disclosure Standards.', tag: 'Compliance', date: '2024.06.01' },
      { id: 'reg-2', title: 'EU ESRS & CSDDD', desc: isZh ? '歐盟供應鏈盡職調查指令對亞洲企業的衝擊' : 'Impact of EU CSDDD on Asian Supply Chains.', tag: 'Supply Chain', date: '2024.05.28' },
      { id: 'reg-3', title: 'GRI 2024 Update', desc: isZh ? '新版生物多樣性公報 (GRI 101) 實務指南' : 'Practical guide to GRI 101 Biodiversity Standard.', tag: 'Reporting', date: '2024.05.15' },
  ];

  const techTrends = [
      { id: 'tech-1', title: isZh ? 'AI 碳盤查自動化' : 'AI Carbon Accounting', desc: isZh ? '利用 LLM 自動解析發票與能耗數據。' : 'Automating Scope 1-3 via LLM invoice parsing.', icon: Cpu, color: 'text-purple-400' },
      { id: 'tech-2', title: isZh ? '區塊鏈產品護照' : 'Blockchain Product Passport', desc: isZh ? '符合歐盟 ESPR 法規的數位溯源技術。' : 'DPP technology compliant with EU ESPR.', icon: Globe, color: 'text-blue-400' },
      { id: 'tech-3', title: isZh ? 'IoT 即時監測' : 'IoT Real-time Monitoring', desc: isZh ? '工廠端 EMS 系統與 API 自動串接。' : 'Factory EMS integration via API.', icon: Zap, color: 'text-gold' },
  ];

  const communityEvents = [
      { id: 'evt-1', title: isZh ? '永續長早餐會 (CSO Breakfast)' : 'CSO Breakfast Meetup', date: 'June 15', type: 'Networking', slots: 5 },
      { id: 'evt-2', title: isZh ? '供應鏈減碳實戰工作坊' : 'Supply Chain Workshop', date: 'June 22', type: 'Workshop', slots: 12 },
  ];

  const consultingOffers = [
      { id: 'off-1', title: isZh ? 'SROI 專案評估' : 'SROI Assessment', discount: '20% OFF', desc: isZh ? '適用於社會影響力報告' : 'For Social Impact Reports' },
      { id: 'off-2', title: isZh ? '雙重重大性分析' : 'Double Materiality', discount: 'Enterprise Plan', desc: isZh ? '符合 CSRD/GRI 要求' : 'CSRD/GRI Compliant' },
  ];

  const sdgColors = [
      "#E5243B", "#DDA63A", "#4C9F38", "#C5192D", "#FF3A21", 
      "#26BDE2", "#FCC30B", "#A21942", "#FD6925", "#DD1367", 
      "#FD9D24", "#BF8B2E", "#3F7E44", "#0A97D9", "#56C02B", 
      "#00689D", "#19486A"
  ];

  const berkeleyFaculty = [
      { name: 'Dr. Solomon Darwin', title: '智慧鄉村之父；Berkeley Haas企業創新中心主任' },
      { name: 'Dr. Arding Hsu', title: '前西門子科技商務的總裁兼首席執行官' },
      { name: 'Dr. Gauthier Vasseur', title: 'Berkeley Haas商業分析中心主任' },
      { name: 'Dr. Herbert Wu', title: '蘋果公司前董事、昇陽電腦前董事' },
      { name: 'Dr. Xiao Ge', title: 'Stanford資料驅動新人工智慧技術研究學者' },
      { name: 'Dr. Kuen-Shiou Yang', title: '台灣社會創新永續發展協會理事長' },
      { name: 'Dr. Rey-Sheng He', title: '慈濟慈慈善基金會副執行長' },
      { name: 'Stan Shi', title: '宏碁集團創辦人' },
  ];

  const svMentors = [
      { name: 'Dr. Surendra Chawla', title: '固特異輪胎和橡膠公司前資深董事' },
      { name: 'Dr. Jim Spohrer', title: 'IBM前開放技術總監、Apple傑出科學家' },
      { name: 'Dr. Gautam Bandyopadhyay', title: 'Siemens前創新與技術管理總監' },
      { name: 'Dr. Deepu Rathi', title: 'Cisco前高級總監' },
      { name: 'Olga Diamandis', title: 'Disney創新總監' },
      { name: 'Piyush Malik', title: 'IBM與Google前雲端總監' },
  ];

  return (
    <>
        {activeCourse && (
            <CoursePlayer 
                course={activeCourse} 
                onClose={() => setActiveCourse(null)} 
                onComplete={handleCourseComplete} 
            />
        )}

        <div className="space-y-8 animate-fade-in pb-12">
            <UniversalPageHeader 
                icon={GraduationCap}
                title={pageData.title}
                description={pageData.desc}
                language={language}
                tag={pageData.tag}
            />

            {/* Navigation Tabs */}
            <div className="flex gap-2 border-b border-white/10 pb-1 overflow-x-auto no-scrollbar">
                {[
                    { id: 'star', icon: Crown, zh: '明星課程', en: 'Star Course' },
                    { id: 'courses', icon: BookOpen, zh: '核心課程', en: 'Core Courses' },
                    { id: 'sdgs', icon: Globe, zh: '聯合國 SDGs', en: 'UN SDGs' },
                    { id: 'trends', icon: Scale, zh: '法規與趨勢', en: 'Trends & Regs' },
                    { id: 'community', icon: Users, zh: '社群與顧問', en: 'Community' },
                ].map(tab => (
                    <button 
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`px-4 py-2 text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === tab.id ? 'text-celestial-gold border-b-2 border-celestial-gold' : 'text-gray-500 hover:text-white'}`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {isZh ? tab.zh : tab.en}
                        <span className="text-[10px] font-light opacity-60 ml-1 font-sans">
                            {isZh ? tab.en : tab.zh}
                        </span>
                    </button>
                ))}
            </div>

            {/* === TAB: STAR COURSE (BERKELEY) === */}
            {activeTab === 'star' && (
                <div className="space-y-8 animate-fade-in">
                    {/* Hero Section */}
                    <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl shadow-amber-900/20 border border-celestial-gold/30">
                        <div className="absolute inset-0">
                            <img src="https://thumbs4.imagebam.com/12/1d/de/ME18KXOE_t.jpg" className="w-full h-full object-cover opacity-90" alt="Berkeley Course" />
                            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
                        </div>
                        <div className="relative z-10 p-8 md:p-12 max-w-3xl">
                            <div className="flex flex-wrap gap-3 mb-4">
                                <span className="px-3 py-1 bg-celestial-gold text-black text-xs font-bold rounded-full uppercase tracking-wider flex items-center gap-1">
                                    <Globe className="w-3 h-3" /> Global Unique
                                </span>
                                <span className="px-3 py-1 bg-white/10 text-white text-xs font-bold rounded-full uppercase tracking-wider border border-white/20 backdrop-blur-md">
                                    Berkeley Haas IBI
                                </span>
                                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-full uppercase tracking-wider border border-emerald-500/30 backdrop-blur-md">
                                    TSISDA
                                </span>
                            </div>
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                                {isZh ? 'Berkeley 國際永續策略創新師' : 'Berkeley International ESG Strategy Innovator'} <br/>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-celestial-gold to-amber-200">
                                    × TSISDA 國際永續轉型規劃師 雙證班
                                </span>
                            </h2>
                            <p className="text-gray-200 text-lg mb-8 leading-relaxed drop-shadow-md">
                                {isZh 
                                    ? '全球唯一整合 Berkeley Haas IBI 八大機構智慧與台灣永續實務。五合一訓練：策略 × 合規 × 創新 × 創價 × 顧問。直接產出企業永續策略藍圖與創價專案。' 
                                    : 'The only program globally integrating Berkeley Haas IBI wisdom with Taiwan implementation. 5-in-1 Training: Strategy, Compliance, Innovation, Value Creation, Consulting.'}
                            </p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div className="p-4 bg-black/40 backdrop-blur-md rounded-xl border border-white/10">
                                    <Award className="w-8 h-8 text-celestial-gold mb-2" />
                                    <h4 className="font-bold text-white mb-1">{isZh ? '雙證書制度' : 'Dual Certification'}</h4>
                                    <p className="text-xs text-gray-300">Berkeley IBI Certificate + TSISDA Strategy Talent Certification.</p>
                                </div>
                                <div className="p-4 bg-black/40 backdrop-blur-md rounded-xl border border-white/10">
                                    <Target className="w-8 h-8 text-emerald-400 mb-2" />
                                    <h4 className="font-bold text-white mb-1">{isZh ? '三大交付成果' : '3 Key Deliverables'}</h4>
                                    <p className="text-xs text-gray-300">Strategy Blueprint 2.0, Report Skeleton, Startup Prototype.</p>
                                </div>
                                <div className="p-4 bg-black/40 backdrop-blur-md rounded-xl border border-white/10">
                                    <Users className="w-8 h-8 text-celestial-purple mb-2" />
                                    <h4 className="font-bold text-white mb-1">{isZh ? '矽谷業師輔導' : 'Silicon Valley Mentors'}</h4>
                                    <p className="text-xs text-gray-300">Office Hour with experts from Apple, Google, Siemens.</p>
                                </div>
                            </div>

                            <button 
                                onClick={handleRegisterStar}
                                className="px-8 py-4 bg-celestial-gold hover:bg-amber-400 text-black font-bold rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2 text-lg group"
                            >
                                {isZh ? '立即報名 / 了解更多' : 'Register Now / Learn More'}
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>

                    {/* Curriculum & Faculty */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                            {/* Curriculum Structure */}
                            <div>
                                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                    <BookOpen className="w-6 h-6 text-celestial-blue" />
                                    {isZh ? '課程架構 (六週 / 72小時)' : 'Curriculum Structure (6 Weeks / 72 Hrs)'}
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="glass-panel p-6 rounded-2xl border-l-4 border-l-celestial-gold">
                                        <div className="text-xs font-bold text-celestial-gold uppercase tracking-wider mb-2">Module A</div>
                                        <h4 className="text-lg font-bold text-white mb-3">Berkeley Haas IBI 國際策略模組</h4>
                                        <ul className="space-y-2 text-sm text-gray-300">
                                            <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-celestial-gold mt-0.5"/> Purpose × 北極星願景設計</li>
                                            <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-celestial-gold mt-0.5"/> Materiality 2.0 & Strategy House</li>
                                            <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-celestial-gold mt-0.5"/> Innovation Matrix × ESG Portfolio</li>
                                            <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-celestial-gold mt-0.5"/> Impact Logic Model</li>
                                        </ul>
                                    </div>
                                    <div className="glass-panel p-6 rounded-2xl border-l-4 border-l-emerald-500">
                                        <div className="text-xs font-bold text-emerald-500 uppercase tracking-wider mb-2">Module B</div>
                                        <h4 className="text-lg font-bold text-white mb-3">TSISDA 台灣永續實務模組</h4>
                                        <ul className="space-y-2 text-sm text-gray-300">
                                            <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5"/> 任脈：GRI / IFRS 合規實務</li>
                                            <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5"/> 督脈：創價型 ESG 商業模式設計</li>
                                            <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5"/> TCFD/TNFD 氣候風險分析</li>
                                            <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5"/> 永續報告書骨架實作</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Impact Stats */}
                            <div className="glass-panel p-6 rounded-2xl border border-white/10 flex items-center justify-between">
                                <div>
                                    <div className="text-3xl font-bold text-white mb-1">NT$ 3,265萬</div>
                                    <div className="text-sm text-gray-400">{isZh ? '第一期學員專案獲資金額' : 'Funding Raised by Cohort 1'}</div>
                                </div>
                                <div className="h-10 w-[1px] bg-white/10" />
                                <div>
                                    <div className="text-3xl font-bold text-white mb-1">100%</div>
                                    <div className="text-sm text-gray-400">{isZh ? '專案實作完成率' : 'Project Completion Rate'}</div>
                                </div>
                                <div className="h-10 w-[1px] bg-white/10" />
                                <div>
                                    <div className="text-3xl font-bold text-white mb-1">29k</div>
                                    <div className="text-sm text-gray-400">{isZh ? '贈送顧問服務價值' : 'Bonus Consulting Value'}</div>
                                </div>
                            </div>
                        </div>

                        {/* Faculty List */}
                        <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-slate-900/50 h-fit">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <Users className="w-5 h-5 text-celestial-purple" />
                                {isZh ? '國際級講師與業師' : 'World-Class Faculty & Mentors'}
                            </h3>
                            <div className="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
                                <div className="text-xs font-bold text-celestial-gold uppercase tracking-wider mb-2">Lead Faculty</div>
                                {berkeleyFaculty.map((prof, i) => (
                                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                                        <div className="w-10 h-10 rounded-full bg-indigo-900 flex items-center justify-center text-xs font-bold text-indigo-300 shrink-0 border border-indigo-500/30">
                                            {prof.name.split(' ')[1]?.[0] || prof.name[0]}
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-white">{prof.name}</div>
                                            <div className="text-[10px] text-gray-400 leading-tight mt-1">{prof.title}</div>
                                        </div>
                                    </div>
                                ))}
                                
                                <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mt-6 mb-2">Silicon Valley Mentors</div>
                                {svMentors.map((mentor, i) => (
                                    <div key={`m-${i}`} className="flex items-start gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                                        <div className="w-10 h-10 rounded-full bg-emerald-900 flex items-center justify-center text-xs font-bold text-emerald-300 shrink-0 border border-emerald-500/30">
                                            {mentor.name.split(' ')[1]?.[0] || mentor.name[0]}
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-white">{mentor.name}</div>
                                            <div className="text-[10px] text-gray-400 leading-tight mt-1">{mentor.title}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ... other tabs ... */}
            {activeTab === 'courses' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                    {isLoading 
                    ? Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="glass-panel rounded-2xl overflow-hidden animate-pulse h-[340px] flex flex-col">
                            <div className="h-48 bg-white/5 w-full" />
                            <div className="p-5 flex-1 flex flex-col justify-between">
                                <div className="space-y-3">
                                    <div className="h-3 w-20 bg-white/5 rounded" />
                                    <div className="h-6 w-full bg-white/5 rounded" />
                                    <div className="h-2 w-full bg-white/5 rounded mt-4" />
                                </div>
                            </div>
                        </div>
                        ))
                    : courses.map((course) => (
                        <div key={course.id} className="glass-panel rounded-2xl overflow-hidden group hover:shadow-2xl hover:shadow-celestial-purple/20 transition-all duration-300 border border-white/5 hover:border-white/20">
                            <div className="relative h-48 overflow-hidden">
                                <img 
                                    src={course.thumbnail} 
                                    alt={course.title} 
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                                <div className="absolute bottom-4 left-4">
                                    <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-md border border-white/10
                                        ${course.level === 'Beginner' ? 'bg-emerald-500/60 text-white' : 
                                        course.level === 'Intermediate' ? 'bg-blue-500/60 text-white' : 'bg-purple-500/60 text-white'}`}>
                                        {course.level}
                                    </span>
                                </div>
                            </div>
                            <div className="p-5">
                                <div className="text-xs text-celestial-purple mb-2 font-medium tracking-wide">{course.category}</div>
                                <h3 className="text-lg font-bold text-white mb-4 line-clamp-2 group-hover:text-celestial-gold transition-colors">{course.title}</h3>
                                
                                <div className="mb-4">
                                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                                        <span>{t.progress}</span>
                                        <span>{course.progress}%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-gray-700/50 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-celestial-emerald to-celestial-purple relative" style={{ width: `${course.progress}%` }}>
                                            <div className="absolute top-0 right-0 w-2 h-full bg-white/50 blur-[2px] animate-pulse" />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center pt-2 border-t border-white/5">
                                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                        <Clock className="w-3.5 h-3.5" />
                                        <span>2h 15m</span>
                                    </div>
                                    <button 
                                        onClick={() => handleStartCourse(course)}
                                        className="flex items-center gap-2 text-xs font-bold text-white bg-white/5 hover:bg-celestial-emerald/20 px-3 py-1.5 rounded-lg border border-white/10 hover:border-celestial-emerald/50 transition-all group/btn"
                                    >
                                        <PlayCircle className="w-4 h-4 text-celestial-emerald group-hover/btn:scale-110 transition-transform" />
                                        {course.progress > 0 ? t.resume : t.start}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* === TAB: SDGs === */}
            {activeTab === 'sdgs' && (
                <div className="space-y-6 animate-fade-in">
                    <div className="mb-4">
                        <h3 className="text-xl font-bold text-white mb-1">{isZh ? '聯合國永續發展目標' : 'UN Sustainable Development Goals'}</h3>
                        <p className="text-gray-400 text-sm">{isZh ? '了解 17 項全球永續發展目標，及其對企業的意義與實踐方式。' : 'Learn about the 17 SDGs and their business implications.'}</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {sdgColors.map((color, i) => {
                            const id = i + 1;
                            return (
                                <div 
                                    key={id} 
                                    onClick={() => handleSdgClick(id)}
                                    className="aspect-square rounded-xl hover:scale-105 transition-transform cursor-pointer flex flex-col items-center justify-center p-2 text-center group shadow-lg"
                                    style={{ backgroundColor: color }}
                                >
                                    <div className="text-4xl font-bold text-white mb-1 drop-shadow-md">{id}</div>
                                    <span className="text-[10px] text-white font-bold uppercase tracking-wide opacity-90">Goal</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* === TAB: TRENDS & REGS === */}
            {activeTab === 'trends' && (
                <div className="space-y-8 animate-fade-in">
                    {/* Regulatory Radar */}
                    <div className="glass-panel p-6 rounded-2xl border-white/10 bg-gradient-to-br from-celestial-blue/5 to-transparent">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Scale className="w-6 h-6 text-celestial-blue" />
                            {isZh ? '法規更新雷達 (Regulatory Radar)' : 'Regulatory Radar'}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {regulations.map((reg) => (
                                <div key={reg.id} className="p-4 bg-white/5 rounded-xl border border-l-4 border-white/10 border-l-celestial-blue hover:bg-white/10 transition-all group">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-[10px] px-2 py-0.5 rounded bg-celestial-blue/20 text-blue-300 font-bold">{reg.tag}</span>
                                        <span className="text-[10px] text-gray-500">{reg.date}</span>
                                    </div>
                                    <h4 className="font-bold text-white mb-2 group-hover:text-celestial-blue transition-colors">{reg.title}</h4>
                                    <p className="text-xs text-gray-400 leading-relaxed">{reg.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Tech Trends */}
                    <div>
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Cpu className="w-6 h-6 text-purple-400" />
                            {isZh ? 'ESG 新科技與產業動態' : 'ESG Tech & Industry Trends'}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {techTrends.map((tech) => (
                                <div key={tech.id} className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-purple-500/30 transition-all group">
                                    <div className="mb-4 p-3 bg-white/5 rounded-full w-fit group-hover:scale-110 transition-transform">
                                        <tech.icon className={`w-6 h-6 ${tech.color}`} />
                                    </div>
                                    <h4 className="font-bold text-white mb-2 text-lg">{tech.title}</h4>
                                    <p className="text-sm text-gray-400 leading-relaxed mb-4">{tech.desc}</p>
                                    <button className="text-xs text-purple-400 flex items-center gap-1 font-bold group-hover:translate-x-1 transition-transform">
                                        {isZh ? '了解更多' : 'Learn More'} <ArrowRight className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* === TAB: COMMUNITY & CONSULTING === */}
            {activeTab === 'community' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
                    {/* Community Exchange */}
                    <div className="glass-panel p-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <Users className="w-6 h-6 text-emerald-400" />
                                {isZh ? 'ESG 社群交流 (Enterprise x Students)' : 'Community Exchange'}
                            </h3>
                        </div>
                        <div className="space-y-4">
                            {communityEvents.map((evt) => (
                                <div key={evt.id} className="flex items-center gap-4 p-4 bg-slate-900/50 rounded-xl border border-white/5 hover:border-emerald-500/30 transition-all">
                                    <div className="flex flex-col items-center justify-center p-2 bg-white/5 rounded-lg min-w-[60px]">
                                        <Calendar className="w-5 h-5 text-emerald-400 mb-1" />
                                        <span className="text-xs font-bold text-white">{evt.date}</span>
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider mb-1">{evt.type}</div>
                                        <h4 className="font-bold text-white text-sm">{evt.title}</h4>
                                        <div className="text-xs text-gray-500 mt-1">{evt.slots} {isZh ? '個名額剩餘' : 'slots left'}</div>
                                    </div>
                                    <button 
                                        onClick={() => handleJoinEvent(evt.title)}
                                        className="px-3 py-1.5 bg-emerald-500 text-white text-xs font-bold rounded-lg hover:bg-emerald-600 transition-colors"
                                    >
                                        {isZh ? '報名' : 'Join'}
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 pt-4 border-t border-white/10 text-center">
                            <p className="text-xs text-gray-400 mb-2">{isZh ? '加入企業永續菁英俱樂部，拓展人脈。' : 'Join the Sustainability Elite Club to expand your network.'}</p>
                            <button className="text-emerald-400 text-xs font-bold hover:underline">{isZh ? '查看所有活動 ->' : 'View All Events ->'}</button>
                        </div>
                    </div>

                    {/* Consulting Discounts */}
                    <div className="glass-panel p-6 rounded-2xl border border-celestial-gold/30 bg-celestial-gold/5">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <Briefcase className="w-6 h-6 text-celestial-gold" />
                                {isZh ? '顧問專案折扣 (Consulting Perks)' : 'Consulting Perks'}
                            </h3>
                            {tier !== 'Free' && <span className="px-2 py-1 bg-celestial-gold text-black text-xs font-bold rounded">PRO Access</span>}
                        </div>
                        <div className="space-y-4">
                            {consultingOffers.map((offer) => (
                                <div key={offer.id} className="relative p-5 bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl border border-celestial-gold/20 overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-2 bg-celestial-gold text-black text-xs font-bold rounded-bl-xl shadow-lg">
                                        {offer.discount}
                                    </div>
                                    <div className="relative z-10">
                                        <h4 className="font-bold text-white text-lg mb-1">{offer.title}</h4>
                                        <p className="text-xs text-gray-400 mb-4">{offer.desc}</p>
                                        <button 
                                            onClick={() => handleClaimOffer(offer.title)}
                                            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-celestial-gold hover:text-black text-celestial-gold rounded-lg text-xs font-bold transition-all border border-celestial-gold/30"
                                        >
                                            <Ticket className="w-3 h-3" />
                                            {isZh ? '領取優惠' : 'Claim Offer'}
                                        </button>
                                    </div>
                                    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-celestial-gold/10 rounded-full blur-2xl group-hover:bg-celestial-gold/20 transition-all" />
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 text-center">
                            <p className="text-[10px] text-gray-500">{isZh ? '由 ESG Sunshine 顧問團隊提供專業支持。' : 'Professional support by ESG Sunshine Consulting Team.'}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    </>
  );
};