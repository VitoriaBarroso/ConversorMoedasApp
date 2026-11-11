import React from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useCurrencyViewModel } from '../viewmodels/useCurrencyViewModel';

const formatCurrency = (value, currency) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency,
  }).format(value);

export function CurrencyConverterView() {
  const {
    amount,
    setAmount,
    fromCurrency,
    setFromCurrency,
    toCurrency,
    setToCurrency,
    currencies,
    result,
    loading,
    loadingCurrencies,
    errorMessage,
    currencyError,
    loadCurrencies,
    convertCurrency,
  } = useCurrencyViewModel();

  const currencyCodes = Object.keys(currencies);

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        <Text style={styles.eyebrow}>CONVERSOR DE MOEDAS</Text>
        <Text style={styles.title}>Conversor de moedas</Text>
        <Text style={styles.subtitle}>Consulte taxas de referência da Frankfurter.</Text>
      </View>

      <View style={styles.formCard}>
        <Text style={styles.label}>
          Valor em {currencies[fromCurrency] ?? fromCurrency}
        </Text>
        <View style={styles.inputContainer}>
          <Text style={styles.inputPrefix}>{fromCurrency}</Text>
          <TextInput
            style={styles.input}
            keyboardType="decimal-pad"
            placeholder="100,00"
            placeholderTextColor="#88a0c0"
            value={amount}
            onChangeText={setAmount}
            accessibilityLabel="Valor a converter"
          />
        </View>

        {loadingCurrencies ? (
          <View style={styles.currencyLoading}>
            <ActivityIndicator size="small" color="#1e3a8a" />
            <Text style={styles.infoText}>Carregando moedas...</Text>
          </View>
        ) : currencyCodes.length > 0 ? (
          <View style={styles.currencyRow}>
            <View style={styles.currencyCard}>
              <Text style={styles.currencyLabel}>DE</Text>
              <Picker
                selectedValue={fromCurrency}
                onValueChange={setFromCurrency}
                style={styles.picker}
                accessibilityLabel="Moeda de origem"
              >
                {currencyCodes.map((code) => (
                  <Picker.Item
                    key={code}
                    label={`${code} - ${currencies[code]}`}
                    value={code}
                  />
                ))}
              </Picker>
            </View>
            <View style={styles.arrowContainer}>
              <Text style={styles.arrow}>→</Text>
            </View>
            <View style={styles.currencyCard}>
              <Text style={styles.currencyLabel}>PARA</Text>
              <Picker
                selectedValue={toCurrency}
                onValueChange={setToCurrency}
                style={styles.picker}
                accessibilityLabel="Moeda de destino"
              >
                {currencyCodes.map((code) => (
                  <Picker.Item
                    key={code}
                    label={`${code} - ${currencies[code]}`}
                    value={code}
                  />
                ))}
              </Picker>
            </View>
          </View>
        ) : (
          <View style={styles.currencyLoading}>
            <Text style={styles.errorText}>
              {currencyError || 'Não foi possível carregar as moedas.'}
            </Text>
            <TouchableOpacity style={styles.retryButton} onPress={loadCurrencies}>
              <Text style={styles.retryText}>Tentar novamente</Text>
            </TouchableOpacity>
          </View>
        )}

        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={convertCurrency}
          disabled={loading || loadingCurrencies || currencyCodes.length < 2}
          accessibilityRole="button"
        >
          {loading ? (
            <ActivityIndicator color="#1e3a8a" />
          ) : (
            <Text style={styles.buttonText}>Converter</Text>
          )}
        </TouchableOpacity>
      </View>

      {result && (
        <View style={styles.resultCard}>
          <Text style={styles.resultEyebrow}>RESULTADO DA CONVERSÃO</Text>
          <Text style={styles.resultCaption}>
            {formatCurrency(result.amount, result.fromCurrency)} equivalem a
          </Text>
          <Text style={styles.resultValue}>
            {formatCurrency(result.convertedValue, result.toCurrency)}
          </Text>
          <Text style={styles.infoText}>
            1 {result.fromCurrency} = {result.rate.toFixed(4)} {result.toCurrency}
          </Text>
          <Text style={styles.infoText}>
            Taxa de referência de {new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC' }).format(
              new Date(`${result.date}T00:00:00Z`),
            )}
          </Text>
          <Text style={styles.infoText}>Não representa uma cotação em tempo real.</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 36,
    backgroundColor: '#F8F9FA',
  },
  header: {
    alignItems: 'center',
    marginBottom: 28,
  },
  eyebrow: {
    color: '#3B82F6',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.4,
    marginBottom: 8,
  },
  title: {
    color: '#1E3A8A',
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    color: '#3B82F6',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
    textAlign: 'center',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
    shadowColor: '#93C5FD',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 3,
  },
  label: {
    color: '#1E3A8A',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputContainer: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#93C5FD',
    borderRadius: 12,
    borderWidth: 1.5,
    flexDirection: 'row',
    paddingHorizontal: 14,
  },
  inputPrefix: {
    color: '#1E3A8A',
    fontSize: 18,
    fontWeight: '700',
  },
  input: {
    color: '#1E3A8A',
    flex: 1,
    fontSize: 20,
    borderWidth: 0,
    outlineWidth: 0,
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  currencyRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 20,
  },
  currencyCard: {
    backgroundColor: '#F8F9FA',
    borderColor: '#93C5FD',
    borderRadius: 12,
    borderWidth: 1,
    flex: 1,
    paddingHorizontal: 6,
    paddingVertical: 8,
  },
  currencyLabel: {
    color: '#3B82F6',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  picker: {
    color: '#1E3A8A',
    height: 48,
    width: '100%',
  },
  currencyLoading: {
    alignItems: 'center',
    marginTop: 18,
  },
  retryButton: {
    backgroundColor: '#FEF08A',
    borderColor: '#FDE047',
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  retryText: {
    color: '#1E3A8A',
    fontSize: 14,
    fontWeight: '700',
  },
  arrowContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  arrow: {
    color: '#1E3A8A',
    fontSize: 22,
    fontWeight: '700',
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 14,
    textAlign: 'center',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#FEF08A',
    borderColor: '#FDE047',
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 20,
    padding: 15,
  },
  buttonDisabled: {
    backgroundColor: '#FEF9C3',
  },
  buttonText: {
    color: '#1E3A8A',
    fontSize: 17,
    fontWeight: 'bold',
  },
  resultCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#FEF08A',
    borderRadius: 18,
    borderWidth: 2,
    marginTop: 22,
    padding: 22,
    shadowColor: '#93C5FD',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  resultEyebrow: {
    color: '#3B82F6',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  resultCaption: {
    color: '#1E3A8A',
    fontSize: 15,
    marginTop: 16,
    textAlign: 'center',
  },
  resultValue: {
    color: '#1E3A8A',
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 6,
    textAlign: 'center',
  },
  infoText: {
    color: '#4B5563',
    fontSize: 13,
    marginTop: 4,
    textAlign: 'center',
  },
});
