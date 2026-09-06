const API_URL = "https://snaptok-api.frewshfricky.workers.dev";

const videoUrl = document.getElementById("videoUrl");
const pasteBtn = document.getElementById("pasteBtn");
const downloadBtn = document.getElementById("downloadBtn");
const statusBox = document.getElementById("status");

const installBtn = document.getElementById("installBtn");
const installModal = document.getElementById("installModal");
const closeModal = document.getElementById("closeModal");
const closeModalButton = document.getElementById("closeModalButton");

let deferredPrompt = null;

function showStatus(message, type = "info") {
    if (!statusBox) return;

    statusBox.textContent = message;
    statusBox.className = "status " + type;
    statusBox.style.display = "block";
}

function isTikTokUrl(value) {
    try {
        const url = new URL(value);
        const host = url.hostname.toLowerCase();

        return (
            host === "tiktok.com" ||
            host.endsWith(".tiktok.com")
        );
    } catch {
        return false;
    }
}

async function validateWithAPI(url) {
    const response = await fetch(`${API_URL}/api/validate`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            url: url
        })
    });

    return await response.json();
}

// Paste button
if (pasteBtn) {
    pasteBtn.addEventListener("click", async () => {
        try {
            const text = await navigator.clipboard.readText();

            if (!text) {
                showStatus("Your clipboard is empty.", "error");
                return;
            }

            videoUrl.value = text.trim();

            showStatus("Link pasted successfully.", "success");

        } catch (error) {
            showStatus(
                "Clipboard access was blocked. Please paste the link manually.",
                "error"
            );
        }
    });
}

// Main Download button
if (downloadBtn) {
    downloadBtn.addEventListener("click", async () => {

        const url = videoUrl.value.trim();

        if (!url) {
            showStatus("Please paste a TikTok link first.", "error");
            return;
        }

        if (!isTikTokUrl(url)) {
            showStatus("Please enter a valid TikTok URL.", "error");
            return;
        }

        downloadBtn.disabled = true;
        downloadBtn.textContent = "Checking...";

        showStatus("Connecting to SnapTok...", "info");

        try {
            const result = await validateWithAPI(url);

            if (!result.success) {
                showStatus(
                    result.error || "Unable to process this link.",
                    "error"
                );
                return;
            }

            showStatus(
                "✓ Link accepted! The SnapTok processing system is connected.",
                "success"
            );

            console.log("SnapTok API response:", result);

        } catch (error) {
            console.error(error);

            showStatus(
                "SnapTok server could not be reached. Please try again.",
                "error"
            );

        } finally {
            downloadBtn.disabled = false;
            downloadBtn.textContent = "Download";
        }
    });
}

// Download option buttons
document.querySelectorAll(".option-download").forEach(button => {

    button.addEventListener("click", async () => {

        const url = videoUrl.value.trim();
        const type = button.dataset.type || "normal";

        if (!url) {
            showStatus("Paste a TikTok link first.", "error");
            return;
        }

        if (!isTikTokUrl(url)) {
            showStatus("Please enter a valid TikTok URL.", "error");
            return;
        }

        showStatus(`Checking link for ${type} download...`, "info");

        try {

            const result = await validateWithAPI(url);

            if (!result.success) {
                showStatus(
                    result.error || "Unable to process this link.",
                    "error"
                );
                return;
            }

            showStatus(
                `✓ ${type.toUpperCase()} option selected. Processing will be connected next.`,
                "success"
            );

        } catch (error) {

            console.error(error);

            showStatus(
                "Unable to connect to the SnapTok server.",
                "error"
            );
        }
    });

});

// Install prompt
window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredPrompt = event;
});

// Install button
if (installBtn) {
    installBtn.addEventListener("click", async () => {

        if (deferredPrompt) {

            deferredPrompt.prompt();

            const choice = await deferredPrompt.userChoice;

            console.log("Install choice:", choice.outcome);

            deferredPrompt = null;

        } else {

            if (installModal) {
                installModal.style.display = "flex";
            }
        }
    });
}

// Close install modal
if (closeModal) {
    closeModal.addEventListener("click", () => {
        installModal.style.display = "none";
    });
}

if (closeModalButton) {
    closeModalButton.addEventListener("click", () => {
        installModal.style.display = "none";
    });
}

// Close modal when clicking outside
if (installModal) {
    installModal.addEventListener("click", (event) => {

        if (event.target === installModal) {
            installModal.style.display = "none";
        }

    });
}

// Enter key submits
if (videoUrl) {
    videoUrl.addEventListener("keydown", (event) => {

        if (event.key === "Enter") {
            event.preventDefault();

            if (downloadBtn) {
                downloadBtn.click();
            }
        }

    });
}
