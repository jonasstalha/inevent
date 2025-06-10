// Store for artist gigs, categories, and tickets
import { createContext, useContext, useState, ReactNode } from 'react';

export type Category = {
  id: string;
  name: string;
};

export type Ticket = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export type Gig = {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  tickets: Ticket[];
};

interface ArtistStoreContextProps {
  gigs: Gig[];
  categories: Category[];
  addGig: (gig: Omit<Gig, 'id'>) => void;
  updateGig: (gig: Gig) => void;
  deleteGig: (id: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (id: string) => void;
}

const ArtistStoreContext = createContext<ArtistStoreContextProps | undefined>(undefined);

export const useArtistStore = () => {
  const ctx = useContext(ArtistStoreContext);
  if (!ctx) throw new Error('useArtistStore must be used within ArtistStoreProvider');
  return ctx;
};

export const ArtistStoreProvider = ({ children }: { children: ReactNode }) => {
  const [categories, setCategories] = useState<Category[]>([
    { id: 'cat1', name: 'Music' },
    { id: 'cat2', name: 'Comedy' },
    { id: 'cat3', name: 'Art' },
  ]);
  const [gigs, setGigs] = useState<Gig[]>([]);

  // Category CRUD
  const addCategory = (category: Omit<Category, 'id'>) => {
    setCategories((prev) => [...prev, { ...category, id: Date.now().toString() }]);
  };
  const updateCategory = (category: Category) => {
    setCategories((prev) => prev.map((c) => (c.id === category.id ? category : c)));
  };
  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    setGigs((prev) => prev.filter((g) => g.categoryId !== id));
  };

  // Gig CRUD
  const addGig = (gig: Omit<Gig, 'id'>) => {
    setGigs((prev) => [...prev, { ...gig, id: Date.now().toString() }]);
  };
  const updateGig = (gig: Gig) => {
    setGigs((prev) => prev.map((g) => (g.id === gig.id ? gig : g)));
  };
  const deleteGig = (id: string) => {
    setGigs((prev) => prev.filter((g) => g.id !== id));
  };

  return (
    <ArtistStoreContext.Provider
      value={{ gigs, categories, addGig, updateGig, deleteGig, addCategory, updateCategory, deleteCategory }}
    >
      {children}
    </ArtistStoreContext.Provider>
  );
};
