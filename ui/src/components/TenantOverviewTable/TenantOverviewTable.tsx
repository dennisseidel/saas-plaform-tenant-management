import { List, message, Avatar, Spin, Tag } from "antd";
import axios from "axios";
import React from "react";

import config from "../../config.json";

interface ITenantOverviewProps {
  children?: React.ReactChild;
  access_token: string;
}

interface TenantOverviewState {
  data: tenant[];
  loading: boolean;
  hasMore: boolean;
  access_token: string;
}

type tenant = {
  tenantName: string;
  plan: string;
  tenantId: string;
  createdAt: number;
  role: string;
};

const tenantDataUrl = config.tenant_management_endpoint;

class InfiniteListExample extends React.Component<
  ITenantOverviewProps,
  TenantOverviewState
> {
  constructor(props: ITenantOverviewProps) {
    super(props);
    this.state = {
      data: [],
      loading: false,
      hasMore: true,
      access_token: props.access_token
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = async () => {
    const res: {
      data: {
        tenants: tenant[];
      };
    } = await axios.get(tenantDataUrl, {
      headers: {
        Authorization: `Bearer ${this.state.access_token}`
      }
    });
    console.log(res);

    this.setState({
      data: res.data.tenants
    });
  };

  render() {
    return (
      <div className="demo-infinite-container">
        <List
          dataSource={this.state.data}
          renderItem={(item: tenant) => (
            <List.Item
              key={item.tenantId}
              actions={[<a>manage users</a>, <a>delete</a>]}
            >
              <List.Item.Meta
                avatar={
                  <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                }
                title={<a href="https://ant.design">{item.tenantName}</a>}
                description={item.tenantId}
              />
              <div>
                <Tag color="red">{item.role}</Tag>
                <Tag color="green">{item.plan}</Tag>
              </div>
            </List.Item>
          )}
        />
      </div>
    );
  }
}

export default InfiniteListExample;
