const request = require("supertest");
const app = require("../src/app");
const stripe = require("stripe");

jest.mock("stripe", () => {
  return jest.fn().mockReturnValue({
    charges: {
      retrieve: jest.fn(),
    },
  });
});

describe("GET /get-receipt/:chargeId", () => {
  let mockStripe;

  const originalConsoleError = console.error;
  beforeEach(() => {
    console.error = jest.fn(); // Mock console.error
    mockStripe = stripe();
    jest.clearAllMocks();
  });

  afterEach(() => {
    console.error = originalConsoleError; // Restore console.error after each test
  });

  it("should retrieve a receipt successfully", async () => {
    const chargeId = "test-charge-id";
    const mockReceipt = {
      receipt_url: "http://example.com/receipt.pdf",
    };

    mockStripe.charges.retrieve.mockResolvedValueOnce(mockReceipt);

    const response = await request(app).get(`/get-receipt/${chargeId}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("receiptUrl", mockReceipt.receipt_url);
  });

  it("should return 500 if there is an error retrieving the receipt", async () => {
    const chargeId = "test-charge-id";
    const errorMessage = "Receipt not found";

    mockStripe.charges.retrieve.mockRejectedValueOnce(new Error(errorMessage));

    const response = await request(app).get(`/get-receipt/${chargeId}`);

    expect(response.statusCode).toBe(500);
    expect(response.body).toHaveProperty("error", errorMessage);
  });
});
