#!/usr/bin/env python3
import argparse
import os
import shutil
import boto3
import botocore


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
            print("Bucket Does Not Exist. Create bucket.")
            return True


parser = argparse.ArgumentParser()
parser.add_argument(
    "-a", "--action", help="Specify yor action either: build, deploy or destroy", default="deploy")
parser.add_argument("-ni", "--noninteractive", type=bool,
                    help="Auto approve the command.", default=False)
parser.add_argument("-c", "--component",
                    help="Specify which component to build/deploy/destroy: infrastructure, service", default="infrastructure")
args = parser.parse_args()

path_to_infrastructure = '../infrastructure'
path_to_service = '../service'
noninteractive = ''
if args.noninteractive:
    noninteractive = '-auto-approve'

if args.component == "infrastructure":
    if args.action == 'deploy':
        bash_command = f'cd {path_to_infrastructure} && terraform init && terraform apply {noninteractive}'
        os.system(bash_command)
        bash_command = f"cd {path_to_infrastructure} && terraform output -json | jq 'with_entries(.value |= .value)' > config.json"
        os.system(bash_command)
    if args.action == 'destroy':
        bash_command = f'cd {path_to_infrastructure} && terraform destroy {noninteractive}'
        os.system(bash_command)

if args.component == "service":
    if args.action == 'deploy':
        bash_command = f'cd {path_to_service} && sls deploy -v'
        os.system(bash_command)
    if args.action == 'destroy':
        bash_command = f'cd {path_to_service} && sls remove'
        os.system(bash_command)
