jest.mock("../ddbclient", () => ({
  ddbDocClient: {
    send: jest.fn(),
  },
  GetItemCommand: jest.fn((params) => ({ ...params, command: "GetItemCommand" })),
  UpdateItemCommand: jest.fn((params) => ({ ...params, command: "UpdateItemCommand" })),
}));

const { handler } = require("../services/updateCoffee");
const ddbClient = require("../ddbclient");

describe("updateInvoice Lambda", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("200 cuando se actualiza correctamente", async () => {
    const mockItem = { id: { S: "1" }, name: { S: "Latte" } };
    const updatedItem = { id: { S: "1" }, name: { S: "Cappuccino" }, description: { S: "Delicious" }, price: { S: "12" } };

    // 1. Simula que existe el item
    ddbClient.ddbDocClient.send
      .mockResolvedValueOnce({ Item: mockItem }) // para GetItem
      .mockResolvedValueOnce({ Attributes: updatedItem }); // para UpdateItem

    const event = {
      pathParameters: { id: "1" },
      body: JSON.stringify({ name: "Cappuccino", description: "Delicious", price: 12 }),
    };

    const result = await handler(event);

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual({ updateItem: updatedItem });
    expect(ddbClient.ddbDocClient.send).toHaveBeenCalledTimes(2);
  });

  it("400 si falta el ID o el body", async () => {
    const event = {
      pathParameters: {}, // falta id
      body: JSON.stringify({ name: "Cappuccino" }),
    };

    const result = await handler(event);

    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body).message).toBe("Ingresar un ID o body valido");
  });

  it("404 si el ID no existe", async () => {
    ddbClient.ddbDocClient.send.mockResolvedValueOnce({}); // GetItem sin .Item

    const event = {
      pathParameters: { id: "999" },
      body: JSON.stringify({ name: "Cappuccino", description: "Delicious", price: 12 }),
    };

    const result = await handler(event);

    expect(result.statusCode).toBe(404);
    expect(JSON.parse(result.body).message).toBe("Id no encontrado");
  });

  it("500 si ocurre un error", async () => {
    ddbClient.ddbDocClient.send.mockRejectedValueOnce(new Error("DynamoDB error"));

    const event = {
      pathParameters: { id: "1" },
      body: JSON.stringify({ name: "Cappuccino", description: "Delicious", price: 12 }),
    };

    const result = await handler(event);

    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body).error).toBe("Invoice not found");
  });
});
