import React, { useState, useEffect } from 'react';
import { ActiveTab, UserProfile, Post } from './types';
import { dataService } from './services/dataService';
import { Navbar } from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import { PostFeed } from './components/PostFeed';
import { Directory } from './components/Directory';
import { HousesHub } from './components/HousesHub';
import { BirthdaysHub } from './components/BirthdaysHub';
import { ProfileEditor } from './components/ProfileEditor';
import { ProfileModal } from './components/ProfileModal';
import { FirebaseConfigModal } from './components/FirebaseConfigModal';

export const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(dataService.getCurrentUser());
  const [activeTab, setActiveTab] = useState<ActiveTab>('feed');
  const [users, setUsers] = useState<UserProfile[]>(dataService.getUsers());
  const [posts, setPosts] = useState<Post[]>(dataService.getPosts());

  // Modals
  const [selectedUserForModal, setSelectedUserForModal] = useState<UserProfile | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = dataService.subscribe(() => {
      setCurrentUser(dataService.getCurrentUser());
      setUsers(dataService.getUsers());
      setPosts(dataService.getPosts());
    });
    return unsubscribe;
  }, []);

  const handleOpenProfileById = (userId: string) => {
    const found = users.find((u) => u.id === userId);
    if (found) {
      setSelectedUserForModal(found);
    }
  };

  const handleLogout = () => {
    dataService.logout();
    setCurrentUser(null);
  };

  const handleSwitchUser = (userId: string) => {
    dataService.switchUser(userId);
    const updated = dataService.getCurrentUser();
    if (updated) setCurrentUser(updated);
  };

  // If not logged in, show AuthModal
  if (!currentUser) {
    return <AuthModal onSuccess={(u) => setCurrentUser(u)} />;
  }

  return (
    <div className="app-container">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenProfile={(u) => setSelectedUserForModal(u)}
        allUsers={users}
        onSwitchUser={handleSwitchUser}
      />

      <main className="main-content">
        {activeTab === 'feed' && (
          <PostFeed
            posts={posts}
            currentUser={currentUser}
            allUsers={users}
            onOpenProfileById={handleOpenProfileById}
            onNavigateTab={setActiveTab}
            onRefresh={() => setPosts(dataService.getPosts())}
          />
        )}

        {activeTab === 'directory' && (
          <Directory
            users={users}
            onOpenProfile={(u) => setSelectedUserForModal(u)}
          />
        )}

        {activeTab === 'houses' && (
          <HousesHub
            posts={posts}
            currentUser={currentUser}
            onRefresh={() => setPosts(dataService.getPosts())}
            onOpenProfileById={handleOpenProfileById}
          />
        )}

        {activeTab === 'birthdays' && (
          <BirthdaysHub
            users={users}
            onOpenProfile={(u) => setSelectedUserForModal(u)}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileEditor
            currentUser={currentUser}
            onSave={() => {
              setCurrentUser(dataService.getCurrentUser());
              setUsers(dataService.getUsers());
            }}
          />
        )}
      </main>

      {/* Member Profile Modal */}
      {selectedUserForModal && (
        <ProfileModal
          user={selectedUserForModal}
          currentUser={currentUser}
          posts={posts}
          onClose={() => setSelectedUserForModal(null)}
          onOpenProfileById={handleOpenProfileById}
        />
      )}

      {/* Firebase Config Modal */}
      {isSettingsOpen && (
        <FirebaseConfigModal onClose={() => setIsSettingsOpen(false)} />
      )}
    </div>
  );
};

export default App;
