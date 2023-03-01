console.log("hello");

let audioContext;
let volume;
let tracks;
const startBtn = document.querySelector(".start");
const setupBtn = document.querySelector(".setupTracks");
const playBtn = document.querySelector(".playSample");


const oneBar = 5000; // length of one bar. TODO: update



const trackPaths = ["./audio/testDrums.mp3","./audio/testSound.mp3"]; //update to hold path names for all audio files

startBtn.addEventListener("click", () => {
  audioContext = new AudioContext();
  volume = audioContext.createGain();
  volume.connect(audioContext.destination);
  console.log("Started the Audio Context");
});

setupBtn.addEventListener("click", () => {
  setupTracks(trackPaths).then((response) => {
    tracks = response;
    console.log(tracks);
    playBtn.addEventListener("click", () => {

      const playingTracks = [];
      for (const track of tracks) {
        playingTracks.push(playTrack(track, 0));
      }
      //const playing = playTrack(tracks[0], 0);
      setTimeout(() => {
        //playing.stop();
        volume.gain.value = 0;
        setTimeout(() => {
          volume.gain.value = 1;
        }, oneBar);
      }, oneBar*2);
    });
  });
})



async function getAudioFile(filePath){
  const response = await fetch(filePath);
  const arrayBuffer = await response.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  return audioBuffer;
}

/**
 * @param {*} paths is an array of path strings
 * @returns an array of audio buffers made from the files that paths point to
 */
async function setupTracks(paths) {
  console.log("Setting up tracks")
  const audioBuffers = [];
  for (const path of paths){
    const track = await getAudioFile(path);
    audioBuffers.push(track);
  }
  console.log("Finished setting up tracks");
  return audioBuffers;
}

function playTrack(audioBuffer, time){
  const trackSource = audioContext.createBufferSource();
  trackSource.buffer = audioBuffer;
  trackSource.connect(volume);
  trackSource.start(time);
  return trackSource;
}










// const playBtn = document.querySelector(".play");
// const pauseBtn = document.querySelector(".pause");
// const stopBtn = document.querySelector(".stop");

// const audioContext = new AudioContext();

// const testDrum1 = new Audio("./audio/testDrums.mp3");

// const source = audioContext.createMediaElementSource(testDrum1);
// const volume = audioContext.createGain();
// volume.gain.value = 1; //causes no change unless != 1

// source.connect(volume); //these two lines are just an example to show how we have to connect up our nodes. 
// volume.connect(audioContext.destination);

// playBtn.addEventListener("click", () => {
//   if (audioContext.state === "suspended") {
//     audioContext.resume();
//   }
//   testDrum1.play();
// });

// pauseBtn.addEventListener("click", () => {
//   testDrum1.pause();
// });

// stopBtn.addEventListener("click", () => {
//   testDrum1.pause();
//   testDrum1.currentTime = 0; // in seconds not milliseconds
// });













// const oneBar = 2000 //How many milliseconds in a bar (update once music is chosen)


// const trackList = document.querySelectorAll("audio");
// const testDrum = trackList[0];
// const testSound = trackList[1];
// //console.log(audio);

// const playBtn = document.querySelector(".play");

// const pauseBtn = document.querySelector(".pause");

// playBtn.addEventListener("click", () => {
//   testDrum.play();
//   testSound.play();
  
// });

// pauseBtn.addEventListener("click", () => {
//   testDrum.pause();
//   testSound.pause();
// });

