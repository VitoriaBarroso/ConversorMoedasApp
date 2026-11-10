const BASE_URL = 'https://api.frankfurter.dev/v1';

export const currencyModel = {
  
  async getCurrencies() {
    try {
      const response = await fetch(`${BASE_URL}/currencies`);
      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`);
      }

      const data = await response.json();
      const formattedCurrencies = {};

      if (Array.isArray(data)) {
        data.forEach((item) => {
          const code = item.code ?? item.iso_code ?? item.currency;
          const name = item.name ?? item.currency_name ?? item.label;

          if (code) {
            formattedCurrencies[code] = name ?? code;
          }
        });
      } else if (data && typeof data === 'object') {
        Object.entries(data).forEach(([code, name]) => {
          formattedCurrencies[code] = typeof name === 'string' ? name : code;
        });
      }

      return formattedCurrencies;
    } catch (error) {
      throw new Error('Não foi possível carregar a lista de moedas.');
    }
  },


  async getExchangeRate(fromCurrency, toCurrency) {
    try {
      const response = await fetch(`${BASE_URL}/latest?from=${encodeURIComponent(fromCurrency)}&to=${encodeURIComponent(toCurrency)}`);
      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`);
      }

      const data = await response.json();
      const rate = data?.rates?.[toCurrency];

      if (typeof rate !== 'number') {
        throw new Error('Taxa de câmbio não encontrada para a conversão informada.');
      }

      return {
        ...data,
        rates: {
          ...(data?.rates ?? {}),
          [toCurrency]: rate,
        },
      };
    } catch (error) {
      throw new Error('Não foi possível obter a taxa de câmbio.');
    }
  },
};