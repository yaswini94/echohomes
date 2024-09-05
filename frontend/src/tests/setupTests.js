import "@testing-library/jest-dom";
import { setupServer } from "msw/node";
import { handlers } from "./mocks/mockApiHandlers"; // If you mock API requests

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
