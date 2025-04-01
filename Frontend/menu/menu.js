document.addEventListener("DOMContentLoaded", () => {
    const btnDarkMode = document.getElementById("btn-dark-mode");

    // Aplicar el modo oscuro si estaba activado
    if (localStorage.getItem("dark-mode") === "enabled") {
        document.body.classList.add("dark-mode");
        if (btnDarkMode) btnDarkMode.textContent = "☀️";
    }

    if (btnDarkMode) {
        btnDarkMode.addEventListener("click", () => {
            document.body.classList.toggle("dark-mode");

            if (document.body.classList.contains("dark-mode")) {
                localStorage.setItem("dark-mode", "enabled");
                btnDarkMode.textContent = "☀️";
            } else {
                localStorage.setItem("dark-mode", "disabled");
                btnDarkMode.textContent = "🌑";
            }
        });
    }
});
