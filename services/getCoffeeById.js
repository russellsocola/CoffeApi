const { DynamoDBClient, GetItemCommand } = require("@aws-sdk/client-dynamodb")

const client = new DynamoDBClient({});
exports.handler = async(event) => {
    try{
        const coffeeId = event?.pathParameters?.id;
        
        console.log("Input: ",coffeeId)
        const params = {
            TableName: "E_INVOICE",
            Key: {
                id: {S: coffeeId}
            }
        };
        try{
            const commad = new GetItemCommand(params);
            const data = await client.send(commad);

            console.log("response de data: ", data);
            if (!data.Item){    
                return{
                    statusCode: 404,
                    body: JSON.stringify({error: "Invoice no found"})
                };
            };

            return {
                statusCode: 200,
                body: JSON.stringify(data.Item)
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