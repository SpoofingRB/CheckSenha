document.addEventListener("DOMContentLoaded", () => {
    const btnDarkMode = document.getElementById("btnDarkMode");
    if (!btnDarkMode) return;

    const temaSalvo = localStorage.getItem("tema");
    if (temaSalvo === "escuro") {
        document.body.classList.add("dark-mode");
        btnDarkMode.innerHTML = '<i class="fa-solid fa-sun"></i>';
    }

    btnDarkMode.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        const modoEscuroAtivo = document.body.classList.contains("dark-mode");

        btnDarkMode.innerHTML = modoEscuroAtivo
            ? '<i class="fa-solid fa-sun"></i>'
            : '<i class="fa-solid fa-moon"></i>';

        localStorage.setItem("tema", modoEscuroAtivo ? "escuro" : "claro");
    });
});