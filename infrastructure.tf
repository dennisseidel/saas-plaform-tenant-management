provider "aws" {
  region = "${var.AWS_REGION}"
}

terraform {
  backend "s3" {
    bucket = "saas-platform-terraform-state"
    key    = "tenant-management/terraform.tfstate"
    region = "eu-central-1"
  }
}

data "template_file" "openapi_spec" {
  template = "${file("${path.module}/openapi.yaml")}"
  vars = {
    aws_lambda_function_create-tenant_arn = "${module.lambdas.aws_lambda_function_create-tenant_arn}"
  }
}

module "lambdas" {
  source = "./create-tenant"
}

resource "aws_api_gateway_rest_api" "tenant-management" {
  name        = "tenant-management"
  description = "Terraform Serverless Application Example"

  body = "${data.template_file.openapi_spec.rendered}"
}

resource "aws_api_gateway_deployment" "tenant-management" {
  rest_api_id = "${aws_api_gateway_rest_api.tenant-management.id}"
  stage_name  = "dev"
}

resource "aws_lambda_permission" "apigw" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = "${module.lambdas.aws_lambda_function_create-tenant_arn}"
  principal     = "apigateway.amazonaws.com"

  # The /*/* portion grants access from any method on any resource
  # within the API Gateway "REST API".
  source_arn = "${aws_api_gateway_deployment.tenant-management.execution_arn}/*/*"
}

output "base_url" {
  value = "${aws_api_gateway_deployment.tenant-management.invoke_url}"
}
