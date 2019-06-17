#!/usr/bin/env python3
import os
import shutil
import boto3
import botocore

s3 = boto3.resource('s3')


def bucket_is_missing(bucket_name):
    try:
        s3.meta.client.head_bucket(Bucket=bucket_name)
        print("Bucket Exists!")
        return False
    except botocore.exceptions.ClientError as e:
        # If a client error is thrown, then check that it was a 404 error.
        # If it was a 404 error, then the bucket does not exist.
        error_code = int(e.response['Error']['Code'])
        if error_code == 403:
            print("Private Bucket. Forbidden Access!")
            return False
        elif error_code == 404:
            print("Bucket Does Not Exist!")
            return True


# create bucket
bucket_name = "saas-platform-lambda-repository"
if bucket_is_missing(bucket_name):
    s3.create_bucket(Bucket=bucket_name,
                     CreateBucketConfiguration={
                         'LocationConstraint': 'eu-central-1'})

# package lambda
file_name = 'example'
version = 'v1.0.0c'
dir_name = "./create-tenant"
shutil.make_archive(file_name, 'zip', dir_name)
# upload to s3
s3.Bucket(bucket_name).upload_file(
    Filename=f'{file_name}.zip', Key=f'{version}/{file_name}.zip')

bash_command = "terraform apply"
os.system(bash_command)
bash_command = "erraform output -json > ../ui/backend-config.json"
