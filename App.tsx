
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { View, Language, Permission } from './types';
import { Layout } from './components/Layout';
import { LoginScreen } from './components/LoginScreen';
import { ToastProvider } from './contexts/ToastContext';
import { CompanyProvider, useCompany } from './components/providers/CompanyProvider';
import { UniversalAgentProvider } from './contexts/UniversalAgentContext';
import { ToastContainer } from './components/Toast';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LoadingScreen } from './components/LoadingScreen';
import { OnboardingSystem } from './components/OnboardingSystem';
import { AccessDenied } from './components/AccessDenied';
import { VIEW_ACCESS_MAP } from './constants';

// Lazy Load Modules
const MyEsg = lazy(() => import('./components/MyEsg').then(module => ({ default: module.MyEsg })));
const Dashboard = lazy(() => import('./components/Dashboard').then(module => ({ default: module.Dashboard })));
const ResearchHub = lazy(() => import('./components/ResearchHub').then(module => ({ default: module.ResearchHub })));
const Academy = lazy(() => import('./components/Academy').then(module => ({ default: module.Academy })));
const Diagnostics = lazy(() => import('./components/Diagnostics').then(module => ({ default: module.Diagnostics })));
const StrategyHub = lazy(() => import('./components/StrategyHub').then(module => ({ default: module.StrategyHub })));
const ReportGen = lazy(() => import('./components/ReportGen').then(module => ({ default: module.ReportGen })));
const CarbonAsset = lazy(() => import('./components/CarbonAsset').then(module => ({ default: module.CarbonAsset })));
const TalentPassport = lazy(() => import('./components/TalentPassport').then(module => ({ default: module.TalentPassport })));
const IntegrationHub = lazy(() => import('./components/IntegrationHub').then(module => ({ default: module.IntegrationHub })));
const CultureBot = lazy(() => import('./components/CultureBot').then(module => ({ default: module.CultureBot })));
const FinanceSim = lazy(() => import('./components/FinanceSim').then(module => ({ default: module.FinanceSim })));
const AuditTrail = lazy(() => import('./components/AuditTrail').then(module => ({ default: module.AuditTrail })));
const GoodwillCoin = lazy(() => import('./components/GoodwillCoin').then(module => ({ default: module.GoodwillCoin })));
const UniversalRestoration = lazy(() => import('./components/Gamification').then(module => ({ default: module.UniversalRestoration })));
const CardGameArenaView = lazy(() => import('./components/Gamification').then(module => ({ default: module.CardGameArenaView })));
const Settings = lazy(() => import('./components/Settings').then(module => ({ default: module.Settings })));
const YangBoZone = lazy(() => import('./components/YangBoZone').then(module => ({ default: module.YangBoZone })));
const BusinessIntel = lazy(() => import('./components/BusinessIntel').then(module => ({ default: module.BusinessIntel })));
const HealthCheck = lazy(() => import('./components/HealthCheck').then(module => ({ default: module.HealthCheck })));
const UniversalTools = lazy(() => import('./components/UniversalTools').then(module => ({ default: module.UniversalTools })));
const Fundraising = lazy(() => import('./components/Fundraising').then(module => ({ default: module.Fundraising })));
const AboutUs = lazy(() => import('./components/AboutUs').then(module => ({ default: module.AboutUs })));
const ApiZone = lazy(() => import('./components/ApiZone').then(module => ({ default: module.ApiZone })));
const UniversalBackend = lazy(() => import('./components/UniversalBackend'));
const AlumniZone = lazy(() => import('./components/AlumniZone').then(module => ({ default: module.AlumniZone })));
const GoodwillLibrary = lazy(() => import('./components/GoodwillLibrary').then(module => ({ default: module.GoodwillLibrary })));
const UserJournal = lazy(() => import('./components/UserJournal').then(module => ({ default: module.UserJournal })));
const UniversalAgentZone = lazy(() => import('./components/UniversalAgentZone').then(module => ({ default: module.UniversalAgentZone })));
const ContactUs = lazy(() => import('./components/ContactUs').then(module => ({ default: module.ContactUs })));
const CardGame = lazy(() => import('./components/CardGame').then(module => ({ default: module.CardGame })));

const ProtectedModule: React.FC<{ view: View; children: React.ReactNode; onNavigate: (view: View) => void }> = ({ view, children, onNavigate }) => {
    const { hasPermission } = useCompany();
    const requiredPermission = VIEW_ACCESS_MAP[view];

    if (!hasPermission(requiredPermission)) {
        return <AccessDenied requiredPermission={requiredPermission} onGoBack={() => onNavigate(View.MY_ESG)} />;
    }
    return <>{children}</>;
};

