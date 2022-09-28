import { numOr0 } from '@/utils/utils';

/**
 * @template T
 * @param {T} obj
 * @return {T|{find: Function, values: Object[], keys: String[]}}
 */
export function useType(obj) {
  /*
    Можно быстро найти что-то из значений, например:
    ROLES.find(item => item.value === testValue)
  */
  Object.defineProperty(obj, 'find', {
    value: (cb) => Object.values(obj).find(cb),
  });

  /* В свойстве-геттере лежит массив ключей ROLES.keys */
  Object.defineProperty(obj, 'keys', {
    get() { return Object.keys(obj) },
  });

  /* В свойстве-геттере лежит массив значений ROLES.keys */
  Object.defineProperty(obj, 'values', {
    get() { return Object.values(obj) },
  });

  /*
    Можно быстро найти что-то из значений, например:
    ROLES.admin.is(testId) тоже самое что ROLES.admin.id === testId
  */
  Object.keys(obj).forEach((key) => {
    const value = obj[key];

    // todo ??? refactor
    Object.defineProperty(value, 'is', {
      value: (id) => numOr0(id) === value.id,
      configurable: true,
    });
  });

  // Заморозили, чтобы нельзя было изменять снаружи
  return Object.freeze(obj);
}

export const ROLES = useType({
  admin: { id: 1, title: 'Администратор' },
  manager: { id: 2, title: 'Менеджер' },
  client: { id: 3, title: 'Клиент' },
});

export const ORDER_STATUSES = useType({
  created: { id: 0, title: 'Создан', variant: 'gray', hexColor: '#828282' },
  pending: { id: 1, title: 'Ожидает', variant: 'orange', hexColor: '#F2994A' },
  declined: { id: 2, title: 'Отклонен', variant: 'red', hexColor: '#EB5757' },
  approved: { id: 3, title: 'Одобрен', variant: 'purple', hexColor: '#9B51E0' },
  ready: { id: 4, title: 'Доступен', variant: 'green', hexColor: '#219653' },
  closed: { id: 5, title: 'Закрыт', variant: 'gray', hexColor: '#4F4F4F' },
});

export const GROUP_STATUSES = useType({
  created: { id: 1, title: 'Сохранен', variant: 'orange' },
  sent: { id: 2, title: 'Отправлен на модерацию', variant: 'gray' },
});

export const PRODUCT_STATUSES = useType({
  draft: { id: 1, title: 'Черновик', variant: 'gray', hexColor: '#828282' },
  moderation: { id: 2, title: 'Отправлен на модерацию', variant: 'orange', hexColor: '#F2994A' },
  errors: { id: 3, title: 'Требует изменений', variant: 'red', hexColor: '#EB5757' },
  notsigned: { id: 4, title: 'Ожидает подписания', variant: 'blue', hexColor: '#2D9CDB' },
  published: { id: 5, title: 'Опубликовано', variant: 'purple', hexColor: '#9B51E0' },
  layout: { id: 6, title: 'Макет', variant: 'yellow', hexColor: '#F2C94C' },
});

export const REGISTER_STATUSES = useType({
  without_errors: { id: 1, title: 'Без ошибок' },
  with_errors: { id: 2, title: 'С ошибками' },
  in_process: { id: 3, title: 'В процессе' },
});

export const APPLICATION_STATUSES = useType({
  new: { id: 1, title: 'Новый', variant: 'green', hexColor: '#219653' },
  responded: { id: 2, title: 'Отвечен', variant: 'orange', hexColor: '#F2994A' },
  not_responded: { id: 3, title: 'Не отвечен', variant: 'red', hexColor: '#EB5757' },
  closed: { id: 4, title: 'Закрыт', variant: 'gray', hexColor: '#BDBDBD' },
});

export const PRINT_STATUSES = useType({
  new: { id: 0, variant: 'green', title: 'Новый' },
  confirm_to_work: { id: 1, variant: 'yellow', title: 'Принято в работу' },
  sent_receipt_to_pay: { id: 2, variant: 'blue', title: 'Отправлен счет на оплату' },
  paid: { id: 3, variant: 'orange', title: 'Оплачен' },
  on_printing: { id: 4, variant: 'fuchsia', title: 'На печати' },
  printed: { id: 5, variant: 'purple', title: 'Распечатан' },
  sent_to_the_client: { id: 6, variant: 'gray', title: 'Отправлено клиенту' },
  // rejected: { id: 7, variant: 'red', title: 'Отменен' },
});

export const PHOTO_TYPES = useType({
  front: { id: 1, title: 'Лицевая сторона' },
  left: { id: 2, title: 'Левая сторона' },
  back: { id: 3, title: 'Задняя сторона' },
  right: { id: 4, title: 'Правая сторона' },
  top: { id: 5, title: 'Верх' },
  bottom: { id: 6, title: 'Низ' },
  diagonal: { id: 7, title: 'Три грани' },
  tech1: { id: 8, title: 'Техническое фото 1' },
  tech2: { id: 9, title: 'Техническое фото 2' },
  tech3: { id: 10, title: 'Техническое фото 3' },
});
