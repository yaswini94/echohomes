import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import OrdersManagement from "../components/OrdersManagement";
import { supabase } from "../supabase";
import axiosInstance from "../helpers/axiosInstance";
import { useAuth } from "../auth/useAuth";
import { vi } from "vitest";

vi.mock("../helpers/axiosInstance");
vi.mock("@stripe/stripe-js");
vi.mock("../auth/useAuth");

// Mock useTranslation
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

// Mock useLocalStorage
vi.mock("../utils/useLocalStorage", () => ({
  default: vi.fn(() => [null, vi.fn()]),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("OrdersManagement", () => {
  it("should render the component and display initial state", () => {
    useAuth.mockReturnValue({ user: { id: "user-id" } });

    render(<OrdersManagement />);

    expect(screen.getAllByText("buyerOrders").length).toBeGreaterThan(0);
    expect(screen.getAllByText("supplierOrders").length).toBeGreaterThan(0);
  });
});
