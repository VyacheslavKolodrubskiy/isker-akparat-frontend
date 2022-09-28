import { cloneDeep, get } from '@/utils/lodash';
import { setErrorToast } from '@/utils/format-error';
import { keys, removeEmpty } from '@/utils/utils';
import { isNil } from '@/utils/type-checks';

const DEFAULTS = {
  formDataConvert: false, /* конвертировать тело запроса в FormData перед отправкой
    (используется в случае наличия файла в теле) */
  dataAbstraction: true, // извлекать и возвращать data из оъекта ответа с сервера
  showAlerts: true, // извлекать и возвращать data из оъекта ответа с сервера
  data: {},
  axiosConfig: {}, // кастомные опции axios
  params: null,
  url: null,
};

/**
 * for functional approach, we have this abstraction
 * - const myObject = { data: [...], anotherKey: ... }
 * - const dataValue = getData(myObject) // instead of : const dataValue = myObject.data
 * We do this to make more easy to read and maintain a code
 * In addition, the code that goes to the browser can be more optimized and smaller
 *
 * Abstractions are powerful things, with small modifications this function can be more efficient
 * - const getData = (obj, defaultValue) => get(obj, 'data', defaultValue)
 * seet https://lodash.com/docs#get for more details
 */
function getData(obj) {
  return get(obj, 'data');
}

function appendRecursive(form, data, wrapper = null) {
  for (const key in data) {
    if (!Object.prototype.hasOwnProperty.call(data, key)) return;

    const value = data[key];

    if (value === undefined) continue;

    if (value && (typeof value === 'object') && !(value instanceof File)) {
      appendRecursive(form, value, wrapper ? `${wrapper}[${key}]` : key);
    } else {
      form.append(wrapper ? `${wrapper}[${key}]` : key, value);
    }
  }

  // eslint-disable-next-line
  return form;
}

function getFormData(data) {
  return appendRecursive(new FormData(), data);
}

function getOptions(options) {
  options = { ...DEFAULTS, ...options };
  const {
    url,
    formDataConvert,
    axiosConfig,
    params,
    data,
  } = options;

  const resultUrl = url;
  const resultData = formDataConvert ? getFormData(data) : data;
  const resultAxiosConfig = cloneDeep(axiosConfig);

  if (resultAxiosConfig.responseType === 'blob') {
    options.dataAbstraction = false;
  }

  if (params) {
    resultAxiosConfig.params = removeEmpty(params, true);
  }

  try {
    if (resultUrl.includes('undefined')) {
      throw new Error('Undefined found in url. Services/http');
    }

    if (resultUrl.includes('[object Object]')) {
      throw new Error('Object found in url. Services/http');
    }
  } catch (e) {
    console.error(e);
  }

  return {
    ...options,
    resultAxiosConfig,
    resultData,
    resultUrl,
  };
}

function onResponse(res, resOptions) {
  return resOptions.dataAbstraction ? getData(res) : res;
}

const instance = {
  get: (url, config) =>
    url ? Promise.resolve({ data: 'getDataTest' }) : Promise.reject({ response: { status: 401 } }),
  delete: (url, config) => url ? Promise.resolve({ data: 'deleteDataTest' }) : Promise.reject({ response: null, request: 'something' }),
  post: (url, config, data) => Promise.resolve(data),
  put: (url, config, data) => Promise.resolve(data),
  patch: (url, config, data) => Promise.resolve(data),
};

export function requester(method, url, params = {}, data = {}, options = {}) {
  if (['get', 'delete'].includes(method)) {
    params = (data && typeof data === 'object') ? { ...params, ...data } : params;
    data = undefined;
  } else if (['put', 'patch'].includes(method)) {
    keys(data).forEach(key => {
      data[key] = isNil(data[key]) ? null : data[key];
    });

    if (options.formDataConvert) {
      data = { _method: method, ...data };
      method = 'post';
    }
  }

  options = getOptions({ url, params, data, ...options });

  return instance[method](options.resultUrl, options.resultAxiosConfig, options.resultData)
    .then((res) => onResponse(res, options))
    .catch(error => {
      const { response, request, message } = error;

      if (response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        // console.log(response.data);
        // console.log(response.headers);

        switch (response.status) {
          case 401:
            throw new Error('accessToken expired or unauthorized').message;
          default:
        }

        if (options.showAlerts) setErrorToast(response);
      } else if (request) {
        throw new Error('The request was made but no response was received').message;
      } else {
        throw new Error('Something happened in setting up the request that triggered an Error');
      }
      throw error;
    });
}
