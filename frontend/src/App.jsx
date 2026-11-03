import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ApplicantsProvider } from './context/ApplicantsContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { LoginModal } from './components/auth/LoginModal';

import { HeroSection } from './components/home/HeroSection';
import { PromotionalBannerSection } from './components/home/PromotionalBannerSection';
import { FeaturedPrograms } from './components/home/FeaturedPrograms';
import { KpiSection } from './components/home/KpiSection';
import { ImpactSection } from './components/home/ImpactSection';
import { FAQSection } from './components/home/FAQSection';
import { EventsSection } from './components/home/EventsSection';
import { MasterBannerPopup } from './components/common/MasterBannerPopup';

import { InstitutionView } from './components/institution/InstitutionView';
import { ProgramsView } from './components/programs/ProgramsView';
import { ProgramDetailModal } from './components/programs/ProgramDetailModal';
import { ProgramDetailView } from './components/programs/ProgramDetailView';
import { AdmissionView } from './components/admission/AdmissionView';
import { RegulationsView } from './components/regulations/RegulationsView';
import { NewsView } from './components/news/NewsView';
import { ContactView } from './components/contact/ContactView';

import { AdminPortal } from './components/portals/AdminPortal';

import './styles/index.css';
import './styles/components.css';

const MainApp = () => {
  const [currentTab, setCurrentTab] = useState('inicio');
  const [selectedProgramModal, setSelectedProgramModal] = useState(null);
  const [selectedProgramDetailId, setSelectedProgramDetailId] = useState(null);
  const [targetProgramForAdmission, setTargetProgramForAdmission] = useState(null);
  const [programFilterState, setProgramFilterState] = useState(null);
  const { currentUser } = useAuth();

  React.useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash || '';
      if (hash.startsWith('#programa/') || hash.startsWith('#/programa/')) {
        const id = hash.replace(/^#\/?programa\//, '');
        if (id) {
          setSelectedProgramDetailId(decodeURIComponent(id));
          setCurrentTab('programa-detalle');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } else if (hash === '#programas' || hash === '#/programas') {
        setCurrentTab('programas');
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleNavigateToAdmission = (programId = null) => {
    if (programId) setTargetProgramForAdmission(programId);
    setCurrentTab('admision');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFilterPrograms = (filterObj) => {
    setProgramFilterState(filterObj);
    setCurrentTab('programas');
  };

  const handleLoginSuccess = () => {
    setCurrentTab('portal-admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenProgramDetail = (prog) => {
    const progId = prog?.id || prog?.code || prog;
    setSelectedProgramDetailId(progId);
    setCurrentTab('programa-detalle');
    window.location.hash = `programa/${progId}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // MODO ADMIN: pantalla completa sin navbar/footer publicos
  if (currentTab === 'portal-admin') {
    return (
      <AdminPortal
        onExitAdmin={() => {
          setCurrentTab('inicio');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    );
  }

  return (
    <div className="page-shell">
      <a className="skip-link" href="#main">Saltar al contenido</a>

      <Navbar
        currentTab={currentTab === 'programa-detalle' ? 'programas' : currentTab}
        setCurrentTab={(tab) => {
          if (window.location.hash.startsWith('#programa/')) {
            window.location.hash = tab === 'programas' ? '#programas' : '';
          }
          setCurrentTab(tab);
        }}
        onOpenProgramDetail={handleOpenProgramDetail}
      />

      <main id="main" className="site-main">
        {currentTab === 'inicio' && (
          <div className="animate-fade-in">
            <HeroSection onNavigate={setCurrentTab} onFilterPrograms={handleFilterPrograms} />
            <PromotionalBannerSection onSelectProgram={handleOpenProgramDetail} />
            <FeaturedPrograms onSelectProgram={handleOpenProgramDetail} onNavigateToAdmission={handleNavigateToAdmission} />
            <KpiSection />
            <ImpactSection
              onExplorePrograms={() => { setCurrentTab('programas'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              onAboutInstitution={() => { setCurrentTab('institucion'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            />
            <FAQSection />
          </div>
        )}
        {currentTab === 'institucion' && <InstitutionView />}
        {currentTab === 'programas' && (
          <ProgramsView onNavigateToAdmission={handleNavigateToAdmission} initialFilter={programFilterState} onSelectProgram={handleOpenProgramDetail} />
        )}
        {currentTab === 'programa-detalle' && (
          <ProgramDetailView
            programId={selectedProgramDetailId}
            onBack={() => { window.location.hash = 'programas'; setCurrentTab('programas'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            onNavigateToAdmission={handleNavigateToAdmission}
          />
        )}
        {currentTab === 'admision' && <AdmissionView targetProgramId={targetProgramForAdmission} />}
        {currentTab === 'normativa' && <RegulationsView />}
        {currentTab === 'noticias' && <NewsView />}
        {currentTab === 'contacto' && <ContactView />}
      </main>

      <Footer onNavigate={(tab) => { if (window.location.hash.startsWith('#programa/')) window.location.hash = ''; setCurrentTab(tab); }} />
      <LoginModal onLoginSuccess={handleLoginSuccess} />

      {selectedProgramModal && (
        <ProgramDetailModal
          program={selectedProgramModal}
          onClose={() => setSelectedProgramModal(null)}
          onApply={(progId) => { setSelectedProgramModal(null); handleNavigateToAdmission(progId); }}
        />
      )}
      <MasterBannerPopup onNavigateToProgram={handleOpenProgramDetail} />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <ApplicantsProvider>
        <MainApp />
      </ApplicantsProvider>
    </AuthProvider>
  );
}
