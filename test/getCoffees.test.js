jest.mock("../ddbclient", () => ({
  ddbDocClient: {
    send: jest.fn(),
  },
  ScanCommand: jest.fn((params) => params),
}));

const { handler } = require("../services/getCoffees");
const ddbClient = require("../ddbclient");

describe("scanInvoices Lambda", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("✅ debe retornar 200 con items y lastEvaluatedKey si hay más páginas", async () => {
    const fakeItems = [{ id: "id-1" }, { id: "id-2" }];
    const lastKey = { id: "id-2" };

    ddbClient.ddbDocClient.send.mockResolvedValueOnce({
      Items: fakeItems,
      LastEvaluatedKey: lastKey,
    });

    const event = {
      queryStringParameters: {
        lastKey: encodeURIComponent(JSON.stringify({ id: "id-0" })),
      },
    };

    const result = await handler(event);

    expect(result.statusCode).toBe(200);
    const body = JSON.parse(result.body);
    expect(body.items).toEqual(fakeItems);
    expect(body.lastEvaluatedKey).toBe(JSON.stringify(lastKey));
    expect(ddbClient.ddbDocClient.send).toHaveBeenCalledTimes(1);
  });

  it("✅ debe retornar 200 sin lastEvaluatedKey si no hay más páginas", async () => {
    const fakeItems = [{ id: "id-1" }];

    ddbClient.ddbDocClient.send.mockResolvedValueOnce({
      Items: fakeItems,
    });

    const event = {
      queryStringParameters: {}, // no lastKey
    };

    const result = await handler(event);

    expect(result.statusCode).toBe(200);
    const body = JSON.parse(result.body);
    expect(body.items).toEqual(fakeItems);
    expect(body.lastEvaluatedKey).toBeNull();
  });

  it("✅ debe funcionar correctamente si no se pasa queryStringParameters", async () => {
    const fakeItems = [{ id: "id-1" }];

    ddbClient.ddbDocClient.send.mockResolvedValueOnce({
      Items: fakeItems,
    });

    const event = {}; // sin queryStringParameters

    const result = await handler(event);

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body).items).toEqual(fakeItems);
  });

  it("🔥 debe retornar 500 si ocurre un error", async () => {
    ddbClient.ddbDocClient.send.mockRejectedValueOnce(new Error("DynamoDB error"));

    const event = {
      queryStringParameters: {},
    };

    const result = await handler(event);

    expect(result.statusCode).toBe(500);
    const body = JSON.parse(result.body);
    expect(body.message).toBe("Error al obtener datos con Paginacion");
    expect(body.error).toBe("DynamoDB error");
  });
});
