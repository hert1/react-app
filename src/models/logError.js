import { get, query, remove } from '@/services/logError';

const Model = {
  namespace: 'logError',
  state: {
    data: {
      records: [],
      pagination: {},
    },
  },
  effects: {
    *fetch({ payload, success }, { call, put }) {
      const { response, data } = yield call(query, payload);
      if (response.status === 200) {
        yield put({
          type: 'save',
          payload: data.data,
        });
        if (success) success(data.data);
      }
    },

    *get({ payload, success }, { call }) {
      const { response, data } = yield call(get, payload);
      if (response.status === 200) {
        if (success) success(data.data);
      }
    },

    *remove({ payload, success }, { call, put }) {
      const { response } = yield call(remove, payload);
      if (response.status === 200) {
        yield put({ type: 'global/requestSuccess', payload: {
            id: 'role(s)', action: 'delete',
          }});
        if (success) success();
      }
    },
  },
  reducers: {
    save(state, { payload }) {
      if (payload.records && payload.size && payload.total && payload.current) {
        // 处理分页
        payload.pagination = {pageSize: payload.size, total: payload.total, current: payload.current};
      }
      return {
        ...state,
        data: payload,
      };
    },
  },
};
export default Model;
