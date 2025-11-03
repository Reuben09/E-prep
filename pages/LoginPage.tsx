import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner'; // Assuming you have sonner for toasts
import { z } from 'zod'; // For schema validation
import { useAuth } from '../contexts/AuthContext'; // Assuming AuthContext is in this path

// Keep your existing UI components
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import BrainCircuitIcon from '../components/icons/BrainCircuitIcon'; // Your custom Brain icon

// Define Zod schemas for form validation
const signUpSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const AuthPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState(''); // For signup
  const [isLoading, setIsLoading] = useState(false);
  // Removed local 'error' state, relying on toast for feedback
  
  const { signUp, signIn, user } = useAuth(); // Get auth functions and user from context
  const navigate = useNavigate();

  // Redirect if already logged in
  if (user) {
    navigate('/dashboard'); // Navigate to dashboard or home page after successful login
    return null;
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const data = { email, password };

    try {
      const validation = signInSchema.safeParse(data);
      if (!validation.success) {
        toast.error(validation.error.errors[0].message);
        return; // Exit if validation fails
      }

      const { error } = await signIn(email, password);
      
      if (error) {
        if (error.message.includes('Invalid')) {
          toast.error('Invalid email or password');
        } else {
          toast.error(error.message || 'Failed to sign in');
        }
      } else {
        toast.success('Signed in successfully!');
        // Redirection handled by the `if (user)` block above
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const data = { fullName, email, password };

    try {
      const validation = signUpSchema.safeParse(data);
      if (!validation.success) {
        toast.error(validation.error.errors[0].message);
        return; // Exit if validation fails
      }

      const { error } = await signUp(email, password, fullName);
      
      if (error) {
        if (error.message.includes('already registered')) {
          toast.error('An account with this email already exists');
        } else {
          toast.error(error.message || 'Failed to sign up');
        }
      } else {
        toast.success('Account created successfully! Please sign in.');
        // Optionally switch to sign-in tab after successful sign-up
        setActiveTab('signin');
        // Clear sign-up specific states
        setFullName('');
        setPassword(''); 
        // Keep email for easier sign-in, or clear as per UX
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-grid-pattern">
       <div className="absolute inset-0 bg-brand-bg opacity-90"></div>
       <Card className="w-full max-w-md z-10 p-8 space-y-6">
            <div className="text-center">
                <BrainCircuitIcon className="mx-auto h-12 w-12 text-brand-primary"/>
                <h2 className="mt-4 text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-primary to-brand-secondary">
                    Welcome to Eprep
                </h2>
                <p className="mt-2 text-gray-400">Sign in or create an account to continue your journey</p>
            </div>

            {/* Tab Navigation */}
            <div className="flex justify-center mb-6">
              <button 
                className={`px-4 py-2 text-sm font-medium rounded-l-md ${activeTab === 'signin' ? 'bg-brand-primary text-white' : 'bg-brand-surface text-gray-400 hover:bg-brand-border'}`}
                onClick={() => setActiveTab('signin')}
                disabled={isLoading}
              >
                Sign In
              </button>
              <button 
                className={`px-4 py-2 text-sm font-medium rounded-r-md ${activeTab === 'signup' ? 'bg-brand-primary text-white' : 'bg-brand-surface text-gray-400 hover:bg-brand-border'}`}
                onClick={() => setActiveTab('signup')}
                disabled={isLoading}
              >
                Sign Up
              </button>
            </div>

            {activeTab === 'signin' && (
              <form className="space-y-6" onSubmit={handleSignIn}>
                  <div>
                      <label htmlFor="signin-email" className="block text-sm font-medium text-gray-300">Email address</label>
                      <input
                          id="signin-email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={isLoading}
                          className="mt-1 block w-full px-3 py-2 bg-brand-surface border border-brand-border rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
                      />
                  </div>
                  <div>
                      <label htmlFor="signin-password"className="block text-sm font-medium text-gray-300">Password</label>
                      <input
                          id="signin-password"
                          name="password"
                          type="password"
                          autoComplete="current-password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          disabled={isLoading}
                          className="mt-1 block w-full px-3 py-2 bg-brand-surface border border-brand-border rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
                      />
                  </div>
                  {/* Removed local error display, using toast */}
                  <div>
                      <Button type="submit" className="w-full" isLoading={isLoading}>
                          {isLoading ? 'Signing In...' : 'Sign In'}
                      </Button>
                  </div>
              </form>
            )}

            {activeTab === 'signup' && (
              <form className="space-y-6" onSubmit={handleSignUp}>
                  <div>
                      <label htmlFor="signup-fullname" className="block text-sm font-medium text-gray-300">Full Name</label>
                      <input
                          id="signup-fullname"
                          name="fullName"
                          type="text"
                          autoComplete="name"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          disabled={isLoading}
                          className="mt-1 block w-full px-3 py-2 bg-brand-surface border border-brand-border rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
                      />
                  </div>
                  <div>
                      <label htmlFor="signup-email" className="block text-sm font-medium text-gray-300">Email address</label>
                      <input
                          id="signup-email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={isLoading}
                          className="mt-1 block w-full px-3 py-2 bg-brand-surface border border-brand-border rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
                      />
                  </div>
                  <div>
                      <label htmlFor="signup-password"className="block text-sm font-medium text-gray-300">Password</label>
                      <input
                          id="signup-password"
                          name="password"
                          type="password"
                          autoComplete="new-password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          disabled={isLoading}
                          className="mt-1 block w-full px-3 py-2 bg-brand-surface border border-brand-border rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
                      />
                  </div>
                  <div>
                      <Button type="submit" className="w-full" isLoading={isLoading}>
                          {isLoading ? 'Creating Account...' : 'Create Account'}
                      </Button>
                  </div>
              </form>
            )}
       </Card>
    </div>
  );
};

export default AuthPage;