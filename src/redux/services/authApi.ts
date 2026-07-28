import { apiSlice } from './apiSlice';
import { setCredentials, logout } from '../authSlice';
import { saveToken, deleteToken } from '../../services/storage';

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const token = data.access_token || data.token;
          await saveToken(token);
          dispatch(
            setCredentials({
              user: data.user || { id: 'unknown', name: 'Student', email: arg.email },
              token: token,
            })
          );
        } catch (err) {
          // Handle error if needed
        }
      },
    }),
    register: builder.mutation({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
          // Registration complete. Do not automatically log in.
        } catch (err) {
          // Handle error if needed
        }
      },
    }),
    logout: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
          // Handle error if needed (e.g. 401 because token was already invalid)
        } finally {
          await deleteToken();
          dispatch(logout());
        }
      },
    }),
    forgotPassword: builder.mutation({
      query: (body) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body,
      }),
    }),
    resetPassword: builder.mutation({
      query: (body) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { 
  useLoginMutation, 
  useRegisterMutation, 
  useLogoutMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation
} = authApi;
