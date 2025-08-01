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

├── services/ # Funciones Lambda (createCoffee, createAmericano, etc.)
├── handler.js # Handler general o de funciones simples
├── serverless.yml # Configuración de Serverless Framework
├── package.json # Dependencias y scripts de Node.js
├── package-lock.json # Lockfile para versiones consistentes
└── README.md # Este archivo

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

cd CoffeApi

npm install

serverless deploy

```