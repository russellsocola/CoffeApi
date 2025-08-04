// test/getCoffeeById.test.js

jest.mock("../ddbclient", () => ({
  ddbDocClient: {
    send: jest.fn(),
  },
  GetItemCommand: jest.fn((params) => params),
}));

const { handler } = require("../services/getCoffeeById");
const ddbClient = require("../ddbclient");

describe("getCoffeeById Lambda", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("✅ debe retornar 200 y el item si existe", async () => {
    const fakeItem = {
      id: { S: "id-123" },
      name: { S: "Latte" },
      price: { N: "12" },
    };

    ddbClient.ddbDocClient.send.mockResolvedValueOnce({ Item: fakeItem });

    const event = {
      pathParameters: { id: "id-123" },
    };

    const result = await handler(event);

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual(fakeItem);
    expect(ddbClient.ddbDocClient.send).toHaveBeenCalledTimes(1);
  });

  it("⚠️ debe retornar 404 si el item no existe", async () => {
    ddbClient.ddbDocClient.send.mockResolvedValueOnce({}); // Sin Item

    const event = {
      pathParameters: { id: "id-404" },
    };

    const result = await handler(event);

    expect(result.statusCode).toBe(404);
    expect(JSON.parse(result.body)).toEqual({ error: "Invoice not found" });
  });

  it("⚠️ debe retornar 400 si no se pasa ID en el path", async () => {
    const event = { pathParameters: {} };

    const result = await handler(event);

    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body)).toEqual({ error: "Ingresar un ID en el path" });
    expect(ddbClient.ddbDocClient.send).not.toHaveBeenCalled();
  });

  it("🔥 debe retornar 500 si ocurre un error interno", async () => {
    const originalConsole = console.error;
    console.error = jest.fn(); // silencia el error

    ddbClient.ddbDocClient.send.mockRejectedValueOnce(new Error("DynamoDB error"));

    const event = {
      pathParameters: { id: "id-error" },
    };

    const result = await handler(event);

    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body)).toEqual({ message: "Internal Server Error" });
    expect(ddbClient.ddbDocClient.send).toHaveBeenCalledTimes(1);

    console.error = originalConsole;
  });
});
