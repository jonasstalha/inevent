import React from 'react';
import { ArtistStoreProvider } from '../../src/components/artist/ArtistStore';
import Marketplace from './marketplace';

const MarketplacePage = () => (
  <ArtistStoreProvider>
    <Marketplace />
  </ArtistStoreProvider>
);

export default MarketplacePage;
