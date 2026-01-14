import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Modal,
  Image,
  Linking,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Platform,
  Alert
} from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome5 } from '@expo/vector-icons'; // Using Expo icons for easy setup
import 'react-native-url-polyfill'; // FIXED: Removed /auto

// --- CONFIGURATION ---
const SB_URL = 'https://hqyayioenlteotepgujs.supabase.co';
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhxeWF5aW9lbmx0ZW90ZXBndWpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1Njg0OTQsImV4cCI6MjA4MjE0NDQ5NH0.QIt-9r-5aCYEkDfDy-auZxyAMfPv_UqIWJZs2drw5MU';

const supabase = createClient(SB_URL, SB_KEY);

// --- TRANSLATIONS ---
const translations = {
  so: {
    welcome: "Soo Dhawow!",
    greeting: "Subax wanaagsan,",
    searchPlaceholder: "Raadi shaqooyin...",
    heroTitle: "Raadi Shaqooyin\nCusub Maanta",
    heroSub: "Hel shaqooyin internetka ah oo sugan, kana ilaalo kuwa khiyaanada ah.",
    startBtn: "Bilow Raadinta",
    home: "Hoyga",
    searchNav: "Raadi",
    account: "Koontada",
    recentJobs: "Shaqooyinkii Ugu Dambeeyay",
    applyNow: "Codso Hada",
    posted: "La galiyay:",
    darkMode: "Habka Mugdiga (Dark Mode)",
    language: "Luqadda (Language)",
    info: "Macluumaad",
    mission: "Ujeeddada",
    privacy: "Privacy Policy",
    terms: "Terms & Conditions",
    close: "Xir",
    loading: "Waa la soo wadaa...",
    noResults: "Wax shaqo ah lama helin.",
    missionText: "ShaqoHub waxa uu caawiyaa dhalinyarada Soomaaliyeed si ay u helaan fursado shaqo online ah. Waxaan isku xirnaa dadka iyo bogagga shaqo ee la hubo.",
    privacyText: "Waxaan ururinaa xog aad u yar (cookies / usage data). KUMA ururinno xog gaar ah oo kuu muuqata sida email ama telefoon.",
    termsText: "Adeegga waxaad u isticmaashaa kaliya si sharci ah. Macluumaadka ku jira waa talo guud — had iyo jeer hubi bogga rasmiga ah."
  },
  en: {
    welcome: "Welcome!",
    greeting: "Good morning,",
    searchPlaceholder: "Search jobs...",
    heroTitle: "Find New\nJobs Today",
    heroSub: "Find secure online jobs and avoid scams.",
    startBtn: "Start Searching",
    home: "Home",
    searchNav: "Search",
    account: "Account",
    recentJobs: "Recent Jobs",
    applyNow: "Apply Now",
    posted: "Posted:",
    darkMode: "Dark Mode",
    language: "Language",
    info: "Information",
    mission: "Mission",
    privacy: "Privacy Policy",
    terms: "Terms & Conditions",
    close: "Close",
    loading: "Loading...",
    noResults: "No jobs found.",
    missionText: "ShaqoHub helps Somali youth find online job opportunities. We connect people with verified job sites.",
    privacyText: "We collect minimal data (usage data). We do NOT collect personal data like email or phone numbers.",
    termsText: "Use the service legally. Information contained is general advice — always check the official site before deciding."
  }
};

