import request from '@/utils/request';
import * as API from '@/api';

export async function query(params) {
  return request(API.Menu.Base, {
    params,
  });
}

export async function queryTree(params) {
  return request(API.Menu.Tree, {
    params,
  });
}

export async function get(params) {
  return request(`${API.Menu.Detail}/${params.id}`);
}


export async function create(params) {
  return request(API.Menu.Submit, {
    method: 'POST',
    data: params,
  });
}

export async function remove(params) {
  return request(API.Menu.Delete, {
    method: 'POST',
    data: params,
  });
}

export async function update(params) {
  return request(API.Menu.Submit, {
    method: 'POST',
    data: params,
  });
}
