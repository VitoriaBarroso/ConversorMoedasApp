import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { CurrencyConverterView } from '../views/CurrencyConverterView';

export default function Page() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <CurrencyConverterView />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
});