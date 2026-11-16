export interface Address {
  street: string;
  postalCode: string;
  city: string;
  country: string;
}

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  nickname?: string;
  avatarUrl?: string;
  birthDate: string; // YYYY-MM-DD
  address: Address;
  phoneNumber: string;
  yearsInColloc?: string; // e.g. "2018 - 2021"
  collocRoom?: string; // e.g. "Chambre du fond", "Chambre bleue"
  dietaryPreferences?: string; // e.g. "Végétarien", "Sans gluten"
  favoriteDrink?: string; // e.g. "Chartreuse", "Bière ambrée"
  bio?: string;
  createdAt: string;
}

export interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  authorNickname?: string;
  authorAvatar?: string;
  createdAt: string;
  content: string;
}

export interface PollOption {
  id: string;
  text: string;
  votes: string[]; // array of userIds
}

export interface PollData {
  question: string;
  options: PollOption[];
  allowMultiple: boolean;
  closed?: boolean;
}

export interface HouseData {
  title: string;
  url?: string;
  location: string;
  priceTotal: number;
  pricePerPerson: number;
  capacity: number;
  bedrooms: number;
  bathrooms: number;
  photos: string[];
  tags: string[]; // e.g. "Cheminée", "Piscine", "Grand salon", "Jacuzzi"
  pros?: string[];
  cons?: string[];
  ratings: Record<string, 'love' | 'good' | 'meh' | 'pass'>; // userId -> rating
}

export type PostType = 'post' | 'poll' | 'house' | 'announcement';

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorNickname?: string;
  authorAvatar?: string;
  createdAt: string;
  type: PostType;
  title: string;
  content: string;
  tags?: string[];
  likes: string[]; // userIds
  comments: Comment[];
  poll?: PollData;
  house?: HouseData;
  isPinned?: boolean;
}

export type ActiveTab = 'feed' | 'directory' | 'houses' | 'birthdays' | 'profile';
