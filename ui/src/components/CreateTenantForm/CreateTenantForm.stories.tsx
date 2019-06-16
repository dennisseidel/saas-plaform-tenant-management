import { storiesOf } from "@storybook/react";
import * as React from "react";

import CreateTenantForm from "./CreateTenantForm";
storiesOf("CreateForm", module).add("default", () => (
  <CreateTenantForm access_token="123" />
));
