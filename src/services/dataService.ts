import { UserProfile, Post, Comment } from '../types';
import { INITIAL_PROFILES, INITIAL_POSTS } from './mockData';

// Local storage keys
const STORAGE_USERS_KEY = 'katkatkat_users_v2';
const STORAGE_POSTS_KEY = 'katkatkat_posts_v2';
const STORAGE_CURRENT_USER_KEY = 'katkatkat_current_user_v2';
const STORAGE_FIREBASE_CONFIG_KEY = 'katkatkat_firebase_config_v2';

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export class DataService {
  private users: UserProfile[] = [];
  private posts: Post[] = [];
  private currentUser: UserProfile | null = null;
  private listeners: (() => void)[] = [];
  private isFirebaseActive = false;

  constructor() {
    this.init();
  }

  private init() {
    // 1. Load users
    const storedUsers = localStorage.getItem(STORAGE_USERS_KEY);
    if (storedUsers) {
      try {
        this.users = JSON.parse(storedUsers);
      } catch {
        this.users = [...INITIAL_PROFILES];
      }
    } else {
      this.users = [...INITIAL_PROFILES];
      this.saveUsers();
    }

    // 2. Load posts
    const storedPosts = localStorage.getItem(STORAGE_POSTS_KEY);
    if (storedPosts) {
      try {
        this.posts = JSON.parse(storedPosts);
      } catch {
        this.posts = [...INITIAL_POSTS];
      }
    } else {
      this.posts = [...INITIAL_POSTS];
      this.savePosts();
    }

    // 3. Load active session
    const storedCurrent = localStorage.getItem(STORAGE_CURRENT_USER_KEY);
    if (storedCurrent) {
      try {
        const found = this.users.find((u) => u.id === storedCurrent);
        if (found) {
          this.currentUser = found;
        }
      } catch {
        this.currentUser = null;
      }
    }
  }

  public subscribe(callback: () => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  private saveUsers() {
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(this.users));
    this.notify();
  }

  private savePosts() {
    localStorage.setItem(STORAGE_POSTS_KEY, JSON.stringify(this.posts));
    this.notify();
  }

  // Auth methods
  public getCurrentUser(): UserProfile | null {
    return this.currentUser;
  }

  public loginWithEmail(email: string, _password?: string): { success: boolean; error?: string } {
    const trimmed = email.trim().toLowerCase();
    const user = this.users.find((u) => u.email.toLowerCase() === trimmed);
    if (!user) {
      return { success: false, error: "Adresse email inconnue. Créez un compte ou choisissez un profil existant." };
    }
    this.currentUser = user;
    localStorage.setItem(STORAGE_CURRENT_USER_KEY, user.id);
    this.notify();
    return { success: true };
  }

  public register(
    email: string,
    firstName: string,
    lastName: string,
    nickname?: string
  ): { success: boolean; user?: UserProfile; error?: string } {
    const trimmedEmail = email.trim().toLowerCase();
    if (this.users.some((u) => u.email.toLowerCase() === trimmedEmail)) {
      return { success: false, error: "Cette adresse email a déjà un compte." };
    }

    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      email: trimmedEmail,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      nickname: nickname?.trim(),
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(firstName)}`,
      birthDate: '1995-01-01',
      address: {
        street: '',
        postalCode: '',
        city: '',
        country: 'France',
      },
      phoneNumber: '',
      yearsInColloc: 'Colloc',
      collocRoom: '',
      dietaryPreferences: 'Mange de tout',
      favoriteDrink: '',
      bio: '',
      createdAt: new Date().toISOString(),
    };

    this.users.push(newUser);
    this.saveUsers();
    this.currentUser = newUser;
    localStorage.setItem(STORAGE_CURRENT_USER_KEY, newUser.id);
    this.notify();
    return { success: true, user: newUser };
  }

  public loginWithGoogleMock(): UserProfile {
    // Simulate Google SSO with a default or prompt
    let user = this.users.find((u) => u.email === 'hugo@katkatkat.fr');
    if (!user) {
      user = this.users[0];
    }
    this.currentUser = user;
    localStorage.setItem(STORAGE_CURRENT_USER_KEY, user.id);
    this.notify();
    return user;
  }

  public switchUser(userId: string) {
    const user = this.users.find((u) => u.id === userId);
    if (user) {
      this.currentUser = user;
      localStorage.setItem(STORAGE_CURRENT_USER_KEY, user.id);
      this.notify();
    }
  }

  public logout() {
    this.currentUser = null;
    localStorage.removeItem(STORAGE_CURRENT_USER_KEY);
    this.notify();
  }

  // Users & Profiles
  public getUsers(): UserProfile[] {
    return [...this.users];
  }

  public getUserById(id: string): UserProfile | undefined {
    return this.users.find((u) => u.id === id);
  }

  public updateUserProfile(updated: UserProfile): { success: boolean } {
    const idx = this.users.findIndex((u) => u.id === updated.id);
    if (idx !== -1) {
      this.users[idx] = { ...updated };
      if (this.currentUser?.id === updated.id) {
        this.currentUser = { ...updated };
      }
      this.saveUsers();
      return { success: true };
    }
    return { success: false };
  }

  // Posts
  public getPosts(): Post[] {
    return [...this.posts].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }

  public addPost(
    post: Omit<Post, 'id' | 'createdAt' | 'likes' | 'comments' | 'authorId' | 'authorName' | 'authorNickname' | 'authorAvatar'>
  ): Post {
    if (!this.currentUser) throw new Error("Authentification requise");

    const newPost: Post = {
      ...post,
      id: `post-${Date.now()}`,
      authorId: this.currentUser.id,
      authorName: `${this.currentUser.firstName} ${this.currentUser.lastName}`.trim(),
      authorNickname: this.currentUser.nickname,
      authorAvatar: this.currentUser.avatarUrl,
      createdAt: new Date().toISOString(),
      likes: [],
      comments: [],
    };

    this.posts.unshift(newPost);
    this.savePosts();
    return newPost;
  }

  public toggleLikePost(postId: string): void {
    if (!this.currentUser) return;
    const post = this.posts.find((p) => p.id === postId);
    if (!post) return;

    const userId = this.currentUser.id;
    if (post.likes.includes(userId)) {
      post.likes = post.likes.filter((id) => id !== userId);
    } else {
      post.likes.push(userId);
    }
    this.savePosts();
  }

  public addComment(postId: string, content: string): Comment | null {
    if (!this.currentUser || !content.trim()) return null;
    const post = this.posts.find((p) => p.id === postId);
    if (!post) return null;

    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      authorId: this.currentUser.id,
      authorName: `${this.currentUser.firstName} ${this.currentUser.lastName}`.trim(),
      authorNickname: this.currentUser.nickname,
      authorAvatar: this.currentUser.avatarUrl,
      createdAt: new Date().toISOString(),
      content: content.trim(),
    };

    post.comments.push(newComment);
    this.savePosts();
    return newComment;
  }

  // Poll voting
  public votePoll(postId: string, optionId: string): void {
    if (!this.currentUser) return;
    const post = this.posts.find((p) => p.id === postId);
    if (!post || !post.poll) return;

    const userId = this.currentUser.id;
    const { allowMultiple, options } = post.poll;

    if (!allowMultiple) {
      // Remove user from all other options
      options.forEach((opt) => {
        opt.votes = opt.votes.filter((id) => id !== userId);
      });
      // Toggle selected option
      const target = options.find((opt) => opt.id === optionId);
      if (target) {
        target.votes.push(userId);
      }
    } else {
      // Multiple choices permitted
      const target = options.find((opt) => opt.id === optionId);
      if (target) {
        if (target.votes.includes(userId)) {
          target.votes = target.votes.filter((id) => id !== userId);
        } else {
          target.votes.push(userId);
        }
      }
    }

    this.savePosts();
  }

  // House rating
  public rateHouse(postId: string, rating: 'love' | 'good' | 'meh' | 'pass'): void {
    if (!this.currentUser) return;
    const post = this.posts.find((p) => p.id === postId);
    if (!post || !post.house) return;

    const userId = this.currentUser.id;
    if (!post.house.ratings) {
      post.house.ratings = {};
    }

    if (post.house.ratings[userId] === rating) {
      delete post.house.ratings[userId];
    } else {
      post.house.ratings[userId] = rating;
    }

    this.savePosts();
  }

  // Firebase Config handling
  public getSavedFirebaseConfig(): FirebaseConfig | null {
    const raw = localStorage.getItem(STORAGE_FIREBASE_CONFIG_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  public saveFirebaseConfig(cfg: FirebaseConfig) {
    localStorage.setItem(STORAGE_FIREBASE_CONFIG_KEY, JSON.stringify(cfg));
    this.isFirebaseActive = true;
    this.notify();
  }

  public isUsingFirebase(): boolean {
    return this.isFirebaseActive;
  }
}

export const dataService = new DataService();
