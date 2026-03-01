<script>
    import { onMount } from 'svelte';
    import { api } from '../scripts/API-Client.js';
    import Auth from './Auth.svelte';

    let fromDate = new Date().toISOString().slice(0, 10);
    let toDate = new Date().toISOString().slice(0, 10);
    let loading = true;
    let user = null;

    function icsEscape(s = "") {
        return String(s).replace(/[\\,;]/g, "\\$&").replace(/\n/g, "\\n");
    }

    function toICS(events) {
        const lines = [
            "BEGIN:VCALENDAR",
            "VERSION:2.0",
            "PRODID:-//Procrasti-NET//EN",
        ];
        for (const e of events) {
            const uid = `${e.id}@procrasti-net`;
            // Simplified date formatting for ICS
            const dtStart = (e.startsAt || "").replace(/[-:]/g, "").split(".")[0] + "Z";
            const dtEnd = (e.endsAt || "").replace(/[-:]/g, "").split(".")[0] + "Z";
            lines.push(
                "BEGIN:VEVENT",
                `UID:${uid}`,
                `DTSTART:${dtStart}`,
                `DTEND:${dtEnd}`,
                `SUMMARY:${icsEscape(e.title)}`,
                "END:VEVENT"
            );
        }
        lines.push("END:VCALENDAR");
        return lines.join("\r\n");
    }

    async function handleExport() {
        if (!user) return;
        loading = true;
        try {
            const allTodos = await api.listTodos();
            // Filter by range and map to ICS events
            const events = allTodos
                .filter(todo => {
                    if (!todo.due_date) return false;
                    const date = todo.due_date.slice(0, 10);
                    return date >= fromDate && date <= toDate;
                })
                .map(todo => ({
                    ...todo,
                    startsAt: todo.due_date,
                    endsAt: todo.due_date // simplify for now, backend doesn't have duration
                }));

            const icsContent = toICS(events);
            const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `procrasti-net_${fromDate}_${toDate}.ics`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (e) {
            console.error("Export failed:", e);
        } finally {
            loading = false;
        }
    }

    async function checkUser() {
        loading = true;
        try {
            user = await api.getCurrentUser();
        } catch (e) {
            console.error("Auth check failed:", e);
        } finally {
            loading = false;
        }
    }

    onMount(checkUser);
</script>

<section class="panel">
    <h2>Calendar Export</h2>
    <p class="description">Export your planned tasks to an .ics file that you can import into Google Calendar, Outlook, or Apple Calendar.</p>

    {#if loading}
        <p>Checking authentication...</p>
    {:else if !user}
        <div class="auth-wrapper">
            <p>Please log in to use this feature.</p>
            <Auth />
        </div>
    {:else}
        <div class="export-box">
            <div class="field">
                <label for="icsFrom">From Date</label>
                <input type="date" id="icsFrom" bind:value={fromDate} />
            </div>
            <div class="field">
                <label for="icsTo">To Date</label>
                <input type="date" id="icsTo" bind:value={toDate} />
            </div>
            <button on:click={handleExport} disabled={loading}>
                {loading ? 'Exporting...' : 'Download .ics File'}
            </button>
        </div>
    {/if}
</section>

<style>
    .panel {
        padding: 2rem;
        background: #fdf2f8;
        border-radius: 12px;
        border: 1px solid #fce7f3;
        max-width: 500px;
        margin: 0 auto;
    }
    h2 {
        margin-top: 0;
        color: #9d174d;
    }
    .description {
        color: #64748b;
        margin-bottom: 2rem;
        line-height: 1.5;
    }
    .export-box {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }
    .field {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
    label {
        font-weight: 600;
        color: #475569;
        font-size: 0.9rem;
    }
    input[type="date"] {
        padding: 0.75rem;
        border: 1px solid #f9a8d4;
        border-radius: 8px;
    }
    button {
        margin-top: 0.5rem;
        padding: 1rem;
        background: #db2777;
        color: white;
        border: none;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.2s;
    }
    button:hover {
        background: #be185d;
    }
    button:disabled {
        background: #f472b6;
        cursor: not-allowed;
    }
    .auth-wrapper {
        text-align: center;
        padding: 2rem;
        background: white;
        border-radius: 8px;
        margin-top: 1rem;
        box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    }
    .auth-wrapper p {
        margin-bottom: 1.5rem;
        color: #64748b;
    }
</style>
