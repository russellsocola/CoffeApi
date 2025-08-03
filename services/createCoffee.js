const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { PutCommand, DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");
const { v4: uuidv4 } = require("uuid");

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

exports.handler = async(event) => {
    try{
        
        const body = JSON.parse(event.body);
        const {nameCoffee, description, price} = body
        if(!nameCoffee || !description ||!price){
            return{
                statusCode: 400,
                body: JSON.stringify({message: "Request invalid"})
            }
        }

        const newItem ={
            id: `id-${uuidv4()}`,
            name: nameCoffee,
            description: description,
            price: price,
            createdAt: new Date().toISOString(),
        }
        const putParams ={
            TableName: "E_INVOICE",
            Item: newItem,
        };

        await ddbDocClient.send(new PutCommand(putParams));

        return{
            statusCode: 201,
            body: JSON.stringify({message: "Stored Successfully"}),
        };
    }catch(error){
        console.error("Error:", error)
        return{
            statusCode: 500,
            body: JSON.stringify({message: "Internal Server Error"})
        }
    }
}