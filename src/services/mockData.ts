import { UserProfile, Post } from '../types';

export const INITIAL_PROFILES: UserProfile[] = [
  {
    id: 'user-hugo',
    email: 'hugo@katkatkat.fr',
    firstName: 'Hugo',
    lastName: 'Demart',
    nickname: 'Hugz',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    birthDate: '1995-12-14',
    address: {
      street: '14 Rue des Abbesses',
      postalCode: '75018',
      city: 'Paris',
      country: 'France',
    },
    phoneNumber: '+33 6 12 34 56 78',
    yearsInColloc: '2017 - 2021',
    collocRoom: 'Chambre du fond (celle qui donnait sur la cour)',
    dietaryPreferences: 'Mange de tout, grand amateur de raclette',
    favoriteDrink: 'Chartreuse verte ou IPA fraîche',
    bio: 'Toujours chaud pour préparer le vin chaud du réveillon. On ne change pas une équipe qui gagne !',
    createdAt: '2023-01-01T10:00:00.000Z',
  },
  {
    id: 'user-camille',
    email: 'camille@katkatkat.fr',
    firstName: 'Camille',
    lastName: 'Vidal',
    nickname: 'Cam',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    birthDate: '1996-03-22',
    address: {
      street: '42 Rue Garibaldi',
      postalCode: '69006',
      city: 'Lyon',
      country: 'France',
    },
    phoneNumber: '+33 6 23 45 67 89',
    yearsInColloc: '2016 - 2019',
    collocRoom: 'Chambre 2ème gauche',
    dietaryPreferences: 'Végétarienne stricte (prévoyez du fromage de chèvre !)',
    favoriteDrink: 'Vin rouge biodynamique',
    bio: 'Gardienne officielle du Secret Santa et des playlists nostalgie 2000s.',
    createdAt: '2023-01-02T11:00:00.000Z',
  },
  {
    id: 'user-thomas',
    email: 'thomas@katkatkat.fr',
    firstName: 'Thomas',
    lastName: 'Rousseau',
    nickname: 'Toto',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    birthDate: '1994-08-05',
    address: {
      street: '8 Quai des Chartrons',
      postalCode: '33000',
      city: 'Bordeaux',
      country: 'France',
    },
    phoneNumber: '+33 6 34 56 78 90',
    yearsInColloc: '2018 - 2022',
    collocRoom: 'La Véranda isolée avec les moyens du bord',
    dietaryPreferences: 'Carnivore assumé, intolérant aux crustacés',
    favoriteDrink: 'Cidre brut ou Gin Tonic',
    bio: 'Trésorier autoproclamé de la cagnotte Lydia/Tricount pour les courses.',
    createdAt: '2023-01-03T12:00:00.000Z',
  },
  {
    id: 'user-sarah',
    email: 'sarah@katkatkat.fr',
    firstName: 'Sarah',
    lastName: 'Benamara',
    nickname: 'Sassa',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    birthDate: '1997-11-28',
    address: {
      street: '25 Boulevard Longchamp',
      postalCode: '13001',
      city: 'Marseille',
      country: 'France',
    },
    phoneNumber: '+33 6 45 67 89 01',
    yearsInColloc: '2019 - 2023',
    collocRoom: 'Le Studio attenant',
    dietaryPreferences: 'Sans gluten (mais je triche pour les bûches)',
    favoriteDrink: 'Pastis frais ou Spritz',
    bio: 'Photographe officielle des dossiers compromettants du week-end annuel.',
    createdAt: '2023-01-04T13:00:00.000Z',
  },
  {
    id: 'user-antoine',
    email: 'antoine@katkatkat.fr',
    firstName: 'Antoine',
    lastName: 'Mercier',
    nickname: 'Tony',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    birthDate: '1995-01-19',
    address: {
      street: '17 Rue Saint-Michel',
      postalCode: '35000',
      city: 'Rennes',
      country: 'France',
    },
    phoneNumber: '+33 6 56 78 90 12',
    yearsInColloc: '2017 - 2020',
    collocRoom: 'Chambre sous les toits',
    dietaryPreferences: 'Aucune allergie, mange pour trois',
    favoriteDrink: 'Bière bretonne ou Kombucha',
    bio: 'DJ officiel du salon à 3h du matin.',
    createdAt: '2023-01-05T14:00:00.000Z',
  },
  {
    id: 'user-lea',
    email: 'lea@katkatkat.fr',
    firstName: 'Léa',
    lastName: 'Dubois',
    nickname: 'Lélou',
    avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
    birthDate: '1996-05-10',
    address: {
      street: '3 Rue Mercière',
      postalCode: '67000',
      city: 'Strasbourg',
      country: 'France',
    },
    phoneNumber: '+33 6 67 89 01 23',
    yearsInColloc: '2018 - 2021',
    collocRoom: 'Chambre du milieu avec le balcon',
    dietaryPreferences: 'Flexitarienne, allergie aux cacahuètes',
    favoriteDrink: 'Riesling ou infusion menthe fraîche',
    bio: 'Responsable logistique jeux de société (Codenames & Loup-Garou obligatoires).',
    createdAt: '2023-01-06T15:00:00.000Z',
  },
  {
    id: 'user-maxime',
    email: 'maxime@katkatkat.fr',
    firstName: 'Maxime',
    lastName: 'Fournier',
    nickname: 'Maxou',
    avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    birthDate: '1993-10-02',
    address: {
      street: '12 Avenue Jean Médecin',
      postalCode: '06000',
      city: 'Nice',
      country: 'France',
    },
    phoneNumber: '+33 6 78 90 12 34',
    yearsInColloc: '2015 - 2018',
    collocRoom: 'La chambre du RDC',
    dietaryPreferences: 'Mange tout sans modération',
    favoriteDrink: 'Limoncello maison',
    bio: 'Doyen historique de la colloc. J’ai encore les clés du premier portail !',
    createdAt: '2023-01-07T16:00:00.000Z',
  },
  {
    id: 'user-julie',
    email: 'julie@katkatkat.fr',
    firstName: 'Julie',
    lastName: 'Bertrand',
    nickname: 'Juju',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    birthDate: '1997-12-05',
    address: {
      street: '19 Rue Sainte-Catherine',
      postalCode: '59800',
      city: 'Lille',
      country: 'France',
    },
    phoneNumber: '+33 6 89 01 23 45',
    yearsInColloc: '2020 - 2023',
    collocRoom: 'La grande chambre d’amis transformée en dortoir',
    dietaryPreferences: 'Végétarienne, adore les gaufres liégeoises',
    favoriteDrink: 'Triple Karmeliet',
    bio: 'Prête à traverser la France pour le week-end Noël !',
    createdAt: '2023-01-08T17:00:00.000Z',
  }
];

