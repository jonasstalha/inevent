import React, { createContext, useContext } from 'react';
import { Gig, Artist, Order, Ticket } from '../models/types';

// Mock data for development purposes
const MOCK_ARTISTS: Artist[] = [
  {
    id: '1',
    email: 'artist@example.com',
    name: 'Emma Johnson',
    role: 'artist',
    profileImage: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=600',
    bio: 'Professional singer with 10+ years of experience in weddings and corporate events',
    storeId: 'store1',
    rating: 4.8,
    categories: ['Music', 'Live Performance'],
    location: 'New York, NY',
    featured: true,
    createdAt: new Date('2023-01-15'),
  },
  {
    id: '2',
    email: 'artist2@example.com',
    name: 'James Wilson',
    role: 'artist',
    profileImage: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=600',
    bio: 'Professional photographer specializing in portraits and events',
    storeId: 'store2',
    rating: 4.6,
    categories: ['Photography', 'Visual Arts'],
    location: 'Los Angeles, CA',
    featured: true,
    createdAt: new Date('2023-02-20'),
  },
  {
    id: '3',
    email: 'artist3@example.com',
    name: 'Sophia Lee',
    role: 'artist',
    profileImage: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=600',
    bio: 'Master chef with expertise in catering for special events',
    storeId: 'store3',
    rating: 4.9,
    categories: ['Culinary Arts', 'Catering'],
    location: 'Chicago, IL',
    featured: false,
    createdAt: new Date('2023-03-10'),
  },
];

const MOCK_GIGS: Gig[] = [
  {
    id: '1',
    artistId: '1',
    title: 'Live Music Performance',
    description: 'Professional live music for your special event. Solo performer with vocals and acoustic guitar.',
    basePrice: 300,
    images: ['https://images.pexels.com/photos/96380/pexels-photo-96380.jpeg?auto=compress&cs=tinysrgb&w=600'],
    category: 'Music',
    options: [
      { id: 'opt1', title: 'Extra Hour', description: 'Add an additional hour to the performance', price: 100 },
      { id: 'opt2', title: 'Song Requests', description: 'Prepare up to 5 song requests in advance', price: 50 },
    ],
    rating: 4.8,
    reviewCount: 24,
    createdAt: new Date('2023-05-12'),
  },
  {
    id: '2',
    artistId: '2',
    title: 'Professional Photography Session',
    description: 'Capture your special moments with a professional photo session.',
    basePrice: 250,
    images: ['https://images.pexels.com/photos/3062541/pexels-photo-3062541.jpeg?auto=compress&cs=tinysrgb&w=600'],
    category: 'Photography',
    options: [
      { id: 'opt1', title: 'Extra Hour', description: 'Add an additional hour to the session', price: 100 },
      { id: 'opt2', title: 'Premium Editing', description: 'Advanced photo editing and retouching', price: 75 },
      { id: 'opt3', title: 'Same-Day Delivery', description: 'Get select photos the same day', price: 50 },
    ],
    rating: 4.7,
    reviewCount: 36,
    createdAt: new Date('2023-04-18'),
  },
  {
    id: '3',
    artistId: '3',
    title: 'Gourmet Catering Service',
    description: 'Exquisite gourmet catering for your event with customizable menu options.',
    basePrice: 500,
    images: ['https://images.pexels.com/photos/587741/pexels-photo-587741.jpeg?auto=compress&cs=tinysrgb&w=600'],
    category: 'Culinary Arts',
    options: [
      { id: 'opt1', title: 'Premium Menu', description: 'Upgrade to our premium selection', price: 200 },
      { id: 'opt2', title: 'Bar Service', description: 'Add professional bar service with mixologists', price: 300 },
      { id: 'opt3', title: 'Dessert Station', description: 'Add a gourmet dessert station', price: 150 },
    ],
    rating: 4.9,
    reviewCount: 42,
    createdAt: new Date('2023-06-05'),
  },
];

const MOCK_ORDERS: Order[] = [
  {
    id: '1',
    clientId: '2',
    gigId: '1',
    artistId: '1',
    status: 'confirmed',
    totalPrice: 450,
    selectedOptions: ['opt1', 'opt2'],
    specialRequests: 'Would like to include "Somewhere Over the Rainbow" as one of the song requests.',
    createdAt: new Date('2023-08-15'),
  },
  {
    id: '2',
    clientId: '2',
    gigId: '2',
    artistId: '2',
    status: 'pending',
    totalPrice: 325,
    selectedOptions: ['opt2'],
    createdAt: new Date('2023-09-02'),
  },
];

const MOCK_TICKETS: Ticket[] = [
  {
    id: '1',
    eventName: 'Summer Jazz Festival',
    eventDate: new Date('2023-07-15'),
    artistId: '1',
    price: 45,
    qrCode: 'dummy-qr-code-data-1',
    status: 'available',
    createdAt: new Date('2023-05-20'),
  },
  {
    id: '2',
    eventName: 'Photography Workshop',
    eventDate: new Date('2023-08-20'),
    artistId: '2',
    price: 75,
    qrCode: 'dummy-qr-code-data-2',
    status: 'available',
    createdAt: new Date('2023-06-15'),
  },
];

interface AppContextType {
  artists: Artist[];
  gigs: Gig[];
  orders: Order[];
  tickets: Ticket[];
  getArtistById: (id: string) => Artist | undefined;
  getGigById: (id: string) => Gig | undefined;
  getGigsByArtistId: (artistId: string) => Gig[];
  getOrdersByClientId: (clientId: string) => Order[];
  getOrdersByArtistId: (artistId: string) => Order[];
  getTicketsByArtistId: (artistId: string) => Ticket[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Get artist by ID
  const getArtistById = (id: string) => {
    return MOCK_ARTISTS.find(artist => artist.id === id);
  };

  // Get gig by ID
  const getGigById = (id: string) => {
    return MOCK_GIGS.find(gig => gig.id === id);
  };

  // Get gigs by artist ID
  const getGigsByArtistId = (artistId: string) => {
    return MOCK_GIGS.filter(gig => gig.artistId === artistId);
  };

  // Get orders by client ID
  const getOrdersByClientId = (clientId: string) => {
    return MOCK_ORDERS.filter(order => order.clientId === clientId);
  };

  // Get orders by artist ID
  const getOrdersByArtistId = (artistId: string) => {
    return MOCK_ORDERS.filter(order => order.artistId === artistId);
  };

  // Get tickets by artist ID
  const getTicketsByArtistId = (artistId: string) => {
    return MOCK_TICKETS.filter(ticket => ticket.artistId === artistId);
  };

  return (
    <AppContext.Provider
      value={{
        artists: MOCK_ARTISTS,
        gigs: MOCK_GIGS,
        orders: MOCK_ORDERS,
        tickets: MOCK_TICKETS,
        getArtistById,
        getGigById,
        getGigsByArtistId,
        getOrdersByClientId,
        getOrdersByArtistId,
        getTicketsByArtistId,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};