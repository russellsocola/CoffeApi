const { DynamoDBClient, GetItemCommand, DeleteItemCommand, ScanCommand, UpdateItemCommand } = require("@aws-sdk/client-dynamodb");//Centralizo requerimientos
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

// Exporto el cliente y Comandos que necesitan mis lambdas
module.exports = {
  ddbDocClient,
  PutCommand,
  GetItemCommand,
  DeleteItemCommand,
  ScanCommand,
  UpdateItemCommand,
};