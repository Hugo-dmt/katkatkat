import React, { useState } from 'react';
import { dataService } from '../services/dataService';
import { UserProfile } from '../types';
import { Lock, Mail, User, CheckCircle2, AlertCircle } from 'lucide-react';

interface AuthModalProps {
  onSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState<string | null>(null);

  const availableUsers = dataService.getUsers().slice(0, 6);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email) {
      setError('Veuillez renseigner votre email.');
      return;
    }
    const res = dataService.loginWithEmail(email, password);
    if (!res.success) {
      setError(res.error || 'Erreur de connexion');
    } else {
      const cur = dataService.getCurrentUser();
      if (cur) onSuccess(cur);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !firstName || !lastName) {
      setError('Prénom, Nom et Email sont obligatoires.');
      return;
    }
    const res = dataService.register(email, firstName, lastName, nickname);
    if (!res.success) {
      setError(res.error || "Erreur lors de l'inscription");
    } else if (res.user) {
      onSuccess(res.user);
    }
  };

  const handleGoogleLogin = () => {
    const user = dataService.loginWithGoogleMock();
    onSuccess(user);
  };

  const handleQuickSwitch = (u: UserProfile) => {
    dataService.switchUser(u.id);
    onSuccess(u);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card" style={{ maxWidth: 460 }}>
        {/* Brand header */}
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <img
            src="./logo.jpg"
            alt="katkatkat"
            style={{ width: 68, height: 68, borderRadius: '50%', margin: '0 auto 10px', display: 'block', border: '2px solid var(--pine-700)' }}
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, color: 'var(--pine-900)' }}>
            katkatkat
          </h1>
          <p style={{ fontSize: 13.5, color: 'var(--text-muted)' }}>
            Espace privé des 30 anciens du Kot 444
          </p>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: 'var(--pine-50)',
            color: 'var(--pine-700)',
            padding: '4px 10px',
            borderRadius: '9999px',
            fontSize: 11.5,
            fontWeight: 600,
            marginTop: 8
          }}>
            <Lock size={12} />
            Accès strictement réservé aux membres connectés
          </div>
        </div>

        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: 'var(--berry-100)',
            color: 'var(--berry-800)',
            padding: '10px 14px',
            borderRadius: 'var(--radius-sm)',
            fontSize: 13,
            marginBottom: 16
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Google SSO Button */}
        <button
          onClick={handleGoogleLogin}
          className="btn-secondary"
          style={{
            width: '100%',
            marginBottom: 16,
            border: '1.5px solid var(--border-dark)',
            padding: '11px',
            fontWeight: 600
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          Continuer avec Google (Firebase Auth)
        </button>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          margin: '16px 0',
          color: 'var(--text-subtle)',
          fontSize: 12
        }}>
          <div style={{ flex: 1, height: 1, background: 'var(--border-light)' }} />
          <span>ou par email et mot de passe</span>
          <div style={{ flex: 1, height: 1, background: 'var(--border-light)' }} />
        </div>

        {mode === 'login' ? (
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  className="form-input"
                  style={{ width: '100%', paddingLeft: 34 }}
                  placeholder="hugo@katkatkat.fr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Mail size={16} style={{ position: 'absolute', left: 10, top: 12, color: 'var(--text-subtle)' }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Mot de passe</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  className="form-input"
                  style={{ width: '100%', paddingLeft: 34 }}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Lock size={16} style={{ position: 'absolute', left: 10, top: 12, color: 'var(--text-subtle)' }} />
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: 8 }}>
              Se connecter
            </button>

            <div style={{ textAlign: 'center', marginTop: 14, fontSize: 13 }}>
              Nouveau colloc ?{' '}
              <button
                type="button"
                onClick={() => setMode('register')}
                style={{ color: 'var(--pine-700)', fontWeight: 700, textDecoration: 'underline' }}
              >
                Créer un compte
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Prénom *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Hugo"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Nom *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Demart"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Surnom dans la colloc (optionnel)</label>
              <input
                type="text"
                className="form-input"
                placeholder="Ex: Hugz, Toto, DJ..."
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email *</label>
              <input
                type="email"
                className="form-input"
                placeholder="votre.email@exemple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Mot de passe</label>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="btn-berry" style={{ width: '100%', marginTop: 8 }}>
              Créer mon compte (Kot 444)
            </button>

            <div style={{ textAlign: 'center', marginTop: 14, fontSize: 13 }}>
              Déjà un compte ?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                style={{ color: 'var(--pine-700)', fontWeight: 700, textDecoration: 'underline' }}
              >
                Se connecter
              </button>
            </div>
          </form>
        )}

        {/* Quick test pills */}
        <div style={{
          marginTop: 24,
          paddingTop: 16,
          borderTop: '1px dashed var(--border-light)',
          fontSize: 12
        }}>
          <p style={{ fontWeight: 600, color: 'var(--text-subtle)', marginBottom: 8 }}>
            ⚡ Connexion rapide (profils de démo pré-enregistrés) :
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {availableUsers.map((u) => (
              <button
                key={u.id}
                onClick={() => handleQuickSwitch(u)}
                style={{
                  padding: '4px 8px',
                  background: 'var(--bg-muted)',
                  borderRadius: 'var(--radius-full)',
                  fontSize: 11.5,
                  fontWeight: 600,
                  color: 'var(--text-main)',
                  border: '1px solid var(--border-light)'
                }}
              >
                {u.firstName} ({u.nickname || 'Colloc'})
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
