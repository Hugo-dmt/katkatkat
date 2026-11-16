import React, { useState } from 'react';
import { Post, UserProfile } from '../types';
import { dataService } from '../services/dataService';
import { CreatePostModal } from './CreatePostModal';
import { 
  Home, 
  Plus, 
  Flame, 
  ThumbsUp, 
  DollarSign, 
  XCircle, 
  ExternalLink, 
  Users, 
  Bed, 
  Bath, 
  MapPin, 
  Sparkles,
  ArrowUpDown
} from 'lucide-react';

interface HousesHubProps {
  posts: Post[];
  currentUser: UserProfile;
  onRefresh: () => void;
  onOpenProfileById: (userId: string) => void;
}

export const HousesHub: React.FC<HousesHubProps> = ({
  posts,
  currentUser,
  onRefresh,
  onOpenProfileById,
}) => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'love' | 'priceAsc' | 'capacityDesc'>('love');

  const housePosts = posts.filter((p) => p.type === 'house' && p.house);

  const sortedHouses = [...housePosts].sort((a, b) => {
    const ha = a.house!;
    const hb = b.house!;
    if (sortBy === 'love') {
      const aLove = Object.values(ha.ratings || {}).filter((r) => r === 'love').length;
      const bLove = Object.values(hb.ratings || {}).filter((r) => r === 'love').length;
      return bLove - aLove;
    }
    if (sortBy === 'priceAsc') {
      return ha.pricePerPerson - hb.pricePerPerson;
    }
    if (sortBy === 'capacityDesc') {
      return hb.capacity - ha.capacity;
    }
    return 0;
  });

  const handleRate = (postId: string, rating: 'love' | 'good' | 'meh' | 'pass') => {
    dataService.rateHouse(postId, rating);
    onRefresh();
  };

  return (
    <div>
      {/* Header */}
      <div className="card" style={{ marginBottom: 24, padding: 24, background: '#fff' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, color: 'var(--pine-900)' }}>
              🏡 Grand Week-end de Noël : Choix de la Maison
            </h1>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 4 }}>
              On rassemble la trentaine de collocs ! Proposez vos trouvailles, comparez les tarifs et votez pour votre coup de cœur.
            </p>
          </div>

          <button
            className="btn-berry"
            onClick={() => setIsCreateOpen(true)}
            style={{ gap: 8 }}
          >
            <Plus size={16} />
            <span>Proposer un gîte / chalet</span>
          </button>
        </div>

        {/* Sort & Filter pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 18, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-subtle)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <ArrowUpDown size={14} /> Trier par :
          </span>

          <button
            className={`filter-chip ${sortBy === 'love' ? 'active' : ''}`}
            onClick={() => setSortBy('love')}
          >
            <Flame size={13} />
            <span>Coups de cœur en tête</span>
          </button>

          <button
            className={`filter-chip ${sortBy === 'priceAsc' ? 'active' : ''}`}
            onClick={() => setSortBy('priceAsc')}
          >
            <DollarSign size={13} />
            <span>Prix par personne croissant</span>
          </button>

          <button
            className={`filter-chip ${sortBy === 'capacityDesc' ? 'active' : ''}`}
            onClick={() => setSortBy('capacityDesc')}
          >
            <Users size={13} />
            <span>Plus grande capacité</span>
          </button>
        </div>
      </div>

      {/* Comparison Scorecard Summary */}
      {sortedHouses.length > 0 && (
        <div className="card" style={{ marginBottom: 24, padding: 18, overflowX: 'auto' }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Sparkles size={16} color="var(--amber-700)" />
            Tableau comparatif rapide
          </h2>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-light)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '8px 12px' }}>Chalet / Gîte</th>
                <th style={{ padding: '8px 12px' }}>Lieu</th>
                <th style={{ padding: '8px 12px' }}>Couchages</th>
                <th style={{ padding: '8px 12px' }}>Prix / pers</th>
                <th style={{ padding: '8px 12px' }}>Total</th>
                <th style={{ padding: '8px 12px' }}>Coups de cœur</th>
                <th style={{ padding: '8px 12px' }}>Lien</th>
              </tr>
            </thead>
            <tbody>
              {sortedHouses.map((p) => {
                const h = p.house!;
                const loves = Object.values(h.ratings || {}).filter((r) => r === 'love').length;
                return (
                  <tr key={p.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '10px 12px', fontWeight: 700, color: 'var(--text-main)' }}>
                      {h.title}
                    </td>
                    <td style={{ padding: '10px 12px', color: 'var(--text-muted)' }}>
                      {h.location}
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <span style={{ fontWeight: 600 }}>{h.capacity} pers</span> ({h.bedrooms} ch)
                    </td>
                    <td style={{ padding: '10px 12px', fontWeight: 700, color: 'var(--pine-700)' }}>
                      {h.pricePerPerson} €
                    </td>
                    <td style={{ padding: '10px 12px', color: 'var(--text-subtle)' }}>
                      {h.priceTotal} €
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--berry-700)', fontWeight: 700 }}>
                        <Flame size={13} /> {loves}
                      </span>
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      {h.url && (
                        <a
                          href={h.url}
                          target="_blank"
                          rel="noreferrer"
                          style={{ color: 'var(--pine-700)', textDecoration: 'underline', fontSize: 12 }}
                        >
                          Annonce ↗
                        </a>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* List of full House Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {sortedHouses.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: 40 }}>
            <Home size={36} color="var(--pine-600)" style={{ margin: '0 auto 12px' }} />
            <p style={{ fontSize: 16, fontWeight: 700 }}>Aucune maison proposée pour l'instant</p>
            <p style={{ fontSize: 13.5, color: 'var(--text-muted)', marginTop: 4, marginBottom: 16 }}>
              Soyez le premier à dénicher le chalet de notre prochain week-end de Noël !
            </p>
            <button className="btn-primary" onClick={() => setIsCreateOpen(true)}>
              <Plus size={16} />
              <span>Proposer une maison</span>
            </button>
          </div>
        ) : (
          sortedHouses.map((post) => {
            const h = post.house!;
            const loves = Object.values(h.ratings || {}).filter((r) => r === 'love').length;
            const goods = Object.values(h.ratings || {}).filter((r) => r === 'good').length;
            const mehs = Object.values(h.ratings || {}).filter((r) => r === 'meh').length;
            const passes = Object.values(h.ratings || {}).filter((r) => r === 'pass').length;

            return (
              <div key={post.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ display: 'grid', gridTemplateColumns: h.photos?.length ? '360px 1fr' : '1fr', minHeight: 240 }}>
                  {h.photos?.length > 0 && (
                    <div style={{ position: 'relative', height: '100%', minHeight: 220, background: '#000' }}>
                      <img
                        src={h.photos[0]}
                        alt={h.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          top: 12,
                          left: 12,
                          background: 'rgba(15, 36, 28, 0.85)',
                          backdropFilter: 'blur(4px)',
                          color: '#fff',
                          padding: '4px 10px',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        📍 {h.location}
                      </div>

                      <div
                        style={{
                          position: 'absolute',
                          bottom: 12,
                          right: 12,
                          background: 'var(--pine-900)',
                          color: '#fff',
                          padding: '6px 12px',
                          borderRadius: 'var(--radius-md)',
                          fontWeight: 700,
                          fontSize: 15,
                        }}
                      >
                        {h.pricePerPerson}€ <span style={{ fontSize: 11, fontWeight: 400 }}>/ personne</span>
                      </div>
                    </div>
                  )}

                  <div style={{ padding: 22, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-main)' }}>
                            {h.title}
                          </h2>
                          <p style={{ fontSize: 12.5, color: 'var(--text-subtle)', marginTop: 2 }}>
                            Proposé par{' '}
                            <strong 
                              style={{ color: 'var(--text-main)', cursor: 'pointer', textDecoration: 'underline' }}
                              onClick={() => onOpenProfileById(post.authorId)}
                            >
                              {post.authorName}
                            </strong>
                          </p>
                        </div>

                        {h.url && (
                          <a
                            href={h.url}
                            target="_blank"
                            rel="noreferrer"
                            className="btn-secondary btn-sm"
                            style={{ gap: 4 }}
                          >
                            <span>Voir l'annonce originale</span>
                            <ExternalLink size={12} />
                          </a>
                        )}
                      </div>

                      <p style={{ fontSize: 14, color: 'var(--text-main)', margin: '12px 0', lineHeight: 1.5 }}>
                        {post.content}
                      </p>

                      {/* Specs */}
                      <div className="house-specs-grid" style={{ margin: '10px 0' }}>
                        <div className="house-spec-item">
                          <Users size={16} color="var(--pine-700)" />
                          <span className="spec-val">{h.capacity} pers</span>
                          <span className="spec-label">Couchages</span>
                        </div>
                        <div className="house-spec-item">
                          <Bed size={16} color="var(--pine-700)" />
                          <span className="spec-val">{h.bedrooms}</span>
                          <span className="spec-label">Chambres</span>
                        </div>
                        <div className="house-spec-item">
                          <Bath size={16} color="var(--pine-700)" />
                          <span className="spec-val">{h.bathrooms}</span>
                          <span className="spec-label">Salles d'eau</span>
                        </div>
                        <div className="house-spec-item">
                          <DollarSign size={16} color="var(--pine-700)" />
                          <span className="spec-val">{h.priceTotal}€</span>
                          <span className="spec-label">Total Gîte</span>
                        </div>
                      </div>

                      {/* Tags */}
                      {h.tags && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, margin: '8px 0' }}>
                          {h.tags.map((t) => (
                            <span
                              key={t}
                              style={{
                                background: 'var(--pine-50)',
                                color: 'var(--pine-800)',
                                fontSize: 11.5,
                                fontWeight: 600,
                                padding: '3px 8px',
                                borderRadius: 'var(--radius-sm)',
                              }}
                            >
                              ✨ {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Ratings bar */}
                    <div className="house-rating-bar" style={{ marginTop: 14 }}>
                      <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text-muted)' }}>
                        Donnez votre voix :
                      </span>

                      <button
                        className={`rating-btn ${h.ratings?.[currentUser.id] === 'love' ? 'active' : ''}`}
                        onClick={() => handleRate(post.id, 'love')}
                      >
                        <Flame size={14} />
                        <span>Coup de cœur ({loves})</span>
                      </button>

                      <button
                        className={`rating-btn ${h.ratings?.[currentUser.id] === 'good' ? 'active' : ''}`}
                        onClick={() => handleRate(post.id, 'good')}
                      >
                        <ThumbsUp size={14} />
                        <span>Validé ({goods})</span>
                      </button>

                      <button
                        className={`rating-btn ${h.ratings?.[currentUser.id] === 'meh' ? 'active' : ''}`}
                        onClick={() => handleRate(post.id, 'meh')}
                      >
                        <DollarSign size={14} />
                        <span>Trop cher ({mehs})</span>
                      </button>

                      <button
                        className={`rating-btn ${h.ratings?.[currentUser.id] === 'pass' ? 'active' : ''}`}
                        onClick={() => handleRate(post.id, 'pass')}
                      >
                        <XCircle size={14} />
                        <span>Passer ({passes})</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {isCreateOpen && (
        <CreatePostModal
          initialType="house"
          onClose={() => setIsCreateOpen(false)}
          onPostCreated={onRefresh}
        />
      )}
    </div>
  );
};
