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