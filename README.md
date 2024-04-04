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
helm upgrade --install ingress-nginx ingress-nginx --repo https://kubernetes.github.io/ingress-nginx --namespace ingress-nginx --create-namespace
```

Deploy to Dev
```
helm install node-auth-server ./helm --values ./helm/values-dev.yaml
```

Deploy to Test
```
helm install node-auth-server ./helm --values values-test.yaml
```

Deploy to Prod
```
helm install node-auth-server ./helm --values values-prod.yaml
```



# FOR FIRST RUN

helm install app-release-name ./
helm install app-release-name ./ --values ./values.yaml

# FOR SECOND RUN

helm upgrade app-release-name ./helm

# DELETE

helm uninstall app-release-name

# DEPLOYMENT
helm install node-app-default ./helm
helm install node-app-dev ./helm --values values-dev.yaml
helm install node-app-test ./helm --values values-test.yaml
helm install node-app-prod ./helm --values values-prod.yaml

# UPGRADE
helm upgrade node-app-default ./helm

# ADDING NGINX INGRESS CONTROLLER
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx

# INSTALLING NGINX INGRESS CONTROLLER
helm upgrade --install ingress-nginx ingress-nginx --repo https://kubernetes.github.io/ingress-nginx --namespace ingress-nginx --create-namespace

# DELETE ALL NGINX INGRESS CONTROLLER RESOURCE
kubectl delete all  --all -n ingress-nginx