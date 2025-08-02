const { DynamoDBClient, QueryCommad } = require("@aws-sdk/client-dynamodb")

const client = new DynamoDBClient({});
exports.handler = async(event) => {
    try{
        const { coffeeId } = event.pathParameters;
        
        const params = {
            TableName: "E_INVOICE",
            KeyConditionExpression: "coffeeId = :id",
            ExpressionAttributeValues: {
                ":id" : { S: coffeeId}
            }
        };
        try{
            const commad = new QueryCommad(params);
            const data = await client.send(commad);

            return{
                statusCode: 200,
                body: JSON.stringify(data.Items)
            };
        }catch(error){
            
            console.error("Error querying DynamoDB", error);
            return {
                statusCode: 500,
                body: JSON.stringify({ error: "Failed to query DynamoDB" })
            };
        }

    }catch(error){
        console.log("Error: ", error);
        return{
            statusCode: 500,
            body: JSON.stringify({message: "Internal Server Error"})
        }
    }
}