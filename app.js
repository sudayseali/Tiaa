import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, Text, View, ScrollView, TouchableOpacity, 
  Image, TextInput, Modal, SafeAreaView, StatusBar, 
  Linking, ActivityIndicator, Alert, Dimensions,
  Platform,
  useWindowDimensions
} from 'react-native';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome5, MaterialIcons, Ionicons, Feather } from '@expo/vector-icons';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import 'react-native-url-polyfill';

// --- CONFIGURATION (Sida ku jirtay app.js) ---
const SB_URL = 'https://hqyayioenlteotepgujs.supabase.co';
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhxeWF5aW9lbmx0ZW90ZXBndWpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1Njg0OTQsImV4cCI6MjA4MjE0NDQ5NH0.QIt-9r-5aCYEkDfDy-auZxyAMfPv_UqIWJZs2drw5MU';

// Initialize Supabase
const supabase = createClient(SB_URL, SB_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// --- TRANSLATIONS (Sida ku jirtay language.js) ---
const translations = {
  so: {
    welcome: "Soo Dhawow!",
    greeting: "Subax wanaagsan,",
    search: "Raadi shaqooyin...",
    heroTitle: "Raadi Shaqooyin\nCusub Maanta",
    heroSub: "Hel shaqooyin internetka ah oo sugan, kana ilaalo kuwa khiyaanada ah.",
    startBtn: "Bilow Raadinta",
    home: "Hoyga",
    searchNav: "Raadi",
    account: "Koontada",
    popular: "Qeybaha Caanka ah",
    seeAll: "Eeg Dhammaan",
    recommended: "Lagula Taliyay",
    filter: "Kala Saar",
    allJobs: "Dhammaan Shaqooyinka",
    settings: "Settings",
    darkMode: "Dark Mode",
    language: "Luqadda",
    about: "About ShaqoHub",
    mission: "Ujeedada App-ka",
    privacy: "Privacy Policy",
    terms: "Terms & Conditions",
    contact: "Nala Soo Xiriir",
    version: "Version 1.0.0",
    madeIn: "Made in Xirfadsame",
    taskTime: "Waqtiga",
    taskLevel: "Heerka",
    apply: "Dalbo Shaqadan",
    details: "Faahfaahin",
    warning: "Taxaddar: Website-kan waa laga shakisan yahay.",
    understood: "Fahmay",
    online: "Online",
    website: "Website"
  },
  en: {
    welcome: "Welcome!",
    greeting: "Good morning,",
    search: "Search jobs...",
    heroTitle: "Find New\nJobs Today",
    heroSub: "Find secure online jobs and avoid scams.",
    startBtn: "Start Searching",
    home: "Home",
    searchNav: "Search",
    account: "Account",
    popular: "Popular Categories",
    seeAll: "See All",
    recommended: "Recommended",
    filter: "Filter",
    allJobs: "All Jobs",
    settings: "Settings",
    darkMode: "Dark Mode",
    language: "Language",
    about: "About ShaqoHub",
    mission: "Mission",
    privacy: "Privacy Policy",
    terms: "Terms & Conditions",
    contact: "Contact Us",
    version: "Version 1.0.0",
    madeIn: "Made in Xirfadsame",
    taskTime: "Time",
    taskLevel: "Level",
    apply: "Apply Now",
    details: "Details",
    warning: "Warning: This website is suspicious.",
    understood: "Understood",
    online: "Online",
    website: "Website"
  }
};

const INFO_CONTENT = {
  mission: `ShaqoHub waxa uu caawiyaa dhalinyarada Soomaaliyeed si ay u helaan fursado shaqo online ah. Waxaan isku xirnaa dadka iyo bogagga shaqo ee la hubo, waxaanan ka digaynaa khiyaanada & scam-ka.`,
  privacy: `Waxaan ururinaa xog aad u yar (cookies / usage data) si app-ku u shaqeeyo. KUMA ururinno xog gaar ah oo kuu muuqata sida email ama telefoon. Xogta waxaa loo isticmaalaa kaliya kor u qaadida adeegga.`,
  terms: `Adeegga waxaad u isticmaashaa kaliya si sharci ah. Macluumaadka ku jira app-kan waa talo guud — had iyo jeer hubi bogga rasmiga ah ka hor intaadan go'aan gaarin. Haddii aad jebiso shuruudaha, waxaan xaq u leenahay inaan xaddidno isticmaalka.`
};

// Create a separate component that uses useSafeAreaInsets
function MainApp() {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  
  // State
  const [activeTab, setActiveTab] = useState('home');
  const [lang, setLang] = useState('so');
  const [isDark, setIsDark] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modals State
  const [selectedTask, setSelectedTask] = useState(null);
  const [infoModal, setInfoModal] = useState({ visible: false, type: '', title: '' });

  const t = translations[lang];
  const theme = isDark ? styles.dark : styles.light;
  const colors = isDark ? darkColors : lightColors;

  // Responsive calculations
  const isSmallScreen = width < 375;
  const isMediumScreen = width >= 375 && width < 414;
  const isLargeScreen = width >= 414;
  
  const isTablet = width >= 768;
  const isLandscape = width > height;
  
  // Responsive font sizes
  const fontSize = {
    xs: isSmallScreen ? 10 : isMediumScreen ? 11 : 12,
    sm: isSmallScreen ? 12 : isMediumScreen ? 13 : 14,
    base: isSmallScreen ? 14 : isMediumScreen ? 15 : 16,
    lg: isSmallScreen ? 16 : isMediumScreen ? 18 : 20,
    xl: isSmallScreen ? 20 : isMediumScreen ? 22 : 24,
    xxl: isSmallScreen ? 24 : isMediumScreen ? 26 : 28,
  };

  // Responsive spacing
  const spacing = {
    xs: isSmallScreen ? 4 : isMediumScreen ? 6 : 8,
    sm: isSmallScreen ? 8 : isMediumScreen ? 10 : 12,
    base: isSmallScreen ? 12 : isMediumScreen ? 14 : 16,
    md: isSmallScreen ? 16 : isMediumScreen ? 18 : 20,
    lg: isSmallScreen ? 20 : isMediumScreen ? 24 : 28,
    xl: isSmallScreen ? 24 : isMediumScreen ? 28 : 32,
  };

  // Load Data
  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const { data: catData, error: catErr } = await supabase.from('categories').select('*');
      if (catData) setCategories(catData);
      
      const { data: taskData, error: taskErr } = await supabase.from('tasks').select('*');
      if (taskData) setTasks(taskData);
    } catch (err) {
      console.error("Cilad xogta ah:", err.message);
    } finally {
      setLoading(false);
    }
  }

  // --- COMPONENTS ---

  const TaskCard = ({ task }) => {
    const cardWidth = isTablet ? (isLandscape ? width * 0.3 : width * 0.4) : width * 0.85;
    
    return (
      <TouchableOpacity 
        activeOpacity={0.9}
        style={[
          styles.taskCard, 
          { 
            backgroundColor: colors.card,
            width: isTablet ? '48%' : '100%',
            marginHorizontal: isTablet ? '1%' : 0,
            marginBottom: isTablet ? spacing.base : spacing.sm
          }
        ]} 
        onPress={() => setSelectedTask(task)}
      >
        <View style={[
          styles.taskImageContainer,
          { height: isSmallScreen ? 150 : isMediumScreen ? 160 : 180 }
        ]}>
          <Image source={{ uri: task.image }} style={styles.taskImage} resizeMode="cover" />
        </View>
        <View style={[styles.taskContent, { padding: spacing.sm }]}>
          <Text style={[
            styles.taskTitle, 
            { 
              color: colors.text,
              fontSize: fontSize.base,
              lineHeight: fontSize.base * 1.3
            }
          ]}>
            {task.title}
          </Text>
          <Text style={[
            styles.taskEarnings,
            { fontSize: fontSize.sm }
          ]}>
            {task.earnings}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const CategoryItem = ({ cat }) => (
    <View style={[
      styles.categoryItem, 
      { 
        width: isTablet ? 100 : 70,
        marginRight: isTablet ? spacing.md : spacing.base
      }
    ]}>
      <View style={[
        styles.categoryIconBox, 
        { 
          backgroundColor: cat.color || '#e0e7ff',
          width: isTablet ? 80 : 64,
          height: isTablet ? 80 : 64,
          borderRadius: isTablet ? 24 : 20
        }
      ]}>
        <FontAwesome5 
          name={cat.icon ? cat.icon.replace('fa-', '') : 'briefcase'} 
          size={isTablet ? 28 : 24} 
          color="#6366f1" 
        />
      </View>
      <Text style={[
        styles.categoryText, 
        { 
          color: colors.subText,
          fontSize: fontSize.xs,
          marginTop: spacing.xs
        }
      ]}>
        {cat.name}
      </Text>
    </View>
  );

  // --- SECTIONS ---

  const HomeSection = () => {
    const tasksPerRow = isTablet ? (isLandscape ? 4 : 3) : 1;
    
    return (
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={{ 
          paddingBottom: isTablet ? 120 : 100,
          paddingHorizontal: isTablet ? spacing.md : spacing.base
        }}
      >
        {/* Hero */}
        <View
          style={[
            styles.heroCard,
            {
              backgroundColor: '#6366f1',
              borderRadius: isTablet ? 32 : 24,
              padding: isTablet ? spacing.xl : spacing.lg,
              marginTop: isTablet ? spacing.xl : spacing.md,
              marginBottom: isTablet ? spacing.xl : spacing.lg,
              position: 'relative',
              overflow: 'hidden'
            }
          ]}
        >
          <Text style={[
            styles.heroTitle,
            {
              fontSize: isTablet ? fontSize.xxl * 1.2 : fontSize.xxl,
              lineHeight: isTablet ? fontSize.xxl * 1.4 : fontSize.xxl * 1.2,
              marginBottom: spacing.sm,
              color: '#fff'
            }
          ]}>
            {t.heroTitle}
          </Text>
          <Text style={[
            styles.heroSub,
            {
              fontSize: isTablet ? fontSize.sm : fontSize.xs,
              maxWidth: isTablet ? '80%' : '70%',
              marginBottom: spacing.md,
              color: '#e0e7ff'
            }
          ]}>
            {t.heroSub}
          </Text>
          <TouchableOpacity 
            style={[
              styles.heroBtn,
              {
                backgroundColor: '#fff',
                paddingHorizontal: isTablet ? spacing.xl : spacing.lg,
                paddingVertical: isTablet ? spacing.md : spacing.sm,
                borderRadius: isTablet ? 16 : 12,
                flexDirection: 'row',
                alignSelf: 'flex-start',
                alignItems: 'center'
              }
            ]} 
            onPress={() => setActiveTab('tasks')}
          >
            <FontAwesome5 name="compass" size={isTablet ? 16 : 14} color="#6366f1" style={{ marginRight: spacing.sm }} />
            <Text style={[
              styles.heroBtnText,
              { 
                fontSize: isTablet ? fontSize.base : fontSize.sm,
                color: '#6366f1',
                fontWeight: 'bold'
              }
            ]}>
              {t.startBtn}
            </Text>
          </TouchableOpacity>
          
          {/* Background blobs imitation */}
          <View style={[
            styles.heroBlob,
            {
              right: isTablet ? -60 : -40,
              bottom: isTablet ? -60 : -40,
              width: isTablet ? 200 : 160,
              height: isTablet ? 200 : 160,
              borderRadius: isTablet ? 100 : 80,
              backgroundColor: '#ffffff',
              opacity: 0.1,
              position: 'absolute'
            }
          ]} />
        </View>

        {/* Categories */}
        <View style={[
          styles.sectionHeader,
          { marginBottom: spacing.sm }
        ]}>
          <Text style={[
            styles.sectionTitle, 
            { 
              color: colors.text,
              fontSize: isTablet ? fontSize.lg * 1.2 : fontSize.lg,
              fontWeight: 'bold'
            }
          ]}>
            {t.popular}
          </Text>
          <TouchableOpacity>
            <Text style={[
              styles.linkText,
              { 
                fontSize: fontSize.xs,
                color: '#6366f1',
                fontWeight: '600'
              }
            ]}>
              {t.seeAll}
            </Text>
          </TouchableOpacity>
        </View>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={[
            styles.catScroll,
            { marginBottom: isTablet ? spacing.xl : spacing.lg }
          ]}
        >
          {categories.map((cat, index) => <CategoryItem key={index} cat={cat} />)}
        </ScrollView>

        {/* Recommended Tasks */}
        <View style={[
          styles.sectionHeader,
          { marginBottom: spacing.sm }
        ]}>
          <Text style={[
            styles.sectionTitle, 
            { 
              color: colors.text,
              fontSize: isTablet ? fontSize.lg * 1.2 : fontSize.lg,
              fontWeight: 'bold'
            }
          ]}>
            {t.recommended}
          </Text>
          <TouchableOpacity>
            <Text style={[
              styles.linkText,
              { 
                fontSize: fontSize.xs,
                color: '#6366f1',
                fontWeight: '600'
              }
            ]}>
              {t.filter}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={[
          styles.taskList,
          isTablet && {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between'
          }
        ]}>
          {loading ? (
            <ActivityIndicator 
              size={isTablet ? 'large' : 'small'} 
              color="#6366f1" 
              style={{ marginTop: spacing.xl }}
            />
          ) : (
            tasks.map((task, i) => <TaskCard key={i} task={task} />)
          )}
        </View>
      </ScrollView>
    );
  };

  const TasksSection = () => (
    <ScrollView 
      showsVerticalScrollIndicator={false} 
      contentContainerStyle={{ 
        paddingBottom: isTablet ? 120 : 100,
        paddingHorizontal: isTablet ? spacing.md : spacing.base
      }}
    >
      <Text style={[
        styles.pageTitle, 
        { 
          color: colors.text,
          fontSize: isTablet ? fontSize.xxl : fontSize.xl,
          marginTop: isTablet ? spacing.xl : spacing.lg,
          marginBottom: spacing.lg,
          fontWeight: 'bold'
        }
      ]}>
        {t.allJobs}
      </Text>
      <View style={[
        styles.taskList,
        isTablet && {
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-between'
        }
      ]}>
        {tasks.map((task, i) => <TaskCard key={i} task={task} />)}
      </View>
    </ScrollView>
  );

  const ProfileSection = () => (
    <ScrollView 
      showsVerticalScrollIndicator={false} 
      contentContainerStyle={{ 
        paddingBottom: isTablet ? 120 : 100,
        paddingHorizontal: isTablet ? spacing.md : spacing.base
      }}
    >
      {/* Profile Card */}
      <View style={[
        styles.profileCard, 
        { 
          backgroundColor: colors.card,
          borderRadius: isTablet ? 32 : 24,
          padding: isTablet ? spacing.xl : spacing.lg,
          marginBottom: isTablet ? spacing.xl : spacing.lg,
          marginTop: isTablet ? spacing.xl : spacing.lg,
          alignItems: 'center'
        }
      ]}>
        <View style={[
          styles.avatar,
          {
            width: isTablet ? 120 : 80,
            height: isTablet ? 120 : 80,
            borderRadius: isTablet ? 60 : 40,
            borderWidth: isTablet ? 6 : 4,
            marginBottom: spacing.md,
            backgroundColor: '#e0e7ff',
            alignItems: 'center',
            justifyContent: 'center',
            borderColor: '#fff'
          }
        ]}>
          <Text style={[
            styles.avatarText,
            { 
              fontSize: isTablet ? fontSize.xxl : fontSize.xl,
              fontWeight: 'bold',
              color: '#6366f1'
            }
          ]}>
            US
          </Text>
        </View>
        <Text style={[
          styles.profileName, 
          { 
            color: colors.text,
            fontSize: isTablet ? fontSize.xxl : fontSize.lg,
            fontWeight: 'bold'
          }
        ]}>
          User Name
        </Text>
      </View>

      {/* Settings */}
      <Text style={[
        styles.groupTitle, 
        { 
          color: colors.subText,
          fontSize: fontSize.sm,
          marginLeft: spacing.sm,
          marginBottom: spacing.xs,
          fontWeight: 'bold',
          textTransform: 'uppercase'
        }
      ]}>
        {t.settings}
      </Text>
      <View style={[
        styles.settingsGroup, 
        { 
          backgroundColor: colors.card,
          borderRadius: isTablet ? 24 : 16,
          marginBottom: isTablet ? spacing.xl : spacing.lg,
          overflow: 'hidden'
        }
      ]}>
        {/* Dark Mode */}
        <View style={[
          styles.settingItem, 
          { 
            borderBottomColor: colors.border,
            paddingVertical: isTablet ? spacing.md : spacing.base,
            paddingHorizontal: isTablet ? spacing.lg : spacing.base,
            borderBottomWidth: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between'
          }
        ]}>
          <View style={[styles.settingLeft, { flexDirection: 'row', alignItems: 'center', gap: 12 }]}>
            <View style={[
              styles.iconBox, 
              { 
                backgroundColor: isDark ? '#374151' : '#f3f4f6',
                width: isTablet ? 40 : 32,
                height: isTablet ? 40 : 32,
                borderRadius: isTablet ? 20 : 16,
                alignItems: 'center',
                justifyContent: 'center'
              }
            ]}>
              <FontAwesome5 name="moon" size={isTablet ? 16 : 14} color={isDark ? '#fff' : '#4b5563'} />
            </View>
            <Text style={[
              styles.settingText, 
              { 
                color: colors.text,
                fontSize: isTablet ? fontSize.base : fontSize.sm,
                fontWeight: '500'
              }
            ]}>
              {t.darkMode}
            </Text>
          </View>
          <TouchableOpacity onPress={() => setIsDark(!isDark)}>
             <FontAwesome5 
               name={isDark ? "toggle-on" : "toggle-off"} 
               size={isTablet ? 32 : 28} 
               color={isDark ? "#6366f1" : "#d1d5db"} 
             />
          </TouchableOpacity>
        </View>

        {/* Language */}
        <View style={[
          styles.settingItem,
          { 
            paddingVertical: isTablet ? spacing.md : spacing.base,
            paddingHorizontal: isTablet ? spacing.lg : spacing.base,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between'
          }
        ]}>
          <View style={[styles.settingLeft, { flexDirection: 'row', alignItems: 'center', gap: 12 }]}>
            <View style={[
              styles.iconBox, 
              { 
                backgroundColor: isDark ? '#374151' : '#eff6ff',
                width: isTablet ? 40 : 32,
                height: isTablet ? 40 : 32,
                borderRadius: isTablet ? 20 : 16,
                alignItems: 'center',
                justifyContent: 'center'
              }
            ]}>
              <FontAwesome5 name="globe" size={isTablet ? 16 : 14} color="#3b82f6" />
            </View>
            <Text style={[
              styles.settingText, 
              { 
                color: colors.text,
                fontSize: isTablet ? fontSize.base : fontSize.sm,
                fontWeight: '500'
              }
            ]}>
              {t.language}
            </Text>
          </View>
          <View style={[
            styles.langSwitch, 
            { 
              backgroundColor: isDark ? '#1f2937' : '#f3f4f6',
              padding: isTablet ? 6 : 4,
              borderRadius: isTablet ? 12 : 8,
              flexDirection: 'row'
            }
          ]}>
            <TouchableOpacity 
              onPress={() => setLang('so')} 
              style={[
                styles.langBtn, 
                lang === 'so' && styles.langBtnActive,
                {
                  paddingHorizontal: isTablet ? spacing.md : spacing.sm,
                  paddingVertical: isTablet ? spacing.sm : spacing.xs,
                  borderRadius: isTablet ? 8 : 6
                }
              ]}
            >
              <Text style={[
                styles.langText, 
                lang === 'so' && styles.langTextActive,
                { 
                  fontSize: isTablet ? fontSize.sm : fontSize.xs,
                  fontWeight: '500',
                  color: lang === 'so' ? '#6366f1' : '#6b7280'
                }
              ]}>
                So
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => setLang('en')} 
              style={[
                styles.langBtn, 
                lang === 'en' && styles.langBtnActive,
                {
                  paddingHorizontal: isTablet ? spacing.md : spacing.sm,
                  paddingVertical: isTablet ? spacing.sm : spacing.xs,
                  borderRadius: isTablet ? 8 : 6
                }
              ]}
            >
              <Text style={[
                styles.langText, 
                lang === 'en' && styles.langTextActive,
                { 
                  fontSize: isTablet ? fontSize.sm : fontSize.xs,
                  fontWeight: '500',
                  color: lang === 'en' ? '#6366f1' : '#6b7280'
                }
              ]}>
                En
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* About */}
      <Text style={[
        styles.groupTitle, 
        { 
          color: colors.subText,
          fontSize: fontSize.sm,
          marginLeft: spacing.sm,
          marginBottom: spacing.xs,
          fontWeight: 'bold',
          textTransform: 'uppercase'
        }
      ]}>
        {t.about}
      </Text>
      <View style={[
        styles.settingsGroup, 
        { 
          backgroundColor: colors.card,
          borderRadius: isTablet ? 24 : 16,
          marginBottom: isTablet ? spacing.xl : spacing.lg,
          overflow: 'hidden'
        }
      ]}>
        {[
          { icon: 'bullseye', color: 'purple', label: t.mission, key: 'mission' },
          { icon: 'shield-alt', color: 'green', label: t.privacy, key: 'privacy' },
          { icon: 'file-contract', color: 'orange', label: t.terms, key: 'terms' }
        ].map((item, i) => (
          <TouchableOpacity 
            key={i} 
            style={[
              styles.settingItem, 
              { 
                borderBottomColor: colors.border,
                paddingVertical: isTablet ? spacing.md : spacing.base,
                paddingHorizontal: isTablet ? spacing.lg : spacing.base,
                borderBottomWidth: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between'
              }
            ]}
            onPress={() => setInfoModal({ visible: true, type: item.key, title: item.label })}
          >
            <View style={[styles.settingLeft, { flexDirection: 'row', alignItems: 'center', gap: 12 }]}>
              <View style={[
                styles.iconBox, 
                { 
                  backgroundColor: isDark ? '#374151' : `${item.color}10`,
                  width: isTablet ? 40 : 32,
                  height: isTablet ? 40 : 32,
                  borderRadius: isTablet ? 20 : 16,
                  alignItems: 'center',
                  justifyContent: 'center'
                }
              ]}>
                <FontAwesome5 name={item.icon} size={isTablet ? 16 : 14} color={item.color} />
              </View>
              <Text style={[
                styles.settingText, 
                { 
                  color: colors.text,
                  fontSize: isTablet ? fontSize.base : fontSize.sm,
                  fontWeight: '500'
                }
              ]}>
                {item.label}
              </Text>
            </View>
            <Feather name="chevron-right" size={isTablet ? 20 : 16} color="#d1d5db" />
          </TouchableOpacity>
        ))}

        <TouchableOpacity 
          style={[
            styles.settingItem,
            { 
              paddingVertical: isTablet ? spacing.md : spacing.base,
              paddingHorizontal: isTablet ? spacing.lg : spacing.base,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between'
            }
          ]}
          onPress={() => Linking.openURL('https://wa.me/252637864155')}
        >
          <View style={[styles.settingLeft, { flexDirection: 'row', alignItems: 'center', gap: 12 }]}>
             <View style={[
               styles.iconBox, 
               { 
                 backgroundColor: '#dcfce7',
                 width: isTablet ? 40 : 32,
                 height: isTablet ? 40 : 32,
                 borderRadius: isTablet ? 20 : 16,
                 alignItems: 'center',
                 justifyContent: 'center'
               }
             ]}>
                <FontAwesome5 name="whatsapp" size={isTablet ? 20 : 18} color="#16a34a" />
              </View>
            <View>
              <Text style={[
                styles.settingText, 
                { 
                  color: colors.text,
                  fontSize: isTablet ? fontSize.base : fontSize.sm,
                  fontWeight: '500'
                }
              ]}>
                {t.contact}
              </Text>
            </View>
          </View>
          <Text style={{ 
            fontSize: isTablet ? fontSize.xs : 10, 
            color: '#9ca3af' 
          }}>
            252 63 7864155
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ 
        alignItems: 'center', 
        marginTop: isTablet ? spacing.xl : spacing.lg 
      }}>
        <Text style={{ 
          fontSize: isTablet ? fontSize.sm : fontSize.xs, 
          color: '#9ca3af' 
        }}>
          {t.version}
        </Text>
        <Text style={{ 
          fontSize: isTablet ? fontSize.xs : 10, 
          color: '#d1d5db', 
          marginTop: spacing.xs 
        }}>
          {t.madeIn}
        </Text>
      </View>
    </ScrollView>
  );

  const TabItem = ({ icon, label, active, onPress }) => (
    <TouchableOpacity 
      onPress={onPress} 
      style={[
        styles.tabItem,
        { 
          width: isTablet ? 80 : 60,
          alignItems: 'center'
        }
      ]}
    >
      <View style={[
        styles.tabIconBox, 
        active && { backgroundColor: isDark ? '#312e81' : '#fff' },
        {
          width: isTablet ? 56 : 48,
          height: isTablet ? 40 : 32,
          borderRadius: isTablet ? 20 : 16,
          marginBottom: isTablet ? 6 : 4,
          alignItems: 'center',
          justifyContent: 'center'
        }
      ]}>
        <FontAwesome5 
          name={icon} 
          size={isTablet ? 22 : 18} 
          color={active ? (isDark ? '#c7d2fe' : '#6366f1') : '#9ca3af'} 
        />
      </View>
      <Text style={[
        styles.tabLabel, 
        { 
          color: active ? (isDark ? '#a5b4fc' : '#6366f1') : '#9ca3af',
          fontSize: isTablet ? fontSize.xs : 10,
          fontWeight: '500'
        }
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[
      styles.container, 
      { 
        backgroundColor: colors.background, 
        paddingTop: insets.top,
        paddingBottom: Platform.OS === 'ios' ? insets.bottom : 0,
        flex: 1
      }
    ]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View style={[
        styles.header, 
        { 
          backgroundColor: colors.headerBg, 
          borderColor: colors.border,
          paddingHorizontal: isTablet ? spacing.xl : spacing.lg,
          paddingTop: isTablet ? spacing.md : spacing.sm,
          paddingBottom: isTablet ? spacing.lg : spacing.md,
          borderBottomWidth: 1
        }
      ]}>
        <View style={[styles.headerTop, { 
          flexDirection: 'row', 
          justifyContent: 'space-between', 
          marginBottom: isTablet ? spacing.lg : spacing.base 
        }]}>
          <View style={[styles.userSection, { flexDirection: 'row', alignItems: 'center' }]}>
            <Image 
              source={{ uri: "https://ui-avatars.com/api/?name=User&background=6366f1&color=fff" }} 
              style={[
                styles.headerAvatar,
                {
                  width: isTablet ? 56 : 48,
                  height: isTablet ? 56 : 48,
                  borderRadius: isTablet ? 28 : 24,
                  marginRight: isTablet ? spacing.base : spacing.sm,
                  borderWidth: 2,
                  borderColor: '#fff'
                }
              ]} 
            />
            <View>
              <Text style={[
                styles.greeting, 
                { 
                  color: colors.subText,
                  fontSize: isTablet ? fontSize.sm : fontSize.xs,
                  fontWeight: '500'
                }
              ]}>
                {t.greeting}
              </Text>
              <Text style={[
                styles.welcome, 
                { 
                  color: colors.text,
                  fontSize: isTablet ? fontSize.xl : fontSize.lg,
                  fontWeight: 'bold'
                }
              ]}>
                {t.welcome}
              </Text>
            </View>
          </View>
          <View style={[
            styles.notifBtn, 
            { 
              borderColor: colors.border, 
              backgroundColor: isDark ? colors.card : '#fff',
              width: isTablet ? 48 : 40,
              height: isTablet ? 48 : 40,
              borderRadius: isTablet ? 24 : 20,
              borderWidth: 1,
              alignItems: 'center', 
              justifyContent: 'center'
            }
          ]}>
            <FontAwesome5 name="bell" size={isTablet ? 18 : 16} color={colors.subText} />
            <View style={[
              styles.badge,
              {
                position: 'absolute',
                top: isTablet ? 10 : 8,
                right: isTablet ? 10 : 8,
                width: isTablet ? 10 : 8,
                height: isTablet ? 10 : 8,
                borderRadius: isTablet ? 5 : 4,
                backgroundColor: '#ef4444'
              }
            ]} />
          </View>
        </View>

        <View style={[styles.searchRow, { 
          flexDirection: 'row',
          gap: isTablet ? spacing.base : spacing.sm 
        }]}>
          <View style={[styles.searchContainer, { 
            flex: 1, 
            position: 'relative', 
            justifyContent: 'center' 
          }]}>
            <FontAwesome5 
              name="search" 
              size={isTablet ? 16 : 14} 
              color="#9ca3af" 
              style={[
                styles.searchIcon,
                { 
                  position: 'absolute',
                  left: isTablet ? spacing.base : spacing.sm,
                  zIndex: 1
                }
              ]} 
            />
            <TextInput 
              placeholder={t.search} 
              placeholderTextColor="#9ca3af"
              style={[
                styles.searchInput, 
                { 
                  backgroundColor: isDark ? '#374151' : '#f3f4f6', 
                  color: colors.text,
                  borderRadius: isTablet ? 20 : 16,
                  paddingVertical: isTablet ? spacing.base : spacing.sm,
                  paddingLeft: isTablet ? spacing.xl : spacing.lg,
                  paddingRight: isTablet ? spacing.base : spacing.sm,
                  fontSize: isTablet ? fontSize.base : fontSize.sm
                }
              ]} 
            />
          </View>
          <View style={[
            styles.filterBtn, 
            { 
              borderColor: colors.border, 
              backgroundColor: isDark ? colors.card : '#fff',
              width: isTablet ? 56 : 48,
              height: isTablet ? 56 : 48,
              borderRadius: isTablet ? 20 : 16,
              borderWidth: 1,
              alignItems: 'center', 
              justifyContent: 'center'
            }
          ]}>
            <FontAwesome5 name="sliders-h" size={isTablet ? 18 : 16} color={colors.subText} />
          </View>
        </View>
      </View>

      {/* Main Content */}
      <View style={[
        styles.mainContent,
        { 
          flex: 1
        }
      ]}>
        {activeTab === 'home' && <HomeSection />}
        {activeTab === 'tasks' && <TasksSection />}
        {activeTab === 'profile' && <ProfileSection />}
      </View>

      {/* Task Detail Modal */}
      <Modal visible={!!selectedTask} animationType="slide" transparent={true} onRequestClose={() => setSelectedTask(null)}>
        <View style={[styles.modalOverlay, { 
          flex: 1, 
          backgroundColor: 'rgba(0,0,0,0.5)', 
          justifyContent: 'flex-end' 
        }]}>
          <View style={[
            styles.modalContent, 
            { 
              backgroundColor: colors.card,
              height: isTablet ? '90%' : '85%',
              maxWidth: isTablet ? 600 : '100%',
              marginHorizontal: isTablet ? 'auto' : 0,
              width: isTablet ? '80%' : '100%',
              borderTopLeftRadius: 24, 
              borderTopRightRadius: 24, 
              overflow: 'hidden'
            }
          ]}>
            <View style={[
              styles.modalImageContainer,
              { 
                height: isTablet ? 250 : 200,
                position: 'relative'
              }
            ]}>
              <Image source={{ uri: selectedTask?.image }} style={[styles.modalImage, { width: '100%', height: '100%' }]} />
              <TouchableOpacity 
                onPress={() => setSelectedTask(null)} 
                style={[
                  styles.closeModalBtn,
                  {
                    width: isTablet ? 48 : 40,
                    height: isTablet ? 48 : 40,
                    borderRadius: isTablet ? 24 : 20,
                    top: isTablet ? spacing.base : spacing.sm,
                    left: isTablet ? spacing.base : spacing.sm,
                    position: 'absolute',
                    backgroundColor: '#fff',
                    alignItems: 'center',
                    justifyContent: 'center',
                    shadowColor: '#000',
                    shadowOpacity: 0.2,
                    elevation: 4
                  }
                ]}
              >
                <FontAwesome5 name="arrow-left" size={isTablet ? 18 : 16} color="#1f2937" />
              </TouchableOpacity>
            </View>
            <ScrollView style={[
              styles.modalBody,
              { 
                flex: 1,
                padding: isTablet ? spacing.xl : spacing.lg
              }
            ]}>
              <View style={[styles.modalHeaderRow, { 
                flexDirection: 'row', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start',
                marginBottom: 8
              }]}>
                <Text style={[
                  styles.modalTitle, 
                  { 
                    color: colors.text,
                    fontSize: isTablet ? fontSize.xxl : fontSize.xl,
                    fontWeight: 'bold',
                    flex: 1,
                    marginRight: 10
                  }
                ]}>
                  {selectedTask?.title}
                </Text>
                <Text style={[
                  styles.modalPrice,
                  { 
                    fontSize: isTablet ? fontSize.xl : fontSize.lg,
                    fontWeight: 'bold',
                    color: '#6366f1'
                  }
                ]}>
                  {selectedTask?.earnings}
                </Text>
              </View>
              <View style={[
                styles.modalMetaRow,
                { 
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: isTablet ? spacing.xl : spacing.lg
                }
              ]}>
                <FontAwesome5 name="map-marker-alt" size={isTablet ? 14 : 12} color="#6b7280" />
                <Text style={[
                  styles.metaText,
                  { 
                    fontSize: isTablet ? fontSize.sm : fontSize.xs,
                    color: '#6b7280',
                    marginLeft: 4
                  }
                ]}>
                  {selectedTask?.website || t.online}
                </Text>
                <Text style={[
                  styles.metaDot,
                  { 
                    marginHorizontal: isTablet ? spacing.sm : spacing.xs,
                    color: '#6b7280'
                  }
                ]}>
                  •
                </Text>
                <FontAwesome5 name="star" size={isTablet ? 14 : 12} color="#facc15" />
                <Text style={[
                  styles.metaText,
                  { 
                    fontSize: isTablet ? fontSize.sm : fontSize.xs,
                    color: '#6b7280',
                    marginLeft: 4
                  }
                ]}>
                  4.8
                </Text>
              </View>
              
              <Text style={[
                styles.sectionHeaderSmall, 
                { 
                  color: colors.text,
                  fontSize: isTablet ? fontSize.lg : fontSize.base,
                  marginBottom: spacing.sm,
                  fontWeight: 'bold'
                }
              ]}>
                {t.details}
              </Text>
              <Text style={[
                styles.modalDesc, 
                { 
                  color: colors.subText,
                  fontSize: isTablet ? fontSize.base : fontSize.sm,
                  lineHeight: isTablet ? fontSize.base * 1.5 : fontSize.sm * 1.4,
                  marginBottom: isTablet ? spacing.xl : spacing.lg
                }
              ]}>
                {selectedTask?.description}
              </Text>

              {/* Stats Grid */}
              <View style={[
                styles.statsGrid,
                { 
                  flexDirection: 'row',
                  gap: isTablet ? spacing.lg : spacing.base
                }
              ]}>
                <View style={[
                  styles.statBox, 
                  { 
                    backgroundColor: isDark ? '#374151' : '#f9fafb',
                    padding: isTablet ? spacing.base : spacing.sm,
                    borderRadius: isTablet ? 16 : 12,
                    flex: 1
                  }
                ]}>
                  <Text style={[
                    styles.statLabel,
                    { 
                      fontSize: isTablet ? fontSize.sm : fontSize.xs,
                      color: '#9ca3af',
                      marginBottom: 4
                    }
                  ]}>
                    {t.taskTime}
                  </Text>
                  <Text style={[
                    styles.statValue, 
                    { 
                      color: colors.text,
                      fontSize: isTablet ? fontSize.lg : fontSize.base,
                      fontWeight: '600'
                    }
                  ]}>
                    1h
                  </Text>
                </View>
                <View style={[
                  styles.statBox, 
                  { 
                    backgroundColor: isDark ? '#374151' : '#f9fafb',
                    padding: isTablet ? spacing.base : spacing.sm,
                    borderRadius: isTablet ? 16 : 12,
                    flex: 1
                  }
                ]}>
                  <Text style={[
                    styles.statLabel,
                    { 
                      fontSize: isTablet ? fontSize.sm : fontSize.xs,
                      color: '#9ca3af',
                      marginBottom: 4
                    }
                  ]}>
                    {t.taskLevel}
                  </Text>
                  <Text style={[
                    styles.statValue, 
                    { 
                      color: colors.text,
                      fontSize: isTablet ? fontSize.lg : fontSize.base,
                      fontWeight: '600'
                    }
                  ]}>
                    Easy
                  </Text>
                </View>
              </View>
            </ScrollView>
            <View style={[
              styles.modalFooter, 
              { 
                borderTopColor: colors.border, 
                backgroundColor: colors.card,
                padding: isTablet ? spacing.xl : spacing.lg,
                paddingTop: 16,
                borderTopWidth: 1
              }
            ]}>
              <TouchableOpacity 
                style={[
                  styles.applyBtn,
                  {
                    backgroundColor: '#6366f1',
                    paddingVertical: isTablet ? spacing.lg : spacing.base,
                    borderRadius: isTablet ? 16 : 12,
                    alignItems: 'center'
                  }
                ]}
                onPress={() => Linking.openURL(selectedTask?.url || '#')}
              >
                <Text style={[
                  styles.applyBtnText,
                  { 
                    fontSize: isTablet ? fontSize.lg : fontSize.base,
                    color: '#fff',
                    fontWeight: 'bold'
                  }
                ]}>
                  {t.apply}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Info Modal */}
      <Modal visible={infoModal.visible} transparent={true} animationType="fade">
        <View style={[styles.infoModalOverlay, { 
          flex: 1, 
          backgroundColor: 'rgba(0,0,0,0.5)', 
          alignItems: 'center', 
          justifyContent: 'center', 
          padding: 20 
        }]}>
          <View style={[
            styles.infoModalCard, 
            { 
              backgroundColor: colors.card,
              maxWidth: isTablet ? 500 : 320,
              padding: isTablet ? spacing.xl : spacing.lg,
              borderRadius: 24,
              alignItems: 'center',
              width: '100%'
            }
          ]}>
            <View style={[
              styles.infoIconCircle,
              {
                width: isTablet ? 72 : 56,
                height: isTablet ? 72 : 56,
                borderRadius: isTablet ? 36 : 28,
                marginBottom: isTablet ? spacing.lg : spacing.base,
                backgroundColor: '#e0e7ff',
                alignItems: 'center',
                justifyContent: 'center'
              }
            ]}>
              <FontAwesome5 name="info" size={isTablet ? 24 : 20} color="#6366f1" />
            </View>
            <Text style={[
              styles.infoTitle, 
              { 
                color: colors.text,
                fontSize: isTablet ? fontSize.xl : fontSize.lg,
                marginBottom: spacing.sm,
                fontWeight: 'bold'
              }
            ]}>
              {infoModal.title}
            </Text>
            <Text style={[
              styles.infoBody, 
              { 
                color: colors.subText,
                fontSize: isTablet ? fontSize.base : fontSize.sm,
                lineHeight: isTablet ? fontSize.base * 1.5 : fontSize.sm * 1.4,
                marginBottom: isTablet ? spacing.xl : spacing.lg,
                textAlign: 'center'
              }
            ]}>
              {INFO_CONTENT[infoModal.type]}
            </Text>
            <TouchableOpacity 
              style={[
                styles.infoBtn, 
                { 
                  backgroundColor: isDark ? '#374151' : '#f3f4f6',
                  paddingVertical: isTablet ? spacing.base : spacing.sm,
                  borderRadius: isTablet ? 16 : 12,
                  width: '100%',
                  alignItems: 'center'
                }
              ]}
              onPress={() => setInfoModal({ ...infoModal, visible: false })}
            >
              <Text style={[
                styles.infoBtnText, 
                { 
                  color: colors.text,
                  fontSize: isTablet ? fontSize.base : fontSize.sm,
                  fontWeight: 'bold'
                }
              ]}>
                {t.understood}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Bottom Tab Bar */}
      <View style={[
        styles.tabBar, 
        { 
          backgroundColor: colors.card, 
          borderTopColor: colors.border, 
          paddingBottom: (Platform.OS === 'ios' ? insets.bottom : 10) + (isTablet ? 20 : 10),
          paddingTop: isTablet ? spacing.base : spacing.sm,
          paddingHorizontal: isTablet ? spacing.xl : spacing.lg,
          height: isTablet ? 90 : 70,
          flexDirection: 'row', 
          justifyContent: 'space-between', 
          borderTopWidth: 1, 
          position: 'absolute', 
          bottom: 0, 
          left: 0, 
          right: 0,
          zIndex: 100
        }
      ]}>
        <TabItem 
          icon="home" 
          label={t.home} 
          active={activeTab === 'home'} 
          onPress={() => setActiveTab('home')}
        />
        <TabItem 
          icon="compass" 
          label={t.searchNav} 
          active={activeTab === 'tasks'} 
          onPress={() => setActiveTab('tasks')}
        />
        <TabItem 
          icon="user" 
          label={t.account} 
          active={activeTab === 'profile'} 
          onPress={() => setActiveTab('profile')}
        />
      </View>
    </View>
  );
}

