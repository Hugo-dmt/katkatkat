import React, { useState } from 'react';
import { UserProfile } from '../types';
import { exportSingleBirthdayToICS, exportAllBirthdaysToICS, exportVCard, getBirthdayInfo } from '../utils/ics';
import { 
  Search, 
  Copy, 
  Check, 
  Phone, 
  Mail, 
  Calendar, 
  MapPin, 
  Download, 
  MessageCircle, 
  UserPlus, 
  Eye,
  Utensils,
  Wine
} from 'lucide-react';

interface DirectoryProps {
  users: UserProfile[];
  onOpenProfile: (user: UserProfile) => void;
}

export const Directory: React.FC<DirectoryProps> = ({ users, onOpenProfile }) => {
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyAddress = (user: UserProfile) => {
    const addr = `${user.address?.street || ''}, ${user.address?.postalCode || ''} ${user.address?.city || ''}, ${user.address?.country || 'France'}`.trim();
    navigator.clipboard.writeText(addr);
    setCopiedId(user.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredUsers = users.filter((u) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    const matchName = `${u.firstName} ${u.lastName}`.toLowerCase().includes(q);
    const matchNick = u.nickname?.toLowerCase().includes(q);
    const matchCity = u.address?.city?.toLowerCase().includes(q);
    const matchRoom = u.collocRoom?.toLowerCase().includes(q);
    const matchEmail = u.email?.toLowerCase().includes(q);
    return matchName || matchNick || matchCity || matchRoom || matchEmail;
  });

  return (
    <div>
      {/* Directory Header */}
      <div className="card" style={{ marginBottom: 24, padding: 24, background: '#fff' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, color: 'var(--pine-900)' }}>
              📖 Trombinoscope & Carnet d'adresses
            </h1>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 4 }}>
              Retrouvez facilement les adresses, numéros, anniversaires et régimes alimentaires de toute la colloc.
            </p>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <button
              className="btn-berry"
              onClick={() => exportAllBirthdaysToICS(users)}
              title="Exporter tous les anniversaires dans Apple / Google Calendar"
            >
              <Download size={15} />
              <span>Exporter tous les anniversaires (.ics)</span>
            </button>
          </div>
        </div>

        {/* Search bar */}
        <div style={{ position: 'relative', marginTop: 18 }}>
          <input
            type="text"
            className="form-input"
            style={{ width: '100%', paddingLeft: 38, fontSize: 14, borderRadius: 'var(--radius-full)' }}
            placeholder="Rechercher par prénom, nom, surnom, ville (Paris, Lyon, Bordeaux...), chambre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search size={18} style={{ position: 'absolute', left: 14, top: 12, color: 'var(--text-subtle)' }} />
        </div>
      </div>

      {/* Stats bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, fontSize: 13, color: 'var(--text-muted)' }}>
        <span>Affichage de <strong>{filteredUsers.length}</strong> colocataires</span>
      </div>

      {/* Grid of Profiles */}
      <div className="directory-grid">
        {filteredUsers.map((user) => {
          const bday = getBirthdayInfo(user.birthDate);
          const cleanPhone = user.phoneNumber?.replace(/[^0-9+]/g, '');
          const waPhone = cleanPhone?.startsWith('0') ? '33' + cleanPhone.slice(1) : cleanPhone?.replace('+', '');

          return (
            <div key={user.id} className="directory-card">
              <div>
                {/* Header: Avatar, Name, Nickname */}
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <img
                    src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120'}
                    alt={user.firstName}
                    className="avatar-md"
                    style={{ cursor: 'pointer' }}
                    onClick={() => onOpenProfile(user)}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h2
                      style={{
                        fontSize: 16,
                        fontWeight: 700,
                        color: 'var(--text-main)',
                        cursor: 'pointer',
                        lineHeight: 1.2,
                      }}
                      onClick={() => onOpenProfile(user)}
                    >
                      {user.firstName} {user.lastName}
                    </h2>
                    {user.nickname && (
                      <p style={{ fontSize: 12.5, color: 'var(--pine-700)', fontWeight: 600 }}>
                        « {user.nickname} »
                      </p>
                    )}
                    {user.yearsInColloc && (
                      <p style={{ fontSize: 11.5, color: 'var(--text-subtle)', marginTop: 2 }}>
                        🏠 {user.yearsInColloc}
                      </p>
                    )}
                  </div>
                </div>

                {/* Colloc Room badge */}
                {user.collocRoom && (
                  <div style={{
                    fontSize: 11.5,
                    background: 'var(--bg-muted)',
                    color: 'var(--text-muted)',
                    padding: '3px 8px',
                    borderRadius: 'var(--radius-sm)',
                    margin: '10px 0 6px',
                    display: 'inline-block'
                  }}>
                    🛏️ {user.collocRoom}
                  </div>
                )}

                {/* Postal Address with 1-click Copy */}
                <div className="address-box">
                  <div style={{ display: 'flex', gap: 6, flex: 1 }}>
                    <MapPin size={14} color="var(--pine-700)" style={{ flexShrink: 0, marginTop: 2 }} />
                    <span className="address-text">
                      {user.address?.street ? (
                        <>
                          {user.address.street}
                          <br />
                          {user.address.postalCode} {user.address.city}
                        </>
                      ) : (
                        <span style={{ color: 'var(--text-subtle)', fontStyle: 'italic' }}>
                          Adresse non renseignée
                        </span>
                      )}
                    </span>
                  </div>

                  {user.address?.street && (
                    <button
                      className="copy-btn"
                      onClick={() => handleCopyAddress(user)}
                      title="Copier l'adresse complète"
                    >
                      {copiedId === user.id ? (
                        <span style={{ color: '#166534', display: 'flex', alignItems: 'center', gap: 3 }}>
                          <Check size={12} /> Copié !
                        </span>
                      ) : (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                          <Copy size={12} /> Copier
                        </span>
                      )}
                    </button>
                  )}
                </div>

                {/* Birthday pill & export */}
                {user.birthDate && bday && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: 12,
                    background: bday.isToday ? 'var(--berry-100)' : 'var(--pine-50)',
                    padding: '6px 10px',
                    borderRadius: 'var(--radius-sm)',
                    margin: '6px 0',
                    color: bday.isToday ? 'var(--berry-700)' : 'var(--pine-800)',
                    fontWeight: 600
                  }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <Calendar size={13} />
                      {bday.formattedDate} ({bday.nextAge} ans)
                    </span>

                    <button
                      onClick={() => exportSingleBirthdayToICS(user)}
                      style={{
                        fontSize: 11,
                        color: 'var(--pine-700)',
                        textDecoration: 'underline',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                      title="Exporter cet anniversaire en .ics"
                    >
                      Ajouter agenda
                    </button>
                  </div>
                )}

                {/* Dietary preference snippet if any */}
                {user.dietaryPreferences && (
                  <div style={{ fontSize: 11.5, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 5, marginTop: 4 }}>
                    <Utensils size={12} color="var(--text-subtle)" />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {user.dietaryPreferences}
                    </span>
                  </div>
                )}
              </div>

              {/* Bottom Quick Contact Buttons */}
              <div>
                <div className="contact-quick-actions">
                  {waPhone && (
                    <a
                      href={`https://wa.me/${waPhone}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-contact btn-whatsapp"
                      title="Ouvrir WhatsApp"
                    >
                      <MessageCircle size={14} />
                      <span>WhatsApp</span>
                    </a>
                  )}

                  {cleanPhone && (
                    <a
                      href={`tel:${cleanPhone}`}
                      className="btn-contact"
                      title="Appeler"
                    >
                      <Phone size={14} />
                      <span>Appeler</span>
                    </a>
                  )}

                  {user.email && (
                    <a
                      href={`mailto:${user.email}`}
                      className="btn-contact"
                      title="Envoyer un email"
                    >
                      <Mail size={14} />
                      <span>Email</span>
                    </a>
                  )}
                </div>

                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  <button
                    className="btn-secondary btn-sm"
                    style={{ flex: 1, justifyContent: 'center' }}
                    onClick={() => onOpenProfile(user)}
                  >
                    <Eye size={13} />
                    <span>Voir profil complet</span>
                  </button>

                  <button
                    className="btn-secondary btn-sm"
                    style={{ padding: '6px 8px' }}
                    onClick={() => exportVCard(user)}
                    title="Télécharger vCard pour carnet d'adresses du téléphone"
                  >
                    <UserPlus size={13} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
