import React from 'react';
import { ActiveTab, UserProfile } from '../types';
import { MessageSquare, Users, Home, Calendar, User, LogOut, Settings } from 'lucide-react';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  currentUser: UserProfile;
  onLogout: () => void;
  onOpenSettings: () => void;
  onOpenProfile: (user: UserProfile) => void;
  allUsers: UserProfile[];
  onSwitchUser: (userId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onLogout,
  onOpenSettings,
  onOpenProfile,
  allUsers,
  onSwitchUser,
}) => {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Brand */}
        <div 
          className="navbar-brand" 
          style={{ cursor: 'pointer' }}
          onClick={() => setActiveTab('feed')}
        >
          <img 
            src="./logo.jpg" 
            alt="katkatkat" 
            style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover', border: '1.5px solid #fff' }}
            onError={(e) => {
              // fallback if image not loaded
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <span>katkatkat</span>
          <span className="brand-badge">BBS Collocs</span>
        </div>

        {/* Tabs */}
        <div className="navbar-tabs">
          <button
            className={`nav-tab-btn ${activeTab === 'feed' ? 'active' : ''}`}
            onClick={() => setActiveTab('feed')}
          >
            <MessageSquare size={16} />
            <span>Le Mur</span>
          </button>

          <button
            className={`nav-tab-btn ${activeTab === 'directory' ? 'active' : ''}`}
            onClick={() => setActiveTab('directory')}
          >
            <Users size={16} />
            <span>L'Annuaire</span>
          </button>

          <button
            className={`nav-tab-btn ${activeTab === 'houses' ? 'active' : ''}`}
            onClick={() => setActiveTab('houses')}
          >
            <Home size={16} />
            <span>Maisons Noël</span>
          </button>

          <button
            className={`nav-tab-btn ${activeTab === 'birthdays' ? 'active' : ''}`}
            onClick={() => setActiveTab('birthdays')}
          >
            <Calendar size={16} />
            <span>Annivs</span>
          </button>
        </div>

        {/* User Pill & Quick Actions */}
        <div className="navbar-user">
          {/* Quick Colloc Switcher for Demo / Multi-test */}
          <select 
            value={currentUser.id} 
            onChange={(e) => onSwitchUser(e.target.value)}
            style={{
              background: 'rgba(255,255,255,0.1)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '9999px',
              padding: '4px 8px',
              fontSize: '12px',
              outline: 'none',
              cursor: 'pointer'
            }}
            title="Changer de colloc connecté"
          >
            {allUsers.map((u) => (
              <option key={u.id} value={u.id} style={{ color: '#111' }}>
                👤 {u.firstName} {u.lastName} {u.nickname ? `(${u.nickname})` : ''}
              </option>
            ))}
          </select>

          <div
            className="user-pill"
            onClick={() => onOpenProfile(currentUser)}
            title="Voir mon profil"
          >
            <img
              src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
              alt={currentUser.firstName}
              className="avatar-sm"
            />
            <span>{currentUser.nickname || currentUser.firstName}</span>
          </div>

          <button
            className="nav-tab-btn"
            style={{ padding: '6px 8px' }}
            onClick={() => setActiveTab('profile')}
            title="Éditer mon profil"
          >
            <User size={16} />
          </button>

          <button
            className="nav-tab-btn"
            style={{ padding: '6px 8px' }}
            onClick={onOpenSettings}
            title="Firebase & Paramètres"
          >
            <Settings size={16} />
          </button>

          <button
            className="nav-tab-btn"
            style={{ padding: '6px 8px', color: '#ffb3b5' }}
            onClick={onLogout}
            title="Déconnexion"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </nav>
  );
};
