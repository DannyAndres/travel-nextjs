import "isomorphic-fetch";
import { configureStore } from "@reduxjs/toolkit";
import { setupServer } from "msw/node";
import { rest } from "msw";
import { userApi } from "./example";

// Define a mock server
const server = setupServer(
  rest.get(
    "https://jsonplaceholder.typicode.com/users",
    async (req, res, ctx) => {
      return await res(
        ctx.json([{ id: 1, name: "User 1", email: "user1@example.com" }])
      );
    }
  ),
  rest.get(
    "https://jsonplaceholder.typicode.com/users/1",
    async (req, res, ctx) => {
      return await res(
        ctx.json({ id: 1, name: "User 1", email: "user1@example.com" })
      );
    }
  )
);

beforeAll(() => {
  server.listen();
});
afterEach(() => {
  server.resetHandlers();
});
afterAll(() => {
  server.close();
});

// Create a store with the API middleware
const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userApi.middleware),
});

it("should fetch users", async () => {
  await store.dispatch(userApi.endpoints.getUsers.initiate(null));

  const users = userApi.endpoints.getUsers.select(null)(store.getState()).data;

  expect(users).toEqual([
    { id: 1, name: "User 1", email: "user1@example.com" },
  ]);
});

it("should fetch user by id", async () => {
  await store.dispatch(userApi.endpoints.getUserById.initiate({ id: "1" }));

  const user = userApi.endpoints.getUserById.select({ id: "1" })(
    store.getState()
  ).data;

  expect(user).toEqual({ id: 1, name: "User 1", email: "user1@example.com" });
});
