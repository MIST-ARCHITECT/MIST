import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ProjectModal } from './components/ProjectModal';
import { SearchModal } from './components/SearchModal';
import { HomePage } from './pages/HomePage';
import { WorksPage } from './pages/WorksPage';
import { ArchitectsPage } from './pages/ArchitectsPage';
import { ContactPage } from './pages/ContactPage';
import { AdminDashboard } from './pages/AdminDashboard';

const MainApp: React.FC = () => {
  const { page } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#0a0a0a] antialiased">
      {/* Fixed Header */}
      <Header />

      {/* Primary Page Router */}
      <main className="flex-1">
        {page === 'home' && <HomePage />}
        {page === 'works' && <WorksPage />}
        {page === 'architects' && <ArchitectsPage />}
        {page === 'contact' && <ContactPage />}
        {page === 'admin' && <AdminDashboard />}
      </main>

      {/* Footer Colophon */}
      <Footer />

      {/* Interactive Global Modals */}
      <ProjectModal />
      <SearchModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
