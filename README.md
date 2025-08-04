# Coffee API - Serverless Framework

API REST sin servidor para manejar tipos de café usando AWS Lambda, DynamoDB y API Gateway.

---

## Descripción

Este proyecto implementa un backend serverless para gestionar cafés (crear, listar, etc.) usando:

- AWS Lambda (Node.js 20.x)
- DynamoDB para almacenamiento
- API Gateway (HTTP API)
- Serverless Framework para despliegues automáticos

---

## Estructura del proyecto


.
├── .github/                # Workflows de GitHub Actions (CI/CD)
├── .serverless/            # Archivos generados por Serverless Framework
├── node_modules/           # Dependencias de Node.js
├── services/               # Lambdas de la API (create, update, delete, get)
│   ├── createCoffee.js
│   ├── deleteCoffee.js
│   ├── getCoffeeById.js
│   ├── getCoffees.js
│   └── updateCoffee.js
├── test/                   # Tests unitarios de las Lambdas
│   ├── createCoffee.test.js
│   ├── deleteCoffee.test.js
│   ├── getCoffeeById.test.js
│   ├── getCoffees.test.js
│   └── updateCoffee.test.js
├── autodisploy.sh          # Script opcional para automatización del deploy
├── ddbclient.js            # Configuración del cliente DynamoDB
├── handler.js              # Handler base
├── package.json            # Configuración y scripts del proyecto Node.js
├── package-lock.json       # Lockfile para versiones consistentes
├── serverless.yml          # Configuración de Serverless Framework
└── README.md               # Este archivo


---

## Requisitos previos

- Tener una cuenta AWS con permisos para crear Lambda, DynamoDB, API Gateway
- Node.js (preferentemente 18+)
- Serverless Framework instalado globalmente (`npm install -g serverless`)
- Configurar credenciales AWS localmente (`serverless config credentials`)

---

## Instalación

```bash
1. Clonar el repositorio

git clone https://github.com/russellsocola/CoffeApi.git

2. Entrar al proyecto

cd CoffeApi

3. Instalar las dependencias necesarias
npm install

4. Desplegar el proyecto
serverless deploy

```