document.addEventListener("DOMContentLoaded", () => {

    const username = document.getElementById("username");
    const password = document.getElementById("password");
    const enabled = document.getElementById("enabled");

    chrome.storage.local.get(["username", "password", "enabled"], (data) => {
        if (data.username) username.value = data.username;
        if (data.password) password.value = data.password;
        enabled.checked = data.enabled ?? true;
    });

    document.getElementById("save").addEventListener("click", () => {
        chrome.storage.local.set({
            username: username.value,
            password: password.value,
            enabled: enabled.checked
        });

        // ✅ Reset status if disabled
        if (!enabled.checked) {
            chrome.storage.local.set({ currentStatus: "disconnected" });
        }

        alert("Settings saved!");
    });

    loadStatusAndLogs();
});


function loadStatusAndLogs() {
    chrome.storage.local.get(["currentStatus", "logs", "enabled"], (data) => {

        const statusText = document.getElementById("statusText");
        const logsDiv = document.getElementById("logs");
        const container = document.getElementById("container");

        // 🧠 STATUS TEXT
        if (!data.enabled) {
            statusText.innerText = "⏸ Auto Login Paused";
        } else {
            statusText.innerText = data.currentStatus || "Unknown";
        }

        // 🧠 CLEAR LOGS
        logsDiv.innerHTML = "";

        if (data.logs) {
            data.logs.forEach(log => {
                const p = document.createElement("p");
                p.textContent = `${log.time} - ${log.message}`;
                logsDiv.appendChild(p);
            });
        }

        // 🎨 ANIMATION STATE
        container.classList.remove(
            "status-checking",
            "status-connected",
            "status-disconnected"
        );

        if (!data.enabled) {
    container.classList.add("status-paused");
} else if (data.currentStatus) {
    container.classList.add("status-" + data.currentStatus);
}
    });
}