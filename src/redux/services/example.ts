import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import fetch from "cross-fetch";

interface User {
  id: number;
  name: string;
  email: number;
}

export const userApi = createApi({
  reducerPath: "userApi",
  refetchOnFocus: true, // when the window is refocused, refetch the data
  baseQuery: fetchBaseQuery({
    baseUrl: "https://jsonplaceholder.typicode.com/",
    fetchFn: fetch, // Use cross-fetch here
  }),
  endpoints: (builder) => ({
    getUsers: builder.query<User[], null>({
      query: () => "users",
    }),
    getUserById: builder.query<User, { id: string }>({
      query: ({ id }) => `users/${id}`,
    }),
  }),
});

export const { useGetUsersQuery, useGetUserByIdQuery } = userApi;
