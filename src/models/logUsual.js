import { get, query, remove } from '@/services/logUsual';

const Model = {
  namespace: 'logUsual',
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
      return {
        ...state,
        data: payload,
      };
    },
  },
};
export default Model;
