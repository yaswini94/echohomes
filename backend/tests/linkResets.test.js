const request = require("supertest");
const app = require("../src/app");
const { createClient } = require("@supabase/supabase-js");

jest.mock("@supabase/supabase-js", () => {
  return {
    createClient: jest.fn().mockReturnValue({
      auth: {
        resetPasswordForEmail: jest.fn(),
        updateUser: jest.fn(),
      },
    }),
  };
});

describe("POST /resetlink", () => {
  let mockSupabase;

  beforeEach(() => {
    mockSupabase = createClient();
    jest.clearAllMocks();
  });

  test("should send reset link email successfully", async () => {
    // Mock the Supabase response
    mockSupabase.auth.resetPasswordForEmail.mockResolvedValue({
      data: { message: "Password reset email sent" },
      error: null,
    });

    const response = await request(app).post("/resetlink").send({
      email: "test@example.com",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Reset password email sent successful"
    );
  });

  test("should return 400 if Supabase returns an error", async () => {
    // Mock the Supabase error
    mockSupabase.auth.resetPasswordForEmail.mockResolvedValue({
      data: null,
      error: { message: "Invalid email" },
    });

    const response = await request(app).post("/resetlink").send({
      email: "invalid-email",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("error", "Invalid email");
  });

  test("should return 400 if email is not provided", async () => {
    const response = await request(app).post("/resetlink").send({});

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("error");
  });
});

describe("POST /updatePassword", () => {
  let mockSupabase;

  beforeEach(() => {
    mockSupabase = createClient();
    jest.clearAllMocks();
  });

  test("should update password successfully", async () => {
    // Mock the Supabase response for successful password update
    mockSupabase.auth.updateUser.mockResolvedValue({
      data: { message: "Password updated" },
      error: null,
    });

    const response = await request(app).post("/updatePassword").send({
      email: "test@example.com",
      password: "newPassword123",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Update password is successful"
    );
  });

  test("should return 400 if Supabase returns an error", async () => {
    // Mock the Supabase response for error case
    mockSupabase.auth.updateUser.mockResolvedValue({
      data: null,
      error: { message: "Invalid email or password" },
    });

    const response = await request(app).post("/updatePassword").send({
      email: "invalid@example.com",
      password: "short",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("error", "Invalid email or password");
  });

  test("should return 400 if email or password is missing", async () => {
    // Missing password
    const response = await request(app).post("/updatePassword").send({
      email: "test@example.com",
    });
    expect(response.statusCode).toBe(400);

    // Missing email
    const response2 = await request(app).post("/updatePassword").send({
      password: "newPassword123",
    });
    expect(response2.statusCode).toBe(400);
  });
});
