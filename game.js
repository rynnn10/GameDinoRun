var isMoving = true;
var isPaused = false;
var isJumping = false; // Flag untuk memeriksa apakah Dino sedang melompat
var backgroundMusic = document.getElementById("backgroundMusic"); // Dapatkan elemen audio

// Mulai memutar musik latar saat game dimulai
window.onload = function () {
  backgroundMusic.play(); // Otomatis memulai musik latar ketika halaman dimuat
};

function setBackgroundMoving() {
  if (isMoving && !isPaused) {
    setTimeout(function () {
      var bg = document.getElementById("board");
      bg.style.backgroundPosition =
        parseInt(bg.style.backgroundPosition.replace("px", "")) - 1 + "px";

      document.getElementById("score").innerHTML =
        parseInt(document.getElementById("score").innerHTML) + 1;
      setBackgroundMoving();
    }, 5);
  }
}

setBackgroundMoving();

function resetGame() {
  isMoving = true;
  isPaused = false;
  isJumping = false; // Reset flag saat game di-reset
  document.getElementById("dino").setAttribute("class", "");
  document.getElementById("box").style.marginLeft = "600px";
  document.getElementById("score").innerHTML = "0";
  backgroundMusic.currentTime = 0; // Setel ulang waktu musik latar
  backgroundMusic.play(); // Mulai ulang musik latar
  setBackgroundMoving();
  setBoxMoving();
}

function setBoxMoving() {
  var box = document.getElementById("box"),
    dino = document.getElementById("dino");
  setTimeout(function () {
    if (!isPaused) {
      box.style.marginLeft =
        parseInt(box.style.marginLeft.replace("px", "")) - 1 + "px";
      if (parseInt(box.style.marginLeft.replace("px", "")) < -100) {
        box.style.marginLeft = "600px";
      }
      // Deteksi tabrakan
      if (
        dino.offsetTop + 50 >= box.offsetTop &&
        dino.offsetLeft + 50 >= box.offsetLeft &&
        dino.offsetTop + 50 <= box.offsetTop + 50 &&
        dino.offsetLeft <= box.offsetLeft + 50
      ) {
        var collisionSfx = document.getElementById("collisionSfx");
        collisionSfx.play(); // Mainkan efek suara tabrakan
        Swal.fire({
          title: "Game Over!",
          text: "Score Anda: " + document.getElementById("score").innerHTML,
          imageUrl: "images/emot.png",
          imageWidth: 200,
          imageHeight: 200,
          confirmButtonText: "RESTART",
        }).then(() => {
          setTimeout(resetGame, 1500);
        });
        dino.setAttribute("class", "freeze");
        isMoving = false;
        backgroundMusic.pause(); // Pause musik latar saat game over
      } else {
        setBoxMoving();
      }
    }
  }, 5);
}
setBoxMoving();
