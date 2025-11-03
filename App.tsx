import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/LoginPage'; // Assuming LoginPage is now AuthPage
import DashboardPage from './pages/DashboardPage';
import QuizFlowPage from './pages/QuizFlowPage';
import { AuthProvider, useAuth } from './contexts/AuthContext'; // Import useAuth
import { Toaster } from 'sonner'; // For displaying toasts globally

// A simple PrivateRoute component to protect authenticated routes
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoadingAuth } = useAuth();

  if (isLoadingAuth) {
    // Optionally render a loading spinner or skeleton screen here
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Loading authentication...
      </div>
    );
  }

  return user ? <>{children}</> : <Navigate to="/auth" replace />;
};

const AppContent: React.FC = () => {
  const { user, signOut } = useAuth(); // Get user and signOut from AuthContext

  const handleLogout = async () => {
    await signOut(); // Call signOut from context
    // No need to navigate here, the PrivateRoute will handle redirection if user becomes null
  };

  return (
    <main className="min-h-screen">
      {user && (
         <header className="bg-brand-surface/80 backdrop-blur-lg border-b border-brand-border sticky top-0 z-50">
           <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
             <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-primary to-brand-secondary">Eprep</div>
             <div>
               <span className="mr-4 text-gray-300">Hello, {user.fullName || user.email}</span> {/* Use user.fullName if available, otherwise email */}
               <button onClick={handleLogout} className="px-4 py-2 text-sm font-medium rounded-md bg-brand-surface border border-brand-border hover:bg-white/10">
                 Logout
               </button>
             </div>
           </nav>
         </header>
      )}
      
      <Routes>
        {/* Public route for authentication */}
        <Route path="/auth" element={<AuthPage />} />

        {/* Protected routes */}
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <DashboardPage /> {/* DashboardPage now receives user from context if needed internally */}
            </PrivateRoute>
          } 
        />
        <Route 
          path="/quiz" 
          element={
            <PrivateRoute>
              <QuizFlowPage /> {/* QuizFlowPage can also fetch user from context */}
            </PrivateRoute>
          } 
        />

        {/* Redirect root to dashboard if logged in, otherwise to auth */}
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Navigate to="/auth" />} />
        
        {/* Fallback for unknown routes */}
        <Route path="*" element={<p className="text-center text-red-500 mt-10">404: Page Not Found</p>} />
      </Routes>
    </main>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
        <Toaster /> {/* Toasts will be available throughout the app */}
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;