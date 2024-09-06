import { http } from "msw";

export const handlers = [
  http.get("/api/your-endpoint", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ data: "mock data" }));
  }),
];
