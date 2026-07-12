import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const booksApi = createApi({
  reducerPath: "booksApi",

  // Cấu hình gốc: URL chung + gắn token vào mọi request
  baseQuery: fetchBaseQuery({
    baseUrl: "https://api.mybooks.com",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),

  tagTypes: ["Book"], // khai báo nhóm cache tên "Book"

  endpoints: (builder) => ({
    // Endpoint ĐỌC
    getBooks: builder.query({
      query: () => "/books",
      providesTags: ["Book"], // đánh dấu: kết quả này thuộc nhóm "Book"
    }),

    // Endpoint GHI
    addBook: builder.mutation({
      query: (newBook) => ({
        url: "/books",
        method: "POST",
        body: newBook,
      }),
      invalidatesTags: ["Book"], // thêm xong -> tự động gọi lại getBooks
    }),
  }),
});

export const { useGetBooksQuery, useAddBookMutation } = booksApi;
