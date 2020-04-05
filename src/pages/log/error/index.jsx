import {
  Card, Form,
  Input, Button, Icon,
  Row, Col, Popover,
} from 'antd';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import StandardTable from '@/components/StandardTable';
import styles from './style.less';

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({ logError, loading }) => ({
  logError,
  loading: loading.models.logError,
}))
class LogError extends Component {
  state = {
    selectedRows: [],
    formValues: {},
  };

  columns = [
    {
      title: '请求url',
      dataIndex: 'requestUri',
    },
    {
      title: '方法类',
      dataIndex: 'methodClass',
    },
    {
      title: '方法名',
      dataIndex: 'methodName',
    },
    {
      title: '异常名',
      dataIndex: 'exceptionName',
    },
    {
      title: '异常消息',
      dataIndex: 'message',
      ellipsis: true
    },
    {
      title: '文件名',
      dataIndex: 'fileName',
    },
    {
      title: '代码行数',
      dataIndex: 'lineNumber',
    },
    {
      title: '堆栈信息',
      dataIndex: 'stackTrace',
      render: (text) => <Popover content={text} title="堆栈信息" trigger="hover"><a>详情</a></Popover>
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'logError/fetch',
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { formValues } = this.state;
    const filters = Object.keys(filtersArg)
      .reduce((obj, key) => {
        const newObj = { ...obj };
        newObj[key] = getValue(filtersArg[key]);
        return newObj;
      }, {});
    const params = {
      ...formValues,
      ...pagination,
      ...filters,
    };

    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    this.fetch(params);
  };

  handleFormReset = () => {
    const { form: { resetFields } } = this.props;
    resetFields();
    this.fetch({}, true);
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
      };
      this.fetch(values, true);
    });
  };

  fetch = (formValues, reset) => {
    const { dispatch } = this.props;
    let payload = {};
    if (typeof reset === 'undefined' || reset !== true) {
      const { pagination, formValues: oldFormValues } = this.state;
      formValues = { ...oldFormValues, ...formValues };
      payload = {
        ...pagination,
        ...formValues,
      };
    } else {
      payload = formValues;
    }
    dispatch({
      type: 'logError/fetch',
      payload,
      success: () => this.setState({ formValues, selectedRows: [] }),
    });
  };

  render() {
    const {
      logError: { data },
      loading,
    } = this.props;
    const { selectedRows } = this.state;

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              size="small"
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(LogError);
