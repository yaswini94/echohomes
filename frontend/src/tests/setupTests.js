import React from "react";
import "@testing-library/jest-dom";
import { setupServer } from "msw/node";
import { handlers } from "./mocks/mockApiHandlers"; // If you mock API requests

const server = setupServer(...handlers);

// beforeAll(() => server.listen());

beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // deprecated
      removeListener: vi.fn(), // deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

afterEach(() => server.resetHandlers());
afterAll(() => server.close());

global.React = React;
