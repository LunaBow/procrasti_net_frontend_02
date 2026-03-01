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
            await api.updateTodo(todo.id, { 
                title: todo.title,
                status: newStatus 
            });
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
            <p>Please log in to use this feature.</p>
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
