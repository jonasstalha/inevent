// Store for artist gigs, categories, and tickets
import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export type Category = {
  id: string;
  name: string;
};

export type Ticket = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  date?: string;
  time?: string;
  flyer?: string;
  location?: string;
  contact?: string;
  description?: string;
};

export type GigOption = {
  id: string;
  title: string;
  description: string;
  price: number;
};

export type Gig = {
  id: string;
  artistId: string;
  title: string;
  description: string;
  basePrice: number;
  images: string[];
  category: string; // Use string for category name for marketplace compatibility
  options: GigOption[];
  location: string;
  rating: number;
  reviewCount: number;
  createdAt: Date;
};

interface SecuritySettings {
  twoFactorEnabled: boolean;
  lastPasswordChange: string;
}

interface NotificationSettings {
  eventUpdates: boolean;
  bookingRequests: boolean;
  messages: boolean;
  paymentUpdates: boolean;
}

interface PaymentMethod {
  id: string;
  type: string;
  last4: string;
}

interface ArtistSettings {
  isDarkMode: boolean;
  language: string;
  notificationsEnabled: boolean;
  notificationSettings: NotificationSettings;
  securitySettings: SecuritySettings;
  paymentMethods: PaymentMethod[];
  profile: {
    name: string;
    email: string;
    phone: string;
    bio: string;
    profileImage?: string;
  };
}

interface ArtistState {
  settings: ArtistSettings;
  gigs: Gig[];
  categories: Category[];
}

type ArtistAction =
  | { type: 'TOGGLE_DARK_MODE' }
  | { type: 'TOGGLE_NOTIFICATIONS' }
  | { type: 'UPDATE_NOTIFICATION_SETTINGS'; payload: Partial<NotificationSettings> }
  | { type: 'UPDATE_LANGUAGE'; payload: string }
  | { type: 'UPDATE_SECURITY_SETTINGS'; payload: Partial<SecuritySettings> }
  | { type: 'ADD_PAYMENT_METHOD'; payload: PaymentMethod }
  | { type: 'REMOVE_PAYMENT_METHOD'; payload: string }
  | { type: 'ADD_GIG'; payload: Omit<Gig, 'id'> }
  | { type: 'UPDATE_GIG'; payload: Gig }
  | { type: 'DELETE_GIG'; payload: string }
  | { type: 'ADD_CATEGORY'; payload: Omit<Category, 'id'> }
  | { type: 'UPDATE_CATEGORY'; payload: Category }
  | { type: 'DELETE_CATEGORY'; payload: string }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<ArtistSettings> }
  | { type: 'ADD_TICKET_TO_GIG'; payload: { gigId: string; ticket: Ticket } };

const initialState: ArtistState = {
  settings: {
    isDarkMode: false,
    language: 'English',
    notificationsEnabled: true,
    notificationSettings: {
      eventUpdates: true,
      bookingRequests: true,
      messages: true,
      paymentUpdates: true,
    },
    securitySettings: {
      twoFactorEnabled: false,
      lastPasswordChange: new Date().toISOString(),
    },
    paymentMethods: [],
    profile: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      bio: 'Professional artist with 10 years of experience',
      profileImage: 'https://via.placeholder.com/150',
    },
  },
  gigs: [],
  categories: [
    { id: 'cat1', name: 'Music' },
    { id: 'cat2', name: 'Comedy' },
    { id: 'cat3', name: 'Art' },
  ],
};

