var isMoving = true;
var isPaused = false;
var isJumping = false; // Flag untuk memeriksa apakah Dino sedang melompat
var backgroundMusic = document.getElementById("backgroundMusic"); // Dapatkan elemen audio

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
    backgroundMusic.play();
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
  backgroundMusic.currentTime = 0;
  backgroundMusic.play();
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
        collisionSfx.play();

        // Simpan skor sebelum menampilkan SweetAlert
        let currentScore = parseInt(document.getElementById("score").innerHTML);
        saveScore(currentScore); // Simpan skor ke localStorage

        let highScores = getHighScores(); // Ambil daftar skor tertinggi
        let highestScore = highScores.length > 0 ? highScores[0] : 0; // Skor tertinggi saat ini

        if (currentScore >= highestScore) {
          // Jika skor baru adalah yang tertinggi, tampilkan SweetAlert dengan piala
          Swal.fire({
            title: "Selamat!",
            text: "Anda mencapai peringkat 1 dengan skor: " + currentScore,
            imageUrl: "images/piala.png", // Ubah dengan ikon piala
            imageWidth: 200,
            imageHeight: 200,
            confirmButtonText: "RESTART",
            allowOutsideClick: false,
            allowEscapeKey: false,
            preConfirm: () => {
              return new Promise((resolve) => {
                setTimeout(() => {
                  resolve();
                }, 1500);
                Swal.showLoading();
              });
            },
          }).then(() => {
            resetGame(); // Panggil fungsi reset setelah "RESTART"
            displayHighScores(); // Tampilkan leaderboard
          });
        } else {
          // Jika skor tidak mencapai peringkat 1, tampilkan SweetAlert biasa
          Swal.fire({
            title: "Game Over!",
            text: "Score Anda: " + currentScore,
            imageUrl: "images/emot.png", // Ubah dengan ikon game over biasa
            imageWidth: 200,
            imageHeight: 200,
            confirmButtonText: "RESTART",
            allowOutsideClick: false,
            allowEscapeKey: false,
            preConfirm: () => {
              return new Promise((resolve) => {
                setTimeout(() => {
                  resolve();
                }, 1500);
                Swal.showLoading();
              });
            },
          }).then(() => {
            resetGame(); // Panggil fungsi reset setelah "RESTART"
            displayHighScores(); // Tampilkan leaderboard
          });
        }

        dino.setAttribute("class", "freeze");
        isMoving = false;
        backgroundMusic.pause(); // Pause backsound saat game over
      } else {
        setBoxMoving();
      }
    }
  }, 5);
}
setBoxMoving();

function jump() {
  if (!isPaused && !isJumping) {
    isJumping = true; // Set flag bahwa Dino sedang melompat
    var dino = document.getElementById("dino");

    // Mainkan SFX lompat
    var jumpSfx = document.getElementById("jumpSfx");
    jumpSfx.play();

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
  backgroundMusic.pause(); // Pause backsound saat game di-pause
});

document.getElementById("resumeButton").addEventListener("click", function () {
  isPaused = false; // Resume game
  document.getElementById("resumeButton").style.display = "none";
  document.getElementById("pauseButton").style.display = "inline";
  var dino = document.getElementById("dino");
  dino.setAttribute("class", "");
  setBackgroundMoving(); // Lanjutkan background
  setBoxMoving(); // Lanjutkan pergerakan box
  backgroundMusic.play(); // Play backsound saat game di-resume
});

// Fungsi untuk menyimpan skor ke localStorage
function saveScore(score) {
  let scores = JSON.parse(localStorage.getItem("dinoScores")) || []; // Ambil data dari localStorage atau buat array kosong
  if (!scores.includes(score)) {
    scores.push(score); // Hanya tambahkan skor jika belum ada di daftar
    localStorage.setItem("dinoScores", JSON.stringify(scores)); // Simpan kembali ke localStorage
  }
}

// Fungsi untuk mendapatkan skor tertinggi
function getHighScores() {
  let scores = JSON.parse(localStorage.getItem("dinoScores")) || []; // Ambil data dari localStorage
  scores.sort((a, b) => b - a); // Urutkan dari yang tertinggi
  return [...new Set(scores)].slice(0, 5); // Hapus duplikat dan ambil 5 skor tertinggi
}

// Tampilkan skor tertinggi di leaderboard (optional, bisa tambahkan HTML untuk ini)
function displayHighScores() {
  let highScores = getHighScores();
  let leaderboard = document.getElementById("leaderboard"); // Pastikan ada elemen HTML dengan id="leaderboard"
  leaderboard.innerHTML = ""; // Kosongkan dulu

  highScores.forEach((score, index) => {
    let scoreElement = document.createElement("li");
    scoreElement.textContent = `Peringkat ${index + 1}: ${score}`;
    leaderboard.appendChild(scoreElement);
  });
}

// Fungsi untuk memeriksa apakah skor terbaru adalah yang tertinggi
function isNewHighScore(score) {
  let scores = JSON.parse(localStorage.getItem("dinoScores")) || [];
  if (scores.length === 0) return true; // Jika belum ada skor, otomatis skor baru jadi yang tertinggi
  let highScore = Math.max(...scores); // Cari skor tertinggi saat ini
  return score > highScore; // Bandingkan skor baru dengan skor tertinggi
}
window.addEventListener("DOMContentLoaded", function () {
  // Hapus data skor di localStorage saat halaman dimuat
  localStorage.removeItem("dinoScores");
});
