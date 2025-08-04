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

  it("✅ debe retornar 201 cuando se guarda correctamente", async () => {
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

  it("⚠️ debe retornar 400 si faltan campos", async () => {
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

  it("🔥 debe retornar 500 si ocurre un error interno", async () => {
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
