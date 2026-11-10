import React from 'react';
import {StyleSheet,Text,View,TextInput,TouchableOpacity,ActivityIndicator,ScrollView,} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useCurrencyViewModel } from '../viewmodels/useCurrencyViewModel';

export function CurrencyConverterView() {
  const {
    amount,
    setAmount,
    fromCurrency,
    setFromCurrency,
    toCurrency,
    setToCurrency,
    currencies,
    convertedValue,
    exchangeRate,
    rateDate,
    loading,
    loadingCurrencies,
    errorMessage,
    convertCurrency,
    swapCurrencies,
  } = useCurrencyViewModel();

  const currencyKeys = Object.keys(currencies);
  const targetCurrencyKeys = currencyKeys.filter((code) => ['CNY', 'EUR'].includes(code));

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Conversor de Moedas</Text>
      <Text style={styles.subtitle}>BRL para Yuan Chinês (CNY) ou Euro (EUR) - API Frankfurter</Text>

 
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Valor em BRL:</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="Ex: 100.00"
          placeholderTextColor="#88a0c0"
          value={amount}
          onChangeText={setAmount}
        />
      </View>

      {loadingCurrencies ? (
        <ActivityIndicator size="small" color="#1e3a8a" />
      ) : (
        <View style={styles.pickerRow}>
          <View style={styles.pickerContainer}>
            <Text style={styles.label}>De:</Text>
            <Picker
              selectedValue={fromCurrency}
              onValueChange={(itemValue) => setFromCurrency(itemValue)}
              style={styles.picker}
            >
              {['BRL'].map((code) => (
                <Picker.Item key={code} label={`${code} - ${currencies[code] ?? 'Real Brasileiro'}`} value={code} />
              ))}
            </Picker>
          </View>

          <TouchableOpacity style={styles.swapButton} onPress={swapCurrencies}>
            <Text style={styles.swapButtonText}>⇄</Text>
          </TouchableOpacity>

          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Para:</Text>
            <Picker
              selectedValue={toCurrency}
              onValueChange={(itemValue) => setToCurrency(itemValue)}
              style={styles.picker}
            >
              {targetCurrencyKeys.map((code) => (
                <Picker.Item key={code} label={`${code} - ${currencies[code]}`} value={code} />
              ))}
            </Picker>
          </View>
        </View>
      )}

      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      {/* Botão de Converter */}
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={convertCurrency}
        disabled={loading || loadingCurrencies}
      >
        {loading ? (
          <ActivityIndicator color="#1e3a8a" />
        ) : (
          <Text style={styles.buttonText}>Converter</Text>
        )}
      </TouchableOpacity>

      {/* Resultado */}
      {convertedValue !== null && (
        <View style={styles.resultCard}>
          <Text style={styles.resultTitle}>Resultado da Conversão:</Text>
          <Text style={styles.resultText}>
            {amount} {fromCurrency} =
          </Text>
          <Text style={styles.resultValue}>
            {convertedValue.toFixed(2)} {toCurrency}
          </Text>
          <Text style={styles.infoText}>Taxa de Câmbio: 1 {fromCurrency} = {exchangeRate} {toCurrency}</Text>
          <Text style={styles.infoText}>Data de Referência API: {rateDate}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#F8F9FA', 
    flexGrow: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1E3A8A', 
  },
  subtitle: {
    fontSize: 13,
    textAlign: 'center',
    color: '#3B82F6', 
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    color: '#1E3A8A',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#93C5FD', 
    borderRadius: 8,
    padding: 12,
    fontSize: 18,
    color: '#1E3A8A',
  },
  pickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  pickerContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#93C5FD',
    overflow: 'hidden',
  },
  picker: {
    color: '#1E3A8A',
  },
  swapButton: {
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FEF08A', 
    borderRadius: 8,
    height: 50,
    marginHorizontal: 8,
  },
  swapButtonText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E3A8A', 
  },
  button: {
    backgroundColor: '#FEF08A', 
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#FDE047',
  },
  buttonDisabled: {
    backgroundColor: '#FEF9C3',
  },
  buttonText: {
    color: '#1E3A8A', 
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#DC2626',
    textAlign: 'center',
    marginVertical: 10,
    fontWeight: '600',
  },
  resultCard: {
    marginTop: 25,
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FEF08A',
    alignItems: 'center',
    shadowColor: '#93C5FD',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    elevation: 3,
  },
  resultTitle: {
    fontSize: 14,
    color: '#3B82F6',
    marginBottom: 5,
  },
  resultText: {
    fontSize: 16,
    color: '#1E3A8A',
    fontWeight: '600',
  },
  resultValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E3A8A', 
    marginVertical: 8,
  },
  infoText: {
    fontSize: 12,
    color: '#4B5563',
    marginTop: 3,
  },
});