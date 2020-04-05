import {
  Card, Form,
  Input, InputNumber, Tooltip, Icon, Radio, TreeSelect,
  Modal,
  Row, Col,
} from 'antd';
import React, { Component } from 'react';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';

import MenuAction from './MenuAction';
import MenuResource from './MenuResource';

class MenuEditor extends Component {
  static defaultProps = {
    handleEdit: () => {},
    handleEditModalVisible: () => {},
    values: {},
  };

  formItemLayout = {
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 18,
    },
  };

  handleSubmit = () => {
    const { form, handleEdit, values: oldValue } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const formValues = { ...oldValue, ...fieldsValue };
     // formValues.resources = formValues.resources && formValues.resources.length ? JSON.stringify(formValues.resources) : null;
      this.setState(
        {
          formValues,
        },
        () => {
          handleEdit(formValues);
        },
      );
    });
  };

  toTreeSelect = data => {
    if (!data) {
      return [];
    }
    const newData = [];
    for (let i = 0; i < data.length; i += 1) {
      const item = { ...data[i], title: data[i].name, value: data[i].id };
      if (item.children && item.children.length > 0) {
        item.children = this.toTreeSelect(item.children);
      }
      newData.push(item);
    }
    return newData;
  };

  render() {
    const {
      editModalVisible, handleEditModalVisible,
      formType, treeData, values, form,
      form: { getFieldDecorator },
    } = this.props;

    return (
      <Modal
        title={formType === 'A' ?
          formatMessage({ id: 'component.operation.create' }) :
          formatMessage({ id: 'component.operation.update' })}
        width={900}
        visible={editModalVisible}
        destroyOnClose
        onCancel={() => handleEditModalVisible(false, values)}
        onOk={this.handleSubmit}
        afterClose={() => handleEditModalVisible()}
        style={{ top: 20 }}
        bodyStyle={{
          maxHeight: 'calc( 100vh - 158px )',
          overflowY: 'auto'
        }}
      >
        <Card bordered={false}>
          <Form>
            <Row>
              <Col span={12}>
                <Form.Item {...this.formItemLayout} label={formatMessage({
                  id: 'menu.field.name',
                })}>
                  {getFieldDecorator('name', {
                    initialValue: formType === 'A' ? null : values.name,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({ id: 'component.placeholder.content' }, {
                          content: formatMessage({
                            id: 'menu.field.name',
                          }),
                        }),
                      },
                    ],
                  })(<Input placeholder={
                    formatMessage({ id: 'component.placeholder' })} />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...this.formItemLayout} label={formatMessage({
                  id: 'menu.field.parentID',
                })}>
                  {getFieldDecorator('parentId', {
                    initialValue: formType === 'A' ? null : values.parentId,
                  })(
                    <TreeSelect
                      showSearch
                      treeNodeFilterProp="title"
                      style={{ width: '100%' }}
                      dropdownStyle={{
                        maxHeight: 400,
                        overflow: 'auto'
                      }}
                      treeData={this.toTreeSelect(treeData)}
                      placeholder={formatMessage({
                        id: 'menu.field.parentID.none',
                      })}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item {...this.formItemLayout} label={formatMessage({
                  id: 'menu.field.icon',
                })}>
                  <Row>
                    <Col span={20}>
                      {getFieldDecorator('icon', {
                        initialValue: formType === 'A' ? null : values.icon,
                        rules: [
                          {
                            required: true,
                            message: formatMessage({ id: 'component.placeholder.content' }, {
                              content: formatMessage({
                                id: 'menu.field.icon',
                              }),
                            }),
                          },
                        ],
                      })(<Input placeholder={formatMessage({
                        id: 'component.placeholder',
                      })}/>)}
                    </Col>
                    <Col span={4} style={{ textAlign: 'center' }}>
                      <Tooltip title={formatMessage({
                        id: 'component.icon.only.support.official',
                      })}>
                        <Icon type="question-circle"/>
                      </Tooltip>
                    </Col>
                  </Row>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...this.formItemLayout} label={formatMessage({
                  id: 'menu.field.router',
                })}>
                  {getFieldDecorator('path', {
                    initialValue: formType === 'A' ? null : values.path,
                  })(<Input placeholder={formatMessage({
                        id: 'component.placeholder',
                      })}/>)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item {...this.formItemLayout} label={formatMessage({
                  id: 'menu.field.sequence',
                })}>
                  <Row>
                    <Col span={20}>
                      {getFieldDecorator('sort', {
                        initialValue: formType === 'A' ? 1000000 : values.sort,
                        rules: [
                          {
                            required: true,
                            message: formatMessage({ id: 'component.placeholder.content' }, {
                              content: formatMessage({
                                id: 'menu.field.sequence',
                              }),
                            }),
                          },
                        ],
                      })(<InputNumber min={1} step={100} max={99999999} style={{ width: '100%' }} />)}
                    </Col>
                    <Col span={4} style={{ textAlign: 'center' }}>
                      <Tooltip title={formatMessage({
                        id: 'component.order.description.desc',
                      })}>
                        <Icon type="question-circle"/>
                      </Tooltip>
                    </Col>
                  </Row>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...this.formItemLayout} label={formatMessage({
                  id: 'menu.field.code',
                })}>
                  {getFieldDecorator('code', {
                    initialValue: formType === 'A' ? null : values.code,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({ id: 'component.placeholder.content' }, {
                          content: formatMessage({
                            id: 'menu.field.name',
                          }),
                        }),
                      },
                    ],
                  })(<Input placeholder={formatMessage({
                    id: 'component.placeholder',
                  })}/>)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item {...this.formItemLayout} label={formatMessage({
                  id: 'menu.field.category',
                })}>
                  {getFieldDecorator('category', {
                    initialValue: formType === 'A' ? 1 : values.category,
                  })(
                    <Radio.Group>
                      <Radio value={1}>
                        <FormattedMessage id='component.option.menu' />
                      </Radio>
                      <Radio value={2}>
                        <FormattedMessage id='component.option.button' />
                      </Radio>
                    </Radio.Group>
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...this.formItemLayout} label={formatMessage({
                  id: 'menu.field.hidden',
                })}>
                  {getFieldDecorator('hidden', {
                    initialValue: formType === 'A' ? 0 : values.hidden,
                  })(
                    <Radio.Group>
                      <Radio value={0}>
                        <FormattedMessage id='component.option.show' />
                      </Radio>
                      <Radio value={1}>
                        <FormattedMessage id='component.option.hidden' />
                      </Radio>
                    </Radio.Group>
                  )}
                </Form.Item>
              </Col>
            </Row>
            {form.getFieldValue('category') === 1 ?
            <Row>
              <Col span={24}>
                <Card bordered={false} title={formatMessage({
                  id: 'menu.action.title',
                })}>
                  {getFieldDecorator('actions', {
                    initialValue: formType === 'A' ? null : values.actions,
                  })(<MenuAction prefix = {form.getFieldValue('code')}/>)}
                </Card>
              </Col>
            </Row> : null}
            {form.getFieldValue('category') === 2 ?
            <Row>
              <Col span={24}>
                <Card bordered={false} title={formatMessage({
                  id: 'menu.resource.title',
                })}>
                  {getFieldDecorator('resourcesList', {
                    initialValue: formType === 'A' ? null : values.resourcesList,
                  })(<MenuResource prefix = {form.getFieldValue('code')}/>)}
                </Card>
              </Col>
            </Row> : null}
          </Form>
        </Card>
      </Modal>
    );
  }
}

export default Form.create()(MenuEditor);
