variable "AWS_REGION" {
  type    = "string"
  default = "us-east-1"
}

variable "mysql_username" {
  type    = "string"
  default = "admin"
}

variable "mysql_password" {
  type = "string"
}

variable "rds_subnets" {
  type = list(string)
}

variable "rds_secret_arn" {
  type = "string"
}
