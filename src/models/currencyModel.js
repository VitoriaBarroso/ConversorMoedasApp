const BASE_URL = 'https://api.frankfurter.dev/v2';

async function fetchJson(url, operation) {
  let response;

  try {
    response = await fetch(url);
  } catch {
    throw new Error(`Não foi possível conectar à Frankfurter ao ${operation}. Verifique sua conexão e tente novamente.`);
  }

  if (!response.ok) {
    throw new Error(`A Frankfurter retornou um erro HTTP ${response.status} ao ${operation}.`);
  }

  try {
    return await response.json();
  } catch {
    throw new Error(`A Frankfurter retornou uma resposta inválida ao ${operation}.`);
  }
}

export const currencyModel = {
  async getCurrencies() {
    const data = await fetchJson(`${BASE_URL}/currencies`, 'carregar as moedas');

    if (!Array.isArray(data)) {
      throw new Error('A lista de moedas recebida da Frankfurter é inválida.');
    }

    const currencies = {};

    data.forEach((item) => {
      if (
        item?.type === 'currency' &&
        typeof item.iso_code === 'string' &&
        typeof item.name === 'string'
      ) {
        currencies[item.iso_code] = item.name;
      }
    });

    if (Object.keys(currencies).length === 0) {
      throw new Error('A Frankfurter não retornou moedas disponíveis.');
    }

    return currencies;
  },

  async getExchangeRate(fromCurrency, toCurrency) {
    const url = `${BASE_URL}/rate/${encodeURIComponent(fromCurrency)}/${encodeURIComponent(toCurrency)}`;
    const data = await fetchJson(url, 'consultar a taxa de câmbio');

    if (
      data?.base !== fromCurrency ||
      data?.quote !== toCurrency ||
      typeof data?.date !== 'string' ||
      !/^\d{4}-\d{2}-\d{2}$/.test(data.date) ||
      typeof data?.rate !== 'number' ||
      !Number.isFinite(data.rate) ||
      data.rate <= 0
    ) {
      throw new Error('A Frankfurter retornou dados inválidos para esta conversão.');
    }

    return data;
  },
};
