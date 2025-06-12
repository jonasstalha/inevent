import React from 'react';
import { useArtistStore } from '../../src/components/artist/ArtistStore';

const ExampleComponent = () => {
  const { gigs, categories, addGig, addCategory } = useArtistStore();

  // Example usage: list gigs and categories
  return (
    <div style={{ padding: 24 }}>
      <h2>Gigs</h2>
      <ul>
        {gigs.map(gig => (
          <li key={gig.id}>{gig.title} - {gig.description}</li>
        ))}
      </ul>
      <h2>Categories</h2>
      <ul>
        {categories.map(cat => (
          <li key={cat.id}>{cat.name}</li>
        ))}
      </ul>
      {/* You can add forms/buttons here to use addGig, addCategory, etc. */}
    </div>
  );
};

export default ExampleComponent;
