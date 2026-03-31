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
        alert("Settings saved!");
    });

    loadStatusAndLogs(); // ✅ call here

});


function loadStatusAndLogs() {
    chrome.storage.local.get(["currentStatus", "logs"], (data) => {

        document.getElementById("statusText").innerText =
            data.currentStatus || "Unknown";

        const logsDiv = document.getElementById("logs");
        logsDiv.innerHTML = "";

        if (data.logs) {
            data.logs.forEach(log => {
                const p = document.createElement("p");
                p.textContent = `${log.time} - ${log.message}`;
                logsDiv.appendChild(p);
            });
        }

        // ✅ MOVE THIS INSIDE CALLBACK
        const container = document.getElementById("container");

        if (data.currentStatus && container) {
            container.classList.remove(
                "status-checking",
                "status-connected",
                "status-disconnected"
            );

            container.classList.add("status-" + data.currentStatus);
        }

    });
}