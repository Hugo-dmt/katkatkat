import React, { useState } from 'react';
import { UserProfile, Post } from '../types';
import { exportSingleBirthdayToICS, exportVCard, getBirthdayInfo } from '../utils/ics';
import { PostCard } from './PostCard';
import { 
  X, 
  MapPin, 
  Copy, 
  Check, 
  Phone, 
  Mail, 
  Calendar, 
  UserPlus, 
  MessageCircle, 
  Utensils, 
  Wine, 
  Home, 
  FileText
} from 'lucide-react';

interface ProfileModalProps {
  user: UserProfile;
  currentUser: UserProfile;
  posts: Post[];
  onClose: () => void;
  onOpenProfileById: (userId: string) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  user,
  currentUser,
  posts,
  onClose,
  onOpenProfileById,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'activity'>('info');

  const bday = getBirthdayInfo(user.birthDate);
  const userPosts = posts.filter((p) => p.authorId === user.id);

  const cleanPhone = user.phoneNumber?.replace(/[^0-9+]/g, '');
  const waPhone = cleanPhone?.startsWith('0') ? '33' + cleanPhone.slice(1) : cleanPhone?.replace('+', '');

  const handleCopy = () => {
    const full = `${user.address?.street || ''}, ${user.address?.postalCode || ''} ${user.address?.city || ''}, ${user.address?.country || 'France'}`.trim();
    navigator.clipboard.writeText(full);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card" style={{ maxWidth: 640 }}>
        {/* Header */}
        <div className="modal-header" style={{ borderBottom: 'none', marginBottom: 0, paddingBottom: 0 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase' }}>
            Profil Membre • katkatkat
          </span>
          <button onClick={onClose} style={{ color: 'var(--text-subtle)' }}>
            <X size={20} />
          </button>
        </div>

        {/* User Hero */}
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', margin: '14px 0 20px' }}>
          <img
            src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
            alt={user.firstName}
            className="avatar-lg"
          />
          <div style={{ flex: 1 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: 'var(--text-main)' }}>
              {user.firstName} {user.lastName}
            </h2>
            {user.nickname && (
              <p style={{ fontSize: 14, color: 'var(--pine-700)', fontWeight: 600 }}>
                Surnom : « {user.nickname} »
              </p>
            )}
            {user.yearsInColloc && (
              <p style={{ fontSize: 12.5, color: 'var(--text-subtle)', marginTop: 2 }}>
                🏠 Colloc {user.yearsInColloc} {user.collocRoom ? `• ${user.collocRoom}` : ''}
              </p>
            )}
          </div>
        </div>

        {/* Tabs: Info vs Posts */}
        <div style={{ display: 'flex', gap: 8, borderBottom: '1px solid var(--border-light)', marginBottom: 16 }}>
          <button
            onClick={() => setActiveTab('info')}
            className={`nav-tab-btn ${activeTab === 'info' ? 'active' : ''}`}
            style={{ borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0', color: activeTab === 'info' ? '#111' : 'var(--text-muted)' }}
          >
            <FileText size={14} />
            <span>Coordonnées & Infos</span>
          </button>

          <button
            onClick={() => setActiveTab('activity')}
            className={`nav-tab-btn ${activeTab === 'activity' ? 'active' : ''}`}
            style={{ borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0', color: activeTab === 'activity' ? '#111' : 'var(--text-muted)' }}
          >
            <MessageCircle size={14} />
            <span>Publications & Sondages ({userPosts.length})</span>
          </button>
        </div>

        {activeTab === 'info' ? (
          <div>
            {/* Quick Contact buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 18 }}>
              {waPhone && (
                <a
                  href={`https://wa.me/${waPhone}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-whatsapp btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6, borderRadius: 'var(--radius-md)', padding: '8px 14px' }}
                >
                  <MessageCircle size={15} />
                  <span>Message WhatsApp</span>
                </a>
              )}

              {cleanPhone && (
                <a
                  href={`tel:${cleanPhone}`}
                  className="btn-secondary btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6, borderRadius: 'var(--radius-md)', padding: '8px 14px' }}
                >
                  <Phone size={15} color="var(--pine-700)" />
                  <span>Appeler ({user.phoneNumber})</span>
                </a>
              )}

              {user.email && (
                <a
                  href={`mailto:${user.email}`}
                  className="btn-secondary btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6, borderRadius: 'var(--radius-md)', padding: '8px 14px' }}
                >
                  <Mail size={15} />
                  <span>{user.email}</span>
                </a>
              )}

              <button
                className="btn-secondary btn-sm"
                onClick={() => exportVCard(user)}
                title="Enregistrer la fiche contact dans mon téléphone"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, borderRadius: 'var(--radius-md)', padding: '8px 14px' }}
              >
                <UserPlus size={15} />
                <span>Ajouter aux contacts (.vcf)</span>
              </button>
            </div>

            {/* Address Details */}
            <div className="card" style={{ padding: 14, marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <MapPin size={15} color="var(--pine-700)" />
                  Adresse postale complète
                </span>

                {user.address?.street && (
                  <button className="copy-btn" onClick={handleCopy}>
                    {copied ? (
                      <span style={{ color: '#166534', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Check size={12} /> Copié !
                      </span>
                    ) : (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Copy size={12} /> Copier l'adresse
                      </span>
                    )}
                  </button>
                )}
              </div>

              <div style={{ fontSize: 14, color: 'var(--text-main)', lineHeight: 1.5 }}>
                {user.address?.street ? (
                  <>
                    <p>{user.address.street}</p>
                    <p>{user.address.postalCode} {user.address.city}</p>
                    <p>{user.address.country}</p>
                  </>
                ) : (
                  <p style={{ color: 'var(--text-subtle)', fontStyle: 'italic' }}>
                    Non renseignée pour le moment.
                  </p>
                )}
              </div>
            </div>

            {/* Birthday details & ICS Export */}
            <div className="card" style={{ padding: 14, marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Calendar size={15} color="var(--berry-700)" />
                    Date de naissance
                  </span>
                  <p style={{ fontSize: 14, marginTop: 4 }}>
                    {bday ? (
                      <>
                        <strong>{bday.formattedDate}</strong> (fête ses {bday.nextAge} ans {bday.isToday ? "aujourd'hui !" : `dans ${bday.diffDays} jours`})
                      </>
                    ) : (
                      <span style={{ color: 'var(--text-subtle)', fontStyle: 'italic' }}>Non renseignée</span>
                    )}
                  </p>
                </div>

                {user.birthDate && (
                  <button
                    className="btn-berry btn-sm"
                    onClick={() => exportSingleBirthdayToICS(user)}
                    style={{ gap: 6 }}
                  >
                    <span>Ajouter à mon agenda (.ics)</span>
                  </button>
                )}
              </div>
            </div>

            {/* Dietary & Drinks */}
            <div className="form-grid-2" style={{ marginBottom: 14 }}>
              <div className="card" style={{ padding: 12 }}>
                <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Utensils size={13} color="var(--amber-700)" />
                  Régime / Allergies
                </span>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
                  {user.dietaryPreferences || 'Aucune restriction indiquée'}
                </p>
              </div>

              <div className="card" style={{ padding: 12 }}>
                <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Wine size={13} color="var(--berry-700)" />
                  Boisson préférée
                </span>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
                  {user.favoriteDrink || 'Non précisé'}
                </p>
              </div>
            </div>

            {/* Bio */}
            {user.bio && (
              <div className="card" style={{ padding: 12 }}>
                <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: 4 }}>
                  Bio / Remarques :
                </span>
                <p style={{ fontSize: 13.5, fontStyle: 'italic', color: 'var(--text-muted)' }}>
                  « {user.bio} »
                </p>
              </div>
            )}
          </div>
        ) : (
          <div>
            {userPosts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px 10px', color: 'var(--text-muted)' }}>
                Cet utilisateur n'a pas encore publié de message ou sondage.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {userPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    currentUser={currentUser}
                    onOpenProfileById={onOpenProfileById}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
