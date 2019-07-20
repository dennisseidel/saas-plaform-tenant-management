# SCS Components

* `/infrastructure`: including databases, usw. and the config file of the current state
* `/servcice`: including service configs (e.g. serverless.yaml), infrastructure (e.g. container for serverless functions - should be replacable e.g. with Docker), business (business logic functions)
* `/scripts`: scripts to e.g. deploy infrastructure, build and deploy/release service
* `/ui`: include the ui component
* `api-swagger?`: where? ui? integration with serverless framework? api first?
* `README.md`: ...

# Serverless with typescript

* https://www.jamestharpe.com/serverless-typescript-getting-started/ 
* https://github.com/prisma/serverless-plugin-typescript


Install the serverless framework:

```bash
npm install -g serverless
# or update global pacakage
npm update -g
```

Create service:

```bash
mkdir service && cd service && serverless create --template aws-nodejs-typescript && npm install
```

Invoke locally

```bash
sls invoke locally -f hello
```

Deploy:

```bash
sls deploy -v
```

Remove:

```bash
sls remove
```
