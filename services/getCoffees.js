const { ddbDocClient,ScanCommand } = require("../ddbclient");

exports.handler = async(event) => {
    try {
        //si viene el lastkey lo uso para identificar a que pagina ir
        const lastKey = event?.queryStringParameters?.lastKey
        ? JSON.parse(decodeURIComponent(event.queryStringParameters.lastKey))
        : undefined;
        

        const params = {
        TableName: "E_INVOICE",
        Limit: 10,
        ExclusiveStartKey: lastKey
        };

        const commat = new ScanCommand(params);
        const data = await ddbDocClient.send(commat);

        console.log("Scan data:", JSON.stringify(data));

        return{
            statusCode: 200,
            body: JSON.stringify({
                items: data.Items,
                lastEvaluatedKey: data.LastEvaluatedKey ? JSON.stringify(data.LastEvaluatedKey) : null
            }),
        };
    }catch(error){
        console.log("Error: ", error);
        return{
            statusCode: 500,
            body: JSON.stringify({message: "Error al obtener datos con Paginacion", error: error.message})
        };
    }
}