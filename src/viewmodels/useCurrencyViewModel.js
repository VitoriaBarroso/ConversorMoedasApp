import { useState, useEffect } from 'react';
import { currencyModel } from '../models/currencyModel';

export function useCurrencyViewModel() {
  const allowedCurrencies = ['BRL', 'CNY', 'EUR'];
  const [amount, setAmount] = useState('');
  const [fromCurrency, setFromCurrency] = useState('BRL'); 
  const [toCurrency, setToCurrency] = useState('CNY');     
  const [currencies, setCurrencies] = useState({});

  const availableCurrencies = Object.fromEntries(
    Object.entries(currencies).filter(([code]) => allowedCurrencies.includes(code)),
  );

  const [convertedValue, setConvertedValue] = useState(null);
  const [exchangeRate, setExchangeRate] = useState(null);
  const [rateDate, setRateDate] = useState('');

  const [loading, setLoading] = useState(false);
  const [loadingCurrencies, setLoadingCurrencies] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');


  useEffect(() => {
    async function loadCurrencies() {
      try {
        setLoadingCurrencies(true);
        const data = await currencyModel.getCurrencies();
        setCurrencies(data);
      } catch (err) {
        setErrorMessage(err.message);
      } finally {
        setLoadingCurrencies(false);
      }
    }
    loadCurrencies();
  }, []);


  const validateInputs = () => {
    if (!amount || amount.trim() === '') {
      setErrorMessage('Por favor, informe o valor a ser convertido.');
      return false;
    }

    const normalizedAmount = amount.replace(',', '.');
    const numericAmount = parseFloat(normalizedAmount);

    if (isNaN(numericAmount) || numericAmount <= 0) {
      setErrorMessage('O valor deve ser um número maior que zero.');
      return false;
    }

    if (fromCurrency !== 'BRL') {
      setErrorMessage('A conversão permitida é somente de BRL para CNY ou EUR.');
      return false;
    }

    if (!toCurrency || !['CNY', 'EUR'].includes(toCurrency)) {
      setErrorMessage('Selecione apenas CNY ou EUR como destino.');
      return false;
    }

    if (fromCurrency === toCurrency) {
      setErrorMessage('As moedas de origem e destino devem ser diferentes.');
      return false;
    }

    setErrorMessage('');
    return true;
  };


  const convertCurrency = async () => {
    if (!validateInputs()) return;

    setLoading(true);
    setConvertedValue(null);

    try {
      const data = await currencyModel.getExchangeRate(fromCurrency, toCurrency);
      
      const rate = data.rates[toCurrency];
      const numericAmount = parseFloat(amount.replace(',', '.'));
      const result = numericAmount * rate;

      setExchangeRate(rate);
      setRateDate(data.date);
      setConvertedValue(result);
      setErrorMessage('');
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };


  const swapCurrencies = () => {
    setToCurrency((current) => (current === 'CNY' ? 'EUR' : 'CNY'));
  };

  return {
    amount,
    setAmount,
    fromCurrency,
    setFromCurrency,
    toCurrency,
    setToCurrency,
    currencies: availableCurrencies,
    convertedValue,
    exchangeRate,
    rateDate,
    loading,
    loadingCurrencies,
    errorMessage,
    convertCurrency,
    swapCurrencies,
  };
}