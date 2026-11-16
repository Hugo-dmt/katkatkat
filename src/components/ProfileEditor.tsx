import React, { useState } from 'react';
import { UserProfile } from '../types';
import { dataService } from '../services/dataService';
import { exportSingleBirthdayToICS, exportVCard } from '../utils/ics';
import { Check, Calendar, Download, Sparkles, User, MapPin, Phone, Mail, Utensils } from 'lucide-react';

interface ProfileEditorProps {
  currentUser: UserProfile;
  onSave: () => void;
}

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
];

export const ProfileEditor: React.FC<ProfileEditorProps> = ({ currentUser, onSave }) => {
  const [firstName, setFirstName] = useState(currentUser.firstName || '');
  const [lastName, setLastName] = useState(currentUser.lastName || '');
  const [nickname, setNickname] = useState(currentUser.nickname || '');
  const [email, setEmail] = useState(currentUser.email || '');
  const [phoneNumber, setPhoneNumber] = useState(currentUser.phoneNumber || '');
  const [birthDate, setBirthDate] = useState(currentUser.birthDate || '');

  // Address
  const [street, setStreet] = useState(currentUser.address?.street || '');
  const [postalCode, setPostalCode] = useState(currentUser.address?.postalCode || '');
  const [city, setCity] = useState(currentUser.address?.city || '');
  const [country, setCountry] = useState(currentUser.address?.country || 'France');

  // Colloc details
  const [yearsInColloc, setYearsInColloc] = useState(currentUser.yearsInColloc || '');
  const [collocRoom, setCollocRoom] = useState(currentUser.collocRoom || '');
  const [dietaryPreferences, setDietaryPreferences] = useState(currentUser.dietaryPreferences || '');
  const [favoriteDrink, setFavoriteDrink] = useState(currentUser.favoriteDrink || '');
  const [bio, setBio] = useState(currentUser.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatarUrl || AVATAR_PRESETS[0]);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...currentUser,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      nickname: nickname.trim() || undefined,
      email: email.trim(),
      phoneNumber: phoneNumber.trim(),
      birthDate: birthDate,
      address: {
        street: street.trim(),
        postalCode: postalCode.trim(),
        city: city.trim(),
        country: country.trim() || 'France',
      },
      yearsInColloc: yearsInColloc.trim() || undefined,
      collocRoom: collocRoom.trim() || undefined,
      dietaryPreferences: dietaryPreferences.trim() || undefined,
      favoriteDrink: favoriteDrink.trim() || undefined,
      bio: bio.trim() || undefined,
      avatarUrl: avatarUrl.trim(),
    };

    dataService.updateUserProfile(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
    onSave();
  };

  return (
    <div style={{ maxWidth: 760, margin: '0 auto' }}>
      <div className="card" style={{ padding: 28, background: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, color: 'var(--pine-900)' }}>
              👤 Mon Profil Collocataire
            </h1>
            <p style={{ fontSize: 13.5, color: 'var(--text-muted)' }}>
              Ces informations sont visibles par les 30 colocataires de katkatkat.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            {birthDate && (
              <button
                type="button"
                className="btn-berry btn-sm"
                onClick={() => exportSingleBirthdayToICS(currentUser)}
                title="Exporter mon anniversaire en .ics"
              >
                <Calendar size={14} />
                <span>Mon Anniv (.ics)</span>
              </button>
            )}

            <button
              type="button"
              className="btn-secondary btn-sm"
              onClick={() => exportVCard(currentUser)}
              title="Exporter ma vCard"
            >
              <Download size={14} />
              <span>vCard (.vcf)</span>
            </button>
          </div>
        </div>

        {savedSuccess && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: 'var(--pine-50)',
            color: 'var(--pine-700)',
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            fontSize: 14,
            fontWeight: 600,
            marginBottom: 20
          }}>
            <Check size={18} />
            <span>Profil mis à jour avec succès ! Tout est sauvegardé.</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Avatar selector */}
          <div style={{ marginBottom: 24 }}>
            <label className="form-label">Photo de profil</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 8 }}>
              <img
                src={avatarUrl}
                alt="Aperçu"
                className="avatar-lg"
                style={{ border: '2px solid var(--pine-700)' }}
              />
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 12.5, color: 'var(--text-muted)', marginBottom: 6 }}>
                  Sélectionnez un avatar ou collez l'URL d'une photo :
                </p>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
                  {AVATAR_PRESETS.map((p, idx) => (
                    <img
                      key={idx}
                      src={p}
                      alt=""
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        cursor: 'pointer',
                        border: avatarUrl === p ? '2px solid var(--pine-700)' : '1px solid var(--border-light)'
                      }}
                      onClick={() => setAvatarUrl(p)}
                    />
                  ))}
                </div>
                <input
                  type="text"
                  className="form-input"
                  style={{ width: '100%', fontSize: 12 }}
                  placeholder="Ou collez une URL d'image personnalisée"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Identity Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Prénom *</label>
              <input
                type="text"
                className="form-input"
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
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Surnom</label>
              <input
                type="text"
                className="form-input"
                placeholder="Ex: Hugz"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
              />
            </div>
          </div>

          {/* Birthday & Contact */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">
                Date de naissance *
              </label>
              <input
                type="date"
                className="form-input"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                required
              />
              <span style={{ fontSize: 11, color: 'var(--text-subtle)' }}>
                Sera exportable en .ics par les collocs
              </span>
            </div>

            <div className="form-group">
              <label className="form-label">Numéro de téléphone *</label>
              <input
                type="tel"
                className="form-input"
                placeholder="+33 6 12 34 56 78"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email *</label>
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Postal Address */}
          <div style={{ background: 'var(--bg-muted)', padding: 16, borderRadius: 'var(--radius-md)', margin: '14px 0' }}>
            <p style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--pine-900)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
              <MapPin size={16} color="var(--pine-700)" />
              Adresse postale complète (pour envoyer des cartes & invitations)
            </p>

            <div className="form-group">
              <label className="form-label">Rue et numéro</label>
              <input
                type="text"
                className="form-input"
                placeholder="14 Rue des Abbesses"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 1fr', gap: 10 }}>
              <div className="form-group">
                <label className="form-label">Code postal</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="75018"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Ville</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Paris"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Pays</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="France"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Colloc Details */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Années dans la colloc</label>
              <input
                type="text"
                className="form-input"
                placeholder="Ex: 2017 - 2021"
                value={yearsInColloc}
                onChange={(e) => setYearsInColloc(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Chambre / Pièce occupée</label>
              <input
                type="text"
                className="form-input"
                placeholder="Ex: Chambre du fond, Le Balcon..."
                value={collocRoom}
                onChange={(e) => setCollocRoom(e.target.value)}
              />
            </div>
          </div>

          {/* Dietary & Drinks (Essential for Christmas weekend!) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Régime alimentaire & Allergies</label>
              <input
                type="text"
                className="form-input"
                placeholder="Ex: Végétarien, sans gluten, intolérant lactose..."
                value={dietaryPreferences}
                onChange={(e) => setDietaryPreferences(e.target.value)}
              />
              <span style={{ fontSize: 11, color: 'var(--text-subtle)' }}>
                Pour le menu du week-end de Noël
              </span>
            </div>

            <div className="form-group">
              <label className="form-label">Boisson préférée</label>
              <input
                type="text"
                className="form-input"
                placeholder="Ex: Chartreuse, IPA, Cidre brut, Tisane..."
                value={favoriteDrink}
                onChange={(e) => setFavoriteDrink(e.target.value)}
              />
            </div>
          </div>

          {/* Bio */}
          <div className="form-group">
            <label className="form-label">Petite bio / mot pour la communauté</label>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="Un mot nostalgique, une réplique culte de la colloc..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          <div style={{ marginTop: 20, textAlign: 'right' }}>
            <button type="submit" className="btn-primary" style={{ padding: '12px 28px', fontSize: 15 }}>
              <Check size={16} />
              <span>Enregistrer mes modifications</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
