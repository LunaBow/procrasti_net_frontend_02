<script>
    export let skill;
</script>

<article class="card">
    <h3>{skill.title}</h3>
    <p class="muted">{skill.description || ""}</p>

    <div class="tags">
        <span class="tag">{skill.difficulty ?? "?"}/5</span>
        {#if skill.category}
            <span class="tag">{skill.category}</span>
        {/if}
    </div>

    {#if skill.tags?.length}
        <div class="tags">
            {#each skill.tags as t}
                <span class="tag">{t}</span>
            {/each}
        </div>
    {/if}
</article>

<style>
    .card {
        padding: 1rem;
        border: 1px solid #ccc;
        border-radius: 8px;
        background: #fff;
    }
    .muted {
        color: #666;
        font-size: 0.9rem;
    }
    .tags {
        display: flex;
        gap: 0.5rem;
        margin-top: 1rem;
    }
    .tag {
        background: #eee;
        padding: 0.2rem 0.5rem;
        border-radius: 4px;
        font-size: 0.8rem;
    }
</style>