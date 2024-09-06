import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SupplierOrderManagement from "./SupplierOrderManagement";
import axiosInstance from "../helpers/axiosInstance";
import { vi } from "vitest";

// Mock axiosInstance
vi.mock("../helpers/axiosInstance");

describe("SupplierOrderManagement Component", () => {
  const mockOrders = [
    {
      supplier_id: "f8a79253-f1e1-439c-9956-ea76eb842a04",
      po_id: "b9247110-ed42-400b-b2ee-83fc1db3b4aa",
      orders_list: [
        {
          name: "Standard Appliances",
          price: 400,
          status: "done",
          quantity: 10,
          feature_id: "a5b8ee99-788f-4db8-9b6a-adba2f20c656",
        },
        {
          name: "Sliding",
          price: 70,
          quantity: 10,
          feature_id: "f13652a7-0852-4b5f-b438-71a110600ec8",
        },
        {
          name: "Skylights",
          price: 40,
          quantity: 10,
          feature_id: "6f093f66-9d00-4868-bed5-8ec447729cb1",
        },
        {
          name: "Slate",
          price: 300,
          status: "inprogress",
          quantity: 10,
          feature_id: "c4d47589-2405-482f-8493-57b64b5157f2",
        },
        {
          name: "Spa-like",
          price: 2060,
          quantity: 10,
          feature_id: "23a89f92-6380-4a48-bf8f-07f1a9067100",
        },
        {
          name: "Granite",
          price: 1500,
          quantity: 10,
          feature_id: "936d93f9-32c9-44d9-a011-001f0667ed5c",
        },
        {
          name: "Geothermal Heating",
          price: 800,
          quantity: 10,
          feature_id: "99ba1a89-874a-44c1-83e1-8e16f8f8533b",
        },
        {
          name: "Walk-in Shower",
          price: 700,
          quantity: 10,
          feature_id: "de931c1c-5674-4776-b9f3-619d4a7d0e96",
        },
        {
          name: "Standard Door",
          price: 30,
          quantity: 10,
          feature_id: "bc70ee9d-a405-4b81-96a6-d43ce5ceef0c",
        },
      ],
      venture_id: "e3d10e68-8d34-41ca-83c1-a55a9cd75630",
      total: 59000,
      stripe_session_id:
        "cs_test_b1V7Qm6Q6ZWAeGMJt16pYu479yBkToeQhDo8BMoIpjrvBv0Ml9bewcxy0I",
      builder_id: "b765bebe-a10c-4bc5-8156-ece04f78f1ae",
      venture: {
        name: "Mulberry Homes",
        address: "London",
        builder: {
          name: "Yaswini Modupalli",
        },
        builder_id: "b765bebe-a10c-4bc5-8156-ece04f78f1ae",
      },
    },
  ];

  beforeEach(() => {
    // Reset mocks before each test so individual mocks can be set for specific tests
    axiosInstance.get.mockReset();
    // Set the default mock response, which can be overwritten in specific tests
    axiosInstance.get.mockResolvedValue({ data: mockOrders });
  });

  it("should fetch and display orders when available", async () => {
    render(<SupplierOrderManagement />);

    // Check if the correct venture information is displayed using a regex
    expect(
      await screen.findByText(/\s*Mulberry Homes\s*/i)
    ).toBeInTheDocument();

    // Check if order items are displayed
    expect(await screen.findByText("Standard Appliances")).toBeInTheDocument();
    expect(await screen.findByText("£ 400")).toBeInTheDocument();
    expect(await screen.findByText("Sliding")).toBeInTheDocument();
    expect(await screen.findByText("£ 70")).toBeInTheDocument();
    expect(await screen.findByText("Slate")).toBeInTheDocument();
    expect(await screen.findByText("£ 300")).toBeInTheDocument();
  });

  it("should display 'No Orders exist !' when there are no orders", async () => {
    axiosInstance.get.mockResolvedValueOnce({ data: [] });
    render(<SupplierOrderManagement />);

    // Check for empty orders message
    expect(await screen.findByText("No Orders exist !")).toBeInTheDocument();
  });

  it("should display action buttons for changing status", async () => {
    // Mock the response to include orders with different statuses
    axiosInstance.get.mockResolvedValueOnce({
      data: [
        {
          po_id: "b9247110-ed42-400b-b2ee-83fc1db3b4aa",
          venture: { name: "Mulberry Homes" },
          orders_list: [
            {
              name: "Sliding",
              price: 70,
              quantity: 10,
              feature_id: "f13652a7-0852-4b5f-b438-71a110600ec8",
              status: null, // Status is "Not Started"
            },
            {
              name: "Slate",
              price: 300,
              quantity: 10,
              feature_id: "c4d47589-2405-482f-8493-57b64b5157f2",
              status: "inprogress", // Status is "Inprogress"
            },
          ],
        },
      ],
    });
  
    // Render the component
    render(<SupplierOrderManagement />);
  
    // Wait for the "Mark Inprogress" button to appear
    const markInProgressButtons = await screen.findAllByText(/markInprogress/i);
    expect(markInProgressButtons.length).toBeGreaterThan(0);
  
    // Wait for the "Mark Done" button to appear for "inprogress" status
    const markDoneButtons = await screen.findAllByText(/markDone/i);
    expect(markDoneButtons.length).toBeGreaterThan(0);
  });
  

  it("should call the API to update the status when the action button is clicked", async () => {
    axiosInstance.post.mockResolvedValueOnce({});
    render(<SupplierOrderManagement />);

    // Wait for the data to load
    await waitFor(() => expect(screen.getByText("Slate")).toBeInTheDocument());

    // Click the "markDone" button for the "Slate" order
    const markDoneButton = screen.getByText("markDone");
    fireEvent.click(markDoneButton);

    // Ensure the API is called with correct parameters
    expect(axiosInstance.post).toHaveBeenCalledWith(
      "/update-purchase-order-status",
      {
        po_id: "b9247110-ed42-400b-b2ee-83fc1db3b4aa",
        feature_id: "c4d47589-2405-482f-8493-57b64b5157f2",
        status: "done",
      }
    );
  });
});
