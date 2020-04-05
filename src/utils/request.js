/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { extend } from 'umi-request';
import { notification } from 'antd';
// import moment from 'moment';
import store from '@/utils/store';
// eslint-disable-next-line import/no-extraneous-dependencies
import { createHashHistory } from 'history'

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};
/**
 * 异常处理程序
 */

const errorHandler = error => {
  const { response, data } = error;

  if (data && data.error && data.error.message) {
    const { status, url } = response;
    notification.error({
      message: `请求错误 ${status}: ${url}`,
      description: data.error.message,
    });
  } else if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;

    notification.error({
      message: `请求错误 ${status}: ${url}`,
      description: errorText,
    });
  } else if (!response) {
    notification.error({
      description: '您的网络发生异常，无法连接服务器',
      message: '网络异常',
    });
  }

  return {
    response,
    data,
  };
};
/**
 * 配置request请求时的默认参数
 */

const request = extend({
  useCache: false,
  errorHandler,
  getResponse: true,
  // 默认错误处理
  // credentials: 'include', // 默认请求是否带上cookie
});

function getAccessToken() {
  return store.getAccessToken();
}

request.interceptors.request.use((url, options) => {
  const auth = getAccessToken();
  if (auth) {
    return {
      url,
      options: {
        ...options,
        interceptors: true,
        headers: {
          ...options.headers,
          'cloud-auth': `Bearer ${getAccessToken()}`,
        },
        params: {
          ...options.params,
        },
      },
    };
  }
    return { url, options };

});

// respone拦截器
request.interceptors.response.use(
  async (response) => {
    /**
     * 下面的注释为通过response自定义code来标示请求状态，当code返回如下情况为权限有问题，登出并返回到登录页
     * 如通过xmlhttprequest 状态码标识 逻辑可写在下面error中
     */
    const resp = await response.clone().json();
    if (!resp) {
      return response;
    }
    const {code, message} = resp;
    if (code !== 200) {
      if (code === 401) {
        notification.error({
          message: `请求错误 ${code}`,
          description: codeMessage[code],
        });
        store.clearAccessToken();
        createHashHistory().push( '/login')
      }
      notification.error({
        message: `请求错误 ${code}`,
        description: message || codeMessage[code],
      });
    }
    return response
  },
);
export default request;
