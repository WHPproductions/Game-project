const html = document.querySelector("html");
const thunder = new Audio('assets/thunder.mp3');

function menuPlay() {
  html.setAttribute("class", "dark");
  thunder.play()
  setTimeout(function () {
    window.location.href = "game/game.html";
  }, 5000);
}
