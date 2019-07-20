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

# add default subnets to rds private subnet group
resource "aws_db_subnet_group" "rds-private-subnet" {
  name       = "rds-private-subnet-group"
  subnet_ids = "${var.rds_subnets}"
}

resource "aws_rds_cluster" "tenant-management" {
  engine_mode          = "serverless"
  master_password      = "${var.mysql_password}"
  master_username      = "${var.mysql_username}"
  cluster_identifier   = "tenant-management"
  skip_final_snapshot  = true
  db_subnet_group_name = "${aws_db_subnet_group.rds-private-subnet.name}"
  scaling_configuration {
    auto_pause               = true
    max_capacity             = 1
    min_capacity             = 1
    seconds_until_auto_pause = 300
  }
}

output "tenant-management_db_arn" {
  value = "${aws_rds_cluster.tenant-management.arn}"
}

output "tenant-management_rds_secret_arn" {
  value = "${var.rds_secret_arn}"
}