function artistReducer(state: ArtistState, action: ArtistAction): ArtistState {
  switch (action.type) {
    case 'TOGGLE_DARK_MODE':
      return {
        ...state,
        settings: {
          ...state.settings,
          isDarkMode: !state.settings.isDarkMode,
        },
      };
    case 'TOGGLE_NOTIFICATIONS':
      return {
        ...state,
        settings: {
          ...state.settings,
          notificationsEnabled: !state.settings.notificationsEnabled,
        },
      };
    case 'UPDATE_NOTIFICATION_SETTINGS':
      return {
        ...state,
        settings: {
          ...state.settings,
          notificationSettings: {
            ...state.settings.notificationSettings,
            ...action.payload,
          },
        },
      };
    case 'UPDATE_LANGUAGE':
      return {
        ...state,
        settings: {
          ...state.settings,
          language: action.payload,
        },
      };
    case 'UPDATE_SECURITY_SETTINGS':
      return {
        ...state,
        settings: {
          ...state.settings,
          securitySettings: {
            ...state.settings.securitySettings,
            ...action.payload,
          },
        },
      };
    case 'ADD_PAYMENT_METHOD':
      return {
        ...state,
        settings: {
          ...state.settings,
          paymentMethods: [...state.settings.paymentMethods, action.payload],
        },
      };
    case 'REMOVE_PAYMENT_METHOD':
      return {
        ...state,
        settings: {
          ...state.settings,
          paymentMethods: state.settings.paymentMethods.filter(
            (method) => method.id !== action.payload
          ),
        },
      };
    case 'ADD_GIG':
      return {
        ...state,
        gigs: [...state.gigs, { ...action.payload, id: Date.now().toString() }],
      };
    case 'UPDATE_GIG':
      return {
        ...state,
        gigs: state.gigs.map((g) => (g.id === action.payload.id ? action.payload : g)),
      };
    case 'DELETE_GIG':
      return {
        ...state,
        gigs: state.gigs.filter((g) => g.id !== action.payload),
      };
    case 'ADD_CATEGORY':
      return {
        ...state,
        categories: [...state.categories, { ...action.payload, id: Date.now().toString() }],
      };
    case 'UPDATE_CATEGORY':
      return {
        ...state,
        categories: state.categories.map((c) =>
          c.id === action.payload.id ? action.payload : c
        ),
      };
    case 'DELETE_CATEGORY':
      return {
        ...state,
        categories: state.categories.filter((c) => c.id !== action.payload),
        gigs: state.gigs.filter((g) => g.category !== action.payload),
      };
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: {
          ...state.settings,
          ...action.payload,
        },
      };
    case 'ADD_TICKET_TO_GIG': {
      // The new Gig type does not support tickets, so this action is now a no-op or should be removed.
      return state;
    }
    default:
      return state;
  }
}

interface ArtistContextType extends ArtistState {
  toggleDarkMode: () => void;
  toggleNotifications: () => void;
  updateNotificationSettings: (settings: Partial<NotificationSettings>) => void;
  updateLanguage: (language: string) => void;
  updateSecuritySettings: (settings: Partial<SecuritySettings>) => void;
  addPaymentMethod: (method: PaymentMethod) => void;
  removePaymentMethod: (id: string) => void;
  addGig: (gig: Omit<Gig, 'id'>) => void;
  updateGig: (gig: Gig) => void;
  deleteGig: (id: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (id: string) => void;
  updateSettings: (settings: Partial<ArtistSettings>) => void;
  addTicketToGig: (gigId: string, ticket: Ticket) => void;
}

const ArtistContext = createContext<ArtistContextType | undefined>(undefined);

export const ArtistStoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(artistReducer, initialState);

  const value: ArtistContextType = {
    ...state,
    toggleDarkMode: () => dispatch({ type: 'TOGGLE_DARK_MODE' }),
    toggleNotifications: () => dispatch({ type: 'TOGGLE_NOTIFICATIONS' }),
    updateNotificationSettings: (settings) =>
      dispatch({ type: 'UPDATE_NOTIFICATION_SETTINGS', payload: settings }),
    updateLanguage: (language) => dispatch({ type: 'UPDATE_LANGUAGE', payload: language }),
    updateSecuritySettings: (settings) =>
      dispatch({ type: 'UPDATE_SECURITY_SETTINGS', payload: settings }),
    addPaymentMethod: (method) => dispatch({ type: 'ADD_PAYMENT_METHOD', payload: method }),
    removePaymentMethod: (id) => dispatch({ type: 'REMOVE_PAYMENT_METHOD', payload: id }),
    addGig: (gig) => dispatch({ type: 'ADD_GIG', payload: gig }),
    updateGig: (gig) => dispatch({ type: 'UPDATE_GIG', payload: gig }),
    deleteGig: (id) => dispatch({ type: 'DELETE_GIG', payload: id }),
    addCategory: (category) => dispatch({ type: 'ADD_CATEGORY', payload: category }),
    updateCategory: (category) => dispatch({ type: 'UPDATE_CATEGORY', payload: category }),
    deleteCategory: (id) => dispatch({ type: 'DELETE_CATEGORY', payload: id }),
    updateSettings: (settings) => dispatch({ type: 'UPDATE_SETTINGS', payload: settings }),
    addTicketToGig: (gigId, ticket) => dispatch({ type: 'ADD_TICKET_TO_GIG', payload: { gigId, ticket } }),
  };

  return <ArtistContext.Provider value={value}>{children}</ArtistContext.Provider>;
};

export const useArtistStore = () => {
  const context = useContext(ArtistContext);
  if (context === undefined) {
    throw new Error('useArtistStore must be used within an ArtistStoreProvider');
  }
  return context;
};
