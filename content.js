function simulateTyping(element, text) {
    element.focus();
    element.value = "";
    for (let char of text) {
        element.value += char;
        element.dispatchEvent(new Event("input", { bubbles: true }));
    }
    element.dispatchEvent(new Event("change", { bubbles: true }));
}

function attemptLogin() {
    chrome.storage.local.get(["username", "password", "enabled"], (data) => {

        if (!data.enabled) return;

        const userField = document.querySelector('input[type="text"]');
        const passField = document.querySelector('input[type="password"]');
        const loginButton = document.querySelector('button, input[type="submit"]');

        if (userField && passField && loginButton) {

            simulateTyping(userField, data.username);
            simulateTyping(passField, data.password);

            setTimeout(() => {
                loginButton.click();

                setTimeout(() => {
                    const stillLoginPage = document.querySelector('input[type="password"]');

                    if (!stillLoginPage) {
                        chrome.runtime.sendMessage({ type: "login_success" });
                    } else {
                        chrome.runtime.sendMessage({ type: "login_failed" });
                    }

                }, 4000);

            }, 500);
        }
    });
}

setTimeout(attemptLogin, 2000);
