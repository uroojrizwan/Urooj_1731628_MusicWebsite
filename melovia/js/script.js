const songs = [
  { title: "Aadat", artist: "Atif Aslam", file: "melovia/audio/aadat.mp3", cover: "melovia/images/atif aslam.jpg" },
  { title: "Bargad", artist: "Arpit Bala", file: "melovia/audio/bargad.mp3", cover: "melovia/images/bargad arpit.jpg" },
  { title: "Bhool", artist: "Murtaza Qizilbash", file: "melovia/audio/bhool.mp3", cover: "melovia/images/murtaza bhool.jpg" },
  { title: "missin something", artist: "Zach Templar", file: "melovia/audio/missin-something.mp3", cover: "melovia/images/zach.jpg" },
  { title: "Rangeen", artist: "Hassan Raheem", file: "melovia/audio/rangeen.mp3", cover: "melovia/images/rangeen hasan.jpg" },
  { title: "That Should Be Me", artist: "Justin Bieber", file: "melovia/audio/that-should-be-me.mp3", cover: "melovia/images/jb.jpg" }
];

let currentIndex = 0;
let isLiked = false;

const audio = new Audio();
audio.preload = "metadata";
audio.volume = 0.5;

const songTitle = document.getElementById("songTitle");
const songArtist = document.getElementById("songArtist");
const playerCover = document.getElementById("playerCover");
const playerBox = document.getElementById("musicPlayer");
const playBtn = document.getElementById("playBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const likeBtn = document.getElementById("likeBtn");
const progressSlider = document.getElementById("progressSlider");
const currentTime = document.getElementById("currentTime");
const duration = document.getElementById("duration");
const volumeSlider = document.getElementById("volumeSlider");
const volumeValue = document.getElementById("volumeValue");
const audioMsg = document.getElementById("audioMsg");
const form = document.getElementById("contactForm");
const formAlert = document.getElementById("formAlert");

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) {
    return "0:00";
  }

  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
  return minutes + ":" + secs;
}

function showSong(index) {
  currentIndex = index;
  const song = songs[index];

  songTitle.textContent = song.title;
  songArtist.textContent = song.artist;
  playerCover.src = song.cover;
  playerCover.alt = song.title + " cover";
  audio.src = song.file;

  progressSlider.value = 0;
  currentTime.textContent = "0:00";
  duration.textContent = "0:00";
  audioMsg.textContent = "";
  playerBox.classList.remove("is-playing");
  setPlayingLook(false);
}

function setPlayingLook(playing) {
  if (playing) {
    playBtn.innerHTML = '<i class="bi bi-pause-fill"></i>';
    playBtn.setAttribute("aria-label", "Pause song");
    playerBox.classList.add("is-playing");
  } else {
    playBtn.innerHTML = '<i class="bi bi-play-fill"></i>';
    playBtn.setAttribute("aria-label", "Play song");
    playerBox.classList.remove("is-playing");
  }
}

function playSong() {
  if (!audio.getAttribute("src")) {
    showSong(currentIndex);
  }

  audio.play().then(function () {
    setPlayingLook(true);
  }).catch(function (err) {
    if (err.name === "AbortError") {
      return;
    }

    setPlayingLook(false);
    audioMsg.textContent = "This song could not be played right now.";
  });
}

function pauseSong() {
  audio.pause();
  setPlayingLook(false);
}

function nextSong() {
  const wasPlaying = !audio.paused;
  currentIndex = (currentIndex + 1) % songs.length;
  showSong(currentIndex);

  if (wasPlaying) {
    playSong();
  }
}

function previousSong() {
  const wasPlaying = !audio.paused;
  currentIndex = (currentIndex - 1 + songs.length) % songs.length;
  showSong(currentIndex);

  if (wasPlaying) {
    playSong();
  }
}

// ply n pause
playBtn.addEventListener("click", function () {
  if (audio.paused) {
    playSong();
  } else {
    pauseSong();
  }
});

prevBtn.addEventListener("click", previousSong);
nextBtn.addEventListener("click", nextSong);

audio.addEventListener("loadedmetadata", function () {
  duration.textContent = formatTime(audio.duration);
});

audio.addEventListener("timeupdate", function () {
  if (!audio.duration) {
    return;
  }

  progressSlider.value = (audio.currentTime / audio.duration) * 100;
  currentTime.textContent = formatTime(audio.currentTime);
});

progressSlider.addEventListener("input", function () {
  if (!audio.duration) {
    return;
  }

  audio.currentTime = (progressSlider.value / 100) * audio.duration;
});

// next song
audio.addEventListener("ended", function () {
  nextSong();
  playSong();
});

// Like btn
likeBtn.addEventListener("click", function () {
  isLiked = !isLiked;

  if (isLiked) {
    likeBtn.innerHTML = '<i class="bi bi-heart-fill"></i> Liked';
    likeBtn.classList.add("liked");
  } else {
    likeBtn.innerHTML = '<i class="bi bi-heart"></i> Like';
    likeBtn.classList.remove("liked");
  }
});

// vol
volumeSlider.addEventListener("input", function () {
  volumeValue.textContent = volumeSlider.value + "%";
  audio.volume = volumeSlider.value / 100;
});

// Albm card song
const playButtons = document.querySelectorAll(".play-song");

playButtons.forEach(function (btn) {
  btn.addEventListener("click", function () {
    const songName = btn.getAttribute("data-song");

    const index = songs.findIndex(function (song) {
      return song.title === songName;
    });

    if (index !== -1) {
      showSong(index);
      playSong();
      document.getElementById("player").scrollIntoView({ behavior: "smooth" });
    }
  });
});

// cntct form
form.addEventListener("submit", function (e) {
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  e.preventDefault();

  const name = document.getElementById("name").value;

  formAlert.textContent = "Thank you " + name + "! We received your message.";
  formAlert.classList.remove("d-none");

  form.reset();

  setTimeout(function () {
    formAlert.classList.add("d-none");
  }, 4000);
});

// active nav link
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-link");

window.addEventListener("scroll", function () {
  let current = "";

  sections.forEach(function (section) {
    if (window.scrollY >= section.offsetTop - 100) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach(function (link) {
    link.classList.remove("active");

    if (link.getAttribute("href") === "#" + current) {
      link.classList.add("active");
    }
  });
});

showSong(0);

const message = document.getElementById("message");

message.addEventListener("input", function () {
    if (this.value.trim() === "") {
        this.setCustomValidity("Message cannot contain only spaces.");
    } else if (this.value.trim().length < 5) {
        this.setCustomValidity("Message must be at least 5 characters.");
    } else {
        this.setCustomValidity("");
    }
});
