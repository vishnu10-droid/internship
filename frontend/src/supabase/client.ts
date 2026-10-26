type ApiError = { message: string; status?: number };
type ApiResult<T> = { data: T; error: ApiError | null };
type Filter = { field: string; operator: "eq" | "gte" | "lte"; value: unknown };
type AuthEvent = "SIGNED_IN" | "SIGNED_OUT";

const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/$/, "");
const TOKEN_KEY = "physiotrack-access-token";
const listeners = new Set<(event: AuthEvent, session: any) => void>();

const request = async <T>(
  path: string,
  options: RequestInit = {},
): Promise<ApiResult<T>> => {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
    const body = await response.json();
    if (!response.ok) {
      return { data: null as T, error: { message: body.message || "Request failed", status: response.status } };
    }
    return { data: body.data as T, error: null };
  } catch (error) {
    return {
      data: null as T,
      error: { message: error instanceof Error ? error.message : "Could not reach the API" },
    };
  }
};

const persistSession = (session: any) => {
  if (session?.access_token) localStorage.setItem(TOKEN_KEY, session.access_token);
  const user = session?.user ? { ...session.user } : null;
  for (const listener of listeners) listener("SIGNED_IN", user ? { user } : null);
};

const auth = {
  getSession: async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return { data: { session: null }, error: null };

    const result = await request<{ user: any }>("/auth/me");
    if (result.error) {
      localStorage.removeItem(TOKEN_KEY);
      return { data: { session: null }, error: null };
    }
    return {
      data: { session: { access_token: token, user: result.data.user } },
      error: null,
    };
  },
  signInWithPassword: async (credentials: { email: string; password: string }) => {
    const result = await request<{ user: any; session: any }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    if (!result.error) persistSession(result.data.session);
    return { data: result.error ? { user: null } : result.data, error: result.error };
  },
  signUp: async (credentials: {
    email: string;
    password: string;
    options: { data: { role: string; full_name: string } };
  }) => {
    const result = await request<{ user: any; session: any }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
        role: credentials.options.data.role,
        full_name: credentials.options.data.full_name,
      }),
    });
    if (!result.error) persistSession(result.data.session);
    return { data: result.error ? { user: null } : result.data, error: result.error };
  },
  updateUser: async () => {
    const result = await auth.getSession();
    return { data: { user: result.data.session?.user || null }, error: result.error };
  },
  signOut: async () => {
    const result = await request("/auth/logout", { method: "POST" });
    localStorage.removeItem(TOKEN_KEY);
    for (const listener of listeners) listener("SIGNED_OUT", null);
    return { data: { user: null }, error: result.error };
  },
  resetPasswordForEmail: async (email: string) =>
    request("/auth/password-reset", {
      method: "POST",
      body: JSON.stringify({ email }),
    }).then(({ error }) => ({ data: {}, error })),
  onAuthStateChange: (callback: (event: AuthEvent, session: any) => void) => {
    listeners.add(callback);
    return {
      data: {
        subscription: {
          unsubscribe: () => listeners.delete(callback),
        },
      },
    };
  },
};

class RecordQuery implements PromiseLike<ApiResult<any>> {
  private action: "select" | "insert" | "update" | "delete" = "select";
  private payload: any;
  private filters: Filter[] = [];
  private sort = "created_at";
  private direction: "asc" | "desc" = "desc";
  private limitValue?: number;
  private include = "";

  constructor(private readonly collection: string) {}

  select(columns = "*") {
    if (columns.includes("patients!")) this.include = "patients";
    return this;
  }

  eq(field: string, value: unknown) {
    this.filters.push({ field, operator: "eq", value });
    return this;
  }

  gte(field: string, value: unknown) {
    this.filters.push({ field, operator: "gte", value });
    return this;
  }

  lte(field: string, value: unknown) {
    this.filters.push({ field, operator: "lte", value });
    return this;
  }

  order(field: string, options?: { ascending?: boolean }) {
    this.sort = field;
    this.direction = options?.ascending ? "asc" : "desc";
    return this;
  }

  limit(value: number) {
    this.limitValue = value;
    return this;
  }

  insert(payload: any) {
    this.action = "insert";
    this.payload = payload;
    return this;
  }

  update(payload: any) {
    this.action = "update";
    this.payload = payload;
    return this;
  }

  delete() {
    this.action = "delete";
    return this;
  }

  single() {
    return this.then((result) => ({
      ...result,
      data: Array.isArray(result.data) ? result.data[0] || null : result.data,
    }));
  }

  maybeSingle() {
    return this.single();
  }

  execute() {
    return this.then((result) => result);
  }

  private async run(): Promise<ApiResult<any>> {
    if (this.action === "select") {
      const params = new URLSearchParams({
        filters: JSON.stringify(this.filters),
        sort: this.sort,
        direction: this.direction,
      });
      if (this.limitValue) params.set("limit", String(this.limitValue));
      if (this.include) params.set("include", this.include);
      return request(`/records/${this.collection}?${params.toString()}`);
    }

    if (this.action === "insert") {
      const items = Array.isArray(this.payload) ? this.payload : [this.payload];
      const results = await Promise.all(
        items.map((item) =>
          request(`/records/${this.collection}`, {
            method: "POST",
            body: JSON.stringify(item),
          }),
        ),
      );
      const error = results.find((result) => result.error)?.error || null;
      return { data: results.map((result) => result.data).filter(Boolean), error };
    }

    const idFilter = this.filters.find((filter) => filter.field === "id");
    if (!idFilter || typeof idFilter.value !== "string") {
      return { data: null, error: { message: "An id filter is required for this operation" } };
    }
    const path = `/records/${this.collection}/${encodeURIComponent(idFilter.value)}`;
    return request(path, {
      method: this.action === "update" ? "PATCH" : "DELETE",
      ...(this.action === "update" ? { body: JSON.stringify(this.payload) } : {}),
    });
  }

  then<TResult1 = ApiResult<any>, TResult2 = never>(
    onfulfilled?: ((value: ApiResult<any>) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null,
  ): PromiseLike<TResult1 | TResult2> {
    return this.run().then(onfulfilled, onrejected);
  }
}

export const configureSupabase = () => ({
  auth,
  from: (collection: string) => new RecordQuery(collection),
});

export const supabase = configureSupabase();
