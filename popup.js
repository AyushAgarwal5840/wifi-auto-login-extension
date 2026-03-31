document.addEventListener("DOMContentLoaded", () => {

    

    const button = document.getElementById("save");
    const username = document.getElementById("username");
    const password = document.getElementById("password");
    const enabled = document.getElementById("enabled");

    // Load saved data
    chrome.storage.local.get(["username", "password", "enabled"], (data) => {
        if (data.username) username.value = data.username;
        if (data.password) password.value = data.password;
        enabled.checked = data.enabled ?? true;
    });

    // 🔥 SINGLE CLICK HANDLER (Ripple + Save)
    if (button) {
        button.addEventListener("click", function (e) {

            // 💧 Ripple effect
            const circle = document.createElement("span");
            circle.classList.add("ripple");

            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);

            circle.style.width = circle.style.height = size + "px";
            circle.style.left = e.clientX - rect.left - size / 2 + "px";
            circle.style.top = e.clientY - rect.top - size / 2 + "px";

            button.appendChild(circle);
            setTimeout(() => circle.remove(), 600);

            // 💾 Save logic
            chrome.storage.local.set({
                username: username.value,
                password: password.value,
                enabled: enabled.checked
            });

            if (!enabled.checked) {
                chrome.storage.local.set({ currentStatus: "disconnected" });
            }

            alert("Settings saved!");
        });
    }

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

        if (data.currentStatus === "connected") {
    statusText.innerText = "Connected";
    statusText.className = "status-connected-text";
}

        // 📜 LOGS
        logsDiv.innerHTML = "";

        if (data.logs) {
            data.logs.forEach((log, index) => {
                const p = document.createElement("p");
                p.classList.add("log-item");
                p.style.animationDelay = `${index * 0.1}s`;
                p.textContent = `${log.time} - ${log.message}`;
                logsDiv.appendChild(p);
            });
        }

        // 🎨 STATUS CLASS FIX
        container.classList.remove(
            "status-checking",
            "status-connected",
            "status-disconnected",
            "status-paused"   // ✅ IMPORTANT FIX
        );

        if (!data.enabled) {
            container.classList.add("status-paused");
        } else if (data.currentStatus) {
            container.classList.add("status-" + data.currentStatus);
        }
    });
}