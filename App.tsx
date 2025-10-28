
import React, { useState } from 'react';
import { User } from './types';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import QuizFlowPage from './pages/QuizFlowPage';

type Page = 'login' | 'dashboard' | 'quiz';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>('login');

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    setCurrentPage('dashboard');
  };
  
  const handleLogout = () => {
    setUser(null);
    setCurrentPage('login');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <LoginPage onLoginSuccess={handleLoginSuccess} />;
      case 'dashboard':
        return user && <DashboardPage user={user} onStartQuiz={() => setCurrentPage('quiz')} />;
      case 'quiz':
        return <QuizFlowPage onBackToDashboard={() => setCurrentPage('dashboard')} />;
      default:
        return <LoginPage onLoginSuccess={handleLoginSuccess} />;
    }
  };
  
  return (
    <main className="min-h-screen">
      {user && (
         <header className="bg-brand-surface/80 backdrop-blur-lg border-b border-brand-border sticky top-0 z-50">
           <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
             <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-primary to-brand-secondary">Eprep</div>
             <div>
               <span className="mr-4 text-gray-300">Hello, {user.name}</span>
               <button onClick={handleLogout} className="px-4 py-2 text-sm font-medium rounded-md bg-brand-surface border border-brand-border hover:bg-white/10">
                 Logout
               </button>
             </div>
           </nav>
         </header>
      )}
      {renderPage()}
    </main>
  );
};

export default App;
