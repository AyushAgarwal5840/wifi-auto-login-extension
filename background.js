function setStatus(status) {
    let color = "#999";
    let text = "…";

    if (status === "connected") {
        color = "#28a745";
        text = "ON";
    } else if (status === "disconnected") {
        color = "#dc3545";
        text = "OFF";
    } else if (status === "checking") {
        color = "#ffc107";
        text = "...";
    }

    chrome.action.setBadgeText({ text: text });
    chrome.action.setBadgeBackgroundColor({ color: color });

    chrome.storage.local.set({ currentStatus: status });
}

async function checkInternet() {
    setStatus("checking");

    try {
        await fetch("http://clients3.google.com/generate_204");
        setStatus("connected");
        logEvent("Internet Connected");
    } catch (e) {
        setStatus("disconnected");
        logEvent("Internet Disconnected");
        openPortalTab();
    }
}

function openPortalTab() {
    chrome.tabs.query({}, function (tabs) {
        let existing = tabs.find(tab =>
            tab.url && tab.url.includes("172.22.2.6")
        );

        if (existing) {
            chrome.tabs.update(existing.id, { active: false });
        } else {
            chrome.tabs.create({
                url: "https://172.22.2.6/connect/PortalMain",
                active: false
            });
        }
    });
}

function logEvent(message) {
    chrome.storage.local.get(["logs"], function (data) {
        let logs = data.logs || [];
        logs.unshift({
            message: message,
            time: new Date().toLocaleString()
        });
        logs = logs.slice(0, 10);
        chrome.storage.local.set({ logs: logs });
    });
}

chrome.alarms.create("internetCheck", { periodInMinutes: 180 });

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "internetCheck") {
        checkInternet();
    }
});

chrome.runtime.onMessage.addListener((message) => {
    if (message.type === "login_success") {
        setStatus("connected");
        logEvent("Login Successful");
    }

    if (message.type === "login_failed") {
        setStatus("disconnected");
        logEvent("Login Failed");
    }
});