interface AppContentProps {
    language: Language;
    onToggleLanguage: () => void;
}

const AppContent: React.FC<AppContentProps> = ({ language, onToggleLanguage }) => {
  const [currentView, setCurrentView] = useState<View>(View.MY_ESG);

  const wrap = (node: React.ReactNode) => (
      <ProtectedModule view={currentView} onNavigate={setCurrentView}>
          {node}
      </ProtectedModule>
  );

  return (
    <>
        <OnboardingSystem language={language} />
        <Layout 
          currentView={currentView} 
          onNavigate={setCurrentView}
          language={language}
          onToggleLanguage={onToggleLanguage}
        >
          <ErrorBoundary>
            <Suspense fallback={<LoadingScreen message="Loading Module Resource..." />}>
              {(() => {
                switch (currentView) {
                  case View.MY_ESG: return wrap(<MyEsg language={language} onNavigate={setCurrentView} />);
                  case View.DASHBOARD: return wrap(<Dashboard language={language} />);
                  case View.RESTORATION: return wrap(<UniversalRestoration language={language} />);
                  case View.CARD_GAME_ARENA: return wrap(<CardGameArenaView language={language} />);
                  case View.USER_JOURNAL: return wrap(<UserJournal language={language} />);
                  case View.FUNDRAISING: return wrap(<Fundraising language={language} />);
                  case View.ABOUT_US: return wrap(<AboutUs language={language} />);
                  case View.CONTACT_US: return wrap(<ContactUs language={language} />);
                  case View.API_ZONE: return wrap(<ApiZone language={language} />);
                  case View.UNIVERSAL_BACKEND: return wrap(<UniversalBackend />);
                  case View.RESEARCH_HUB: return wrap(<ResearchHub language={language} />);
                  case View.ACADEMY: return wrap(<Academy language={language} />);
                  case View.DIAGNOSTICS: return wrap(<Diagnostics language={language} />);
                  case View.STRATEGY: return wrap(<StrategyHub language={language} />);
                  case View.REPORT: return wrap(<ReportGen language={language} />);
                  case View.CARBON: return wrap(<CarbonAsset language={language} />);
                  case View.TALENT: return wrap(<TalentPassport language={language} />);
                  case View.INTEGRATION: return wrap(<IntegrationHub language={language} />);
                  case View.CULTURE: return wrap(<CultureBot language={language} />);
                  case View.FINANCE: return wrap(<FinanceSim language={language} />);
                  case View.AUDIT: return wrap(<AuditTrail language={language} />);
                  case View.GOODWILL: return wrap(<GoodwillCoin language={language} />);
                  case View.SETTINGS: return wrap(<Settings language={language} />);
                  case View.YANG_BO: return wrap(<YangBoZone language={language} />);
                  case View.BUSINESS_INTEL: return wrap(<BusinessIntel language={language} onNavigate={setCurrentView} />);
                  case View.HEALTH_CHECK: return wrap(<HealthCheck language={language} onNavigate={setCurrentView} />);
                  case View.UNIVERSAL_TOOLS: return wrap(<UniversalTools language={language} />); 
                  case View.ALUMNI_ZONE: return wrap(<AlumniZone language={language} />);
                  case View.LIBRARY: return wrap(<GoodwillLibrary language={language} />);
                  case View.UNIVERSAL_AGENT: return wrap(<UniversalAgentZone language={language} />);
                  case View.CARD_GAME: return wrap(<CardGame language={language} />);
                  default: return wrap(<MyEsg language={language} onNavigate={setCurrentView} />);
                }
              })()}
            </Suspense>
          </ErrorBoundary>
        </Layout>
    </>
  );
};

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [language, setLanguage] = useState<Language>('zh-TW');

  useEffect(() => {
    const savedLang = localStorage.getItem('app_language') as Language;
    if (savedLang) {
      setLanguage(savedLang);
    }
  }, []);

  const handleToggleLanguage = () => {
    const newLang = language === 'zh-TW' ? 'en-US' : 'zh-TW';
    setLanguage(newLang);
    localStorage.setItem('app_language', newLang);
  };

  return (
    <ToastProvider>
      <UniversalAgentProvider>
        {!isLoggedIn ? (
          <ErrorBoundary>
             <LoginScreen 
                onLogin={() => setIsLoggedIn(true)} 
                language={language} 
                onToggleLanguage={handleToggleLanguage}
             />
          </ErrorBoundary>
        ) : (
          <CompanyProvider>
             <AppContent language={language} onToggleLanguage={handleToggleLanguage} />
          </CompanyProvider>
        )}
        <ToastContainer />
      </UniversalAgentProvider>
    </ToastProvider>
  );
};

export default App;
