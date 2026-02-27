class APIClient {
    baseUrl;
    constructor() {
        this.baseUrl = "https://mt242001-10925.node.ustp.cloud";
    }

    getHeaders(isFormData = false) {
        const token = localStorage.getItem("jwt");

        const headers = {
            ...(token ? { "Authorization": `Bearer ${token}` } : {}),
            ...(!isFormData ? { "Content-Type": "application/json" } : {})
        };

        return headers;
    }

    async login(username, password) {
        const res = await fetch(`${this.baseUrl}/login`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify({ username, password })
        });

        if (!res.ok) {
            throw new Error("Login failed");
        }

        const data = await res.json();
        if (data.token) {
            localStorage.setItem('jwt', data.token);
        }
        return data;
    }

    async register(username, password) {
        const res = await fetch(`${this.baseUrl}/user`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify({
                username,
                password,
                profileDescription: "member" // Dein Standard-Wert
            })
        });

        if (!res.ok) {
            throw new Error('Registration failed');
        }
        const contentType = res.headers.get('content-type');
        if(contentType && contentType.includes("application/json")) {
            return res.json();
        }
        return {success: true}; // Falls kein JSON zurückgegeben wird, aber der Status OK ist
    }

    logout() {
        localStorage.removeItem('jwt');
        window.location.reload(); // Seite neu laden, um UI zu resetten
    }

    async getCurrentUser() {
        const res = await fetch(`${this.baseUrl}/me`, { headers: this.getHeaders() });
        return res.ok ? await res.json() : null;
    }

    async uploadBook(data) {
        const res = await fetch(`${this.baseUrl}/book`, {
            method: "POST",
            headers: this.getHeaders(),
            body: JSON.stringify(data),
        });
        return res.json();
    }

    async uploadDrawing(data, file) {
        const res = await fetch(`${this.baseUrl}/artwork`, {
            method: "POST",
            headers: this.getHeaders(),
            body: JSON.stringify(data),
        });
        const artwork = await res.json();
        // Schritt 2: Bild-Upload (falls vorhanden)
        if (file && artwork.artworkId) {
            const formData = new FormData();
            formData.append("image", file);
            await fetch(`${this.baseUrl}/artwork/${artwork.artworkId}/image`, {
                method: "POST",
                headers: this.getHeaders(true), // true wegen FormData
                body: formData,
            });
        }
        return artwork;
    }

    async uploadAV(data) {
        const res = await fetch(`${this.baseUrl}/av`, {
            method: "POST",
            headers: this.getHeaders(),
            body: JSON.stringify(data),
        });
        return res.json();
    }

    async getAllUsers() {
        try{
            const res = await fetch(`${this.baseUrl}/user`, {
                method: 'GET',
                headers: this.getHeaders()
            });
            if (!res.ok) {
                throw new Error('Failed to fetch users');
            }
            return await res.json();
        }catch (e){
            console.error("Error in getAllUsers:", e);
            return [];
        }
    }

    async getBooks(){
        const res = await fetch(`${this.baseUrl}/book`, {headers: this.getHeaders()});
        if (!res.ok) return [];
        return await res.json();
    }

    async getArtworks(){
        const res = await fetch(`${this.baseUrl}/artwork`, {headers: this.getHeaders()});
        if (!res.ok) return [];
        return await res.json();
    }

    async getAVs() {
        const res = await fetch(`${this.baseUrl}/av`, { headers: this.getHeaders() });
        if (!res.ok) return [];
        return await res.json();
    }
}
export const api = new APIClient();