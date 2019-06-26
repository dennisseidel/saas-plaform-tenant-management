# https://medium.com/swlh/integrating-the-serverless-framework-and-terraform-874215daa8bf

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

locals {
  service_name = "tenant-management"
  #service_stage = "${terraform.workspace}"
  service_stage = "dev"
}


# db
resource "aws_dynamodb_table" "tenant-management" {
  name         = "TenantManagement"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "tenantId"

  attribute {
    name = "tenantId"
    type = "S"
  }
}

resource "aws_ssm_parameter" "tenant-management-db" {
  name  = "/${local.service_name}-${local.service_stage}/db"
  type  = "String"
  value = "${aws_dynamodb_table.tenant-management.name}"
}

output "tenant-management_db_name" {
  value = "${aws_dynamodb_table.tenant-management.name}"
}

output "tenant-management_db_arn" {
  value = "${aws_dynamodb_table.tenant-management.arn}"
}


