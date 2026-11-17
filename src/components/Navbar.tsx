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
    <>
      {/* Top Navbar */}
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
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <span>katkatkat</span>
            <span className="brand-badge">Kot 444</span>
          </div>

          {/* Desktop Navigation Tabs */}
          <div className="navbar-tabs-desktop">
            <button
              className={`nav-tab-btn ${activeTab === 'feed' ? 'active' : ''}`}
              onClick={() => setActiveTab('feed')}
            >
              <MessageSquare size={15} />
              <span>Le Mur</span>
            </button>

            <button
              className={`nav-tab-btn ${activeTab === 'directory' ? 'active' : ''}`}
              onClick={() => setActiveTab('directory')}
            >
              <Users size={15} />
              <span>L'Annuaire</span>
            </button>

            <button
              className={`nav-tab-btn ${activeTab === 'houses' ? 'active' : ''}`}
              onClick={() => setActiveTab('houses')}
            >
              <Home size={15} />
              <span>Maisons Noël</span>
            </button>

            <button
              className={`nav-tab-btn ${activeTab === 'birthdays' ? 'active' : ''}`}
              onClick={() => setActiveTab('birthdays')}
            >
              <Calendar size={15} />
              <span>Annivs</span>
            </button>
          </div>

          {/* User & Actions */}
          <div className="navbar-user-actions">
            {/* Desktop Colloc Switcher */}
            <div className="desktop-only-item">
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
                title="Changer de colocataire connecté"
              >
                {allUsers.map((u) => (
                  <option key={u.id} value={u.id} style={{ color: '#111' }}>
                    👤 {u.firstName} {u.nickname ? `(${u.nickname})` : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* User Pill */}
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

            {/* Desktop profile edit button */}
            <button
              className="nav-tab-btn desktop-only-item"
              style={{ padding: '6px 8px' }}
              onClick={() => setActiveTab('profile')}
              title="Éditer mon profil"
            >
              <User size={16} />
            </button>

            {/* Settings */}
            <button
              className="nav-tab-btn"
              style={{ padding: '6px 8px' }}
              onClick={onOpenSettings}
              title="Configuration Firebase"
            >
              <Settings size={16} />
            </button>

            {/* Logout */}
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

      {/* Mobile Bottom Navigation Bar */}
      <div className="bottom-nav">
        <button
          className={`bottom-nav-item ${activeTab === 'feed' ? 'active' : ''}`}
          onClick={() => setActiveTab('feed')}
        >
          <MessageSquare size={18} />
          <span>Le Mur</span>
        </button>

        <button
          className={`bottom-nav-item ${activeTab === 'directory' ? 'active' : ''}`}
          onClick={() => setActiveTab('directory')}
        >
          <Users size={18} />
          <span>Annuaire</span>
        </button>

        <button
          className={`bottom-nav-item ${activeTab === 'houses' ? 'active' : ''}`}
          onClick={() => setActiveTab('houses')}
        >
          <Home size={18} />
          <span>Maisons</span>
        </button>

        <button
          className={`bottom-nav-item ${activeTab === 'birthdays' ? 'active' : ''}`}
          onClick={() => setActiveTab('birthdays')}
        >
          <Calendar size={18} />
          <span>Annivs</span>
        </button>

        <button
          className={`bottom-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <User size={18} />
          <span>Profil</span>
        </button>
      </div>
    </>
  );
};
