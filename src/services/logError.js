import request from '@/utils/request';
import * as API from '@/api';

export async function query(params) {
  return request(API.LogError.List, {
    params,
  });
}

export async function get(params) {
  return request(`${API.LogError.Detail}/?id=${params.id}`);
}

export async function remove(params) {
  return request(API.LogError.Delete, {
    method: 'POST',
    data: params,
  });
}
