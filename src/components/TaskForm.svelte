<script lang="ts">
    import { api } from "../lib/apiClient.ts";

    let title = "";

    async function submit() {
        await api.createTask({ title, completed: false });
        title = "";
    }
</script>

<input bind:value={title} placeholder="New task" />
<button on:click={submit}>Add</button>