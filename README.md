<p align="center">
  <img src="https://github.com/node-auth/node-auth-server/assets/25092979/1c124b8a-391e-484a-809d-f06017a801fe" width="150px" height="150px">
</p>

<div align="center">
  <h1>node-auth</h1>
</div>
<p align="center">Node Auth is an open source authentication solution built with nodejs</p>
<p align="center">v.0.1.0</p>

## Features

- Authentication with JWT
- Oauth2 Authentication
- Authorization Code Grant
- Resource Owner Password Credentials Grant
- Client Credentials Grant
- Refresh Token Grant


## Setup

### Install dependencies

```
$ npm install
```

### Migrate database

```
$ npx sequelize db:migrate
```

### Seed initial data

Copy the script from `config/db/initial.sql`


### Deploy on Kubernetes

Add Ingress Controller
```
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
```

Deploy to Dev
```
helm install node-auth-server ./helm --values values-dev.yaml
```

Deploy to Test
```
helm install node-auth-server ./helm --values values-test.yaml
```

Deploy to Prod
```
helm install node-auth-server ./helm --values values-prod.yaml
```