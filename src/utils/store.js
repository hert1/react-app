const accessTokenKey = 'access_token';

export default class store {
  static active = false;
  // 设定访问令牌
  static setAccessToken(data) {
    this.active = true;
    sessionStorage.setItem(accessTokenKey, data.token);
  }

  // 获取访问令牌
  static getAccessToken() {
    const token = sessionStorage.getItem(accessTokenKey);
    if (!token || token === '') {
      return null;
    }
    return token;
  }

  // 清空访问令牌
  static clearAccessToken() {
    this.active = false;
    sessionStorage.removeItem(accessTokenKey);
  }
}
