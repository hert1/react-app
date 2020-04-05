import { Form, Table } from 'antd';
import React, { PureComponent } from 'react';
import { EditableCell } from './EditableCell';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';

@connect(({ menu, loading }) => ({
  menu,
  loading: loading.models.menu,
}))
class Index extends PureComponent {
  constructor(props) {
    super(props);

    this.columns = [
      {
        title: formatMessage({ id: 'menu.name' }),
        dataIndex: 'name',
        width: '30%',
      },
      {
        title: formatMessage({ id: 'menu.resource.perm' }),
        dataIndex: 'resources',
        editable: true,
        width: '40%',
      },
    ];

    this.state = {
      menuData: [],
      dataSource: props.value || [],
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/fetchTree',
      payload: {
        includeActions: 1,
        includeResources: 1,
      },
      success: list => {
        this.setState({ menuData: this.fillData(list) });
      }
    });
  }

  static getDerivedStateFromProps(nextProps, state) {
    if ('value' in nextProps) {
      return {
        ...state,
        dataSource: nextProps.value || [],
      };
    }
    return state;
  }

  fillData = data => {
    const newData = [...data];
    for (let i = 0; i < newData.length; i += 1) {
      const { children } = newData[i];
      const item = { ...newData[i], hasChild: children && children.length > 0 };
      if (item.hasChild) {
        item.children = this.fillData(children);
      }
      newData[i] = item;
    }
    return newData;
  };

  handleSave = (record, dataIndex, values) => {
    const { dataSource } = this.state;
    const data = [...dataSource];
    const index = data.findIndex(item => item.id === record.id);
    let item = data[index];
    if (!item) {
      item = {
        id: record.id,
        dataIndex: values,
      };
    } else {
      item[dataIndex] = values;
    }
    data.splice(index, 1, {
      ...item,
    });
    this.setState({ dataSource: data }, () => {
      this.triggerChange(data);
    });
  };

  triggerChange = data => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(data);
    }
  };

  expandAllChild = data => {
    let child = [];
    for (let i = 0; i < data.length; i += 1) {
      child.push(data[i].id);
      if (data[i].children) {
        child.push(...this.expandAllChild(data[i].children));
      }
    }
    return child;
  };

  checkAndAdd = (data, addData) => {
    const set = new Set();
    data.map(i => set.add(i));
    addData.map(i => set.add(i));
    return Array.from(set);
  };

  cancelSelected = (data, selectedRows) => {
    return data.filter(i => selectedRows.indexOf(i) === -1);
  };

  handleSelectedRow = (record, selected) => {
    let selectedRows = [];
    if (record.children) {
       selectedRows = this.expandAllChild(record.children);
    }
    selectedRows.push(record.id);
    const { dataSource } = this.state;
    let list = [];
    if (selected) {
      list = this.checkAndAdd(dataSource, selectedRows);
    } else {
      list = this.cancelSelected(dataSource, selectedRows);
    }
    this.setState({ dataSource: list }, () => {
      this.triggerChange(list);
    });
  };

  handleSelectAll = (selected, selectRows) => {
    let list = [];
    if (selected) {
      list = selectRows.map(vv => {
        return vv.id;
      });
    }
    this.setState({ dataSource: list }, () => {
      this.triggerChange(list);
    });
  };

  render() {
    const { dataSource, menuData } = this.state;
    const components = {
      body: {
        cell: EditableCell,
      },
    };
    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          data: dataSource,
          dataIndex: col.dataIndex,
          handleSave: this.handleSave,
        }),
      };
    });

    return (
      menuData.length > 0 && (
        <Table
          bordered
          defaultExpandAllRows
          rowSelection={{
            selectedRowKeys: dataSource,
            onSelect: this.handleSelectedRow,
            onSelectAll: this.handleSelectAll,
          }}
          rowKey={record => record.id}
          dataSource={menuData}
          columns={columns}
          pagination={false}
        />
      )
    );
  }
}

export default Form.create()(Index);
