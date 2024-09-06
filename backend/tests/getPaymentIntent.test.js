const request = require("supertest");
const app = require("../src/app");
const stripe = require("stripe");

jest.mock("stripe", () => {
  return jest.fn().mockReturnValue({
    paymentIntents: {
      retrieve: jest.fn(),
    },
  });
});

describe("GET /get-payment-intent/:id", () => {
  let mockStripe;

  // Mock console.error to prevent logging in the test output
  const originalConsoleError = console.error;
  beforeEach(() => {
    console.error = jest.fn(); // Mock console.error
    mockStripe = stripe();
    jest.clearAllMocks();
  });

  afterEach(() => {
    console.error = originalConsoleError; // Restore console.error after each test
  });

  it("should retrieve a payment intent successfully", async () => {
    const paymentIntentId = "test-payment-intent-id";
    const mockPaymentIntent = {
      id: paymentIntentId,
      amount: 1000,
      currency: "usd",
    };

    mockStripe.paymentIntents.retrieve.mockResolvedValueOnce(mockPaymentIntent);

    const response = await request(app).get(
      `/get-payment-intent/${paymentIntentId}`
    );

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("paymentIntent", mockPaymentIntent);
  });

  it("should return 500 if there is an error retrieving the payment intent", async () => {
    const paymentIntentId = "test-payment-intent-id";
    const errorMessage = "Payment Intent not found";

    mockStripe.paymentIntents.retrieve.mockRejectedValueOnce(
      new Error(errorMessage)
    );

    const response = await request(app).get(
      `/get-payment-intent/${paymentIntentId}`
    );

    expect(response.statusCode).toBe(500);
    expect(response.body).toHaveProperty("error", errorMessage);
  });
});
