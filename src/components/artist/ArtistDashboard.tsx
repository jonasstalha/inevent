import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, ScrollView, StyleSheet, Button, SafeAreaView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useArtistStore } from './ArtistStore';

const ArtistMobileApp = () => {
  const {
    gigs,
    categories,
    addGig,
    updateGig,
    deleteGig,
    addCategory,
    updateCategory,
    deleteCategory,
  } = useArtistStore();

  const [activeTab, setActiveTab] = useState('home');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<{ type: string; name: string } | null>(null);
  const [notifications, setNotifications] = useState(3);
  const [credits, setCredits] = useState(50);
  const [walletBalance, setWalletBalance] = useState(1250.00);

  const artistProfile = {
    name: "Creative Arts Studio",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    description: "Professional event services and creative solutions for your special moments",
    rating: 4.8,
    reviewsCount: 124
  };

  const marketplaceCategories = categories.map(cat => cat.name);

  const [newService, setNewService] = useState({
    title: '',
    description: '',
    basePrice: '',
    category: '',
    offers: [],
    images: []
  });

  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    ticketTypes: [{ name: 'Normal', price: '', quantity: '' }],
    flyer: null
  });

  const insets = useSafeAreaInsets();

  const addService = () => {
    if (credits < 5) {
      alert('Insufficient credits! You need 5 credits to publish a service.');
      return;
    }
    if (!selectedCategory || !newService.title || !newService.description || !newService.basePrice) return;
    const categoryObj = categories.find(c => c.name === selectedCategory.name);
    addGig({
      title: newService.title,
      description: newService.description,
      categoryId: categoryObj ? categoryObj.id : '',
      tickets: [],
    });
    setCredits(credits - 5);
    setNewService({
      title: '',
      description: '',
      basePrice: '',
      category: '',
      offers: [],
      images: []
    });
    setSelectedCategory(null);
  };

  const addEvent = () => {
    if (credits < 10) {
      alert('Insufficient credits! You need 10 credits to publish an event.');
      return;
    }
    if (!newEvent.title || !newEvent.description || !newEvent.date) return;
    addGig({
      title: newEvent.title,
      description: newEvent.description,
      categoryId: categories[0]?.id || '',
      tickets: newEvent.ticketTypes.map((t, i) => ({
        id: `${Date.now()}-${i}`,
        name: t.name,
        price: Number(t.price),
        quantity: Number(t.quantity)
      })),
    });
    setCredits(credits - 10);
    setNewEvent({
      title: '',
      description: '',
      date: '',
      ticketTypes: [{ name: 'Normal', price: '', quantity: '' }],
      flyer: null
    });
  };

  const addTicketType = () => {
    setNewEvent({
      ...newEvent,
      ticketTypes: [...newEvent.ticketTypes, { name: '', price: '', quantity: '' }]
    });
  };

  const updateTicketType = (index: number, field: 'name' | 'price' | 'quantity', value: string) => {
    const updatedTypes = [...newEvent.ticketTypes];
    updatedTypes[index][field] = value;
    setNewEvent({ ...newEvent, ticketTypes: updatedTypes });
  };

  // Home Page Component
  const HomePage = () => (
    <ScrollView style={styles.container}>
      {/* Profile Preview */}
      <View style={styles.card}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
          <Image 
            source={{ uri: artistProfile.image }} 
            style={{ width: 64, height: 64, borderRadius: 32, marginRight: 16 }}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{artistProfile.name}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
              <Text style={{ fontSize: 16 }}>⭐</Text>
              <Text style={{ fontSize: 14, color: '#666', marginLeft: 4 }}>{artistProfile.rating} ({artistProfile.reviewsCount} avis)</Text>
            </View>
            <Text style={{ fontSize: 14, color: '#666' }}>{artistProfile.description}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.buttonBlue}>
          <Text style={{ color: 'white', fontWeight: 'bold' }}>👁️ Voir mon profil public</Text>
        </TouchableOpacity>
      </View>
      {/* Credits and Wallet Balance */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Mon compte</Text>
        <View style={styles.rowBetween}><Text>Crédits disponibles :</Text><Text style={styles.bold}>{credits} crédits</Text></View>
        <View style={styles.rowBetween}><Text>Solde du portefeuille :</Text><Text style={styles.bold}>{walletBalance.toFixed(2)} MAD</Text></View>
        <TouchableOpacity style={styles.buttonGreen}>
          <Text style={{ color: 'white', fontWeight: 'bold' }}>➕ Ajouter des fonds</Text>
        </TouchableOpacity>
      </View>
      {/* Add Service */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Ajouter un service</Text>
        <TextInput 
          placeholder="Titre du service" 
          value={newService.title}
          onChangeText={text => setNewService({ ...newService, title: text })}
          style={styles.input}
        />
        <TouchableOpacity onPress={() => setShowCategoryDropdown(!showCategoryDropdown)} style={styles.input}>
          <Text>{selectedCategory?.name || 'Choisir une catégorie'}</Text>
        </TouchableOpacity>
        {showCategoryDropdown && (
          <View style={styles.dropdown}>
            {marketplaceCategories.map(cat => (
              <TouchableOpacity 
                key={cat} 
                onPress={() => {
                  setSelectedCategory({ type: 'marketplace', name: cat });
                  setShowCategoryDropdown(false);
                }}
                style={styles.dropdownItem}
              >
                <Text>{cat}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        <TextInput 
          placeholder="Prix de base" 
          value={newService.basePrice}
          onChangeText={text => setNewService({ ...newService, basePrice: text })}
          style={styles.input}
          keyboardType="numeric"
        />
        <TextInput 
          placeholder="Description du service" 
          value={newService.description}
          onChangeText={text => setNewService({ ...newService, description: text })}
          style={[styles.input, { height: 80 }]}
          multiline
        />
        <TouchableOpacity onPress={addService} style={styles.buttonBlue}>
          <Text style={{ color: 'white', fontWeight: 'bold' }}>➕ Ajouter le service</Text>
        </TouchableOpacity>
      </View>
      {/* Services List */}
      {gigs.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Mes services</Text>
          {gigs.map(gig => (
            <View key={gig.id} style={styles.serviceCard}>
              <View style={styles.rowBetween}>
                <Text style={styles.bold}>{gig.title}</Text>
                <Text style={styles.active}>Actif</Text>
              </View>
              <Text style={{ color: '#666', marginBottom: 8 }}>{gig.description}</Text>
              <View style={styles.rowBetween}>
                <Text style={{ color: '#2563eb', fontWeight: 'bold' }}>{gig.tickets[0]?.price || 'N/A'} MAD</Text>
                <View style={{ flexDirection: 'row' }}>
                  <TouchableOpacity style={styles.iconBtn}><Text>✏️</Text></TouchableOpacity>
                  <TouchableOpacity style={styles.iconBtn} onPress={() => deleteGig(gig.id)}><Text>🗑️</Text></TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );

  // --- Calendar Page (Events/Tickets) ---
  const CalendarPage = () => (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Créer un événement</Text>
        <TextInput
          placeholder="Titre de l'événement"
          value={newEvent.title}
          onChangeText={text => setNewEvent({ ...newEvent, title: text })}
          style={styles.input}
        />
        <TextInput
          placeholder="Description"
          value={newEvent.description}
          onChangeText={text => setNewEvent({ ...newEvent, description: text })}
          style={[styles.input, { height: 60 }]}
          multiline
        />
        <TextInput
          placeholder="Date (ex: 2025-06-10)"
          value={newEvent.date}
          onChangeText={text => setNewEvent({ ...newEvent, date: text })}
          style={styles.input}
        />
        <Text style={{ marginTop: 8, marginBottom: 4, fontWeight: 'bold' }}>Types de billets</Text>
        {newEvent.ticketTypes.map((ticket, idx) => (
          <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
            <TextInput
              placeholder="Nom"
              value={ticket.name}
              onChangeText={text => updateTicketType(idx, 'name', text)}
              style={[styles.input, { flex: 1, marginRight: 4 }]}
            />
            <TextInput
              placeholder="Prix"
              value={ticket.price}
              onChangeText={text => updateTicketType(idx, 'price', text)}
              style={[styles.input, { width: 70, marginRight: 4 }]}
              keyboardType="numeric"
            />
            <TextInput
              placeholder="Qté"
              value={ticket.quantity}
              onChangeText={text => updateTicketType(idx, 'quantity', text)}
              style={[styles.input, { width: 60 }]}
              keyboardType="numeric"
            />
          </View>
        ))}
        <TouchableOpacity onPress={addTicketType} style={[styles.buttonBlue, { marginTop: 0, backgroundColor: '#e0e7ff' }]}> 
          <Text style={{ color: '#2563eb', fontWeight: 'bold' }}>+ Ajouter un type de billet</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={addEvent} style={styles.buttonPurple}>
          <Text style={{ color: 'white', fontWeight: 'bold' }}>🎫 Publier l'événement (10 crédits)</Text>
        </TouchableOpacity>
      </View>
      {/* Events List */}
      {gigs.filter(g => g.tickets.length > 0).length > 0 && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Mes événements</Text>
          {gigs.filter(g => g.tickets.length > 0).map(gig => (
            <View key={gig.id} style={styles.serviceCard}>
              <View style={styles.rowBetween}>
                <Text style={styles.bold}>{gig.title}</Text>
                <Text style={styles.active}>Actif</Text>
              </View>
              <Text style={{ color: '#666', marginBottom: 8 }}>{gig.description}</Text>
              <Text style={{ color: '#888', fontSize: 12 }}>Date: N/A</Text>
              <Text style={{ fontWeight: 'bold', marginTop: 4 }}>Billets:</Text>
              {gig.tickets.map(t => (
                <Text key={t.id} style={{ fontSize: 13 }}>- {t.name}: {t.price} MAD ({t.quantity} places)</Text>
              ))}
              <View style={styles.rowBetween}>
                <TouchableOpacity style={styles.iconBtn}><Text>✏️</Text></TouchableOpacity>
                <TouchableOpacity style={styles.iconBtn} onPress={() => deleteGig(gig.id)}><Text>🗑️</Text></TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );

  // --- Analytics Page (Dashboard) ---
  const AnalyticsPage = () => (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Statistiques</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
          <View style={styles.analyticsCard}><MaterialCommunityIcons name="cash" size={28} color="#22c55e" /><Text style={styles.analyticsValue}>{walletBalance.toFixed(2)} MAD</Text><Text style={styles.analyticsLabel}>Revenus</Text></View>
          <View style={styles.analyticsCard}><Ionicons name="ticket-outline" size={28} color="#6366f1" /><Text style={styles.analyticsValue}>{gigs.reduce((acc, g) => acc + g.tickets.length, 0)}</Text><Text style={styles.analyticsLabel}>Billets</Text></View>
          <View style={styles.analyticsCard}><FontAwesome5 name="users" size={24} color="#f59e42" /><Text style={styles.analyticsValue}>124</Text><Text style={styles.analyticsLabel}>Clients</Text></View>
        </View>
        <Text style={{ fontWeight: 'bold', marginBottom: 6 }}>Commandes récentes</Text>
        {[1, 2, 3].map(order => (
          <View key={order} style={styles.orderCard}>
            <Text style={{ fontWeight: 'bold' }}>Commande #{order}001</Text>
            <Text style={{ color: '#666' }}>Service: Photographie</Text>
            <Text style={{ color: '#22c55e', fontWeight: 'bold' }}>+850 MAD</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  // --- Settings Page ---
  const SettingsPage = () => (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Paramètres du compte</Text>
        <TouchableOpacity style={styles.settingsBtn}><Ionicons name="person-outline" size={20} color="#2563eb" /><Text style={styles.settingsBtnText}>Informations personnelles</Text></TouchableOpacity>
        <TouchableOpacity style={styles.settingsBtn}><Ionicons name="notifications-outline" size={20} color="#f59e42" /><Text style={styles.settingsBtnText}>Notifications</Text></TouchableOpacity>
        <TouchableOpacity style={styles.settingsBtn}><Ionicons name="lock-closed-outline" size={20} color="#6366f1" /><Text style={styles.settingsBtnText}>Confidentialité</Text></TouchableOpacity>
        <TouchableOpacity style={styles.settingsBtn}><Ionicons name="help-circle-outline" size={20} color="#22c55e" /><Text style={styles.settingsBtnText}>Aide & Support</Text></TouchableOpacity>
      </View>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Crédits</Text>
        <View style={styles.rowBetween}><Text>Crédits disponibles :</Text><Text style={styles.bold}>{credits} crédits</Text></View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
          <TouchableOpacity style={styles.creditBtn} onPress={() => setCredits(credits + 10)}><Text>+10</Text></TouchableOpacity>
          <TouchableOpacity style={styles.creditBtn} onPress={() => setCredits(credits + 25)}><Text>+25</Text></TouchableOpacity>
          <TouchableOpacity style={styles.creditBtn} onPress={() => setCredits(credits + 50)}><Text>+50</Text></TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity style={styles.logoutBtn}><Text style={{ color: '#ef4444', fontWeight: 'bold' }}>Se déconnecter</Text></TouchableOpacity>
    </ScrollView>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage />;
      case 'calendar':
        return <CalendarPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <View style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{artistProfile.name}</Text>
          <Text style={{ color: '#666' }}>{artistProfile.description}</Text>
        </View>
        {/* Content */}
        <View style={{ flex: 1 }}>{renderContent()}</View>
      </View>
      {/* Footer Navigation - absolutely positioned and padded for safe area */}
      <View style={[styles.footer, { paddingBottom: insets.bottom, position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: 'white', borderTopWidth: 1, borderColor: '#e5e7eb', zIndex: 100 }]}> 
        <TouchableOpacity onPress={() => setActiveTab('home')} style={[styles.footerBtn, activeTab === 'home' && styles.footerBtnActive]}>
          <MaterialCommunityIcons name="home-variant" size={28} color={activeTab === 'home' ? '#2563eb' : '#888'} />
          <Text style={[styles.footerLabel, activeTab === 'home' && { color: '#2563eb' }]}>Services</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('calendar')} style={[styles.footerBtn, activeTab === 'calendar' && styles.footerBtnActive]}>
          <Ionicons name="calendar-outline" size={28} color={activeTab === 'calendar' ? '#6366f1' : '#888'} />
          <Text style={[styles.footerLabel, activeTab === 'calendar' && { color: '#6366f1' }]}>Billets</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('analytics')} style={[styles.footerBtn, activeTab === 'analytics' && styles.footerBtnActive]}>
          <MaterialCommunityIcons name="chart-bar" size={28} color={activeTab === 'analytics' ? '#22c55e' : '#888'} />
          <Text style={[styles.footerLabel, activeTab === 'analytics' && { color: '#22c55e' }]}>Stats</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('settings')} style={[styles.footerBtn, activeTab === 'settings' && styles.footerBtnActive]}>
          <Ionicons name="settings-outline" size={28} color={activeTab === 'settings' ? '#f59e42' : '#888'} />
          <Text style={[styles.footerLabel, activeTab === 'settings' && { color: '#f59e42' }]}>Paramètres</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  card: { backgroundColor: 'white', borderRadius: 12, padding: 16, margin: 12, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#222' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  bold: { fontWeight: 'bold', color: '#222' },
  active: { fontSize: 12, backgroundColor: '#bbf7d0', color: '#166534', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  buttonBlue: { backgroundColor: '#2563eb', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  buttonGreen: { backgroundColor: '#22c55e', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  buttonPurple: { backgroundColor: '#6366f1', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 12 },
  input: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, padding: 10, marginBottom: 8, fontSize: 14, backgroundColor: '#f3f4f6' },
  dropdown: { backgroundColor: 'white', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, marginBottom: 8 },
  dropdownItem: { padding: 12 },
  serviceCard: { backgroundColor: '#f3f4f6', borderRadius: 8, padding: 12, marginVertical: 6 },
  iconBtn: { marginLeft: 8 },
  header: { padding: 16, backgroundColor: 'white', borderBottomWidth: 1, borderColor: '#e5e7eb' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#222' },
  footer: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingVertical: 6, backgroundColor: 'white' },
  footerBtn: { flex: 1, alignItems: 'center', paddingVertical: 4 },
  footerBtnActive: { borderTopWidth: 2, borderColor: '#2563eb', backgroundColor: '#f3f4f6' },
  footerLabel: { fontSize: 12, color: '#888', marginTop: 2 },
  analyticsCard: { alignItems: 'center', flex: 1, backgroundColor: '#f3f4f6', borderRadius: 8, padding: 10, marginHorizontal: 2 },
  analyticsValue: { fontWeight: 'bold', fontSize: 16, marginTop: 2 },
  analyticsLabel: { fontSize: 12, color: '#666' },
  orderCard: { backgroundColor: '#f9fafb', borderRadius: 8, padding: 10, marginVertical: 4 },
  settingsBtn: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 8, backgroundColor: '#f3f4f6', marginBottom: 8 },
  settingsBtnText: { marginLeft: 10, fontSize: 15, color: '#222' },
  creditBtn: { backgroundColor: '#e0e7ff', padding: 10, borderRadius: 8, alignItems: 'center', flex: 1, marginHorizontal: 4 },
  logoutBtn: { backgroundColor: '#fef2f2', padding: 14, borderRadius: 8, alignItems: 'center', margin: 16 },
});

export default ArtistMobileApp;
