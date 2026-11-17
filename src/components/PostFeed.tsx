import React, { useState } from 'react';
import { Post, UserProfile } from '../types';
import { PostCard } from './PostCard';
import { CreatePostModal } from './CreatePostModal';
import { getBirthdayInfo } from '../utils/ics';
import { 
  Plus, 
  Search, 
  Calendar, 
  Home, 
  BarChart2, 
  MessageSquare, 
  Flame, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface PostFeedProps {
  posts: Post[];
  currentUser: UserProfile;
  allUsers: UserProfile[];
  onOpenProfileById: (userId: string) => void;
  onNavigateTab: (tab: 'feed' | 'directory' | 'houses' | 'birthdays' | 'profile') => void;
  onRefresh: () => void;
}

export const PostFeed: React.FC<PostFeedProps> = ({
  posts,
  currentUser,
  allUsers,
  onOpenProfileById,
  onNavigateTab,
  onRefresh,
}) => {
  const [filter, setFilter] = useState<'all' | 'post' | 'poll' | 'house' | 'announcement'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createInitialType, setCreateInitialType] = useState<'post' | 'poll' | 'house'>('post');

  // Filter & Search
  const filteredPosts = posts.filter((p) => {
    if (filter !== 'all' && p.type !== filter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchContent = p.content.toLowerCase().includes(q);
      const matchAuthor = p.authorName.toLowerCase().includes(q);
      const matchTags = p.tags?.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchContent && !matchAuthor && !matchTags) return false;
    }
    return true;
  });

  // Calculate upcoming birthdays
  const upcomingBirthdays = allUsers
    .map((u) => ({
      user: u,
      info: getBirthdayInfo(u.birthDate),
    }))
    .filter((item) => item.info !== null)
    .sort((a, b) => (a.info!.diffDays) - (b.info!.diffDays))
    .slice(0, 3);

  // Houses stats
  const housePosts = posts.filter((p) => p.type === 'house' && p.house);

  return (
    <div>
      {/* BBS Hero Header */}
      <div className="bbs-hero">
        <div className="bbs-hero-title">
          <span>katkatkat • Kot 444</span>
        </div>
        <p className="bbs-hero-desc">
          Hub privé des 30 anciens du 444 : adresses postales, sondages et sélection de la maison pour le week-end de Noël.
        </p>

        <div className="bbs-hero-stats">
          <div className="hero-stat-chip">
            👥 <span>{allUsers.length} membres enregistrés</span>
          </div>
          <div className="hero-stat-chip">
            🏡 <span>{housePosts.length} gîtes proposés</span>
          </div>
          <div className="hero-stat-chip">
            🎄 <span>Week-end de Noël annuel</span>
          </div>
        </div>
      </div>

      <div className="feed-layout">
        {/* Main Feed Column */}
        <div>
          {/* Quick Trigger Bar */}
          <div
            className="card"
            style={{
              padding: '12px 16px',
              marginBottom: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              background: '#ffffff',
            }}
          >
            <div
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                background: 'var(--bg-muted)',
                padding: '9px 14px',
                borderRadius: 'var(--radius-full)',
                cursor: 'pointer',
                color: 'var(--text-muted)',
                fontSize: 13.5,
              }}
              onClick={() => {
                setCreateInitialType('post');
                setIsCreateOpen(true);
              }}
            >
              <img
                src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                alt=""
                className="avatar-sm"
              />
              <span>Écrire un message pour le groupe...</span>
            </div>

            <div style={{ display: 'flex', gap: 6 }}>
              <button
                className="btn-secondary btn-sm"
                onClick={() => {
                  setCreateInitialType('poll');
                  setIsCreateOpen(true);
                }}
                title="Lancer un sondage"
              >
                <BarChart2 size={15} color="var(--pine-700)" />
                <span>Sondage</span>
              </button>

              <button
                className="btn-berry btn-sm"
                onClick={() => {
                  setCreateInitialType('house');
                  setIsCreateOpen(true);
                }}
                title="Proposer une maison pour Noël"
              >
                <Home size={15} />
                <span>Maison</span>
              </button>
            </div>
          </div>

          {/* Filter Bar & Search */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 16 }}>
            <div className="filter-bar" style={{ margin: 0, padding: 0 }}>
              <button
                className={`filter-chip ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                Tous les posts ({posts.length})
              </button>

              <button
                className={`filter-chip ${filter === 'post' ? 'active' : ''}`}
                onClick={() => setFilter('post')}
              >
                <MessageSquare size={13} />
                <span>Discussions</span>
              </button>

              <button
                className={`filter-chip ${filter === 'poll' ? 'active' : ''}`}
                onClick={() => setFilter('poll')}
              >
                <BarChart2 size={13} />
                <span>Sondages ({posts.filter((p) => p.type === 'poll').length})</span>
              </button>

              <button
                className={`filter-chip ${filter === 'house' ? 'active' : ''}`}
                onClick={() => setFilter('house')}
              >
                <Home size={13} />
                <span>Maisons Noël ({housePosts.length})</span>
              </button>

              <button
                className={`filter-chip ${filter === 'announcement' ? 'active' : ''}`}
                onClick={() => setFilter('announcement')}
              >
                <span>📢 Annonces</span>
              </button>
            </div>

            {/* Search */}
            <div style={{ position: 'relative', minWidth: 200 }}>
              <input
                type="text"
                className="form-input"
                style={{ padding: '6px 10px 6px 30px', fontSize: 13, borderRadius: 'var(--radius-full)' }}
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search size={14} style={{ position: 'absolute', left: 10, top: 9, color: 'var(--text-subtle)' }} />
            </div>
          </div>

          {/* Posts List */}
          {filteredPosts.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
              <p style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>Aucun message correspondant</p>
              <p style={{ fontSize: 13.5 }}>Soyez le premier à poster ou modifiez vos critères de recherche !</p>
            </div>
          ) : (
            filteredPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                currentUser={currentUser}
                onOpenProfileById={onOpenProfileById}
              />
            ))
          )}
        </div>

        {/* Sidebar Column */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Upcoming Birthdays Widget */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: 14 }}>
                <Calendar size={16} color="var(--berry-700)" />
                <span>Prochains Annivs</span>
              </div>
              <button
                onClick={() => onNavigateTab('birthdays')}
                style={{ fontSize: 12, color: 'var(--pine-700)', fontWeight: 600 }}
              >
                Tout voir →
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {upcomingBirthdays.map(({ user, info }) => (
                <div
                  key={user.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    cursor: 'pointer',
                    padding: '4px',
                    borderRadius: 'var(--radius-sm)',
                  }}
                  onClick={() => onOpenProfileById(user.id)}
                >
                  <img
                    src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                    alt={user.firstName}
                    className="avatar-sm"
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {user.firstName} {user.nickname ? `(${user.nickname})` : ''}
                    </p>
                    <p style={{ fontSize: 11.5, color: 'var(--text-subtle)' }}>
                      {info?.formattedDate} ({info?.nextAge} ans)
                    </p>
                  </div>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: info?.isToday ? '#ffffff' : 'var(--berry-700)',
                      background: info?.isToday ? 'var(--berry-700)' : 'var(--berry-100)',
                      padding: '2px 6px',
                      borderRadius: 'var(--radius-full)',
                    }}
                  >
                    {info?.isToday ? "AUJOURD'HUI !" : `Dans ${info?.diffDays}j`}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Houses Widget */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: 14 }}>
                <Home size={16} color="var(--pine-700)" />
                <span>Week-end de Noël</span>
              </div>
              <button
                onClick={() => onNavigateTab('houses')}
                style={{ fontSize: 12, color: 'var(--pine-700)', fontWeight: 600 }}
              >
                Comparer →
              </button>
            </div>

            <p style={{ fontSize: 12.5, color: 'var(--text-muted)', marginBottom: 12, lineHeight: 1.5 }}>
              On cherche la maison idéale pour accueillir la trentaine de collocs !
            </p>

            <button
              className="btn-berry"
              style={{ width: '100%', fontSize: 12.5, padding: '8px 12px' }}
              onClick={() => {
                setCreateInitialType('house');
                setIsCreateOpen(true);
              }}
            >
              <Plus size={14} />
              <span>Proposer un gîte / chalet</span>
            </button>
          </div>

          {/* Directory Quick Link */}
          <div
            className="card"
            style={{
              background: 'var(--pine-50)',
              border: '1px solid var(--pine-100)',
              cursor: 'pointer',
            }}
            onClick={() => onNavigateTab('directory')}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--pine-900)' }}>
                  📖 Annuaire & Adresses
                </p>
                <p style={{ fontSize: 12, color: 'var(--pine-700)', marginTop: 2 }}>
                  Copiez en 1 clic l'adresse de n'importe quel colloc.
                </p>
              </div>
              <ArrowRight size={16} color="var(--pine-800)" />
            </div>
          </div>
        </aside>
      </div>

      {/* Modal create post */}
      {isCreateOpen && (
        <CreatePostModal
          initialType={createInitialType}
          onClose={() => setIsCreateOpen(false)}
          onPostCreated={() => {
            onRefresh();
          }}
        />
      )}
    </div>
  );
};
