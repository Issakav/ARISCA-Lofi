console.log("hello");

let audioContext;
let volume;
let gainNodes = [];
let tracks; //Drums, Piano, Melody, Guitar

const currentlyPlaying = []; //set of VOLUME nodes NOT audio
// const startBtn = document.querySelector(".start");
// const setupBtn = document.querySelector(".setupTracks");
// const playBtn = document.querySelector(".playSample");
// const pauseBtn = document.querySelector(".pause");
const properBtn = document.querySelector(".primary");
const likeCheckbox = document.getElementById('like');

const likeBtn = docuent.querySelector(".secondary"); 
    //Added this if we want to switch to button for visual purposes.


const oneBar = 5647; // length of one bar. TODO: update
/* Note: The new sounds that I added in are all 5.647 second long. 
I know this is a really inconvenient number and if the math doesn't work or anything
lmk and I can fix the length, that was just the length that all of them looped
the best when I listened to it on garageband
*/

/*
Note on nature sounds:
They are unfortunately all different lengths
  Forest: 12.285s
  Ocean: 12.083
  Grasslands: 12.930s
  Rain: 30.000s
*/
let nextTime = 0;

let started = false; // a boolean checking if the button should play/pause

const drumTrackPaths = ["./audio/Drum_1.wav", "./audio/Drum_2.wav", "./audio/Drum_3.wav", "./audio/Drum_4.wav", "./audio/Drum_5.wav"];
const guitarTrackPaths = ["./audio/Guitar_1.wav", "./audio/Guitar_2.wav", "./audio/Guitar_3.wav", "./audio/Guitar_4.wav", "./audio/Guitar_5.wav"];
const melodyTrackPaths = ["./audio/Melody_1.wav", "./audio/Melody_2.wav", "./audio/Melody_3.wav", "./audio/Melody_4.wav", "./audio/Melody_5.wav"];
const pianoTrackPaths = ["./audio/Piano_1.wav", "./audio/Piano_2.wav", "./audio/Piano_3.wav", "./audio/Piano_4.wav", "./audio/Piano_5.wav"];

const trackPaths = drumTrackPaths.concat(guitarTrackPaths).concat(melodyTrackPaths).concat(pianoTrackPaths);

const forestAudio = new Audio('./audio/Nature_Forest.wav');
const grasslandsAudio = new Audio('./audio/Nature_Grasslands.wav');
const oceanAudio = new Audio('./audio/Nature_Ocean.wav');
const rainAudio = new Audio('./audio/Nature_Rain.wav');

let changedTrack = null; 

properBtn.addEventListener("click", () => {
  if (started == false) {
    audioContext = new AudioContext();
    console.log("Started the Audio Context");
    properBtn.textContent = 'PAUSE';
    started = true;
    setupTracks(trackPaths).then((response) => {
      let tracks = response;
      console.log(tracks);
      const playingTracks = [];
      for (const track of tracks) {
        nextTime = audioContext.currentTime;
        playingTracks.push(playTrack(track, 0).start());
      }
      let i = 0;
      while (i < gainNodes.length - 1) {
        if (i%5 != 0){
          gainNodes[i].gain.value = 0;
          currentlyPlaying.push(gainNodes[i]);
        }
        i++;
      }
      setInterval(changeTrack, 2 * oneBar);
    });
  } else { // if the audio is already playing/paused
    if (audioContext.state === 'running') {
      audioContext.suspend().then(function () {
        properBtn.textContent = 'RESUME';
      });
    } else if (audioContext.state === 'suspended') {
      audioContext.resume().then(function () {
        properBtn.textContent = 'PAUSE';
      });
    }
  }
})

// startBtn.addEventListener("click", () => {
//   audioContext = new AudioContext();
//   console.log("Started the Audio Context");
// });

// setupBtn.addEventListener("click", () => {
//   setupTracks(trackPaths).then((response) => {
//     let tracks = response;
//     console.log(tracks);

//     playBtn.addEventListener("click", () => {
//       const playingTracks = [];
//       for (const track of tracks) {
//         nextTime = audioContext.currentTime;
//         playingTracks.push(playTrack(track, 0).start());
//       }
//       let i = 0;
//       while (i < gainNodes.length - 1) {
//         if (i%5 != 0){
//          gainNodes[i].gain.value = 0;
//          currentlyPlaying.push(gainNodes[i]);
//         }
//         i++;
//       }
//       setInterval(changeTrack, 2 * oneBar);
//     });