// Main App component wrapped with SafeAreaProvider
export default function App() {
  return (
    <SafeAreaProvider>
      <MainApp />
    </SafeAreaProvider>
  );
}

// --- STYLES & THEME ---

const lightColors = {
  background: '#f9fafb',
  card: '#ffffff',
  text: '#1f2937',
  subText: '#4b5563',
  headerBg: '#ffffff',
  border: '#f3f4f6',
};

const darkColors = {
  background: '#0b1220',
  card: '#111827',
  text: '#e5e7eb',
  subText: '#9ca3af',
  headerBg: '#1f2937',
  border: '#374151',
};

// Basic styles object (most styles are inline now for responsive design)
const styles = StyleSheet.create({
  container: { flex: 1 },
  mainContent: { flex: 1 },
  taskCard: { borderRadius: 24, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  taskImageContainer: { width: '100%', borderRadius: 16, overflow: 'hidden' },
  taskImage: { width: '100%', height: '100%' },
  taskTitle: { fontWeight: 'bold' },
  taskEarnings: { color: '#6366f1', fontWeight: 'bold' },
  pageTitle: { fontWeight: 'bold' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  sectionTitle: { fontWeight: 'bold' },
  linkText: { color: '#6366f1', fontWeight: '600' },
  catScroll: { flexDirection: 'row' },
  categoryItem: { alignItems: 'center' },
  categoryIconBox: { alignItems: 'center', justifyContent: 'center' },
  categoryText: { fontWeight: '500', textAlign: 'center' },
  taskList: { },
  heroCard: { position: 'relative', overflow: 'hidden' },
  heroTitle: { fontWeight: 'bold' },
  heroSub: { },
  heroBtn: { backgroundColor: '#fff', flexDirection: 'row', alignSelf: 'flex-start', alignItems: 'center' },
  heroBtnText: { fontWeight: 'bold' },
  heroBlob: { position: 'absolute' },
  profileCard: { alignItems: 'center' },
  avatar: { backgroundColor: '#e0e7ff', alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontWeight: 'bold', color: '#6366f1' },
  profileName: { fontWeight: 'bold' },
  groupTitle: { fontWeight: 'bold', textTransform: 'uppercase' },
  settingsGroup: { overflow: 'hidden' },
  settingItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1 },
  settingLeft: { flexDirection: 'row', alignItems: 'center' },
  iconBox: { alignItems: 'center', justifyContent: 'center' },
  settingText: { fontWeight: '500' },
  langSwitch: { flexDirection: 'row' },
  langBtn: { },
  langBtnActive: { backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 2, elevation: 1 },
  langText: { fontWeight: '500' },
  langTextActive: { color: '#6366f1', fontWeight: 'bold' },
  tabBar: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, position: 'absolute', bottom: 0, left: 0, right: 0 },
  tabItem: { alignItems: 'center' },
  tabIconBox: { alignItems: 'center', justifyContent: 'center' },
  tabLabel: { fontWeight: '500' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: 24, borderTopRightRadius: 24, overflow: 'hidden' },
  modalImageContainer: { position: 'relative' },
  modalImage: { width: '100%', height: '100%' },
  closeModalBtn: { position: 'absolute', backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.2, elevation: 4 },
  modalBody: { flex: 1 },
  modalHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  modalTitle: { fontWeight: 'bold', flex: 1 },
  modalPrice: { fontWeight: 'bold', color: '#6366f1' },
  modalMetaRow: { flexDirection: 'row', alignItems: 'center' },
  metaText: { color: '#6b7280' },
  metaDot: { color: '#6b7280' },
  sectionHeaderSmall: { fontWeight: 'bold' },
  modalDesc: { },
  statsGrid: { flexDirection: 'row' },
  statBox: { flex: 1 },
  statLabel: { color: '#9ca3af' },
  statValue: { fontWeight: '600' },
  modalFooter: { },
  applyBtn: { backgroundColor: '#6366f1', alignItems: 'center' },
  applyBtnText: { color: '#fff', fontWeight: 'bold' },
  infoModalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center', padding: 20 },
  infoModalCard: { width: '100%', borderRadius: 24, alignItems: 'center' },
  infoIconCircle: { backgroundColor: '#e0e7ff', alignItems: 'center', justifyContent: 'center' },
  infoTitle: { fontWeight: 'bold' },
  infoBody: { textAlign: 'center' },
  infoBtn: { alignItems: 'center' },
  infoBtnText: { fontWeight: 'bold' }
});
