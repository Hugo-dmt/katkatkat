import React, { useState } from 'react';
import { dataService, FirebaseConfig } from '../services/dataService';
import { X, Check, Database, Flame, Key, ExternalLink } from 'lucide-react';

interface FirebaseConfigModalProps {
  onClose: () => void;
}

export const FirebaseConfigModal: React.FC<FirebaseConfigModalProps> = ({ onClose }) => {
  const existing = dataService.getSavedFirebaseConfig() || {
    apiKey: '',
    authDomain: 'katkatkat-colloc.firebaseapp.com',
    projectId: 'katkatkat-colloc',
    storageBucket: 'katkatkat-colloc.firebasestorage.app',
    messagingSenderId: '',
    appId: '',
  };

  const [config, setConfig] = useState<FirebaseConfig>(existing);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    dataService.saveFirebaseConfig(config);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card" style={{ maxWidth: 540 }}>
        <div className="modal-header">
          <div className="modal-title">
            <Database size={20} color="var(--amber-700)" />
            <span>Configuration Firebase & Firestore</span>
          </div>
          <button onClick={onClose} style={{ color: 'var(--text-subtle)' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ background: 'var(--pine-50)', padding: 14, borderRadius: 'var(--radius-md)', marginBottom: 18, fontSize: 13, color: 'var(--pine-900)', lineHeight: 1.5 }}>
          <p style={{ fontWeight: 700, marginBottom: 4 }}>
            🔥 Statut de la base de données :
          </p>
          <p>
            L'application fonctionne actuellement avec un stockage local persistant (LocalStorage & state temps réel), pré-rempli avec les anciens colocataires, sondages et chalets de Noël.
          </p>
          <p style={{ marginTop: 6 }}>
            Si vous disposez d'un projet Firebase (Console Firebase &gt; Paramètres du projet &gt; Vos applications Web), vous pouvez renseigner vos clés ci-dessous pour activer le Cloud Firestore et Firebase Auth officiel.
          </p>
        </div>

        {saved && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: 'var(--pine-100)',
            color: 'var(--pine-700)',
            padding: '10px 14px',
            borderRadius: 'var(--radius-sm)',
            fontSize: 13,
            fontWeight: 600,
            marginBottom: 16
          }}>
            <Check size={16} />
            <span>Configuration enregistrée avec succès !</span>
          </div>
        )}

        <form onSubmit={handleSave}>
          <div className="form-group">
            <label className="form-label">API Key</label>
            <input
              type="text"
              className="form-input"
              placeholder="AIzaSy..."
              value={config.apiKey}
              onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div className="form-group">
              <label className="form-label">Project ID</label>
              <input
                type="text"
                className="form-input"
                placeholder="katkatkat-app"
                value={config.projectId}
                onChange={(e) => setConfig({ ...config, projectId: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Auth Domain</label>
              <input
                type="text"
                className="form-input"
                placeholder="katkatkat-app.firebaseapp.com"
                value={config.authDomain}
                onChange={(e) => setConfig({ ...config, authDomain: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div className="form-group">
              <label className="form-label">Storage Bucket</label>
              <input
                type="text"
                className="form-input"
                placeholder="katkatkat-app.appspot.com"
                value={config.storageBucket}
                onChange={(e) => setConfig({ ...config, storageBucket: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">App ID</label>
              <input
                type="text"
                className="form-input"
                placeholder="1:123456789:web:abcdef"
                value={config.appId}
                onChange={(e) => setConfig({ ...config, appId: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 }}>
            <a
              href="https://console.firebase.google.com/"
              target="_blank"
              rel="noreferrer"
              style={{ fontSize: 12.5, color: 'var(--pine-700)', display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'underline' }}
            >
              <span>Accéder à la Console Firebase</span>
              <ExternalLink size={12} />
            </a>

            <div style={{ display: 'flex', gap: 8 }}>
              <button type="button" onClick={onClose} className="btn-secondary">
                Fermer
              </button>
              <button type="submit" className="btn-primary">
                Enregistrer les clés
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
