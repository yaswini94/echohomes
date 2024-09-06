import { render, screen, waitFor } from "@testing-library/react";
import { AuthProvider, useAuth } from "./useAuth"; // Adjust path as needed
import { supabase } from "../supabase"; // Supabase mock
import { userRoles } from "../utils/constants";
import { vi } from "vitest";

// Mock supabase
vi.mock("../supabase", () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(),
    },
    from: vi.fn(),
  },
}));

// Create a test component to consume useAuth
const TestComponent = () => {
  const { user, role, loading } = useAuth();
  return (
    <div>
      <p>User: {user?.email || "No user"}</p>
      <p>Role: {role || "No role"}</p>
      <p>{loading ? "Loading..." : "Not Loading"}</p>
    </div>
  );
};

describe("AuthProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock the onAuthStateChange method to return a valid subscription object
    supabase.auth.onAuthStateChange.mockReturnValue({
      data: {
        subscription: {
          unsubscribe: vi.fn(), // Mock the unsubscribe function
        },
      },
    });

    // Mock getSession to return a resolved promise
    supabase.auth.getSession.mockResolvedValue({
      data: { session: { user: { id: "user-id", email: "test@example.com" } } },
    });
  });

  test("should set initial loading state", () => {
    // Mock getSession to return a loading state
    supabase.auth.getSession.mockResolvedValueOnce({ data: { session: null } });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Check for loading state
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("should set user and role after fetching session", async () => {
    // Mock getSession to return a user session
    const mockUser = { id: "user-id", email: "test@example.com" };
    supabase.auth.getSession.mockResolvedValueOnce({
      data: { session: { user: mockUser } },
    });

    // Mock the database role check for the user
    supabase.from.mockImplementation((table) => {
      if (table === "builders") {
        return {
          select: () => ({
            eq: () => ({ single: () => ({ data: null, error: null }) }),
          }),
        };
      }
      if (table === "buyers") {
        return {
          select: () => ({
            eq: () => ({
              single: () => ({ data: { buyer_id: mockUser.id }, error: null }),
            }),
          }),
        };
      }
      return {
        select: () => ({
          eq: () => ({ single: () => ({ data: null, error: null }) }),
        }),
      };
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Wait for the user to be set
    await waitFor(() =>
      expect(
        screen.getByText((content, element) =>
          content.includes("test@example.com")
        )
      ).toBeInTheDocument()
    );

    // Wait for the role to be set to "buyers"
    await waitFor(() =>
      expect(
        screen.getByText((content, element) => content.includes("buyers"))
      ).toBeInTheDocument()
    );
  });

  test("should handle no user session", async () => {
    // Mock getSession to return no session
    supabase.auth.getSession.mockResolvedValueOnce({ data: { session: null } });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Wait for the component to stop loading
    await waitFor(() =>
      expect(
        screen.getByText((content, element) => content.includes("No user"))
      ).toBeInTheDocument()
    );

    // Ensure no role is set
    expect(
      screen.getByText((content, element) => content.includes("No role"))
    ).toBeInTheDocument();
  });

  test("should unsubscribe on unmount", () => {
    const unsubscribeMock = vi.fn();
    supabase.auth.onAuthStateChange.mockReturnValueOnce({
      data: { subscription: { unsubscribe: unsubscribeMock } },
    });

    const { unmount } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Unmount the component
    unmount();

    // Ensure the unsubscribe function was called
    expect(unsubscribeMock).toHaveBeenCalled();
  });
});
