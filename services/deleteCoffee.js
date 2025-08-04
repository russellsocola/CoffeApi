const { ddbDocClient, GetItemCommand, DeleteItemCommand } = require("../ddbclient");

exports.handler = async(event) => {
    try{
        //recibo el parametro ID
        const id = event?.pathParameters?.id;

        console.log("Input id: ", id);

        if(!id){
            return{
                statusCode: 400,
                body: JSON.stringify({ message: "Ingresar un ID valido" })
            };
        };
        // Verifico si existe el Id 
        const getCommand = new GetItemCommand({
                    TableName: "E_INVOICE",
                    Key: { id: { S: id } }
        });
        const getResult = await ddbDocClient.send(getCommand);


        if(!getResult.Item){
            //Si no existe devuelvo el mensaje de error
            return{
                statusCode: 404,
                body: JSON.stringify({message: "Id no encontrado"}),
            }
        }

        //Si existe proceso a eliminarlo
        const delette = new DeleteItemCommand({
            TableName: "E_INVOICE",
            Key: { id: { S: id } }
        })
        await ddbDocClient.send(delette);

        return{
            statusCode: 200,
            body: JSON.stringify({ message: "Delette Success"})
        };

    }catch(error) {
        console.log("Error: ", error);
        return{
            statusCode: 500,
            body: JSON.stringify({error: "Invoice not found"})
        };
    }
}