/* ===============================
   XP BAR ANIMATION
================================*/
window.addEventListener("load", () => {
    const xpBar = document.querySelector(".progress-bar");

    setTimeout(() => {
        xpBar.style.width = "85%";
    }, 500);
});


/* ===============================
   TERMINAL COMMAND SYSTEM
================================*/
const commandInput = document.getElementById("command");
const terminal = document.getElementById("terminal");

commandInput.addEventListener("keydown", function(e) {

    if (e.key === "Enter") {

        const value = this.value.toLowerCase().trim();
        terminal.innerHTML += "<br>> " + value;

        switch(value){

            case "skills":
                terminal.innerHTML +=
                "<br>HTML, CSS, JavaScript, UI Design, Startup Strategy";
                break;

            case "projects":
                terminal.innerHTML +=
                "<br>Neon Battle Engine, Cosmic FLAMES, Galaxy UI Framework";
                break;

            case "founder":
                terminal.innerHTML +=
                "<br>Founder of Cosmic Labs – Interactive Web Startup.";
                break;

            case "hire":
                terminal.innerHTML +=
                "<br>You don't hire me. We collaborate 🚀";
                break;

            case "help":
                terminal.innerHTML +=
                "<br>Available commands: skills | projects | founder | hire";
                break;

            default:
                terminal.innerHTML += "<br>Unknown command.";
        }

        terminal.scrollTop = terminal.scrollHeight;
        this.value = "";
    }
});


/* ===============================
   OPTIONAL STARFIELD EFFECT
================================*/
for(let i = 0; i < 150; i++){
    let star = document.createElement("div");

    star.style.position = "fixed";
    star.style.width = "2px";
    star.style.height = "2px";
    star.style.background = "white";
    star.style.opacity = "0.7";
    star.style.left = Math.random() * 100 + "vw";
    star.style.top = Math.random() * 100 + "vh";
    star.style.zIndex = "-1";

    document.body.appendChild(star);
}


/* ===============================
   SMOOTH SCROLL (OPTIONAL)
================================*/
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function(e){
        e.preventDefault();
        document.querySelector(this.getAttribute("href"))
            .scrollIntoView({
                behavior: "smooth"
            });
    });
});
