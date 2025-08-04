exports.hello = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Go Serverless v4! Your function executed successfully. Bienvenido Russell!",
    }),
  };
};
/**Lambda de ejemplo podria devulve un string simple con un status 200 */