export const INITIAL_POSTS: Post[] = [
  {
    id: 'post-welcome',
    authorId: 'user-hugo',
    authorName: 'Hugo Demart',
    authorNickname: 'Hugz',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    createdAt: '2024-11-10T14:30:00.000Z',
    type: 'announcement',
    title: '🎉 Bienvenue sur katkatkat, le repaire officiel des 30 collocs !',
    content: `Salut tout le monde ! 

Après des années de galères sur WhatsApp ("C'est quoi l'adresse de Sarah déjà ?", "On va où pour Noël ?", "Qui a les dates ?"), on a enfin notre plateforme privée.

Ce que vous pouvez faire dès maintenant :
1. **Complétez votre profil** (adresse postale pour les cartes de vœux/mariages, tél, date d'anniv)
2. **Exportez tous les anniversaires** en un clic sur votre Google Calendar / Apple Calendar
3. **Votez pour la maison de notre week-end de Noël** dans l'onglet Maisons ou ci-dessous
4. **Proposez des sondages** ou postez vos nouvelles !

Rien n'est public, tout reste strictement entre nous. Bon séjour sur katkatkat ! 🎄✨`,
    tags: ['Annonce', 'Colloc', 'Noël'],
    isPinned: true,
    likes: ['user-camille', 'user-thomas', 'user-sarah', 'user-antoine', 'user-lea'],
    comments: [
      {
        id: 'c-1',
        authorId: 'user-camille',
        authorName: 'Camille Vidal',
        authorNickname: 'Cam',
        authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        createdAt: '2024-11-10T15:10:00.000Z',
        content: 'INCROYABLE !! Enfin fini de fouiller dans les vieux messages WhatsApp pour retrouver l’adresse de Thomas ! 🔥'
      },
      {
        id: 'c-2',
        authorId: 'user-thomas',
        authorName: 'Thomas Rousseau',
        authorNickname: 'Toto',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        createdAt: '2024-11-10T16:05:00.000Z',
        content: 'J’ai mis à jour mon adresse à Bordeaux, pas d’excuse pour ne pas m’envoyer une carte de Noël cette année.'
      }
    ]
  },
  {
    id: 'post-poll-dates',
    authorId: 'user-camille',
    authorName: 'Camille Vidal',
    authorNickname: 'Cam',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    createdAt: '2024-11-12T09:15:00.000Z',
    type: 'poll',
    title: '🗓️ Quel week-end pour notre Noël Colloc 2024 ?',
    content: 'Votez pour vos disponibilités afin qu’on puisse bloquer la maison rapidement ! Choix multiple possible.',
    tags: ['Sondage', 'Organisation', 'Dates'],
    likes: ['user-hugo', 'user-sarah', 'user-julie'],
    poll: {
      question: 'Quelles dates vous conviennent pour le grand week-end ?',
      allowMultiple: true,
      options: [
        {
          id: 'opt-1',
          text: 'Du 6 au 8 Décembre 2024',
          votes: ['user-hugo', 'user-sarah']
        },
        {
          id: 'opt-2',
          text: 'Du 13 au 15 Décembre 2024 (Le plus populaire d’habitude)',
          votes: ['user-hugo', 'user-camille', 'user-thomas', 'user-antoine', 'user-lea', 'user-julie']
        },
        {
          id: 'opt-3',
          text: 'Du 10 au 12 Janvier 2025 (Épiphanie / Galette)',
          votes: ['user-maxime', 'user-antoine']
        }
      ]
    },
    comments: [
      {
        id: 'c-3',
        authorId: 'user-antoine',
        authorName: 'Antoine Mercier',
        authorNickname: 'Tony',
        authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        createdAt: '2024-11-12T10:00:00.000Z',
        content: 'Le week-end du 13-15 décembre est parfait pour poser le vendredi aprem !'
      }
    ]
  },
  {
    id: 'post-house-alpes',
    authorId: 'user-thomas',
    authorName: 'Thomas Rousseau',
    authorNickname: 'Toto',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    createdAt: '2024-11-13T17:45:00.000Z',
    type: 'house',
    title: '🏡 Proposition 1 : Le Grand Chalet Savoyard des Aravis (32 couchages)',
    content: `J’ai trouvé ce chalet de malade près de La Clusaz ! 

On rentre tous les 30 largement sans avoir à tirer à la courte paille pour le canapé-lit. Il y a un poêle géant au centre, une grande table où on tient tous en même temps, et sauna au sous-sol.`,
    tags: ['Maison', 'Chalet', 'Montagne'],
    likes: ['user-hugo', 'user-camille', 'user-sarah', 'user-lea'],
    house: {
      title: 'Chalet Panoramique des Aravis - 32 couchages',
      url: 'https://airbnb.fr/chalet-aravis-32p',
      location: 'La Clusaz, Haute-Savoie (74)',
      priceTotal: 3400,
      pricePerPerson: 115,
      capacity: 32,
      bedrooms: 12,
      bathrooms: 8,
      photos: [
        'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=80'
      ],
      tags: ['Cheminée géante', 'Sauna', 'Table 32 pers', 'Vue montagne', 'Parking 10 voitures'],
      pros: [
        'Chacun a un vrai lit (pas de matelas gonflable par terre)',
        'Grande pièce de vie pour faire le réveillon tous ensemble',
        'À 2h de Lyon, 4h de Paris en TGV+navette'
      ],
      cons: [
        'Pneus neige ou chaînes obligatoires s’il neige fort'
      ],
      ratings: {
        'user-hugo': 'love',
        'user-camille': 'love',
        'user-sarah': 'good',
        'user-julie': 'love'
      }
    },
    comments: [
      {
        id: 'c-4',
        authorId: 'user-sarah',
        authorName: 'Sarah Benamara',
        authorNickname: 'Sassa',
        authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
        createdAt: '2024-11-13T18:20:00.000Z',
        content: 'Coup de cœur direct !! 115€ par personne pour 3 jours avec sauna c’est hyper raisonnable.'
      }
    ]
  },
  {
    id: 'post-house-morvan',
    authorId: 'user-sarah',
    authorName: 'Sarah Benamara',
    authorNickname: 'Sassa',
    authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    createdAt: '2024-11-14T11:00:00.000Z',
    type: 'house',
    title: '🏡 Proposition 2 : Domaine du Morvan avec piscine intérieure chauffée',
    content: `Pour ceux qui trouvent les Alpes trop loin pour les Bretons et Lillois, voici une alternative centrale en Bourgogne/Morvan. 

Superbe grange rénovée, billard, babyfoot, et piscine intérieure chauffée à 29°C !`,
    tags: ['Maison', 'Bourgogne', 'Piscine'],
    likes: ['user-thomas', 'user-antoine', 'user-julie'],
    house: {
      title: 'Domaine des Grands Chênes - 30 pers',
      url: 'https://gites-de-france.com/domaine-morvan-30p',
      location: 'Parc Naturel du Morvan (58)',
      priceTotal: 2900,
      pricePerPerson: 97,
      capacity: 30,
      bedrooms: 10,
      bathrooms: 6,
      photos: [
        'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80'
      ],
      tags: ['Piscine chauffée 29°', 'Billard', 'Babyfoot', 'Terrain de pétanque couvert', 'Parc 2 hectares'],
      pros: [
        'Très central pour tout le monde (Paris, Lyon, Lille, Rennes)',
        'Moins de 100€ par personne',
        'Piscine couverte en plein hiver !'
      ],
      cons: [
        '2 chambres de 4 lits superposés'
      ],
      ratings: {
        'user-antoine': 'love',
        'user-julie': 'love',
        'user-thomas': 'good'
      }
    },
    comments: []
  },
  {
    id: 'post-secret-santa',
    authorId: 'user-lea',
    authorName: 'Léa Dubois',
    authorNickname: 'Lélou',
    authorAvatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
    createdAt: '2024-11-15T16:00:00.000Z',
    type: 'poll',
    title: '🎁 Secret Santa : quel budget pour le cadeau ?',
    content: 'Comme chaque année, tirage au sort des binômes Secret Santa ! Pour rappel la règle : cadeau drôle ou utile, emballé dans du papier journal ou du tissu.',
    tags: ['Secret Santa', 'Cadeaux', 'Tradition'],
    likes: ['user-hugo', 'user-camille'],
    poll: {
      question: 'Quel budget maximum pour le Secret Santa ?',
      allowMultiple: false,
      options: [
        {
          id: 'opt-ss-10',
          text: '10 € max (symbolique & drôle)',
          votes: ['user-thomas', 'user-sarah']
        },
        {
          id: 'opt-ss-15',
          text: '15 € max (le sweet spot)',
          votes: ['user-hugo', 'user-camille', 'user-lea', 'user-julie']
        },
        {
          id: 'opt-ss-20',
          text: '20 € max (pour des vrais cadeaux)',
          votes: ['user-antoine']
        }
      ]
    },
    comments: [
      {
        id: 'c-5',
        authorId: 'user-camille',
        authorName: 'Camille Vidal',
        authorNickname: 'Cam',
        authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        createdAt: '2024-11-15T16:45:00.000Z',
        content: '15€ c’est parfait ! Et interdiction formelle d’offrir un mug cette année Thomas 😂'
      }
    ]
  }
];
