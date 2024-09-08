var isMoving = true;
var isPaused = false;
var isJumping = false; // Flag untuk memeriksa apakah Dino sedang melompat

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
      } else {
        setBoxMoving();
      }
    }
  }, 5);
}
setBoxMoving();

function jump() {
  if (!isPaused && !isJumping) {
    // Pastikan dino tidak bisa lompat lagi jika sudah melompat
    isJumping = true; // Set flag bahwa Dino sedang melompat
    var dino = document.getElementById("dino");
    dino.style.marginTop = "30px";
    dino.setAttribute("class", "freeze");
    setTimeout(function () {
      dino.style.marginTop = "170px"; // Dino kembali mendarat
      dino.setAttribute("class", "");
      isJumping = false; // Setelah mendarat, reset flag agar bisa lompat lagi
    }, 800); // Lama lompatan Dino
  }
}

// Event listener untuk tombol panah atas (keyboard)
window.addEventListener("keyup", function (e) {
  if (e.keyCode == 38 && !isPaused) {
    // Kode untuk tombol panah atas, dicek jika tidak pause
    jump();
  }
});

// Event listener untuk tombol jump pada layar
document.getElementById("jumpButton").addEventListener("click", function () {
  if (!isPaused) {
    // Hanya loncat jika tidak di-pause
    jump();
  }
});

// Tombol Pause dan Resume
document.getElementById("pauseButton").addEventListener("click", function () {
  isPaused = true; // Pause game
  document.getElementById("pauseButton").style.display = "none";
  document.getElementById("resumeButton").style.display = "inline";
  var dino = document.getElementById("dino");
  dino.setAttribute("class", "freeze");
});

document.getElementById("resumeButton").addEventListener("click", function () {
  isPaused = false; // Resume game
  document.getElementById("resumeButton").style.display = "none";
  document.getElementById("pauseButton").style.display = "inline";
  var dino = document.getElementById("dino");
  dino.setAttribute("class", "");
  setBackgroundMoving(); // Lanjutkan background
  setBoxMoving(); // Lanjutkan pergerakan box
});
