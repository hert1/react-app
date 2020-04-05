import request from '@/utils/request';
import * as API from '@/api';

export async function query(params) {
  return request(API.LogUsual.List, {
    params,
  });
}

export async function get(params) {
  return request(`${API.LogUsual.Detail}/?id=${params.id}`);
}

export async function remove(params) {
  return request(API.LogUsual.Delete, {
    method: 'POST',
    data: params,
  });
}
