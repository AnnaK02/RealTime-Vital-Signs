export const dateFormatBr = (value, time = false) => {
  if (!value) return null;
  return new Intl.DateTimeFormat(
    'pt-BR',
    time
      ? { dateStyle: 'short', timeStyle: 'medium' }
      : { dateStyle: 'short' }
  ).format(new Date(value)).replace(',', '');
};
