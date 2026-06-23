export const formatCurrencyBRL = (value: string): string => {
  const onlyDigits = value.replace(/\D/g, "");
  
  if (!onlyDigits) return "";

  const numberValue = Number(onlyDigits) / 100;
  
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numberValue);
};

export const parseCurrencyToNumber = (value: string): number => {
  const onlyDigits = value.replace(/\D/g, "");
  if (!onlyDigits) return 0;
  
  return Number(onlyDigits) / 100;
};
