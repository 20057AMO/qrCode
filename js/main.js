const imgBox = document.getElementById("imgBox");
const qrImage = document.getElementById("qrImage");
const qrText = document.getElementById("qrText");
const generateBtn = document.getElementById("generateBtn");
const downloadBtn = document.getElementById("downloadBtn");
const loading = document.getElementById("loading");
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");

// Theme Icons (Lucide-like SVG paths)
const sunIcon = `<circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path>`;
const moonIcon = `<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>`;

// Initialize Theme
function initTheme() {
    const savedTheme = localStorage.getItem("theme") || "dark"; // Default to dark as per recent user preference
    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
        themeIcon.innerHTML = sunIcon;
    } else {
        document.body.classList.remove("dark-mode");
        themeIcon.innerHTML = moonIcon;
    }
}

themeToggle.addEventListener("click", () => {
    const isDark = document.body.classList.toggle("dark-mode");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    themeIcon.innerHTML = isDark ? sunIcon : moonIcon;
});

// QR Generation Logic
function generateQR() {
    const text = qrText.value.trim();
    if (text.length > 0) {
        qrImage.classList.add("hidden");
        loading.classList.remove("hidden");
        imgBox.classList.add("show-img");
        
        const size = "200x200";
        const url = `https://api.qrserver.com/v1/create-qr-code/?size=${size}&margin=1&data=${encodeURIComponent(text)}`;
        
        qrImage.src = url;
        
        qrImage.onload = () => {
            loading.classList.add("hidden");
            qrImage.classList.remove("hidden");
            downloadBtn.classList.remove("hidden");
        };
        
        qrImage.onerror = () => {
            loading.classList.add("hidden");
            alert("Error generating QR code. Please try again.");
        };

    } else {
        qrText.classList.add("error");
        setTimeout(() => {
            qrText.classList.remove("error");
        }, 1000);
    }
}

async function downloadQR() {
    if (!qrImage.src) return;
    
    try {
        const response = await fetch(qrImage.src);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `QR_Code_${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error("Download failed:", error);
        alert("Failed to download image.");
    }
}

// Call init on load
initTheme();