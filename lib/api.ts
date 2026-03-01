export interface LoginParams {
    email: string;
    password: string;
}

export interface RegisterParams {
    email: string;
    password: string;
    display_name: string;
}

export interface AuthResponse {
    token: string;
}

export interface BaseResponse {
    message: string;
}

export interface Category {
    id: string;
    name: string;
    description: string;
}

export interface Prompt {
    category_id: number;
    name: string;
    title: string;
    description: string;
}

export class ApiClient {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    get token(): string | null {
        if (typeof window === "undefined") return null;
        return localStorage.getItem("jwt");
    }

    set token(v: string | null) {
        if (typeof window === "undefined") return;
        if (!v) localStorage.removeItem("jwt");
        else localStorage.setItem("jwt", v);
    }

    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const headers = {
            'Content-Type': 'application/json',
            ...(this.token ? { 'Authorization': `Bearer ${this.token}` } : {}),
            ...options.headers,
        };

        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            ...options,
            headers,
        });

        if (response.status === 401) {
            this.token = null;
        }

        const text = await response.text();
        const data = text ? JSON.parse(text) : {};

        if (!response.ok) {
            throw new Error(data.message || 'Ein Fehler ist aufgetreten');
        }

        return data as T;
    }

    async login(credentials: LoginParams): Promise<AuthResponse> {
        const data = await this.request<AuthResponse>('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });

        if (data?.token) {
            this.token = data.token;
        }

        return data;
    }

    async register(credentials: RegisterParams): Promise<BaseResponse> {
        return this.request<BaseResponse>('/auth/register', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
    }

    async getCurrentUser(): Promise<any> {
        if (!this.token) return null;
        try {
            return await this.request<any>('/auth/me', {
                method: 'GET',
            });
        } catch {
            return null;
        }
    }

    logout() {
        this.token = null;
    }

    async getCategories(): Promise<Category[]> {
        return this.request<Category[]>('/categories', {
            method: 'GET',
        });
    }

    async getCategoryById(categoryid: string | number): Promise<Category> {
        const id = encodeURIComponent(String(categoryid));
        return this.request<Category>(`/categories/${id}`, {
            method: 'GET',
        });
    }

    async createPrompt(promptData: Prompt): Promise<BaseResponse> {
        return this.request<BaseResponse>('/prompts', {
            method: 'POST',
            body: JSON.stringify(promptData),
        });
    }

    async getPrompts(): Promise<Prompt[]> {
        return this.request<Prompt[]>('/prompts', {
            method: 'GET',
        });
    }

    async getPromptById(promptid: string | number): Promise<Prompt> {
        const id = encodeURIComponent(String(promptid));
        return this.request<Prompt>(`/prompts/${id}`, {
            method: 'GET',
        });
    }
}
//TODO: change after deploying
const API_BASE = (import.meta.env.PUBLIC_API_URL || "https://mt231043-10992.node.ustp.cloud/api").replace(/\/$/, "");
export const api = new ApiClient(API_BASE);