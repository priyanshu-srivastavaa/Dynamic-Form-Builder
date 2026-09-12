themeBtn.addEventListener("click", function () {
    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
        localStorage.setItem("theme", "dark");
        themeBtn.textContent = "☀ Light Mode";
    } else {
        localStorage.setItem("theme", "light");
        themeBtn.textContent = "🌙 Dark Mode";
    }
});

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "light") {
    document.body.classList.remove("dark");
    themeBtn.textContent = "🌙 Dark Mode";
} else {
    document.body.classList.add("dark");
    themeBtn.textContent = "☀ Light Mode";
}
