const Domain = '.'; /* 使用当前域名留空 */
const BaseUrl = `${Domain}/api`;

export const Public = {
  Login: {
    Base: `${BaseUrl}/cloud-auth/auth/login`,
    Exit: `${BaseUrl}/cloud-auth/logout`,
    GetCaptcha: `${BaseUrl}/v1/pub/login/captchaid`,
    ResCaptcha: `${BaseUrl}/v1/pub/login/captcha`,
  },
  RefreshToken: `${BaseUrl}/v1/pub/refresh-token`,
  Current: {
    UpdatePassword:  `${BaseUrl}/cloud-base/user/update-password`,
    GetUserInfo:  `${BaseUrl}/cloud-auth/checkLogin`,
    QueryUserMenuTree:  `${BaseUrl}/cloud-base/menu/router`,
  }
};

export const Menu = {
  Base: `${BaseUrl}/cloud-base/menu/fetch`,
  Detail: `${BaseUrl}/cloud-base/menu/detail`,
  Submit: `${BaseUrl}/cloud-base/menu/submit`,
  Delete: `${BaseUrl}/cloud-base/menu/remove`,
  Tree: `${BaseUrl}/cloud-base/menu/tree`,
};

export const Role = {
  Submit: `${BaseUrl}/cloud-base/role/submit`,
  Base: `${BaseUrl}/cloud-base/role/list`,
  Select: `${BaseUrl}/cloud-base/roles.select`,
  Detail: `${BaseUrl}/cloud-base/role/detail`,
  Delete: `${BaseUrl}/cloud-base/role/remove`,
};

export const User = {
  Base: `${BaseUrl}/cloud-base/user/list`,
  Submit: `${BaseUrl}/cloud-base/user/submit`,
  Detail: `${BaseUrl}/cloud-base/user/detail`,
  Delete: `${BaseUrl}/cloud-base/user/remove`,
  Reset: `${BaseUrl}/cloud-base/user/reset-password`,
};

export const LogApi = {
  List: `${BaseUrl}/cloud-log/api/list`,
  Detail: `${BaseUrl}/cloud-log/api/detail`,
  Delete: `${BaseUrl}/cloud-log/api/remove`,
};

export const LogError = {
  List: `${BaseUrl}/cloud-log/error/list`,
  Detail: `${BaseUrl}/cloud-log/error/detail`,
  Delete: `${BaseUrl}/cloud-log/error/remove`,
};

export const LogUsual = {
  List: `${BaseUrl}/cloud-log/usual/list`,
  Detail: `${BaseUrl}/cloud-log/usual/detail`,
  Delete: `${BaseUrl}/cloud-log/usual/remove`,
};
