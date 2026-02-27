function navigateTo(sectionId) {
    const sections = [
        "BootVisible",
        "EvaluationVisible",
        "RequiredVisible",
        "JoinContent",
        "ArtVisible",
        "MemberVisible",
        "picsOnly",
        "avOnly",
        "booksOnly"
    ];

    sections.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = "none";
    });

    const target = document.getElementById(sectionId);
    if (target) target.style.display = "block";
}

window.addEventListener("DOMContentLoaded", () => {
    const hash = window.location.hash;

    const simpleRoutes = {
        "#boot": "BootVisible",
        "#evaluation": "EvaluationVisible",
        "#members": "MemberVisible",
        "#required": "RequiredVisible",
        "#artworks": "ArtVisible"
    };

    // 1. Prüfen, ob es eine normale Hauptseite ist
    if (simpleRoutes[hash]) {
        navigateTo(simpleRoutes[hash]);
        if (hash === "#artworks") {
            // Alles zeigen
            ["artGallery", "avGallery", "BookGallery", "uploadArt"].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.style.display = "block";
            });
            initGallery();
        }
    }
    // 2. Prüfen, ob es einer deiner Unter-Hashes ist
    else if (["#picsOnly", "#avOnly", "#booksOnly"].includes(hash)) {
        // Zuerst zur Art-Sektion navigieren
        navigateTo("ArtVisible");

        // Jetzt den entsprechenden Klick-Handler "feuern" lassen
        const mapping = {
            "#picsOnly": "showPicsOnly",
            "#avOnly": "showAVOnly",
            "#booksOnly": "showBooksOnly"
        };

        const btnId = mapping[hash];
        const btn = document.getElementById(btnId);
        if (btn) btn.click(); // Das führt deinen bereits geschriebenen Code für den Filter aus!
    }
    // 3. Fallback zur Startseite
    else {
        navigateTo("JoinContent");
    }
});

document.getElementById("triggerEvaluation").addEventListener("click", function() {
    document.getElementById("EvaluationVisible").style.display = "block";
    document.getElementById("RequiredVisible").style.display = "none";
    document.getElementById("JoinContent").style.display = "none";
    document.getElementById("ArtVisible").style.display = "none";
    document.getElementById("BootVisible").style.display = "none";
    window.location.hash = "evaluation";
})
document.getElementById("triggerRequired").addEventListener("click", function() {
    document.getElementById("RequiredVisible").style.display = "block";
    document.getElementById("EvaluationVisible").style.display = "none";
    document.getElementById("JoinContent").style.display = "none";
    document.getElementById("ArtVisible").style.display = "none";
    document.getElementById("MemberVisible").style.display = "none";
    document.getElementById("BootVisible").style.display = "none";
    window.location.hash = "required";
})

document.getElementById("triggerArt").addEventListener("click", function() {
    document.getElementById("uploadArt").style.display = "block";
    document.getElementById("ArtVisible").style.display = "block";
    document.getElementById("RequiredVisible").style.display = "none";
    document.getElementById("EvaluationVisible").style.display = "none";
    document.getElementById("JoinContent").style.display = "none";
    document.getElementById("MemberVisible").style.display = "none";
    document.getElementById("BookGallery").style.display = "block";
    document.getElementById("avGallery").style.display = "block";
    document.getElementById("artGallery").style.display = "block";
    document.getElementById("BootVisible").style.display = "none";
    window.location.hash = "artworks";
    initGallery();
})

document.getElementById("TriggerMember").addEventListener("click", function() {
    document.getElementById("MemberVisible").style.display = "block";
    document.getElementById("ArtVisible").style.display = "none";
    document.getElementById("RequiredVisible").style.display = "none";
    document.getElementById("EvaluationVisible").style.display = "none";
    document.getElementById("JoinContent").style.display = "none";
    document.getElementById("BootVisible").style.display = "none";
    window.location.hash = "members";
    displayMembers();
})

document.getElementById("showPicsOnly").addEventListener("click", function() {
    navigateTo("ArtVisible");
    document.getElementById("uploadArt").style.display = "none";
    document.getElementById("BookGallery").style.display = "none";
    document.getElementById("avGallery").style.display = "none";
    document.getElementById("artGallery").style.display = "block";
    window.location.hash = "picsOnly";
    initGallery();
})

document.getElementById("showAVOnly").addEventListener("click", function() {
    navigateTo("ArtVisible");
    document.getElementById("uploadArt").style.display = "none";
    document.getElementById("BookGallery").style.display = "none";
    document.getElementById("avGallery").style.display = "block";
    document.getElementById("artGallery").style.display = "none";
    window.location.hash = "avOnly";
    initGallery();
})

document.getElementById("showBooksOnly").addEventListener("click", function() {
    navigateTo("ArtVisible");
    document.getElementById("uploadArt").style.display = "none";
    document.getElementById("BookGallery").style.display = "block";
    document.getElementById("avGallery").style.display = "none";
    document.getElementById("artGallery").style.display = "none";
    window.location.hash = "booksOnly";
    initGallery();
})

document.getElementById("headerHeading").addEventListener("click", function() {
    document.getElementById("EvaluationVisible").style.display = "none";
    document.getElementById("RequiredVisible").style.display = "none";
    document.getElementById("JoinContent").style.display = "block";
    document.getElementById("ArtVisible").style.display = "none";
    document.getElementById("BootVisible").style.display = "none";
    window.location.hash = "home";
})

document.getElementById("triggerBoot").addEventListener("click", function() {
    document.getElementById("BootVisible").style.display = "block";
    document.getElementById("EvaluationVisible").style.display = "none";
    document.getElementById("RequiredVisible").style.display = "none";
    document.getElementById("JoinContent").style.display = "none";
    document.getElementById("ArtVisible").style.display = "none";
    window.location.hash = "boot";
})

const map = [
    ["triggerSkills", "SkillsVisible"],
    ["triggerTodos", "TodosVisible"],
    ["triggerHabits", "HabitsVisible"],
    ["triggerPlanner", "PlannerVisible"],
    ["triggerCalendar", "CalendarVisible"],
    ["triggerSettings", "SettingsVisible"],
];

function show(id) {
    for (const [, panel] of map) {
        const el = document.getElementById(panel);
        if (el) el.style.display = panel === id ? "block" : "none";
    }
}

for (const [btn, panel] of map) {
    document.getElementById(btn)?.addEventListener("click", () => show(panel));
}