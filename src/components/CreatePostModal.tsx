import React, { useState } from 'react';
import { PostType, PollOption, HouseData } from '../types';
import { dataService } from '../services/dataService';
import { X, MessageSquare, BarChart2, Home, Plus, Trash2, Sparkles } from 'lucide-react';

interface CreatePostModalProps {
  onClose: () => void;
  onPostCreated: () => void;
  initialType?: PostType;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  onClose,
  onPostCreated,
  initialType = 'post',
}) => {
  const [type, setType] = useState<PostType>(initialType);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [isPinned, setIsPinned] = useState(false);

  // Poll state
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState<string[]>(['Option 1', 'Option 2']);
  const [allowMultiple, setAllowMultiple] = useState(false);

  // House state
  const [houseLocation, setHouseLocation] = useState('');
  const [houseUrl, setHouseUrl] = useState('');
  const [housePriceTotal, setHousePriceTotal] = useState(3000);
  const [houseCapacity, setHouseCapacity] = useState(30);
  const [houseBedrooms, setHouseBedrooms] = useState(10);
  const [houseBathrooms, setHouseBathrooms] = useState(6);
  const [housePhotoUrl, setHousePhotoUrl] = useState(
    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&auto=format&fit=crop&q=80'
  );
  const [houseTagsInput, setHouseTagsInput] = useState('Cheminée, Sauna, Grande table');

  const handleAddPollOption = () => {
    setPollOptions([...pollOptions, `Option ${pollOptions.length + 1}`]);
  };

  const handleRemovePollOption = (idx: number) => {
    if (pollOptions.length <= 2) return;
    setPollOptions(pollOptions.filter((_, i) => i !== idx));
  };

  const handleOptionChange = (idx: number, val: string) => {
    const updated = [...pollOptions];
    updated[idx] = val;
    setPollOptions(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() && type !== 'poll') return;

    const tags = tagInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    let pollData;
    if (type === 'poll') {
      const validOptions: PollOption[] = pollOptions
        .filter((opt) => opt.trim().length > 0)
        .map((text, i) => ({
          id: `opt-${Date.now()}-${i}`,
          text: text.trim(),
          votes: [],
        }));

      if (validOptions.length < 2) {
        alert('Veuillez entrer au moins 2 options pour le sondage.');
        return;
      }

      pollData = {
        question: pollQuestion.trim() || title.trim(),
        options: validOptions,
        allowMultiple,
      };
    }

    let houseData: HouseData | undefined;
    if (type === 'house') {
      const pricePerHead = Math.round(housePriceTotal / (houseCapacity || 30));
      const houseTags = houseTagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      houseData = {
        title: title.trim(),
        url: houseUrl.trim() || undefined,
        location: houseLocation.trim() || 'France',
        priceTotal: Number(housePriceTotal),
        pricePerPerson: pricePerHead,
        capacity: Number(houseCapacity),
        bedrooms: Number(houseBedrooms),
        bathrooms: Number(houseBathrooms),
        photos: housePhotoUrl.trim() ? [housePhotoUrl.trim()] : [],
        tags: houseTags,
        pros: ['Grand espace commun pour 30 pers', 'Idéal pour le week-end Noël'],
        cons: [],
        ratings: {},
      };
    }

    dataService.addPost({
      type,
      title: title.trim() || (type === 'poll' ? pollQuestion : 'Nouveau post'),
      content: content.trim(),
      tags,
      poll: pollData,
      house: houseData,
      isPinned,
    });

    onPostCreated();
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-header">
          <div className="modal-title">
            <Sparkles size={20} color="var(--pine-700)" />
            <span>Publier sur katkatkat</span>
          </div>
          <button onClick={onClose} style={{ color: 'var(--text-subtle)' }}>
            <X size={20} />
          </button>
        </div>

        {/* Type selector tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          <button
            type="button"
            className={`btn-secondary ${type === 'post' ? 'btn-primary' : ''}`}
            style={{ flex: 1, padding: '8px 10px', fontSize: 13 }}
            onClick={() => setType('post')}
          >
            <MessageSquare size={14} />
            <span>Discussion</span>
          </button>

          <button
            type="button"
            className={`btn-secondary ${type === 'poll' ? 'btn-primary' : ''}`}
            style={{ flex: 1, padding: '8px 10px', fontSize: 13 }}
            onClick={() => setType('poll')}
          >
            <BarChart2 size={14} />
            <span>Sondage</span>
          </button>

          <button
            type="button"
            className={`btn-secondary ${type === 'house' ? 'btn-primary' : ''}`}
            style={{ flex: 1, padding: '8px 10px', fontSize: 13 }}
            onClick={() => setType('house')}
          >
            <Home size={14} />
            <span>Maison Noël</span>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="form-group">
            <label className="form-label">
              {type === 'poll' ? 'Titre du post' : type === 'house' ? 'Nom du gîte / chalet' : 'Titre du message'}
            </label>
            <input
              type="text"
              className="form-input"
              placeholder={
                type === 'poll'
                  ? 'Ex: Vote pour le menu du réveillon'
                  : type === 'house'
                  ? 'Ex: Grand Chalet des Aravis (32 couchages)'
                  : 'De quoi voulez-vous parler aux collocs ?'
              }
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* POLL SPECIFIC */}
          {type === 'poll' && (
            <div style={{ background: 'var(--bg-muted)', padding: 14, borderRadius: 'var(--radius-md)', marginBottom: 16 }}>
              <div className="form-group">
                <label className="form-label">Question du sondage</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ex: Quel week-end êtes-vous dispo ?"
                  value={pollQuestion}
                  onChange={(e) => setPollQuestion(e.target.value)}
                  required
                />
              </div>

              <label className="form-label" style={{ marginBottom: 6 }}>Options de vote</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 10 }}>
                {pollOptions.map((opt, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <input
                      type="text"
                      className="form-input"
                      style={{ flex: 1 }}
                      value={opt}
                      onChange={(e) => handleOptionChange(idx, e.target.value)}
                      placeholder={`Option ${idx + 1}`}
                      required
                    />
                    {pollOptions.length > 2 && (
                      <button
                        type="button"
                        onClick={() => handleRemovePollOption(idx)}
                        style={{ color: 'var(--berry-700)', padding: 6 }}
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={handleAddPollOption}
                  className="btn-secondary btn-sm"
                  style={{ gap: 4 }}
                >
                  <Plus size={14} />
                  <span>Ajouter une option</span>
                </button>

                <label style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={allowMultiple}
                    onChange={(e) => setAllowMultiple(e.target.checked)}
                  />
                  <span>Autoriser les choix multiples</span>
                </label>
              </div>
            </div>
          )}

          {/* HOUSE SPECIFIC */}
          {type === 'house' && (
            <div style={{ background: 'var(--bg-muted)', padding: 14, borderRadius: 'var(--radius-md)', marginBottom: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div className="form-group">
                  <label className="form-label">Localisation (Région / Ville)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Ex: La Clusaz (74)"
                    value={houseLocation}
                    onChange={(e) => setHouseLocation(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Lien Airbnb / Gîtes / Booking</label>
                  <input
                    type="url"
                    className="form-input"
                    placeholder="https://..."
                    value={houseUrl}
                    onChange={(e) => setHouseUrl(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                <div className="form-group">
                  <label className="form-label">Prix total (€)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={housePriceTotal}
                    onChange={(e) => setHousePriceTotal(Number(e.target.value))}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Couchages</label>
                  <input
                    type="number"
                    className="form-input"
                    value={houseCapacity}
                    onChange={(e) => setHouseCapacity(Number(e.target.value))}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Chambres</label>
                  <input
                    type="number"
                    className="form-input"
                    value={houseBedrooms}
                    onChange={(e) => setHouseBedrooms(Number(e.target.value))}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">SDB</label>
                  <input
                    type="number"
                    className="form-input"
                    value={houseBathrooms}
                    onChange={(e) => setHouseBathrooms(Number(e.target.value))}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">URL d'une photo du chalet</label>
                <input
                  type="text"
                  className="form-input"
                  value={housePhotoUrl}
                  onChange={(e) => setHousePhotoUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div className="form-group">
                <label className="form-label">Équipements phares (séparés par virgule)</label>
                <input
                  type="text"
                  className="form-input"
                  value={houseTagsInput}
                  onChange={(e) => setHouseTagsInput(e.target.value)}
                  placeholder="Cheminée, Sauna, Piscine couverte, Billard..."
                />
              </div>
            </div>
          )}

          {/* Content / description */}
          <div className="form-group">
            <label className="form-label">
              {type === 'house' ? 'Description & Remarques' : 'Message'}
            </label>
            <textarea
              className="form-textarea"
              rows={4}
              placeholder="Écrivez votre message pour la colloc..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required={type === 'post'}
            />
          </div>

          {/* Tags */}
          <div className="form-group">
            <label className="form-label">Tags (séparés par des virgules)</label>
            <input
              type="text"
              className="form-input"
              placeholder="Organisation, Noël, Photos, Rigolo..."
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
            <label style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={isPinned}
                onChange={(e) => setIsPinned(e.target.checked)}
              />
              <span>Épingler en haut du mur (Annonce importante)</span>
            </label>

            <div style={{ display: 'flex', gap: 8 }}>
              <button type="button" onClick={onClose} className="btn-secondary">
                Annuler
              </button>
              <button type="submit" className="btn-primary">
                Publier
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