//     pauseBtn.onclick = function () {
//       if (audioContext.state === 'running') {
//         audioContext.suspend().then(function () {
//           pauseBtn.textContent = 'RESUME';
//         });
//       } else if (audioContext.state === 'suspended') {
//         audioContext.resume().then(function () {
//           pauseBtn.textContent = 'PAUSE';
//         });
//       }
//     }
//   });
// })

function changeTrack() {
  if (!likeCheckbox.checked) { // doesn't change tracks like usual if like button is pressed
    const typeToChange = getRndInteger(1, 6);
    console.log(typeToChange);
    if (typeToChange == 5) { //sets one track at random to silent for 1 bar to create a sort of beat droppy effect
      const typeToMute = getRndInteger(1, 5); // ?
      const trackToChange = currentlyPlaying[typeToChange - 1]; // ?
      trackToChange.gain.value = 0;
      setTimeout(() => {
        trackToChange.gain.value = 1;
      }, oneBar);
    } else { //swaps one track for another of the same type. sometimes changes it for itself causing no change so that the changes don't feel as consistent.
      const trackToChange = currentlyPlaying[typeToChange - 1]; //trackToChange is actually a gain node, not a track
      trackToChange.gain.value = 0;
      const newTrack = gainNodes[getRndInteger((typeToChange - 1) * 5, (typeToChange * 5) - 1)];
      newTrack.gain.value = 1;
      currentlyPlaying[typeToChange - 1] = newTrack;
    }
  } 
  // else {
  //   if (changedTrack != null) {
  //     changedTrack.gain.value = 0;
  //   } 
  //   let setTracks = [];
  //   for (i = 0; i < currentlyPlaying.length; i++) {
  //     setTracks[i] = currentlyPlaying[i];
  //   }
  //   for (const track of setTracks) {
  //     track.gain.value = 1;
  //   }
  //   const typeToChange = getRndInteger(1, 6);
  //   if (typeToChange == 5) { //sets one track at random to silent for 1 bar to create a sort of beat droppy effect
  //     const typeToMute = getRndInteger(1, 5); // ?
  //     const trackToChange = setTracks[typeToChange - 1]; // ?
  //     trackToChange.gain.value = 0;
  //     setTimeout(() => {
  //       trackToChange.gain.value = 1;
  //     }, oneBar);
  //   } else { //swaps one track for another of the same type. sometimes changes it for itself causing no change so that the changes don't feel as consistent.
  //     const trackToChange = setTracks[typeToChange - 1]; //trackToChange is actually a gain node, not a track
  //     trackToChange.gain.value = 0;
  //     const newTrack = gainNodes[getRndInteger((typeToChange - 1) * 5, (typeToChange * 5) - 1)];
  //     newTrack.gain.value = 1;
  //     setTracks[typeToChange - 1].gain.value = 0;
  //     changedTrack = newTrack;
  //   }
  // }
}

//min is inclusive, max is not. 
function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}


async function getAudioFile(filePath) {
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
  for (const path of paths) {
    const track = await getAudioFile(path);
    audioBuffers.push(track);
  }
  console.log("Finished setting up tracks");
  return audioBuffers;
}

function playTrack(audioBuffer, time) {
  const trackSource = audioContext.createBufferSource();
  trackSource.buffer = audioBuffer;
  volume = audioContext.createGain();
  volume.connect(audioContext.destination);
  gainNodes.push(volume);
  trackSource.connect(volume);
  trackSource.loop = true;
  return trackSource;
}


// fix repeated code - make into one method
function playForest() {
  checkbox = document.getElementById('forest');
  if (checkbox.checked) {
    forestAudio.play();
    forestAudio.loop = true;
  } else {
    forestAudio.pause();
  }
}

  function playOcean() {
    checkbox = document.getElementById('ocean');
    if (checkbox.checked) {
      oceanAudio.play();
      oceanAudio.loop = true;
    } else {
      oceanAudio.pause();
    }
}

function playGrasslands() {
  checkbox = document.getElementById('grasslands');
  if (checkbox.checked) {
    grasslandsAudio.play();
    grasslandsAudio.loop = true;
  } else {
    grasslandsAudio.pause();
  }
}

function playRain() {
  checkbox = document.getElementById('rain');
  if (checkbox.checked) {
    rainAudio.play();
    rainAudio.loop = true;
  } else {
    rainAudio.pause();
  }
}