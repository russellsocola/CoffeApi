const { DynamoDBClient, GetItemCommand, UpdateItemCommand } = require("@aws-sdk/client-dynamodb");

const client = new DynamoDBClient({});

exports.handler = async (event) => {
    try{
        const id = event?.pathParameters?.id;
        const body = JSON.parse(event.body);

        console.log("Input id: ", id);

        if(!id || !body){
            return{
                statusCode: 400,
                body: JSON.stringify({ message: "Ingresar un ID o body valido" })
            };
        };

        const getCommand = new GetItemCommand({
            TableName: "E_INVOICE",
            Key: { id: { S: id } }
        });

        const getResult = await client.send(getCommand);
        if(!getResult.Item){
            return{
                statusCode: 404,
                body: JSON.stringify({message: "Id no encontrado"}),
            }
        }

        const updateCommand = new UpdateItemCommand({
            TableName: "E_INVOICE",
            Key: { id: { S: id } },
            UpdateExpression: "SET #name = :name, description = :description, price = :price",
            ExpressionAttributeNames: {
                "#name": "name"
            },
            ExpressionAttributeValues: {
                ":name": {S: body.name},
                ":description": {S: body.description},
                ":price": {S: body.price},
            },
            ReturnValues: "ALL_NEW"
        })

        const updateResult = await client.send(updateCommand);

        return{
            statusCode: 200,
            body: JSON.stringify({ updateItem: updateResult.Attributes})
        };

    }catch(error) {
        console.log("Error: ", error);
        return{
            statusCode: 500,
            body: JSON.stringify({error: "Invoice not found"})
        };
    }
}