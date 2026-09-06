const videoUrl = document.getElementById("videoUrl");

const pasteBtn = document.getElementById("pasteBtn");

const downloadBtn =
  document.getElementById("downloadBtn");

const statusBox =
  document.getElementById("status");

const installBtn =
  document.getElementById("installBtn");

const installTop =
  document.getElementById("installTop");

const installModal =
  document.getElementById("installModal");

const closeModal =
  document.getElementById("closeModal");

const closeModalButton =
  document.getElementById("closeModalButton");


// ----------------------------------
// STATUS
// ----------------------------------

function showStatus(message) {

  statusBox.textContent = message;

}


// ----------------------------------
// CHECK URL
// ----------------------------------

function isTikTokUrl(value) {

  try {

    const url = new URL(value);

    const host =
      url.hostname.toLowerCase();

    return (
      host === "tiktok.com" ||
      host.endsWith(".tiktok.com")
    );

  } catch {

    return false;

  }

}


// ----------------------------------
// PASTE
// ----------------------------------

pasteBtn.addEventListener("click", async () => {

  try {

    const text =
      await navigator.clipboard.readText();

    if (!text) {

      showStatus(
        "Your clipboard is empty."
      );

      return;
    }

    videoUrl.value = text;

    showStatus(
      "Link pasted successfully."
    );

  } catch {

    videoUrl.focus();

    showStatus(
      "Please paste the link manually."
    );

  }

});


// ----------------------------------
// MAIN DOWNLOAD
// ----------------------------------

downloadBtn.addEventListener("click", () => {

  const url =
    videoUrl.value.trim();

  if (!url) {

    showStatus(
      "Please paste a video link first."
    );

    videoUrl.focus();

    return;
  }

  if (!isTikTokUrl(url)) {

    showStatus(
      "Please enter a valid TikTok link."
    );

    return;
  }

  /*
    IMPORTANT:

    This frontend does not directly scrape TikTok.

    The authorized download/processing backend
    will be connected here later.

    Example:

    fetch("/api/process", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        url: url
      })
    });
  */

  showStatus(
    "Link accepted. Download processing will be connected next."
  );

});


// ----------------------------------
// DOWNLOAD OPTIONS
// ----------------------------------

document
  .querySelectorAll(".option-download")
  .forEach(button => {

    button.addEventListener("click", () => {

      const url =
        videoUrl.value.trim();

      if (!url) {

        showStatus(
          "Paste your video link first."
        );

        videoUrl.focus();

        return;
      }

      if (!isTikTokUrl(url)) {

        showStatus(
          "Please enter a valid TikTok link."
        );

        return;
      }

      const type =
        button.dataset.type;

      if (type === "normal") {

        showStatus(
          "Normal video selected."
        );

      }

      if (type === "hd") {

        showStatus(
          "HD video selected."
        );

      }

      if (type === "audio") {

        showStatus(
          "Audio option selected."
        );

      }

      /*
        Backend processing will be connected
        to these buttons later.
      */

    });

  });


// ----------------------------------
// INSTALL MODAL
// ----------------------------------

function openInstallModal() {

  installModal.classList.add("show");

}

function closeInstallModal() {

  installModal.classList.remove("show");

}

installBtn.addEventListener(
  "click",
  openInstallModal
);

installTop.addEventListener(
  "click",
  openInstallModal
);

closeModal.addEventListener(
  "click",
  closeInstallModal
);

closeModalButton.addEventListener(
  "click",
  closeInstallModal
);

installModal.addEventListener(
  "click",
  function(event) {

    if (event.target === installModal) {

      closeInstallModal();

    }

  }
);


// ----------------------------------
// ANDROID PWA INSTALL
// ----------------------------------

let deferredPrompt = null;

window.addEventListener(
  "beforeinstallprompt",
  event => {

    event.preventDefault();

    deferredPrompt = event;

  }
);


// ----------------------------------
// ENTER KEY
// ----------------------------------

videoUrl.addEventListener(
  "keydown",
  event => {

    if (event.key === "Enter") {

      downloadBtn.click();

    }

  }
);
