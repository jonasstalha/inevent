import React from 'react';
import { ArtistStoreProvider } from '../../src/components/artist/ArtistStore';
import ArtistDashboard from '../../src/components/artist/ArtistDashboard';

const ArtistPlatform = () => {
  return (
    <ArtistStoreProvider>
      <ArtistDashboard />
    </ArtistStoreProvider>
  );
};

export default ArtistPlatform;
