export function formatCurrency(value) {
  if (value === undefined || value === null) return 'R$ 0,00';
  const numericValue = typeof value === 'number' ? value : parseFloat(value);
  if (isNaN(numericValue)) return 'R$ 0,00';

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(numericValue);
}

export function formatDate(dateString) {
  if (!dateString) return '-';
  // If format is YYYY-MM-DD
  const parts = dateString.split('-');
  if (parts.length === 3) {
    const [year, month, day] = parts;
    return `${day}/${month}/${year}`;
  }
  return dateString;
}

export function getMonthYearOptions() {
  const options = [];
  const currentDate = new Date();
  // Options for past 12 months, plus 2026 for sample compatibility
  const months = [
    { name: 'Janeiro', value: '01' },
    { name: 'Fevereiro', value: '02' },
    { name: 'Março', value: '03' },
    { name: 'Abril', value: '04' },
    { name: 'Maio', value: '05' },
    { name: 'Junho', value: '06' },
    { name: 'Julho', value: '07' },
    { name: 'Agosto', value: '08' },
    { name: 'Setembro', value: '09' },
    { name: 'Outubro', value: '10' },
    { name: 'Novembro', value: '11' },
    { name: 'Dezembro', value: '12' },
  ];

  const years = [2026, 2025, 2024];

  years.forEach(year => {
    months.forEach(m => {
      options.push({
        label: `${m.name} de ${year}`,
        month: m.value,
        year: year,
        value: `${year}-${m.value}`,
      });
    });
  });

  return options;
}
