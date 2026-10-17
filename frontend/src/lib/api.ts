const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api/v1";

type ApiEnvelope<T> = { data?: T; message?: string };

export class ApiError<T = unknown> extends Error {
  constructor(
    message: string,
    public readonly data?: T,
  ) {
    super(message);
  }
}

export async function api<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: options.credentials ?? "include",
    headers: { "Content-Type": "application/json", ...options.headers },
  });
  const payload = (await response.json().catch(() => ({}))) as ApiEnvelope<T>;
  if (!response.ok)
    throw new ApiError(
      payload.message || "Something went wrong. Please try again.",
      payload.data,
    );
  return (payload.data ?? payload) as T;
}

export const authApi = {
  signup: (body: { username: string; email: string; password: string }) =>
    api("/user/signup", { method: "POST", body: JSON.stringify(body) }),
  signin: (body: { email: string; password: string }) =>
    api("/user/signin", { method: "POST", body: JSON.stringify(body) }),
  signout: () => api("/user/signout", { method: "POST" }),
  currentUser: () => api<User>("/user/getUser"),
};

export const brainApi = {
  content: async () => {
    try {
      return await api<ContentItem[]>("/content/getAll");
    } catch (error) {
      if (error instanceof ApiError && /no content found/i.test(error.message))
        return [];
      throw error;
    }
  },
  categories: () => api<Category[]>("/categories/getAllCategories"),
  createCategory: (name: string) =>
    api<Category>("/categories/createCategory", {
      method: "POST",
      body: JSON.stringify({ name }),
    }),
  deleteCategory: (id: string) =>
    api(`/categories/deleteCategory/${id}`, { method: "DELETE" }),
  tags: () => api<Tag[]>("/tags/getAllTags"),
  createContent: (body: CreateContent) =>
    api("/content/create", { method: "POST", body: JSON.stringify(body) }),
  deleteContent: (id: string) =>
    api(`/content/deleteContent/${id}`, { method: "DELETE" }),
  contentDetail: (id: string) =>
    api<ContentItem>(`/content/getPostDetail/${id}`),
  search: async (query: string): Promise<SearchResult> => {
    const result = await api<BackendSearchResult>("/brain/search", {
      method: "POST",
      body: JSON.stringify({ query }),
    });
    return {
      content: Array.isArray(result.answer) ? result.answer : [],
      answer: result.llmSummary,
    };
  },
  share: (share: boolean) =>
    api<{ hash?: string; shareLink?: string }>("/brain/share", {
      method: "POST",
      body: JSON.stringify({ share }),
    }),
  publicBrain: (shareId: string) =>
    api<ContentItem[]>(`/brain/getBrain/${shareId}`, { credentials: "omit" }),
};

export type Tag = { _id: string; name?: string; title?: string };
export type Category = { _id: string; name: string };
export type User = {
  _id?: string;
  username?: string;
  email?: string;
  profileImage?: string;
};
export type ContentItem = {
  _id: string;
  title: string;
  content?: string;
  link?: string;
  tags?: Tag[];
  category?: Category | string;
  categoryId?: Category | string;
  createdAt?: string;
  updatedAt?: string;
  summary?: string;
  userId?: { username?: string; email?: string };
};
export type CreateContent = {
  title: string;
  content: string;
  link?: string;
  tags?: string[];
  categoryId?: string;
};
type BackendSearchResult = { answer?: ContentItem[]; llmSummary?: string };
export type SearchResult = { answer?: string; content?: ContentItem[] };
