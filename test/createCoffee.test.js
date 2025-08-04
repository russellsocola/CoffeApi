jest.mock("../ddbclient", () => ({
  ddbDocClient: {
    send: jest.fn(),
  },
  PutCommand: jest.fn((params) => params),
}));

const { handler } = require("../services/createCoffee");
const ddbClient = require("../ddbclient");

describe("createCoffee Lambda", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("201 Se guardo Correctamente", async () => {
    ddbClient.ddbDocClient.send.mockResolvedValueOnce({});

    const event = {
      body: JSON.stringify({
        nameCoffee: "Espresso",
        description: "Café fuerte",
        price: 10,
      }),
    };

    const result = await handler(event);

    expect(result.statusCode).toBe(201);
    expect(JSON.parse(result.body)).toEqual({ message: "Stored Successfully" });
    expect(ddbClient.ddbDocClient.send).toHaveBeenCalledTimes(1);
  });

  it("400 Faltan Campos", async () => {
    const event = {
      body: JSON.stringify({
        nameCoffee: "Café solo",
        price: 10,
      }),
    };

    const result = await handler(event);

    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body)).toEqual({ message: "Request invalid" });
    expect(ddbClient.ddbDocClient.send).not.toHaveBeenCalled();
  });

  it("500 Un error interno en el Servidor", async () => {
    ddbClient.ddbDocClient.send.mockRejectedValueOnce(new Error("DynamoDB error"));

    const event = {
      body: JSON.stringify({
        nameCoffee: "Americano",
        description: "Suave",
        price: 8,
      }),
    };

    const result = await handler(event);

    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body)).toEqual({ message: "Internal Server Error" });
    expect(ddbClient.ddbDocClient.send).toHaveBeenCalledTimes(1);
  });
});
