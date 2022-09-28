import { numOr0 } from '@/utils/utils';
import { truncate } from '@/utils/lodash';
import dayjs from 'dayjs';

export function formatPhone(str) {
  if (!str) return str;
  // Filter only numbers from the input
  const cleaned = (`${str}`).replace(/\D/g, '');
  // Check if the input is of correct
  const match = cleaned.match(/^(7|)?(\d{3})(\d{3})(\d{2})(\d{2})$/);

  return match ? ['+7', ' ', match[2], ' ', match[3], ' ', match[4], ' ', match[5]].join('') : str;
}

function toStingTrim(value) {
  return `${value}`.trim();
}

export function format(value, method, options) {
  switch (method) {
    case 'num':
      return numOr0(value).toString();
    case 'datetime':
      return dayjs(value).format('HH:mm DD.MM.YYYY');
    case 'date':
      return dayjs(value).format('DD.MM.YYYY');
    case 'time':
      return dayjs(value).format('HH:mm');
    case 'phone':
      return formatPhone(toStingTrim(value));
    case 'yesno':
      return !!value ? 'Да' : 'Нет';
    case 'truncate':
      return truncate(toStingTrim(value), Object.assign({ length: 50, separator: '...' }, options));
    case 'empty':
      const defaultText = options || 'Данных нет';
      return !!value ? value : defaultText;
    default:
      return toStingTrim(value);
  }
}