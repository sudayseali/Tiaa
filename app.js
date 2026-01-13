import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar,
  AppRegistry 
} from 'react-native';

const App = () => {
  const [count, setCount] = useState(0);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <Text style={styles.title}>ShaqoHub React Native</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Ku soo dhawaaw App-ka!</Text>
        <Text style={styles.cardText}>
          Kani waa tijaabo React Native ah. Waxaad riixday badhanka {count} jeer.
        </Text>

        <TouchableOpacity 
          style={styles.button} 
          onPress={() => setCount(count + 1)}
        >
          <Text style={styles.buttonText}>Riix Halkan</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>ShaqoHub © 2026</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  header: { padding: 20, backgroundColor: '#4f46e5', alignItems: 'center' },
  title: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  card: { backgroundColor: '#fff', margin: 20, padding: 20, borderRadius: 15, elevation: 3 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#1f2937' },
  cardText: { fontSize: 14, color: '#4b5563', marginBottom: 20 },
  button: { backgroundColor: '#6366f1', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  footer: { position: 'absolute', bottom: 30, width: '100%', alignItems: 'center' },
  footerText: { color: '#9ca3af', fontSize: 12 },
});

// KHADKA UGU MUHIIMSAN: Waa in magaca halkan ku qoran uu la mid noqdo magaca App-ka
AppRegistry.registerComponent('ShaqoApp', () => App);

export default App;
