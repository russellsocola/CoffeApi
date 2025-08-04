const { ddbDocClient,PutCommand } = require("../ddbclient");//importo solo los servicios necesarios
const { v4: uuidv4 } = require("uuid");

exports.handler = async(event) => {
    try{
        //extraigo los datos del evento
        const body = JSON.parse(event.body);
        const {nameCoffee, description, price} = body
        if(!nameCoffee || !description ||!price){
            return{
                statusCode: 400,
                body: JSON.stringify({message: "Request invalid"})
            }
        }

        //construllo el cuerpo de mi solicitud
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

        //envio la accion mediante el cliente DynadoBd si es correcta devolvera un 200
        await ddbDocClient.send(new PutCommand(putParams));

        return{
            statusCode: 201,
            body: JSON.stringify({message: "Stored Successfully"}),
        };

    }catch(error){
        //Si hay una falla de englobara en este Catch y podre verlo en Cloud Watch
        console.error("Error:", error)
        return{
            statusCode: 500,
            body: JSON.stringify({message: "Internal Server Error"})
        }
    }
}