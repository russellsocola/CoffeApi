const { ddbDocClient,GetItemCommand } = require("../ddbclient");

exports.handler = async (event) => {
  try {
    //recibo el parametro ID
    const coffeeId = event?.pathParameters?.id;

    console.log("Input ID: ", coffeeId);

    //Valido que el Id venga en el path
    if (!coffeeId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Ingresar un ID en el path" })
      };
    }

    const params = {
      TableName: "E_INVOICE",
      Key: {
        id: { S: coffeeId }
      }
    };

    const command = new GetItemCommand(params);
    const data = await ddbDocClient.send(command);

    console.log("Se obtuvo de DynamoDB : ", data);

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
