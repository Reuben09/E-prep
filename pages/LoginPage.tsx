
import React, { useState } from 'react';
import { User } from '../types';
import { login } from '../services/apiService';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import BrainCircuitIcon from '../components/icons/BrainCircuitIcon';

interface LoginPageProps {
  onLoginSuccess: (user: User) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('chinedu@eprep.com');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const user = await login(email, password);
      onLoginSuccess(user);
    } catch (err) {
      setError('Failed to login. Please check your credentials.');
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
                <p className="mt-2 text-gray-400">Sign in to continue your journey</p>
            </div>
            <form className="space-y-6" onSubmit={handleLogin}>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email address</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-brand-surface border border-brand-border rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
                    />
                </div>
                <div>
                     <label htmlFor="password"className="block text-sm font-medium text-gray-300">Password</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-brand-surface border border-brand-border rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
                    />
                </div>
                {error && <p className="text-red-400 text-sm">{error}</p>}
                <div>
                    <Button type="submit" className="w-full" isLoading={isLoading}>
                        Sign In
                    </Button>
                </div>
            </form>
       </Card>
    </div>
  );
};

export default LoginPage;
