export interface Skill {
    id: number;
    name: string;
    description: string;
    category_id: number;
}

export interface Task {
    id: number;
    title: string;
    completed: boolean;
    due_date?: string;
}

class ApiClient {
    private baseUrl = (import.meta.env.PUBLIC_API_URL || "https://mt231043-10992.node.ustp.cloud/api").replace(/\/$/, "");

    private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            headers: {
                "Content-Type": "application/json",
            },
            ...options,
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        return response.json() as Promise<T>;
    }

    // SKILLS
    getSkills(): Promise<Skill[]> {
        return this.request<Skill[]>("/skills");
    }

    getSkill(id: number): Promise<Skill> {
        return this.request<Skill>(`/skills/${id}`);
    }

    // TASKS
    getTasks(): Promise<Task[]> {
        return this.request<Task[]>("/tasks");
    }

    createTask(task: Partial<Task>): Promise<Task> {
        return this.request<Task>("/tasks", {
            method: "POST",
            body: JSON.stringify(task),
        });
    }

    updateTask(id: number, task: Partial<Task>): Promise<Task> {
        return this.request<Task>(`/tasks/${id}`, {
            method: "PATCH",
            body: JSON.stringify(task),
        });
    }

    deleteTask(id: number): Promise<void> {
        return this.request<void>(`/tasks/${id}`, {
            method: "DELETE",
        });
    }
}

export const api = new ApiClient();