import {
  Card, Form,
  Input, Button, Radio, Icon, Badge, Switch,
  Row, Col, Modal,
} from 'antd';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import moment from 'moment';
import StandardTable from '@/components/StandardTable';
import UserEditor from './components/UserEditor';
import RoleSelect from './components/RoleSelect';
import styles from './style.less';

const { confirm } = Modal;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const statusMap = ['default', 'processing', 'error'];

/* eslint react/no-multi-comp:0 */
@connect(({ user, loading }) => ({
  user,
  loading: loading.models.user,
}))
class TableList extends Component {
  state = {
    editModalVisible: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
  };
  columns = [
    {
      title: formatMessage({
        id: 'user.field.parentName',
      }),
      dataIndex: 'parentName',
    },
    {
      title: formatMessage({
        id: 'user.field.account',
      }),
      dataIndex: 'account',
    },
    {
      title: formatMessage({
        id: 'user.field.userName',
      }),
      dataIndex: 'nickname',
      render(val, record) {
        return <Badge status={statusMap[record.status]} text={val}/>
      }
    },
    {
      title: formatMessage({
        id: 'user.field.roles',
      }),
      dataIndex: 'roleName',
    },
    {
      title: formatMessage({
        id: 'user.field.email',
      }),
      dataIndex: 'email',
    },
    {
      title: formatMessage({
        id: 'user.field.phone',
      }),
      dataIndex: 'phone',
    },
    {
      title: formatMessage({
        id: 'user.field.createdAt',
      }),
      dataIndex: 'createTime',
      render: val => <span>{moment(val)
        .format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: formatMessage({
        id: 'user.field.status',
      }),
      dataIndex: 'status',
      render: (val, record) => {
        return <Switch checkedChildren={formatMessage({
                          id: 'component.option.normal'
                        })}
                       unCheckedChildren={formatMessage({
                         id: 'component.option.ban'
                       })}
                       onChange={() => this.handleSwitchUserStatus(record)} checked={val === 1}/>;
      },
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/fetch',
    });
  }

  fetch = (formValues, reset) => {
    const { dispatch } = this.props;
    let payload = {};
    if (typeof reset === 'undefined' || reset !== true) {
      const { pagination, formValues: oldFormValues } = this.state;
      formValues = { ...oldFormValues, ...formValues };
      payload = {
        ...pagination,
        ...formValues,
      }
    } else {
      payload = formValues;
    }
    dispatch({
      type: 'user/fetch',
      payload,
      success: () => this.setState({ formValues, selectedRows: [] }),
    });
  };

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

