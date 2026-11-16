import React from 'react';
import { UserProfile } from '../types';
import { exportSingleBirthdayToICS, exportAllBirthdaysToICS, getBirthdayInfo } from '../utils/ics';
import confetti from 'canvas-confetti';
import { Calendar, Download, Gift, Sparkles } from 'lucide-react';

interface BirthdaysHubProps {
  users: UserProfile[];
  onOpenProfile: (user: UserProfile) => void;
}

const MONTHS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

export const BirthdaysHub: React.FC<BirthdaysHubProps> = ({ users, onOpenProfile }) => {
  const usersWithBirthday = users.filter((u) => u.birthDate);

  // Group by month (0-11)
  const byMonth: Record<number, UserProfile[]> = {};
  for (let m = 0; m < 12; m++) {
    byMonth[m] = [];
  }

  usersWithBirthday.forEach((u) => {
    const d = new Date(u.birthDate);
    if (!isNaN(d.getTime())) {
      byMonth[d.getMonth()].push(u);
    }
  });

  // Sort inside each month by day
  for (let m = 0; m < 12; m++) {
    byMonth[m].sort((a, b) => {
      const da = new Date(a.birthDate).getDate();
      const db = new Date(b.birthDate).getDate();
      return da - db;
    });
  }

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  return (
    <div>
      {/* Header */}
      <div className="card" style={{ marginBottom: 24, padding: 24, background: '#fff' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, color: 'var(--pine-900)' }}>
              🎂 Calendrier des Anniversaires de la Colloc
            </h1>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 4 }}>
              Fini les anniversaires oubliés ! Synchronisez l'ensemble des dates de naissance en 1 clic dans votre agenda.
            </p>
          </div>

          <button
            className="btn-berry"
            onClick={() => {
              triggerConfetti();
              exportAllBirthdaysToICS(users);
            }}
            style={{ padding: '12px 20px', fontSize: 14, gap: 8 }}
          >
            <Download size={16} />
            <span>Exporter tous les anniversaires (.ics)</span>
          </button>
        </div>

        <div style={{ marginTop: 14, padding: '10px 14px', background: 'var(--pine-50)', borderRadius: 'var(--radius-sm)', fontSize: 12.5, color: 'var(--pine-800)' }}>
          💡 <strong>Astuce :</strong> Le fichier <code>.ics</code> fonctionne nativement avec Google Calendar, Apple Calendar (iPhone/Mac) et Microsoft Outlook. Les événements sont configurés avec une récurrence annuelle et un rappel la veille.
        </div>
      </div>

      {/* Month-by-month grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {MONTHS.map((monthName, idx) => {
          const list = byMonth[idx];
          const isCurrentMonth = new Date().getMonth() === idx;

          return (
            <div
              key={monthName}
              className="card"
              style={{
                padding: 16,
                border: isCurrentMonth ? '2px solid var(--berry-600)' : '1px solid var(--border-light)',
                background: isCurrentMonth ? '#fffdfb' : '#fff'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, borderBottom: '1px solid var(--border-light)', paddingBottom: 8 }}>
                <h2 style={{ fontSize: 15, fontWeight: 700, color: isCurrentMonth ? 'var(--berry-700)' : 'var(--pine-900)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Calendar size={15} color={isCurrentMonth ? 'var(--berry-700)' : 'var(--pine-700)'} />
                  <span>{monthName}</span>
                </h2>
                <span style={{ fontSize: 12, color: 'var(--text-subtle)', fontWeight: 600 }}>
                  {list.length} anniv{list.length > 1 ? 's' : ''}
                </span>
              </div>

              {list.length === 0 ? (
                <p style={{ fontSize: 12.5, color: 'var(--text-subtle)', fontStyle: 'italic', padding: '10px 0' }}>
                  Aucun anniversaire ce mois-ci
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {list.map((u) => {
                    const bday = getBirthdayInfo(u.birthDate);
                    return (
                      <div
                        key={u.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: 8,
                          padding: '6px 8px',
                          borderRadius: 'var(--radius-sm)',
                          background: bday?.isToday ? 'var(--berry-100)' : 'var(--bg-muted)'
                        }}
                      >
                        <div
                          style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', flex: 1, minWidth: 0 }}
                          onClick={() => onOpenProfile(u)}
                        >
                          <img
                            src={u.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                            alt=""
                            className="avatar-sm"
                          />
                          <div style={{ overflow: 'hidden' }}>
                            <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-main)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                              {u.firstName} {u.nickname ? `(${u.nickname})` : ''}
                            </p>
                            <p style={{ fontSize: 11, color: 'var(--text-subtle)' }}>
                              Le {new Date(u.birthDate).getDate()} {monthName.toLowerCase()} ({bday?.nextAge} ans)
                            </p>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          {bday?.isToday && (
                            <span style={{ fontSize: 10.5, fontWeight: 700, background: 'var(--berry-700)', color: '#fff', padding: '2px 6px', borderRadius: 'var(--radius-full)' }}>
                              FÊTE !
                            </span>
                          )}

                          <button
                            onClick={() => exportSingleBirthdayToICS(u)}
                            style={{
                              fontSize: 11,
                              color: 'var(--pine-700)',
                              fontWeight: 600,
                              textDecoration: 'underline',
                              cursor: 'pointer'
                            }}
                            title="Ajouter cet anniversaire en .ics"
                          >
                            .ics
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