export default function App() {
  // --- STATE ---
  const [currentTab, setCurrentTab] = useState('home');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [lang, setLang] = useState('so');
  const [isDark, setIsDark] = useState(false);
  
  // Modals
  const [selectedTask, setSelectedTask] = useState(null);
  const [infoModalType, setInfoModalType] = useState(null); // 'mission', 'privacy', 'terms'

  // --- THEME COLORS ---
  const theme = {
    bg: isDark ? '#0b1220' : '#f9fafb',
    cardBg: isDark ? '#111827' : '#ffffff',
    text: isDark ? '#e5e7eb' : '#1f2937',
    textSub: isDark ? '#9ca3af' : '#6b7280',
    primary: '#6366f1',
    primaryLight: '#a5b4fc',
    border: isDark ? '#1f2937' : '#e5e7eb',
    navBg: isDark ? '#111827' : '#ffffff',
    navActive: isDark ? '#c7d2fe' : '#4f46e5',
    navInactive: isDark ? '#4b5563' : '#9ca3af',
  };

  const t = translations[lang];

  // --- EFFECT: LOAD DATA & PREFERENCES ---
  useEffect(() => {
    fetchTasks();
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const storedLang = await AsyncStorage.getItem('lang');
      const storedTheme = await AsyncStorage.getItem('theme');
      if (storedLang) setLang(storedLang);
      if (storedTheme === 'dark') setIsDark(true);
    } catch (e) {
      console.log('Error loading prefs', e);
    }
  };

  const savePreference = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (e) { console.log(e); }
  };

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTasks(data || []);
    } catch (err) {
      console.error("Supabase Error:", err);
      // Fallback data if offline or error, similar to your offline.html logic
      Alert.alert("Error", "Could not fetch jobs. Please check internet.");
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageToggle = (newLang) => {
    setLang(newLang);
    savePreference('lang', newLang);
  };

  const handleThemeToggle = () => {
    const newVal = !isDark;
    setIsDark(newVal);
    savePreference('theme', newVal ? 'dark' : 'light');
  };

  const filteredTasks = tasks.filter(task => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (task.title && task.title.toLowerCase().includes(q)) ||
      (task.platform && task.platform.toLowerCase().includes(q))
    );
  });

  // --- RENDER HELPERS ---
  const renderTaskItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.taskCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}
      onPress={() => setSelectedTask(item)}
      activeOpacity={0.8}
    >
      <View style={styles.taskHeader}>
        <View style={[styles.iconContainer, { backgroundColor: theme.bg }]}>
          <FontAwesome5 name={getIconName(item.platform)} size={20} color={theme.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.taskTitle, { color: theme.text }]} numberOfLines={1}>{item.title}</Text>
          <Text style={[styles.taskPlatform, { color: theme.textSub }]}>{item.platform}</Text>
        </View>
        <View style={styles.arrowContainer}>
          <FontAwesome5 name="chevron-right" size={14} color={theme.textSub} />
        </View>
      </View>
      <View style={styles.taskFooter}>
        <Text style={[styles.taskReward, { color: theme.primary }]}>
          {item.reward || '$0.00'}
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: item.status === 'Open' ? '#dcfce7' : '#fee2e2' }]}>
          <Text style={{ color: item.status === 'Open' ? '#166534' : '#991b1b', fontSize: 10, fontWeight: 'bold' }}>
            {item.status || 'Active'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const getIconName = (platform) => {
    const p = platform ? platform.toLowerCase() : '';
    if (p.includes('youtube')) return 'youtube';
    if (p.includes('tiktok')) return 'tiktok';
    if (p.includes('facebook')) return 'facebook';
    if (p.includes('survey')) return 'clipboard-list';
    if (p.includes('video')) return 'play-circle';
    return 'briefcase';
  };

  const openLink = (url) => {
    if (url) Linking.openURL(url);
  };

  // --- SCREENS ---
  const HomeScreen = () => (
    <ScrollView style={[styles.screenContainer, { backgroundColor: theme.bg }]} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: theme.textSub }]}>{t.greeting}</Text>
          <Text style={[styles.appName, { color: theme.text }]}>ShaqoHub</Text>
        </View>
        <TouchableOpacity style={styles.profileBtn}>
           <FontAwesome5 name="user-circle" size={28} color={theme.primary} />
        </TouchableOpacity>
      </View>

      {/* Hero Card */}
      <View style={styles.heroCard}>
        <View style={{ flex: 1 }}>
          <Text style={styles.heroTitle}>{t.heroTitle}</Text>
          <Text style={styles.heroSub}>{t.heroSub}</Text>
          <TouchableOpacity 
            style={styles.heroBtn} 
            onPress={() => setCurrentTab('search')}
          >
            <Text style={styles.heroBtnText}>{t.startBtn}</Text>
          </TouchableOpacity>
        </View>
        <FontAwesome5 name="rocket" size={50} color="rgba(255,255,255,0.2)" style={{ position: 'absolute', right: 20, bottom: 20 }} />
      </View>

      {/* Recent List */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>{t.recentJobs}</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={theme.primary} style={{ marginTop: 20 }} />
      ) : (
        tasks.slice(0, 5).map(item => (
          <View key={item.id}>
             {renderTaskItem({ item })}
          </View>
        ))
      )}
      <View style={{ height: 100 }} />
    </ScrollView>
  );

  const SearchScreen = () => (
    <View style={[styles.screenContainer, { backgroundColor: theme.bg, flex: 1 }]}>
      <View style={[styles.searchHeader, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
        <FontAwesome5 name="search" size={16} color={theme.textSub} style={{ marginRight: 10 }} />
        <TextInput
          style={[styles.searchInput, { color: theme.text }]}
          placeholder={t.searchPlaceholder}
          placeholderTextColor={theme.textSub}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      
      {loading ? (
        <ActivityIndicator size="large" color={theme.primary} style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={filteredTasks}
          keyExtractor={item => item.id.toString()}
          renderItem={renderTaskItem}
          contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
          ListEmptyComponent={
            <Text style={{ textAlign: 'center', color: theme.textSub, marginTop: 50 }}>
              {t.noResults}
            </Text>
          }
        />
      )}
    </View>
  );

  const AccountScreen = () => (
    <ScrollView style={[styles.screenContainer, { backgroundColor: theme.bg }]}>
      <View style={{ padding: 20 }}>
        <Text style={[styles.screenTitle, { color: theme.text }]}>{t.account}</Text>
        
        {/* Settings Card */}
        <View style={[styles.settingsCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
          
          {/* Language */}
          <View style={[styles.settingRow, { borderBottomColor: theme.border, borderBottomWidth: 1 }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <FontAwesome5 name="globe" size={18} color={theme.textSub} style={{ width: 30 }} />
              <Text style={{ color: theme.text, fontSize: 16 }}>{t.language}</Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TouchableOpacity 
                onPress={() => handleLanguageToggle('so')}
                style={[styles.langBtn, lang === 'so' && { backgroundColor: theme.primaryLight }]}
              >
                <Text style={{ color: lang === 'so' ? '#312e81' : theme.textSub, fontWeight: 'bold' }}>SO</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => handleLanguageToggle('en')}
                style={[styles.langBtn, lang === 'en' && { backgroundColor: theme.primaryLight }]}
              >
                <Text style={{ color: lang === 'en' ? '#312e81' : theme.textSub, fontWeight: 'bold' }}>EN</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Dark Mode */}
          <View style={styles.settingRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <FontAwesome5 name="moon" size={18} color={theme.textSub} style={{ width: 30 }} />
              <Text style={{ color: theme.text, fontSize: 16 }}>{t.darkMode}</Text>
            </View>
            <TouchableOpacity 
              onPress={handleThemeToggle}
              style={[styles.toggleTrack, { backgroundColor: isDark ? theme.primary : '#d1d5db' }]}
            >
              <View style={[styles.toggleThumb, { transform: [{ translateX: isDark ? 22 : 2 }] }]} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Info Links */}
        <Text style={{ color: theme.textSub, marginTop: 20, marginBottom: 10, fontWeight: 'bold' }}>{t.info}</Text>
        <View style={[styles.settingsCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
          {[
            { id: 'mission', icon: 'flag', label: t.mission },
            { id: 'privacy', icon: 'shield-alt', label: t.privacy },
            { id: 'terms', icon: 'file-contract', label: t.terms },
          ].map((item, index) => (
            <TouchableOpacity 
              key={item.id}
              style={[styles.settingRow, index !== 2 && { borderBottomColor: theme.border, borderBottomWidth: 1 }]}
              onPress={() => setInfoModalType(item.id)}
            >
               <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <FontAwesome5 name={item.icon} size={18} color={theme.textSub} style={{ width: 30 }} />
                <Text style={{ color: theme.text, fontSize: 16 }}>{item.label}</Text>
              </View>
              <FontAwesome5 name="chevron-right" size={14} color={theme.textSub} />
            </TouchableOpacity>
          ))}
        </View>

      </View>
    </ScrollView>
  );

  // --- MAIN RENDER ---
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <ExpoStatusBar style={isDark ? "light" : "dark"} backgroundColor={theme.bg} />
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={theme.bg} />

      {/* Content Area */}
      <View style={{ flex: 1 }}>
        {currentTab === 'home' && <HomeScreen />}
        {currentTab === 'search' && <SearchScreen />}
        {currentTab === 'account' && <AccountScreen />}
      </View>

      {/* Bottom Navigation */}
      <View style={[styles.navBar, { backgroundColor: theme.navBg, borderTopColor: theme.border }]}>
        <TouchableOpacity style={styles.navItem} onPress={() => setCurrentTab('home')}>
          <View style={[styles.navIconContainer, currentTab === 'home' && { backgroundColor: isDark ? '#312e81' : '#e0e7ff' }]}>
            <FontAwesome5 name="home" size={20} color={currentTab === 'home' ? theme.primary : theme.navInactive} />
          </View>
          <Text style={[styles.navText, { color: currentTab === 'home' ? theme.primary : theme.navInactive }]}>
            {t.home}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => setCurrentTab('search')}>
          <View style={[styles.navIconContainer, currentTab === 'search' && { backgroundColor: isDark ? '#312e81' : '#e0e7ff' }]}>
            <FontAwesome5 name="search" size={20} color={currentTab === 'search' ? theme.primary : theme.navInactive} />
          </View>
          <Text style={[styles.navText, { color: currentTab === 'search' ? theme.primary : theme.navInactive }]}>
            {t.searchNav}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => setCurrentTab('account')}>
          <View style={[styles.navIconContainer, currentTab === 'account' && { backgroundColor: isDark ? '#312e81' : '#e0e7ff' }]}>
            <FontAwesome5 name="user" size={20} color={currentTab === 'account' ? theme.primary : theme.navInactive} />
          </View>
          <Text style={[styles.navText, { color: currentTab === 'account' ? theme.primary : theme.navInactive }]}>
            {t.account}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Task Detail Modal */}
      <Modal
        visible={!!selectedTask}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedTask(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.cardBg }]}>
            {selectedTask && (
              <>
                <View style={styles.modalHeader}>
                  <View style={[styles.iconContainerBig, { backgroundColor: theme.bg }]}>
                    <FontAwesome5 name={getIconName(selectedTask.platform)} size={30} color={theme.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.modalTitle, { color: theme.text }]}>{selectedTask.title}</Text>
                    <Text style={{ color: theme.textSub }}>{selectedTask.platform}</Text>
                  </View>
                  <TouchableOpacity onPress={() => setSelectedTask(null)}>
                    <FontAwesome5 name="times" size={24} color={theme.textSub} />
                  </TouchableOpacity>
                </View>
                
                <ScrollView style={{ maxHeight: 300, marginVertical: 20 }}>
                  <Text style={{ color: theme.text, lineHeight: 22, fontSize: 15 }}>
                    {selectedTask.description || "No description provided."}
                  </Text>
                  <Text style={{ color: theme.textSub, marginTop: 15, fontSize: 12 }}>
                    {t.posted} {new Date(selectedTask.created_at).toLocaleDateString()}
                  </Text>
                </ScrollView>

                <TouchableOpacity 
                  style={[styles.primaryBtn, { backgroundColor: theme.primary }]}
                  onPress={() => openLink(selectedTask.link)}
                >
                  <Text style={styles.primaryBtnText}>{t.applyNow}</Text>
                  <FontAwesome5 name="external-link-alt" size={14} color="white" />
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Info Modal (Mission/Privacy/Terms) */}
      <Modal
        visible={!!infoModalType}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setInfoModalType(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.cardBg }]}>
            <Text style={[styles.modalTitle, { color: theme.text, marginBottom: 15 }]}>
              {infoModalType === 'mission' && t.mission}
              {infoModalType === 'privacy' && t.privacy}
              {infoModalType === 'terms' && t.terms}
            </Text>
            <Text style={{ color: theme.text, lineHeight: 24, fontSize: 15, marginBottom: 20 }}>
              {infoModalType === 'mission' && t.missionText}
              {infoModalType === 'privacy' && t.privacyText}
              {infoModalType === 'terms' && t.termsText}
            </Text>
            <TouchableOpacity 
              style={[styles.primaryBtn, { backgroundColor: theme.primary }]}
              onPress={() => setInfoModalType(null)}
            >
              <Text style={styles.primaryBtnText}>{t.close}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screenContainer: {
    flex: 1,
  },
  // Home Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
  },
  greeting: {
    fontSize: 14,
  },
  appName: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  profileBtn: {
    padding: 5,
  },
  // Hero Card
  heroCard: {
    margin: 20,
    marginTop: 0,
    backgroundColor: '#6366f1',
    borderRadius: 20,
    padding: 24,
    flexDirection: 'row',
    overflow: 'hidden',
    position: 'relative',
    elevation: 4,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  heroTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  heroSub: {
    color: '#e0e7ff',
    fontSize: 13,
    marginBottom: 16,
    lineHeight: 18,
    marginRight: 20,
  },
  heroBtn: {
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  heroBtnText: {
    color: '#6366f1',
    fontWeight: 'bold',
    fontSize: 14,
  },
  // Section
  sectionHeader: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  // Task Card
  taskCard: {
    flexDirection: 'column',
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    elevation: 1,
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  taskPlatform: {
    fontSize: 12,
  },
  arrowContainer: {
    marginLeft: 10,
  },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  taskReward: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  // Search
  searchHeader: {
    margin: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 50,
    borderRadius: 14,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
  },
  // Account
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  settingsCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  langBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  toggleTrack: {
    width: 48,
    height: 28,
    borderRadius: 14,
    padding: 2,
    justifyContent: 'center',
  },
  toggleThumb: {
    width: 24,
    height: 24,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  // Navbar
  navBar: {
    flexDirection: 'row',
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
    borderTopWidth: 1,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 10,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navIconContainer: {
    padding: 6,
    borderRadius: 12,
    marginBottom: 4,
  },
  navText: {
    fontSize: 10,
    fontWeight: '600',
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    borderRadius: 24,
    padding: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  iconContainerBig: {
    width: 50,
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
  },
  primaryBtnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
