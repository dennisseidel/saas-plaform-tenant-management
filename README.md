# saas-platform-tenant-management

_Self contained Component that mange the tenant of a SaaS Platform_

## Content

- `azure-pipelines.yml`: CI/CD pipeline to deploy all components based on the following files
- `deploy.py` & `requirements.txt`: Deployment script that build the components and deploys them.
- `infratructure.tf`: Terraform file to setup the infrastructure, including refrences to all other modules like `./create-tenant/infrastructure.tf`
- `openapi.yaml`: API specification of all functions included as well as a mapping between the api gateway and the lambda functions through annotations.
- `./create-tenant`: Function to create the tenant
- `./ui`: Ui component to create a tenant.

## Getting Started

### Prerequisites

```
- AWS Account
```

### Deploy

#### Locally

A step by step series of examples that tell you have to get a development env running

Install prerequisits

```
virtualenv venv
source venv/bin/activate
pip3 install -r requirements.txt
```

Execute deploy script

```
python deploy.py
```

End with an example of getting some data out of the system or using it for a little demo

### CICD

TODO:tbd

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our process for submitting pull requests to us.

### Develop

1. Create a new lambda function: `den repo:addfunction`
2. Add required infrastructure (e.g. new db) to `./infrastructure.tf` update/add configs (e.g. new iam permissions) to `./new-function/infrastructure.tf`
3. Extend the API in `./openapi.yaml` and wire up the lambda functions
4. Extend the UI Components in `./ui` using `npm run storybook`.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/denseidel/saas-platform-tenant-management/tags).

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
