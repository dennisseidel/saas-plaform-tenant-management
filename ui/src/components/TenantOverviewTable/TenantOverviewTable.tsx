import { List, message, Avatar, Spin } from "antd";
import reqwest from "reqwest";
import React from "react";

import InfiniteScroll from "react-infinite-scroller";
import { access } from "fs";
import { inflateRaw } from "zlib";

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
};

const fakeDataUrl =
  "https://randomuser.me/api/?results=5&inc=name,gender,email,nat&noinfo";

const tenantDataUrl =
  "https://2wifthija8.execute-api.eu-central-1.amazonaws.com/dev/tenants";

const tenantData = {
  tenants: [
    {
      tenantName: "NovaTeam2",
      plan: "premium",
      createdAt: 1561636461699,
      role: "tenant-admin",
      userId: "115c128e-ecf8-41ba-b6ff-8c419d2ce21f",
      tenantId: "4d2efd30-98d2-11e9-b698-81fb57414177"
    },
    {
      tenantName: "NovaTeam3",
      plan: "premium",
      createdAt: 1561636462676,
      role: "tenant-admin",
      userId: "115c128e-ecf8-41ba-b6ff-8c419d2ce21f",
      tenantId: "4dc41140-98d2-11e9-b698-81fb57414177"
    }
  ]
};

class InfiniteListExample extends React.Component<
  ITenantOverviewProps,
  TenantOverviewState
> {
  constructor(props: ITenantOverviewProps) {
    super(props);
    // Don't call this.setState() here!
    this.state = {
      data: [],
      loading: false,
      hasMore: true,
      access_token: props.access_token
    };
  }

  componentDidMount() {
    this.fetchData(res => {
      this.setState({
        data: tenantData.tenants
      });
    });
  }

  fetchData = callback => {
    reqwest({
      url: fakeDataUrl,
      type: "json",
      method: "get",
      contentType: "application/json",
      success: res => {
        callback(res);
      }
    });
  };

  handleInfiniteOnLoad = () => {
    let { data } = this.state;
    this.setState({
      loading: true
    });
    if (data.length > 14) {
      message.warning("Infinite List loaded all");
      this.setState({
        hasMore: false,
        loading: false
      });
      return;
    }
    this.fetchData(res => {
      data = data.concat(res.results);
      this.setState({
        data,
        loading: false
      });
    });
  };

  render() {
    return (
      <div className="demo-infinite-container">
        <InfiniteScroll
          initialLoad={false}
          pageStart={0}
          loadMore={this.handleInfiniteOnLoad}
          hasMore={!this.state.loading && this.state.hasMore}
          useWindow={false}
        >
          <List
            dataSource={this.state.data}
            renderItem={(item: tenant) => (
              <List.Item key={item.tenantId}>
                <List.Item.Meta
                  avatar={
                    <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                  }
                  title={<a href="https://ant.design">{item.tenantName}</a>}
                  description={item.tenantId}
                />
                <div>Content</div>
              </List.Item>
            )}
          >
            {this.state.loading && this.state.hasMore && (
              <div className="demo-loading-container">
                <Spin />
              </div>
            )}
          </List>
        </InfiniteScroll>
      </div>
    );
  }
}

export default InfiniteListExample;
