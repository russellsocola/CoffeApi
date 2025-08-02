const { DynamoDBClient, GetItemCommand } = require("@aws-sdk/client-dynamodb");

const client = new DynamoDBClient({});

exports.handler = async (event) => {
  try {
    const coffeeId = event?.pathParameters?.id;

    console.log("Input ID: ", coffeeId);

    if (!coffeeId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing ID in path" })
      };
    }

    const params = {
      TableName: "E_INVOICE",
      Key: {
        id: { S: coffeeId }
      }
    };

    const command = new GetItemCommand(params);
    const data = await client.send(command);

    console.log("DynamoDB response: ", data);

    if (!data.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Invoice not found" })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(data.Item)
    };

  } catch (error) {
    console.error("Error: ", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" })
    };
  }
};
