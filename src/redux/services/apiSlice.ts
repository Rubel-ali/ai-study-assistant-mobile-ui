import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../store';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:3000/api/v1', // 10.0.2.2 works for Android Emulator, use your PC's IP for real devices
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['User', 'Hierarchy', 'Exam', 'Leaderboard', 'Analytics'],
  endpoints: (builder) => ({}),
});
