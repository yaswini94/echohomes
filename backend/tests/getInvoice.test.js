const request = require("supertest");
const app = require("../src/app");
const stripe = require("stripe");

jest.mock("stripe", () => {
  return jest.fn().mockReturnValue({
    invoices: {
      retrieve: jest.fn(),
    },
  });
});

describe("GET /get-invoice/:invoiceId", () => {
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

  it("should retrieve an invoice successfully", async () => {
    const invoiceId = "test-invoice-id";
    const mockInvoice = {
      invoice_pdf: "http://example.com/invoice.pdf",
      charge: "test-charge-id",
    };

    mockStripe.invoices.retrieve.mockResolvedValueOnce(mockInvoice);

    const response = await request(app).get(`/get-invoice/${invoiceId}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("pdfUrl", mockInvoice.invoice_pdf);
    expect(response.body).toHaveProperty("charge", mockInvoice.charge);
  });

  it("should return 500 if there is an error retrieving the invoice", async () => {
    const invoiceId = "test-invoice-id";
    const errorMessage = "Invoice not found";

    mockStripe.invoices.retrieve.mockRejectedValueOnce(new Error(errorMessage));

    const response = await request(app).get(`/get-invoice/${invoiceId}`);

    expect(response.statusCode).toBe(500);
    expect(response.body).toHaveProperty("error", errorMessage);
  });
});
