import { UserProfile } from '../types';

/**
 * Format a Date to ICS YYYYMMDD string
 */
function formatDateToICS(dateString: string): string {
  // birthDate is YYYY-MM-DD
  const parts = dateString.split('-');
  if (parts.length < 3) return '';
  const yyyy = parts[0];
  const mm = parts[1];
  const dd = parts[2];
  return `${yyyy}${mm}${dd}`;
}

/**
 * Triggers a browser download of a text blob
 */
export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Export a single user's birthday to .ics
 */
export function exportSingleBirthdayToICS(user: UserProfile) {
  if (!user.birthDate) {
    alert("Aucune date de naissance renseignée pour cet utilisateur.");
    return;
  }

  const dtStart = formatDateToICS(user.birthDate);
  const name = `${user.firstName} ${user.lastName}`.trim();
  const nickname = user.nickname ? ` (${user.nickname})` : '';
  const summary = `🎂 Anniversaire de ${name}${nickname} [katkatkat]`;
  const description = `Anniversaire de ${name}.\\nTél: ${user.phoneNumber || 'Non renseigné'}\\nAdresse: ${user.address?.street || ''} ${user.address?.postalCode || ''} ${user.address?.city || ''}`;
  const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const uid = `bday-${user.id}-${Date.now()}@katkatkat.app`;

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//katkatkat//Anciens Collocs Bday//FR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${now}`,
    `DTSTART;VALUE=DATE:${dtStart}`,
    'RRULE:FREQ=YEARLY',
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description}`,
    'TRANSP:TRANSPARENT',
    'BEGIN:VALARM',
    'TRIGGER:-P1D',
    'ACTION:DISPLAY',
    `DESCRIPTION:Rappel: Demain c'est l'anniversaire de ${name} !`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const filename = `anniversaire_${user.firstName.toLowerCase()}_${user.lastName.toLowerCase()}.ics`;
  downloadFile(icsContent, filename, 'text/calendar;charset=utf-8');
}

/**
 * Export ALL users' birthdays into a single .ics calendar file
 */
export function exportAllBirthdaysToICS(users: UserProfile[]) {
  const validUsers = users.filter((u) => u.birthDate);
  if (validUsers.length === 0) {
    alert("Aucun anniversaire disponible.");
    return;
  }

  const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  const events = validUsers.map((user) => {
    const dtStart = formatDateToICS(user.birthDate);
    const name = `${user.firstName} ${user.lastName}`.trim();
    const nickname = user.nickname ? ` (${user.nickname})` : '';
    const summary = `🎂 Anniversaire ${name}${nickname}`;
    const description = `Colloc katkatkat\\nTéléphone: ${user.phoneNumber || 'N/A'}\\nAdresse: ${user.address?.street || ''} ${user.address?.postalCode || ''} ${user.address?.city || ''}`;
    const uid = `bday-${user.id}@katkatkat.app`;

    return [
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${now}`,
      `DTSTART;VALUE=DATE:${dtStart}`,
      'RRULE:FREQ=YEARLY',
      `SUMMARY:${summary}`,
      `DESCRIPTION:${description}`,
      'TRANSP:TRANSPARENT',
      'BEGIN:VALARM',
      'TRIGGER:-P1D',
      'ACTION:DISPLAY',
      `DESCRIPTION:Demain c'est l'anniversaire de ${name} (${user.nickname || 'Colloc'}) !`,
      'END:VALARM',
      'END:VEVENT'
    ].join('\r\n');
  });

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//katkatkat//Tous les Anniversaires des Collocs//FR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:🎂 Anniversaires - katkatkat Collocs',
    'X-WR-TIMEZONE:Europe/Paris',
    ...events,
    'END:VCALENDAR'
  ].join('\r\n');

  downloadFile(icsContent, 'anniversaires_katkatkat_tous.ics', 'text/calendar;charset=utf-8');
}

/**
 * Export contact as vCard (.vcf)
 */
export function exportVCard(user: UserProfile) {
  const vcard = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${user.lastName};${user.firstName};;;`,
    `FN:${user.firstName} ${user.lastName}${user.nickname ? ' (' + user.nickname + ')' : ''}`,
    user.nickname ? `NICKNAME:${user.nickname}` : '',
    user.phoneNumber ? `TEL;TYPE=CELL:${user.phoneNumber}` : '',
    user.email ? `EMAIL;TYPE=INTERNET:${user.email}` : '',
    user.birthDate ? `BDAY:${user.birthDate.replace(/-/g, '')}` : '',
    user.address ? `ADR;TYPE=HOME:;;${user.address.street};${user.address.city};;${user.address.postalCode};${user.address.country}` : '',
    user.collocRoom ? `NOTE:Ancien colloc katkatkat - ${user.collocRoom} (${user.yearsInColloc || ''})` : 'NOTE:Ancien colloc katkatkat',
    'END:VCARD'
  ].filter(Boolean).join('\r\n');

  downloadFile(vcard, `contact_${user.firstName}_${user.lastName}.vcf`, 'text/vcard;charset=utf-8');
}

/**
 * Calculate age and days until next birthday
 */
export function getBirthdayInfo(birthDateStr: string) {
  if (!birthDateStr) return null;
  const birth = new Date(birthDateStr);
  const today = new Date();
  
  // Calculate next birthday date
  const next = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
  if (next.getTime() < new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()) {
    next.setFullYear(today.getFullYear() + 1);
  }

  const diffTime = next.getTime() - new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  // Current age turning next
  const nextAge = next.getFullYear() - birth.getFullYear();

  return {
    isToday: diffDays === 0,
    diffDays,
    nextAge,
    formattedDate: birth.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })
  };
}
