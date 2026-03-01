<script>
    import { api } from '../../../lib/api';

    let isLogin = true;
    let error = "";
    let formData = {
        email: "",
        password: "",
        display_name: "",
    };

    async function handleSubmit() {
        error = "";
        try {
            if (isLogin) {
                await api.login({
                    email: formData.email,
                    password: formData.password
                });
                window.location.href = "/";
            } else {
                await api.register({
                    email: formData.email,
                    password: formData.password,
                    display_name: formData.display_name || formData.email.split("@")[0],
                    handle: formData.email.split("@")[0],
                });
                isLogin = true;
                error = "Registrierung erfolgreich! Bitte logge dich jetzt ein.";
            }
        } catch (err) {
            console.error(err);
            error = err.message || "Operation failed";
        }
    }
</script>

<div class="flex items-center justify-center p-4">
    <div class="w-full max-w-md bg-white rounded-xl border border-gray-200 shadow-md overflow-hidden">
        <div class="p-8">
            <div class="flex justify-between items-baseline mb-6">
                <div>
                    <h3 class="text-2xl font-bold text-gray-900">
                        {isLogin ? "Login" : "Registrieren"}
                    </h3>
                    <p class="text-sm text-gray-500 mt-1">
                        {isLogin ? "Gib deine E-Mail ein, um dich einzuloggen." : "Erstelle ein Konto, um loszulegen."}
                    </p>
                </div>
                <button 
                    class="text-sm text-blue-600 hover:text-blue-800 font-semibold"
                    on:click={() => { isLogin = !isLogin; error = ""; }}
                >
                    {isLogin ? "Neu hier?" : "Schon dabei?"}
                </button>
            </div>

            <form on:submit|preventDefault={handleSubmit} class="space-y-5">
                {#if error}
                    <div class={`text-sm font-medium p-3 rounded-lg border ${error.includes('erfolgreich') ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                        {error}
                    </div>
                {/if}

                <div class="space-y-1.5">
                    <label for="email" class="text-sm font-semibold text-gray-700">E-Mail</label>
                    <input
                        id="email"
                        type="email"
                        required
                        class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-sm transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                        bind:value={formData.email}
                        placeholder="name@example.com"
                    />
                </div>

                {#if !isLogin}
                    <div class="space-y-1.5">
                        <label for="display_name" class="text-sm font-semibold text-gray-700">Anzeigename</label>
                        <input
                            id="display_name"
                            type="text"
                            required
                            class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-sm transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                            bind:value={formData.display_name}
                            placeholder="Dein Name"
                        />
                    </div>
                {/if}

                <div class="space-y-1.5">
                    <label for="password" class="text-sm font-semibold text-gray-700">Passwort</label>
                    <input
                        id="password"
                        type="password"
                        required
                        class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-sm transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                        bind:value={formData.password}
                        placeholder="••••••••"
                    />
                </div>

                <button 
                    type="submit" 
                    class="w-full inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-[0.98]"
                >
                    {isLogin ? "Einloggen" : "Konto erstellen"}
                </button>
            </form>
        </div>
    </div>
</div>
