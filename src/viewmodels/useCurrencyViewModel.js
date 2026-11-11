import { useCallback, useEffect, useRef, useState } from 'react';
import { currencyModel } from '../models/currencyModel';

function parseAmount(value) {
  const normalizedValue = value.trim().replace(',', '.');

  if (!/^(?:\d+(?:\.\d+)?|\.\d+)$/.test(normalizedValue)) {
    return null;
  }

  const numericValue = Number(normalizedValue);
  return Number.isFinite(numericValue) && numericValue > 0 ? numericValue : null;
}

export function useCurrencyViewModel() {
  const [amount, setAmount] = useState('');
  const [fromCurrency, setFromCurrency] = useState('BRL');
  const [toCurrency, setToCurrency] = useState('CNY');
  const [currencies, setCurrencies] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingCurrencies, setLoadingCurrencies] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [currencyError, setCurrencyError] = useState('');
  const conversionRequestId = useRef(0);
  const currenciesRequestId = useRef(0);

  const loadCurrencies = useCallback(async () => {
    const requestId = currenciesRequestId.current + 1;
    currenciesRequestId.current = requestId;
    setLoadingCurrencies(true);
    setCurrencyError('');

    try {
      const availableCurrencies = await currencyModel.getCurrencies();

      if (currenciesRequestId.current !== requestId) return;

      const currencyCodes = Object.keys(availableCurrencies);
      const defaultFromCurrency = currencyCodes.includes('BRL') ? 'BRL' : currencyCodes[0];
      const defaultToCurrency =
        currencyCodes.includes('CNY')
          ? 'CNY'
          : currencyCodes.find((code) => code !== defaultFromCurrency) ?? defaultFromCurrency;
      setCurrencies(availableCurrencies);
      setFromCurrency(defaultFromCurrency);
      setToCurrency(defaultToCurrency);
    } catch (error) {
      if (currenciesRequestId.current === requestId) {
        setCurrencyError(error.message);
      }
    } finally {
      if (currenciesRequestId.current === requestId) {
        setLoadingCurrencies(false);
      }
    }
  }, []);

  useEffect(() => {
    loadCurrencies();

    return () => {
      currenciesRequestId.current += 1;
      conversionRequestId.current += 1;
    };
  }, [loadCurrencies]);

  const clearConversion = () => {
    conversionRequestId.current += 1;
    setResult(null);
    setErrorMessage('');
    setLoading(false);
  };

  const handleAmountChange = (value) => {
    clearConversion();
    setAmount(value);
  };

  const handleFromCurrencyChange = (currency) => {
    clearConversion();
    setFromCurrency(currency);
  };

  const handleToCurrencyChange = (currency) => {
    clearConversion();
    setToCurrency(currency);
  };

  const convertCurrency = async () => {
    const numericAmount = parseAmount(amount);

    if (numericAmount === null) {
      setResult(null);
      setErrorMessage(
        amount.trim()
          ? 'Informe um número maior que zero, usando apenas uma vírgula ou um ponto decimal.'
          : 'Por favor, informe o valor a ser convertido.',
      );
      return;
    }

    if (!fromCurrency || !toCurrency) {
      setErrorMessage('Selecione as moedas de origem e destino.');
      return;
    }

    if (fromCurrency === toCurrency) {
      setErrorMessage('As moedas de origem e destino devem ser diferentes.');
      return;
    }

    const requestId = conversionRequestId.current + 1;
    conversionRequestId.current = requestId;
    const requestedAmount = numericAmount;
    const requestedFromCurrency = fromCurrency;
    const requestedToCurrency = toCurrency;

    setLoading(true);
    setResult(null);
    setErrorMessage('');

    try {
      const rateData = await currencyModel.getExchangeRate(
        requestedFromCurrency,
        requestedToCurrency,
      );

      if (conversionRequestId.current !== requestId) return;

      const convertedValue = requestedAmount * rateData.rate;

      if (!Number.isFinite(convertedValue)) {
        setErrorMessage('O valor informado é grande demais para realizar esta conversão.');
        return;
      }

      setResult({
        amount: requestedAmount,
        fromCurrency: requestedFromCurrency,
        toCurrency: requestedToCurrency,
        rate: rateData.rate,
        date: rateData.date,
        convertedValue,
      });
    } catch (error) {
      if (conversionRequestId.current === requestId) {
        setErrorMessage(error.message);
      }
    } finally {
      if (conversionRequestId.current === requestId) {
        setLoading(false);
      }
    }
  };

  return {
    amount,
    setAmount: handleAmountChange,
    fromCurrency,
    setFromCurrency: handleFromCurrencyChange,
    toCurrency,
    setToCurrency: handleToCurrencyChange,
    currencies,
    result,
    loading,
    loadingCurrencies,
    errorMessage,
    currencyError,
    loadCurrencies,
    convertCurrency,
  };
}
