import React, { PureComponent } from 'react';
import { Form, Input, Modal, message } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import md5 from 'md5';

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/updatePassword'],
}))
class UpdatePasswordDialog extends PureComponent {
  handleOK = () => {
    const { form, currentUser } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return;
      }
      if (values.newPassword !== values.confirmNewPassword) {
        message.warning(formatMessage({ id: 'user.password.notMatch' }));
        return;
      }

      const formData = {
        id: currentUser.id,
        oldPassword: md5(values.oldPassword),
        newPassword: md5(values.newPassword),
      };
      const { dispatch } = this.props;
      dispatch({
        type: 'login/updatePassword',
        payload: formData,
        success: this.handleCancel,
      });
    });
  };

  handleCancel = () => {
    const { onCancel } = this.props;
    if (onCancel) onCancel();
  };

  render() {
    const {
      visible,
      submitting,
      form: { getFieldDecorator },
    } = this.props;

    const formItemLayout = {
      labelCol: {
        span: 8,
      },
      wrapperCol: {
        span: 16,
      },
    };

    return (
      <Modal
        title={formatMessage({ id: 'user.password.change' })}
        width={600}
        visible={visible}
        maskClosable={false}
        confirmLoading={submitting}
        destroyOnClose
        onOk={this.handleOK}
        onCancel={this.handleCancel}
        okText={formatMessage({ id: 'user.password.update' })}
        style={{ top: 20 }}
        bodyStyle={{ maxHeight: 'calc( 100vh - 158px )', overflowY: 'auto' }}
      >
        <Form>
          <Form.Item {...formItemLayout} label={formatMessage({
            id: 'user.password.oldPassword',
          })}>
            {getFieldDecorator('oldPassword', {
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'component.placeholder.content' }, {
                    content: formatMessage({
                      id: 'user.password.oldPassword',
                    }),
                  }),
                },
              ],
            })(<Input type='password' placeholder={formatMessage({
              id: 'component.placeholder.content'
            }, {
              content: formatMessage({
                id: 'user.password.oldPassword',
              }),
            })} />)}
          </Form.Item>
          <Form.Item {...formItemLayout} label={formatMessage({
            id: 'user.password.newPassword',
          })}>
            {getFieldDecorator('newPassword', {
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'component.placeholder.content' }, {
                    content: formatMessage({
                      id: 'user.password.newPassword',
                    }),
                  }),
                },
              ],
            })(<Input type='password' placeholder={formatMessage({
              id: 'component.placeholder.content'
            }, {
              content: formatMessage({
                id: 'user.password.newPassword',
              }),
            })} />)}
          </Form.Item>
          <Form.Item {...formItemLayout} label={formatMessage({
            id: 'user.password.confirmPassword',
          })}>
            {getFieldDecorator('confirmNewPassword', {
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'component.placeholder.content' }, {
                    content: formatMessage({
                      id: 'user.password.confirmPassword',
                    }),
                  }),
                },
              ],
            })(<Input type='password' placeholder={formatMessage({
              id: 'component.placeholder.content'
            }, {
              content: formatMessage({
                id: 'user.password.confirmPassword',
              }),
            })} />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(UpdatePasswordDialog);
