import axiosInstance from "../helpers/axiosInstance";
import { supabase } from "../supabase";

// Mock Supabase
vi.mock("../supabase");

// Mock axios interceptors directly
describe("axiosInstance interceptors", () => {
  let consoleErrorSpy;

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock console.error to prevent error messages from appearing in test output
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore console.error after each test
    consoleErrorSpy.mockRestore();
  });

  test("should attach Authorization header when the route is not excluded", async () => {
    const mockToken = "mock-jwt-token";

    // Mock the Supabase auth session with a valid token
    supabase.auth.getSession.mockResolvedValue({
      data: {
        session: {
          access_token: mockToken,
        },
      },
      error: null,
    });

    // Create a mock Axios request config
    const requestConfig = { url: "/dashboard", headers: {} };

    // Simulate calling the request interceptor
    const updatedConfig =
      await axiosInstance.interceptors.request.handlers[0].fulfilled(
        requestConfig
      );

    // Check if the Authorization header is correctly set
    expect(updatedConfig.headers["Authorization"]).toBe(`Bearer ${mockToken}`);
  });

  test("should not attach Authorization header when the route is excluded", async () => {
    // Create a mock Axios request config for an excluded route
    const requestConfig = { url: "/login", headers: {} };

    // Simulate calling the request interceptor
    const updatedConfig =
      await axiosInstance.interceptors.request.handlers[0].fulfilled(
        requestConfig
      );

    // Check if the Authorization header is not set
    expect(updatedConfig.headers["Authorization"]).toBeUndefined();
  });

  test("should handle Supabase session error correctly", async () => {
    // Mock Supabase to return an error
    supabase.auth.getSession.mockResolvedValue({
      data: null,
      error: new Error("Failed to get session"),
    });

    // Create a mock Axios request config
    const requestConfig = { url: "/dashboard", headers: {} };

    // Simulate calling the request interceptor
    const updatedConfig =
      await axiosInstance.interceptors.request.handlers[0].fulfilled(
        requestConfig
      );

    // Ensure no Authorization header is added since there was an error
    expect(updatedConfig.headers["Authorization"]).toBeUndefined();
  });
});
