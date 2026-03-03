<script lang="ts">
    import { onMount } from "svelte";
    import { api } from "../../lib/api";

    type Todo = {
        id?: number;
        title?: string;
        text?: string;
        done?: boolean;
        completed?: boolean;
        created_at?: string;
    };

    let todos: Todo[] = [];
    let loading = true;
    let error = "";
    let needsLogin = false;

    function isUnauthorized(msg: string) {
        const m = (msg || "").toLowerCase();
        return m.includes("unauthorized") || m.includes("401") || m.includes("no token");
    }

    async function refresh() {
        loading = true;
        error = "";
        needsLogin = false;

        // If there's no token, skip me
        if (!api.token) {
            needsLogin = true;
            loading = false;
            return;
        }

        try {
            const data = await api.listTodos();
            todos = Array.isArray(data) ? data : [];
        } catch (e: any) {
            const msg = e?.message ?? "Failed to load todos";
            if (isUnauthorized(msg)) {
                needsLogin = true;
                todos = [];
            } else {
                error = msg;
            }
        } finally {
            loading = false;
        }
    }

    onMount(() => {
        refresh();
    });

    $: normalizedTodos = todos.map((t) => ({
        ...t,
        title: t.title ?? t.text ?? "(untitled)",
        done: t.done ?? t.completed ?? false
    }));
</script>

<section class="panel">
    <h2>To-dos</h2>

    <div class="controls">
        <button type="button" on:click={refresh} disabled={loading}>
            {loading ? "Loading..." : "Refresh"}
        </button>
    </div>

    {#if loading}
        <p>Loading to-dos...</p>

    {:else if needsLogin}
        <div class="notice">
            <p><strong>Login required.</strong> Your backend protects <code>/todos</code>.</p>
            <p>
                Go to your Auth page, log in, then come back and hit Refresh.
            </p>
        </div>

    {:else if error}
        <p class="error">{error}</p>

    {:else}
        <ul class="todoList">
            {#each normalizedTodos as todo (todo.id ?? todo.title)}
                <li class:done={todo.done}>
                    <span class="title">{todo.title}</span>
                    <span class="status">{todo.done ? "✓" : ""}</span>
                </li>
            {:else}
                <li class="empty">No to-dos yet.</li>
            {/each}
        </ul>
    {/if}
</section>

<style>
    .panel {
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: var(--radius-lg);
        padding: 2rem;
        /* Adding the requested horizontal margin */
        margin: 0 1.5rem;
        box-shadow: 8px 8px 0px rgba(0, 0, 0, 0.2);
    }

    h2 {
        margin-top: 0;
        margin-bottom: 1.5rem;
        font-family: 'JetBrains Mono', monospace;
        text-transform: uppercase;
        letter-spacing: -1px;
        color: var(--primary);
    }

    .controls {
        margin: 0.5rem 0 1.5rem;
        display: flex;
        gap: 0.5rem;
    }

    button {
        background: var(--primary);
        color: white;
        border: none;
        padding: 0.6rem 1.2rem;
        border-radius: var(--radius-md);
        font-weight: 700;
        cursor: pointer;
        transition: all 0.2s ease;
        text-transform: uppercase;
        font-size: 0.75rem;
        letter-spacing: 1px;
    }

    button:hover:not(:disabled) {
        filter: brightness(1.1);
        transform: translateY(-1px);
    }

    button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .todoList {
        list-style: none;
        padding: 0;
        margin: 0;
        display: grid;
        gap: 0.75rem;
    }

    .todoList li {
        padding: 1rem;
        border-radius: var(--radius-md);
        background: rgba(0, 0, 0, 0.2);
        border: 1px solid var(--border);
        display: flex;
        justify-content: space-between;
        align-items: center;
        transition: border-color 0.2s ease;
    }

    .todoList li:hover {
        border-color: var(--primary-hover);
    }

    .todoList li.done {
        opacity: 0.5;
        text-decoration: line-through;
        border-color: transparent;
        background: rgba(0, 0, 0, 0.1);
    }

    .title {
        font-weight: 500;
        color: var(--text);
    }

    .status {
        color: var(--primary);
        font-weight: 900;
        font-size: 1.2rem;
    }

    .notice {
        padding: 1.5rem;
        border-radius: var(--radius-md);
        background: rgba(255, 0, 85, 0.05);
        border: 1px dashed var(--primary);
        color: var(--text);
    }

    .notice code {
        background: rgba(0,0,0,0.3);
        padding: 0.2rem 0.4rem;
        border-radius: 4px;
        color: var(--primary);
    }

    .error {
        color: #ff4444;
        font-family: 'JetBrains Mono', monospace;
        background: rgba(255, 68, 68, 0.1);
        padding: 1rem;
        border-left: 4px solid #ff4444;
    }

    .empty {
        opacity: 0.6;
        font-style: italic;
        text-align: center;
        padding: 2rem;
    }

    code { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; }
</style>