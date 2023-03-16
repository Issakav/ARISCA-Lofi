console.log("hello");

let audioContext;
let volume;
let gainNodes = [];
let tracks; //Drums, Piano, Melody, Guitar
const startBtn =  document.querySelector(".start");
const setupBtn = document.querySelector(".setupTracks");
const playBtn = document.querySelector(".playSample");


const oneBar = 5647; // length of one bar. TODO: update
/* Note: The new sounds that I added in are all 5.647 second long. 
I know this is a really inconvenient number and if the math doesn't work or anything
lmk and I can fix the length, that was just the length that all of them looped
the best when I listened to it on garageband
*/
let nextTime = 0;

const drumTrackPaths = ["./audio/Drum_1.wav","./audio/Drum_2.wav","./audio/Drum_3.wav", "./audio/Drum_4.wav","./audio/Drum_5.wav"];
const guitarTrackPaths = ["./audio/Guitar_1.wav","./audio/Guitar_2.wav","./audio/Guitar_3.wav","./audio/Guitar_4.wav","./audio/Guitar_5.wav"]
const melodyTrackPaths = ["./audio/Melody_1.wav","./audio/Melody_2.wav","./audio/Melody_3.wav","./audio/Melody_4.wav","./audio/Melody_5.wav"]
const pianoTrackPaths = ["./audio/Piano_1.wav","./audio/Piano_2.wav","./audio/Piano_3.wav","./audio/Piano_4.wav","./audio/Piano_5.wav"]

const trackPaths = drumTrackPaths.concat(guitarTrackPaths).concat(melodyTrackPaths).concat(pianoTrackPaths);
//TODO fix idea: set all loops to the same audio, around 10 times and see if the delay is still present
startBtn.addEventListener("click", () => {
  audioContext = new AudioContext();
  // volume = audioContext.createGain();
  // volume.connect(audioContext.destination);
  console.log("Started the Audio Context");
});

setupBtn.addEventListener("click", () => {
  setupTracks(trackPaths).then((response) => {
    let tracks = response;
    console.log(tracks);
    playBtn.addEventListener("click", () => {

      const playingTracks = [];
      for (const track of tracks) {
        nextTime = audioContext.currentTime;
        playingTracks.push(playTrack(track, 0).start());
      }
      //check setTimout and setInterval to switch tracks every x loops. Check if there is something like this in the webAudioAPI.
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
  volume = audioContext.createGain();
  volume.connect(audioContext.destination);
  gainNodes.push(volume);
  trackSource.connect(volume);
  trackSource.loop = true;
  //trackSource.start(time); //TODO: moving this to playingTracks.push(playTrack(track, 0).start(0)); in the playBtn event listener solved the issue so that all tracks now start at the same time.
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

