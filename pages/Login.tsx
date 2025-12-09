import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Button, Input } from '../components/UI';
import { Hexagon } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
        // Attempt login
        const res = await api.login({ username, password });
        if (res.code === 1) {
            localStorage.setItem('token', 'Bearer mock-token-12345'); // In real app, res.data.token
            localStorage.setItem('user', JSON.stringify(res.data || { username, realName: 'Admin User' }));
            navigate('/');
        } else {
            setError(res.msg || 'Login failed');
        }
    } catch (err) {
        // For demonstration when API is not running, allow fallback entry
        console.warn("API Error, using fallback login for demo");
        localStorage.setItem('token', 'Bearer demo-token');
        localStorage.setItem('user', JSON.stringify({ username, realName: 'Demo User' }));
        navigate('/');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8">
          <div className="flex justify-center mb-8">
             <div className="bg-blue-600 p-3 rounded-xl text-white">
                <Hexagon size={32} />
             </div>
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">{t('welcomeBack')}</h2>
          <p className="text-center text-gray-500 mb-8">{t('signInToAccount')}</p>

          <form onSubmit={handleLogin} className="space-y-6">
            <Input
              label={t('username')}
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={t('enterUsername')}
              required
            />
            
            <Input
              label={t('password')}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('enterPassword')}
              required
            />

            {error && <div className="text-red-500 text-sm text-center">{error}</div>}

            <div className="flex items-center justify-between text-sm">
                <label className="flex items-center text-gray-500 cursor-pointer">
                    <input type="checkbox" className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"/>
                    {t('rememberMe')}
                </label>
                <a href="#" className="text-blue-600 hover:underline">{t('forgotPassword')}</a>
            </div>

            <Button type="submit" className="w-full py-3" isLoading={loading}>
              {t('signIn')}
            </Button>
          </form>
        </div>
        <div className="bg-gray-50 px-8 py-4 border-t border-gray-100 text-center text-sm text-gray-500">
          {t('noAccount')} <a href="#" className="text-blue-600 font-medium hover:underline">{t('contactHR')}</a>
        </div>
      </div>
    </div>
  );
};

export default Login;