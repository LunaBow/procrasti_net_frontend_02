<script>
    export let skill;
</script>

<article class="card">
    <h3>{skill.name}</h3>
    <p class="muted">{skill.description || ""}</p>
    <div class="tags">
        <span class="tag">{skill.difficulty_level ?? "?"}/5</span>
        <span class="tag">{skill.energy_required ?? "?"}</span>
        <span class="tag">{skill.evidence_level ?? "?"}</span>
    </div>
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
