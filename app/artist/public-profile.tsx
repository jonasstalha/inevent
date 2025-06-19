import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useArtistStore } from '../../src/components/artist/ArtistStore';

const PublicProfile = () => {
  const insets = useSafeAreaInsets();
  const { gigs, settings } = useArtistStore();

  // Dummy data for profile if not set
  const artistProfile = {
    name: settings.profile.name || 'Creative Arts Studio',
    avatar: settings.profile.profileImage || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    banner: (settings.profile as any).banner || 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80',
    title: (settings.profile as any).title || 'Professional Event Services',
    slogan: (settings.profile as any).slogan || 'Making your moments unforgettable',
    description: settings.profile.bio || 'We provide creative solutions and professional event services for all your special occasions. From music to photography, we have you covered!'
  };

  // Use all marketplace categories, but only show service cards for categories with published services
  const MARKETPLACE_CATEGORIES = [
    'Mariage',
    'Anniversaire',
    'Traiteur',
    'Musique',
    'Neggafa',
    'Conference',
    "Evenement d'entreprise",
    'Kermesse',
    'Henna',
    'Photographie',
    'Animation',
    'Decoration',
    'Buffet',
  ];

  // Dummy services for demo if no real gigs
  const dummyServices = [
    {
      title: 'Wedding Photography',
      description: 'Capture your special day with professional wedding photography.',
      images: ['https://images.unsplash.com/photo-1519125323398-675f0ddb6308'],
      category: 'Photographie',
    },
    {
      title: 'Live Band Performance',
      description: 'Energetic live music for your event, covering all genres.',
      images: ['https://images.unsplash.com/photo-1464983953574-0892a716854b'],
      category: 'Musique',
    },
    {
      title: 'Birthday Party Animation',
      description: 'Fun games and entertainment for kids and adults.',
      images: ['https://images.unsplash.com/photo-1506744038136-46273834b3fb'],
      category: 'Animation',
    },
    {
      title: 'Buffet Traiteur',
      description: 'Delicious buffet catering for all occasions.',
      images: ['https://images.unsplash.com/photo-1504674900247-0877df9cc836'],
      category: 'Buffet',
    },
  ];

  // Merge real gigs and dummy services for each category
  const gigsByCategory = MARKETPLACE_CATEGORIES.map((cat) => {
    const realServices = gigs.filter((g) => g.category === cat);
    const demoServices = dummyServices.filter((d) => d.category === cat);
    return {
      name: cat,
      services: realServices.length > 0 ? realServices : demoServices,
      isDummy: realServices.length === 0 && demoServices.length > 0,
    };
  });

  return (
    <View style={{ flex: 1, backgroundColor: '#faf8ff' }}>
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: insets.bottom + 24 }} showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <Image source={{ uri: artistProfile.banner }} style={styles.banner} />
        {/* Avatar, Name, Title, Slogan, Edit Button */}
        <View style={[styles.profileHeader, { backgroundColor: '#fff', borderRadius: 18, marginTop: -40, marginHorizontal: 12, paddingVertical: 18, shadowColor: '#6a0dad', shadowOpacity: 0.08, shadowRadius: 8, elevation: 2 }]}> 
          <View style={{alignItems:'center', marginBottom:8}}>
            <View style={{borderWidth:3, borderColor:'#fff', borderRadius:50, overflow:'hidden', shadowColor:'#6a0dad', shadowOpacity:0.15, shadowRadius:8, elevation:3}}>
              <Image source={{ uri: artistProfile.avatar }} style={{width:90, height:90, borderRadius:45, backgroundColor:'#eee'}} />
            </View>
          </View>
          <Text style={styles.name}>{artistProfile.name}</Text>
          <Text style={styles.title}>{artistProfile.title}</Text>
          <Text style={styles.slogan}>{artistProfile.slogan}</Text>
          <Text style={styles.description}>{artistProfile.description}</Text>
          <View style={{marginTop:10, alignItems:'center'}}>
            <View style={{flexDirection:'row', alignItems:'center', marginTop:6}}>
              <Ionicons name="create-outline" size={18} color="#6a0dad" style={{marginRight:4}} />
              <Text style={{color:'#6a0dad', fontWeight:'bold', fontSize:14}}>Edit Profile</Text>
            </View>
          </View>
        </View>
        {/* Categories and Services */}
        <View style={{ paddingHorizontal: 8, marginTop: 18 }}>
          {gigsByCategory.map((cat) => (
            <View key={cat.name} style={[styles.categoryBox, {marginBottom:24, borderWidth:1, borderColor:'#ece0fa', backgroundColor:'#fff'}]}> 
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                <Ionicons name="albums" size={22} color="#6a0dad" style={{ marginRight: 8 }} />
                <Text style={[styles.categoryTitle, {fontSize:17}]}>{cat.name}</Text>
              </View>
              {cat.services.length > 0 ? (
                cat.services.map((service, idx) => (
                  <View key={service.title + idx} style={[styles.serviceCard, {marginBottom:12, borderLeftWidth:4, borderLeftColor:'#6a0dad', backgroundColor:'#faf8ff', shadowColor:'#6a0dad', shadowOpacity:0.04, shadowRadius:2, elevation:1}]}> 
                    <Text style={[styles.serviceTitle, {fontSize:16}]}>{service.title}</Text>
                    <Text style={[styles.serviceDesc, {marginBottom:4}]}>{service.description}</Text>
                    {service.images && service.images.length > 0 && (
                      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 6 }}>
                        {service.images.map((img, i) => (
                          <Image key={i} source={{ uri: img }} style={styles.serviceImage} />
                        ))}
                      </ScrollView>
                    )}
                  </View>
                ))
              ) : (
                <Text style={{ color: '#bbb', fontStyle: 'italic', marginBottom: 4 }}>No published services in this category</Text>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
  },
  profileHeader: {
    alignItems: 'center',
    marginTop: -40,
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#fff',
    marginBottom: 8,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 22,
    color: '#222',
  },
  title: {
    fontSize: 15,
    color: '#6a0dad',
    fontWeight: '600',
    marginTop: 2,
  },
  slogan: {
    fontSize: 13,
    color: '#888',
    fontStyle: 'italic',
    marginTop: 2,
  },
  description: {
    fontSize: 14,
    color: '#444',
    marginTop: 6,
    textAlign: 'center',
  },
  categoryBox: {
    backgroundColor: '#f7f3fa',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    shadowColor: '#6a0dad',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 1,
  },
  categoryTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#6a0dad',
  },
  serviceCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  serviceTitle: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#333',
  },
  serviceDesc: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  serviceImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 8,
    marginTop: 4,
  },
});

export default PublicProfile;
