import { apiSlice } from './apiSlice';

export interface Category {
  id: string;
  name: string;
  iconName?: string;
  description?: string;
}

export interface SubCategory {
  id: string;
  categoryId: string;
  name: string;
  iconName?: string;
}

export interface Subject {
  id: string;
  subCategoryId: string;
  name: string;
  iconName?: string;
}

export interface Topic {
  id: string;
  subjectId: string;
  name: string;
  description?: string;
  iconName?: string;
}

export const categoriesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<Category[], void>({
      query: () => '/categories',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Hierarchy' as const, id })),
              { type: 'Hierarchy', id: 'LIST_CATEGORIES' },
            ]
          : [{ type: 'Hierarchy', id: 'LIST_CATEGORIES' }],
    }),
    getSubCategories: builder.query<SubCategory[], string>({
      query: (categoryId) => `/subcategories?categoryId=${categoryId}`,
      providesTags: (result, error, arg) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Hierarchy' as const, id })),
              { type: 'Hierarchy', id: `LIST_SUBCATEGORIES_${arg}` },
            ]
          : [{ type: 'Hierarchy', id: `LIST_SUBCATEGORIES_${arg}` }],
    }),
    getSubjects: builder.query<Subject[], string>({
      query: (subCategoryId) => `/subjects?subCategoryId=${subCategoryId}`,
      providesTags: (result, error, arg) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Hierarchy' as const, id })),
              { type: 'Hierarchy', id: `LIST_SUBJECTS_${arg}` },
            ]
          : [{ type: 'Hierarchy', id: `LIST_SUBJECTS_${arg}` }],
    }),
    getTopics: builder.query<Topic[], string>({
      query: (subjectId) => `/topics?subjectId=${subjectId}`,
      providesTags: (result, error, arg) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Hierarchy' as const, id })),
              { type: 'Hierarchy', id: `LIST_TOPICS_${arg}` },
            ]
          : [{ type: 'Hierarchy', id: `LIST_TOPICS_${arg}` }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetCategoriesQuery,
  useGetSubCategoriesQuery,
  useGetSubjectsQuery,
  useGetTopicsQuery,
} = categoriesApi;
