import request from '@/utils/request';
import * as API from '@/api';

export async function query(params) {
  return request(API.User.Base, {
    params,
  });
}

export async function get(params) {
  return request(`${API.User.Detail}?id=${params.id}`);
}

export async function create(params) {
  return request(API.User.Submit, {
    method: 'POST',
    data: params,
  });
}

export async function remove(params) {
  return request(API.User.Delete, {
    method: 'DELETE',
    data: params,
  });
}

export async function update(params) {
  return request(API.User.Submit, {
    method: 'POST',
    data: params,
  });
}

export async function resetp(params) {
  return request(API.User.Reset, {
    method: 'POST',
    data: params,
  });
}

export async function disable(params) {
  return request(API.User.Submit, {
    method: 'POST',
    data: params,
  });
}

export async function enable(params) {
  return request(API.User.Submit, {
    method: 'POST',
    data: params,
  });
}

export async function queryNotices() {
  return request('/api/notices');
}