  handleEditModalVisible = flag => {
    this.setState({
      editModalVisible: !!flag,
    });
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

      let roleId = '';
      if (fieldsValue.role_ids) {
        roleId = fieldsValue.role_ids.map(v => v.role_id).join(',');
      }
      const values = {
        ...fieldsValue,
        roleId,
      };
      this.fetch(values, true);
    });
  };

  handleSwitchUserStatus = record => {
    const { dispatch } = this.props;
    let type;
    if (record.status === 1) {
      type = 'user/disable';
      record.status = 2;
    } else {
      type = 'user/enable';
      record.status = 1;
    }
    dispatch({
      type: type,
      payload: record,
    });
  };

  handleEdit = fields => {
    const { formType } = this.state;
    const { dispatch } = this.props;
    if (formType !== 'E') fields.id = null;
    dispatch({
      type: formType === 'E' ? 'user/update' : 'user/add',
      payload: fields,
      success: () => {
        this.fetch();
        this.handleEditModalVisible();
      },
    });
  };

  handleEditClick = formType => {
    if (formType === 'E') {
      const { selectedRows } = this.state;
      const { dispatch } = this.props;
      dispatch({
        type: 'user/get',
        payload: selectedRows[0],
        success: data => {
          this.setState({
            editModalVisible: true,
            formType,
            stepFormValues: data,
          });
        }
      });
    } else {
      this.setState({
        editModalVisible: true,
        formType,
      });
    }
  };

  handleDisableUsers = records => {
    for (let record of records) {
      record.status = 2;
      const { dispatch } = this.props;
      dispatch({
        type: 'user/disable',
        payload: record,
      });
    }
  };

  handleEnableUsers = records => {
    for (let record of records) {
      record.status = 1;
      const { dispatch } = this.props;
      dispatch({
        type: 'user/enable',
        payload: record,
      });
    }
  };

  handleDelClick = () => {
    const { selectedRows } = this.state;
    const selectName = selectedRows.map(i => i.nickname);
    const selectId = selectedRows.map(i => i.id);
    const modal = confirm({
      title: formatMessage({ id: 'user.operation.delete.refuse.confirm' }),
      content: (
        <React.Fragment>
          <span style={{
            marginBottom: '10px',
            display: 'block'
          }}>
            {formatMessage({ id: 'component.name:.content' }, { content: selectName })}
          </span>
        </React.Fragment>
      ),
      okText: formatMessage({ id: 'component.button.confirm' }),
      okType: 'danger',
      cancelText: formatMessage({ id: 'component.button.cancel' }),
      onOk: () => {
        const { dispatch } = this.props;
        dispatch({
          type: 'user/remove',
          payload: selectId,
          success: () => this.fetch(),
        });
      },
    });
  };

  handleResetPassword = () => {
    const { selectedRows } = this.state;
    const selectName = selectedRows.map(i => i.nickname);
    const selectId = selectedRows.map(i => i.id);
    const modal = confirm({
      title: formatMessage({ id: 'user.operation.resetPassword.refuse.confirm' }),
      content: (
        <React.Fragment>
          <span style={{
            marginBottom: '10px',
            display: 'block'
          }}>
            {formatMessage({ id: 'component.name:.content' }, { content: selectName })}
          </span>
        </React.Fragment>
      ),
      okText: formatMessage({ id: 'component.button.confirm' }),
      okType: 'danger',
      cancelText: formatMessage({ id: 'component.button.cancel' }),
      onOk: () => {
        const { dispatch } = this.props;
        dispatch({
          type: 'user/resetPassword',
          payload: selectId,
          success: () => this.fetch(),
        });
      },
    });
  };

  renderSearchForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch}>
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item label={formatMessage({ id: 'user.field.account'})}>
              {getFieldDecorator('account')
              (<Input placeholder={formatMessage({
                id: 'component.placeholder.content'
                }, {
                content: formatMessage({
                  id: 'user.field.account',
                }) })} />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label={formatMessage({ id: 'user.search.roles'})}>
              {getFieldDecorator('roleId')(<RoleSelect />)}</Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label={formatMessage({ id: 'user.field.phone'})}>
              {getFieldDecorator('phone')
              (<Input placeholder={formatMessage({
                id: 'component.placeholder.content'
              }, {
                content: formatMessage({
                  id: 'user.field.phone',
                }) })} />)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item label={formatMessage({ id: 'user.field.status'})}>
              {getFieldDecorator('status')(
                <Radio.Group>
                  <Radio value={0}><FormattedMessage id='component.option.all' /></Radio>
                  <Radio value={1}><FormattedMessage id='component.option.normal' /></Radio>
                  <Radio value={2}><FormattedMessage id='component.option.ban' /></Radio>
                </Radio.Group>
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <div style={{ overflow: 'hidden' }}>
              <span style={{ marginBottom: 24 }}>
                <Button type="primary" htmlType="submit">
                  <FormattedMessage id='component.searchList.search' />
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                  <FormattedMessage id='component.searchList.reset' />
                </Button>
              </span>
            </div>
          </Col>
        </Row>
      </Form>
    );
  }

  listOperate() {
    const {selectedRows} = this.state;
    return (
      <div>
        <Button icon="plus" type="primary" onClick={() => this.handleEditClick('A')}>
          <FormattedMessage id='component.operation.create' />
        </Button>
        {selectedRows.length > 0 && (
          <React.Fragment>
            {selectedRows.length === 1 ?
              <Button onClick={() => this.handleEditClick('E')}>
                <Icon type='edit'/>
                <FormattedMessage id='component.operation.edit' />
              </Button> : null}
            <Button onClick={() => this.handleEnableUsers(selectedRows)}>
              <Icon type='check'/>
              <FormattedMessage id='component.operation.enable' />
            </Button>
            <Button type='danger'
                    onClick={() => this.handleDisableUsers(selectedRows)}>
              <Icon type='stop'/>
              <FormattedMessage id='component.operation.disable' />
            </Button>
            <Button type='danger'
                    onClick={() => this.handleDelClick(selectedRows)}>
              <Icon type='delete'/>
              <FormattedMessage id='component.operation.delete' />
            </Button>
            <Button onClick={() => this.handleResetPassword(selectedRows)}>
              <Icon type='RedoOutlined'/>
              <FormattedMessage id='component.operation.resetPassword' />
            </Button>
          </React.Fragment>
        )}
      </div>
    )
  }

  render() {
    const {
      user: { data },
      loading,
    } = this.props;
    const { selectedRows, editModalVisible, formType, stepFormValues } = this.state;
    const parentMethods = {
      handleEdit: this.handleEdit,
      handleEditModalVisible: this.handleEditModalVisible,
      formType,
    };
    return (
      <PageHeaderWrapper>
        <StandardTable
          searchForm={this.renderSearchForm()}
          listOperate={this.listOperate()}
          selectedRows={selectedRows}
          loading={loading}
          data={data}
          columns={this.columns}
          onSelectRow={this.handleSelectRows}
          onChange={this.handleStandardTableChange}
        />
        <UserEditor {...parentMethods} editModalVisible={editModalVisible}
                    values={stepFormValues}/>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(TableList);
