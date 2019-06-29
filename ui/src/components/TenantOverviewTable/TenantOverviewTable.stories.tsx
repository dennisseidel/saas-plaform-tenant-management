import { storiesOf } from "@storybook/react";
import * as React from "react";

import InfiniteListExample from "./TenantOverviewTable";
storiesOf("Tenant Overview", module).add("default", () => (
  <InfiniteListExample access_token="123" />
));
