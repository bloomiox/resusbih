import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Page } from '../../types';

interface LoginPageProps {
  setCurrentPage: (page: Page) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ setCurrentPage }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const success = await login(email, password);
      if (success) {
        setCurrentPage(Page.Admin);
      } else {
        setError('Neispravni podaci za prijavu');
      }
    } catch (error) {
      setError('Greška pri prijavi. Molimo pokušajte ponovo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-gray py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <img 
            src="https://pub-7d86d5f2e97b46c0a2c2ed8485d9788b.r2.dev/RESUSBIH%20LOGO.png" 
            alt="RESUSBIH Logo" 
            className="h-16 w-auto mx-auto mb-4"
          />
          <h2 className="text-3xl font-black text-brand-blue tracking-wider">
            RESUSBIH
          </h2>
          <h3 className="mt-2 text-xl font-bold text-gray-900">
            Admin Panel
          </h3>
          <p className="mt-2 text-sm text-gray-600">
            Prijavite se za pristup CMS-u
          </p>
        </div>
        <form className="mt-8 bg-white p-8 rounded-lg shadow-sm border border-gray-200" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email adresa
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                placeholder="office@resusbih.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Lozinka
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                placeholder="Unesite lozinku"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg mt-4">{error}</div>
          )}

          <div className="mt-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-brand-blue hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue transition-colors duration-200"
            >
              {loading ? 'Prijavljivanje...' : 'Prijavite se'}
            </button>
          </div>
        </form>
        
        <div className="text-center">
          <button
            type="button"
            onClick={() => setCurrentPage(Page.Home)}
            className="text-brand-blue hover:text-blue-800 text-sm font-medium transition-colors duration-200"
          >
            ← Povratak na početnu
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;