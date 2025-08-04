jest.mock("../ddbclient", () => ({
  ddbDocClient: {
    send: jest.fn(),
  },
  GetItemCommand: jest.fn((params) => ({ ...params, command: "GetItemCommand" })),
  DeleteItemCommand: jest.fn((params) => ({ ...params, command: "DeleteItemCommand" })),
}));

const { handler } = require("../services/deleteCoffee");
const ddbClient = require("../ddbclient");

describe("deleteInvoice Lambda", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("200 se elimino Correctamente", async () => {
    const mockItem = { id: { S: "1" } };

    ddbClient.ddbDocClient.send
      .mockResolvedValueOnce({ Item: mockItem }) // GetItem
      .mockResolvedValueOnce({});                // DeleteItem

    const event = {
      pathParameters: { id: "1" },
    };

    const result = await handler(event);

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body).message).toBe("Delette Success");
    expect(ddbClient.ddbDocClient.send).toHaveBeenCalledTimes(2);
  });

  it("400 Falta el ID", async () => {
    const event = {
      pathParameters: {}, // sin ID
    };

    const result = await handler(event);

    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body).message).toBe("Ingresar un ID valido");
    expect(ddbClient.ddbDocClient.send).not.toHaveBeenCalled();
  });

  it("404 si el ID no existe", async () => {
    ddbClient.ddbDocClient.send.mockResolvedValueOnce({}); // GetItem sin `.Item`

    const event = {
      pathParameters: { id: "999" },
    };

    const result = await handler(event);

    expect(result.statusCode).toBe(404);
    expect(JSON.parse(result.body).message).toBe("Id no encontrado");
    expect(ddbClient.ddbDocClient.send).toHaveBeenCalledTimes(1);
  });

  it("500 un error inesperado", async () => {
    ddbClient.ddbDocClient.send.mockRejectedValueOnce(new Error("DynamoDB fail"));

    const event = {
      pathParameters: { id: "1" },
    };

    const result = await handler(event);

    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body).error).toBe("Invoice not found");
  });
});
