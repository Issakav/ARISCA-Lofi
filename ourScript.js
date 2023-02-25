const trackList = document.querySelectorAll("audio");
const testDrum = trackList[0];
const testSound = trackList[1];
//console.log(audio);

const playBtn = document.querySelector(".play");

const pauseBtn = document.querySelector(".pause");

playBtn.addEventListener("click", () => {
  testDrum.play();
  testSound.play();
});

pauseBtn.addEventListener("click", () => {
  testDrum.pause();
  testSound.pause();
});

