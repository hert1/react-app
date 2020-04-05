import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import { Card, Typography, Alert } from 'antd';
import styles from './Welcome.less';

const { Title } = Typography;

export default () => (
  <PageHeaderWrapper>
    <Card>
      <Title style={{marginTop: '200px',marginBottom: '200px',textAlign: 'center'}}>react-app</Title>
    </Card>
  </PageHeaderWrapper>
);
