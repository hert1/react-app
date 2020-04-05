import { Card, Table} from 'antd';
import React, { Component } from 'react';
import styles from './index.less';
import {formatMessage } from 'umi-plugin-react/locale';

class StandardTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
    };
  }

  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    const currySelectedRowKeys = selectedRowKeys;
    const { onSelectRow } = this.props;
    if (onSelectRow) {
      onSelectRow(selectedRows);
    }
    this.setState({
      selectedRowKeys: currySelectedRowKeys,
    });
  };

  handleTableChange = (pagination, filters, sorter, ...rest) => {
    const { onChange } = this.props;

    if (onChange) {
      onChange(pagination, filters, sorter, ...rest);
    }
  };

  render() {
    const { selectedRowKeys } = this.state;
    const { selectedRows, data, rowKey, searchForm, listOperate, ...rest  } = this.props;
    const { records = [], pagination = false } = data || {};
    const paginationProps = pagination ? {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
      showTotal: total => formatMessage({
        id: 'component.searchList.result.total'
      }, {total}),
    } : false;
    const rowSelection = {
      selectedRowKeys: selectedRows && selectedRows.length === 0 ? [] : selectedRowKeys,
      onChange: this.handleRowSelectChange,
      getCheckboxProps: record => ({
        disabled: record.disabled,
      }),
    };
    return (
      <Card bordered={false}>
        <div className={styles.tableList}>
          {searchForm ? <div className={styles.tableListForm}>{searchForm}</div> : null}
          {listOperate ? <div className={styles.tableListOperator}>{listOperate}</div> : null}
          <div className={styles.standardTable}>
            <Table
              rowKey={rowKey || 'key'}
              rowSelection={rowSelection}
              dataSource={records}
              pagination={paginationProps}
              onChange={this.handleTableChange}
              {...rest}
            />
          </div>
        </div>
      </Card>
    );
  }
}

export default StandardTable;
