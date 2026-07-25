import { apiSlice } from './apiSlice';
import { setCredentials, logout } from '../authSlice';
import { saveToken, deleteToken } from '../../services/storage';

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      async queryFn(credentials) {
        // Mock network delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return {
          data: {
            user: { id: '1', name: 'Student', email: credentials.email },
            token: 'mock-jwt-token-123',
          },
        };
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          await saveToken(data.token);
          dispatch(
            setCredentials({
              user: data.user,
              token: data.token,
            })
          );
        } catch (err) {
          // Handle error if needed
        }
      },
    }),
    register: builder.mutation({
      async queryFn(userData) {
        // Mock network delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return {
          data: {
            user: { id: '1', name: userData.name || 'New Student', email: userData.email },
            token: 'mock-jwt-token-123',
          },
        };
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          await saveToken(data.token);
          dispatch(
            setCredentials({
              user: data.user,
              token: data.token,
            })
          );
        } catch (err) {
          // Handle error if needed
        }
      },
    }),
    logout: builder.mutation({
      async queryFn() {
        // Mock network delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        return { data: { success: true } };
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          await deleteToken();
          dispatch(logout());
        } catch (err) {
          // Handle error if needed
        }
      },
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useLogoutMutation } = authApi;
