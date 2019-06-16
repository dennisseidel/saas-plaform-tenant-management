import React from "react";
import { Form, Icon, Input, Button, Select } from "antd";
import { FormComponentProps } from "antd/lib/form";

const { Option } = Select;

// https://ant.design/components/form/#Using-in-TypeScriptg
// https://stackoverflow.com/questions/44898248/how-to-use-antd-form-create-in-typescript
export interface ICreateTenantFormProps extends FormComponentProps {
  children?: React.ReactChild;
  products?: Array<String>; // might be used to display the available products, must they exist before the form is initialized? No so better use component state instead of props?
  access_token: string; // access token to create the tenant in the user context
}

class CreateTenantForm extends React.Component<ICreateTenantFormProps> {
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log(
          `Received values of form: ${values}, with access_token: ${
            this.props.access_token
          }`
        );
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className="createtenant-form">
        <Form.Item>
          {getFieldDecorator("tenantname", {
            rules: [
              { required: true, message: "Please input your tenantname!" }
            ]
          })(
            <Input
              prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />}
              placeholder="Tenantname"
            />
          )}
        </Form.Item>
        <Form.Item hasFeedback>
          {getFieldDecorator("select", {
            rules: [
              { required: true, message: "Please select your product tier!" }
            ]
          })(
            <Select placeholder="Please select your product tier">
              <Option value="free">Free</Option>
              <Option value="premium">Premium</Option>
            </Select>
          )}
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="createtenant-form-button"
          >
            Create Tenant
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

const WrappedCreateTenantForm = Form.create<ICreateTenantFormProps>({
  name: "create_tenant"
})(CreateTenantForm);

export default WrappedCreateTenantForm;
