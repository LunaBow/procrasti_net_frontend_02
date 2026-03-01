<script>
    import { onMount } from 'svelte';
    import { api } from '../scripts/API-Client.js';
    import Auth from './Auth.svelte';

    let todos = [];
    let newTodoTitle = "";
    let newTodoPriority = "medium";
    let loading = true;
    let user = null;

    async function loadTodos() {
        loading = true;
        try {
            user = await api.getCurrentUser();
            if (user) {
                todos = await api.listTodos();
            }
        } catch (e) {
            console.error("Failed to load todos:", e);
        } finally {
            loading = false;
        }
    }

    async function addTodo() {
        if (!newTodoTitle.trim()) return;
        try {
            await api.createTodo({ 
                title: newTodoTitle.trim(), 
                priority: newTodoPriority,
                status: "open"
            });
            newTodoTitle = "";
            await loadTodos();
        } catch (e) {
            console.error("Failed to add todo:", e);
        }
    }

    async function toggleTodo(todo) {
        try {
            const newStatus = todo.status === "completed" ? "open" : "completed";
            await api.updateTodo(todo.id, { status: newStatus });
            await loadTodos();
        } catch (e) {
            console.error("Failed to update todo:", e);
        }
    }

    async function deleteTodo(id) {
        try {
            await api.deleteTodo(id);
            await loadTodos();
        } catch (e) {
            console.error("Failed to delete todo:", e);
        }
    }

    onMount(loadTodos);
</script>

<section class="panel">
    <h2>Todo List</h2>
    
    <form on:submit|preventDefault={addTodo} class="add-form">
        <input 
            type="text" 
            placeholder="What needs to be done?" 
            bind:value={newTodoTitle}
        />
        <select bind:value={newTodoPriority}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
        </select>
        <button type="submit">Add</button>
    </form>

    {#if loading}
        <p>Loading todos...</p>
    {:else if !user}
        <div class="auth-wrapper">
            <p>Please log in to manage your tasks.</p>
            <Auth />
        </div>
    {:else}
        <div class="todo-list">
            {#each todos as todo}
                <div class="todo-item" class:done={todo.status === "completed"}>
                    <input 
                        type="checkbox" 
                        checked={todo.status === "completed"} 
                        on:change={() => toggleTodo(todo)}
                    />
                    <span class="title">{todo.title}</span>
                    <span class="priority-tag {todo.priority}">{todo.priority}</span>
                    <button class="delete-btn" on:click={() => deleteTodo(todo.id)}>✕</button>
                </div>
            {:else}
                <p class="empty">Nothing to do! Enjoy your time.</p>
            {/each}
        </div>
    {/if}
</section>

<style>
    .panel {
        padding: 1.5rem;
        background: #fff;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        max-width: 600px;
        margin: 0 auto;
    }
    h2 {
        margin-top: 0;
        margin-bottom: 1.5rem;
        text-align: center;
        color: #333;
    }
    .add-form {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 2rem;
    }
    input[type="text"] {
        flex: 1;
        padding: 0.75rem;
        border: 2px solid #eee;
        border-radius: 8px;
        font-size: 1rem;
        transition: border-color 0.2s;
    }
    input[type="text"]:focus {
        outline: none;
        border-color: #3b82f6;
    }
    select {
        padding: 0.75rem;
        border: 2px solid #eee;
        border-radius: 8px;
        background: #fff;
    }
    button[type="submit"] {
        padding: 0.75rem 1.5rem;
        background: #3b82f6;
        color: white;
        border: none;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
    }
    .todo-list {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }
    .todo-item {
        display: flex;
        align-items: center;
        padding: 1rem;
        background: #f8fafc;
        border-radius: 8px;
        gap: 1rem;
        transition: opacity 0.2s;
    }
    .todo-item.done {
        opacity: 0.6;
    }
    .todo-item.done .title {
        text-decoration: line-through;
    }
    .title {
        flex: 1;
        font-size: 1.1rem;
    }
    .priority-tag {
        font-size: 0.75rem;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        text-transform: uppercase;
        font-weight: bold;
    }
    .priority-tag.high { background: #fee2e2; color: #ef4444; }
    .priority-tag.medium { background: #fef3c7; color: #f59e0b; }
    .priority-tag.low { background: #dcfce7; color: #10b981; }
    
    .delete-btn {
        background: transparent;
        border: none;
        color: #94a3b8;
        font-size: 1.2rem;
        cursor: pointer;
        padding: 0.25rem;
    }
    .delete-btn:hover {
        color: #ef4444;
    }
    .empty {
        text-align: center;
        color: #64748b;
        font-style: italic;
    }
</style>
