resource "aws_lambda_function" "create-tenant" {
  function_name = "create-tenant"

  # The bucket name as created earlier with "aws s3api create-bucket"
  s3_bucket = "saas-platform-lambda-repository"
  s3_key    = "v1.0.0c/example.zip"

  # "main" is the filename within the zip file (main.js) and "handler"
  # is the name of the property under which the handler function was
  # exported in that file.
  handler = "app.lambdaHandler"

  runtime = "nodejs8.10"

  role = "${aws_iam_role.create-tenant.arn}"
}

# IAM role which dictates what other AWS services the Lambda function
# may access.
resource "aws_iam_role" "create-tenant" {
  name = "create-tenant"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_iam_policy" "write_db" {
  name = "write_db_policy"
  path = "/"
  description = "My test policy"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "dynamodb:PutItem"
      ],
      "Effect": "Allow",
      "Resource": "*"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "write_db_attach_to_create_tenant_policy" {
  role       = "${aws_iam_role.create-tenant.name}"
  policy_arn = "${aws_iam_policy.write_db.arn}"
}

output "aws_lambda_function_create-tenant_arn" {
  value = "${aws_lambda_function.create-tenant.arn}"
}
