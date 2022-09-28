import { isEmpty, values } from '@/utils/utils';
import { isArray } from '@/utils/type-checks';
import { notification } from 'ant-design-vue';
import { h } from 'vue';

function getErrorsHtml(errors) {
  if (isEmpty(errors)) return '';

  let errorsStr = '';

  values(errors).forEach(value => {
    value.forEach(text => {
      errorsStr += `<div>${text}</div>`;
    });
  });

  return errorsStr;
}

function setNotifyText(data) {
  let text;
  console.log(data.errors && !isArray(data.errors));
  if (data.errors && !isArray(data.errors)) {
    console.log('data.errors', data.errors);
    text = getErrorsHtml(data.errors);
    console.log(text);
  } else {
    text = data?.message;
  }

  return text;
}

function showErrorMessage(descr) {
  notification.error({
    message: 'Ошибка',
    description: h('div', {
      class: 'ant-space ant-space-vertical',
      style: { gap: 8 + 'px' },
      innerHTML: descr,
    }),
  });
}

export function setErrorToast({ config, data }) {
  if (config.responseType === 'blob') {
    data.text().then((res) => {
      const text = setNotifyText(JSON.parse(res));
      showErrorMessage(text);
    });
  } else {
    const text = setNotifyText(data);
    showErrorMessage(text);
  }
}
