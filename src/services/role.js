import request from '@/utils/request';
import * as API from '@/api';

export async function query(params) {
  return request(API.Role.Base, {
    params,
  });
}

export async function get(params) {
  return request(`${API.Role.Detail}/${params.id}`);
}

export async function create(params) {
  return request(API.Role.Submit, {
    method: 'POST',
    data: params,
  });
}

export async function remove(params) {
  return request(API.Role.Delete, {
    method: 'POST',
    data: params,
  });
}

export async function update(params) {
  return request(API.Role.Submit, {
    method: 'POST',
    data: params,
  });
}

export async function disable(params) {
  return request(`${API.Role.Base}/${params.record_id}/disable`, {
    method: 'PATCH',
  });
}

export async function enable(params) {
  return request(`${API.Role.Base}/${params.record_id}/enable`, {
    method: 'PATCH',
  });
}
