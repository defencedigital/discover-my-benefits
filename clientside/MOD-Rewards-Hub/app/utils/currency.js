import currencyFormatter from 'currency-formatter';

export const formatCurrency = (value) => currencyFormatter.format(value, { code: 'GBP' });
