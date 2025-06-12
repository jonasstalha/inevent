export interface User {
  id: string;
  email: string;
  role: 'artist' | 'client' | 'admin';
  name: string;
  password?: string; // Added password field
  profileImage?: string;
  createdAt: Date;
}

export interface Artist extends User {
  bio: string;
  storeId: string;
  rating: number;
  categories: string[];
  location: string;
  featured: boolean;
}

export interface Client extends User {
  savedArtists: string[];
  points: number;
  purchaseHistory: string[];
}

export interface Admin extends User {
  permissions: string[];
}

export interface Gig {
  id: string;
  artistId: string;
  title: string;
  description: string;
  basePrice: number;
  images: string[];
  category: string;
  options: GigOption[];
  rating: number;
  reviewCount: number;
  createdAt: Date;
}

export interface GigOption {
  id: string;
  title: string;
  description: string;
  price: number;
}

export interface Order {
  id: string;
  clientId: string;
  gigId: string;
  artistId: string;
  status: 'pending' | 'confirmed' | 'rejected' | 'completed';
  totalPrice: number;
  selectedOptions: string[];
  specialRequests?: string;
  createdAt: Date;
}

export interface Ticket {
  id: string;
  eventName: string;
  eventDate: Date;
  artistId: string;
  clientId?: string;
  price: number;
  qrCode: string;
  status: 'available' | 'sold' | 'used';
  createdAt: Date;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'purchase' | 'sale' | 'refund' | 'payout';
  amount: number;
  description: string;
  createdAt: Date;
}

export interface Points {
  userId: string;
  currentPoints: number;
  history: PointsHistory[];
}

export interface PointsHistory {
  id: string;
  amount: number;
  reason: string;
  createdAt: Date;
}