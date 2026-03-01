import { api } from "./API-Client.js";

async function displayMembers() {
    const userList = document.getElementById('user-list');
    if(!userList) return;

    try {
        const allUsers = await api.getAllUsers();

        // Erst hier leeren wir den "Loading"-Text
        userList.innerHTML = "";

        if(!allUsers || allUsers.length === 0){
            userList.innerHTML = "<li>No members found.</li>";
            return;
        }

        allUsers.forEach(user => {
            const li = document.createElement("li");
            li.className = "member-item";

            li.innerHTML = `<strong>${user.username}</strong>`;

            userList.appendChild(li);
        });
    } catch (error) {
        console.error("Fehler beim Laden der Member:", error);
        userList.innerHTML = "<li>Error loading members.</li>";
    }
}

displayMembers();