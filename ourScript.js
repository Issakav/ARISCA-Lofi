console.log("hello");

let audioContext;
let volume;
let gainNodes = [];
let tracks; //Drums, Piano, Melody, Guitar

const currentlyPlaying = []; //set of VOLUME nodes NOT audio
const properBtn = document.querySelector(".primary");
const likeCheckbox = document.getElementById('like');
const changeButton = document.getElementById("changeIt");
const muteButton = document.getElementById("mute");
let backgroundVolume = document.querySelector("#backgroundVolume"); 
let musicVolume = document.querySelector("#musicVolume");


const drumText = document.getElementById("pDrums");
const guitarText = document.getElementById("pGuitar");
const melodyText = document.getElementById("pMelody");
const pianoText = document.getElementById("pPiano");

drumText.innerHTML = "1";
guitarText.innerHTML = "1";
melodyText.innerHTML = "1";
pianoText.innerHTML = "1";



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
let playing = false;

const drumTrackPaths = ["./audio/Drum_1.wav", "./audio/Drum_2.wav", "./audio/Drum_3.wav", "./audio/Drum_4.wav", "./audio/Drum_5.wav"];
const guitarTrackPaths = ["./audio/Guitar_1.wav", "./audio/Guitar_2.wav", "./audio/Guitar_3.wav", "./audio/Guitar_4.wav", "./audio/Guitar_5.wav"];
const melodyTrackPaths = ["./audio/Melody_1.wav", "./audio/Melody_2.wav", "./audio/Melody_3.wav", "./audio/Melody_4.wav", "./audio/Melody_5.wav"];
const pianoTrackPaths = ["./audio/Piano_1.wav", "./audio/Piano_2.wav", "./audio/Piano_3.wav", "./audio/Piano_4.wav", "./audio/Piano_5.wav"];

let trackPaths = [];
trackPaths = trackPaths.concat(drumTrackPaths);
trackPaths = trackPaths.concat(guitarTrackPaths);
trackPaths = trackPaths.concat(melodyTrackPaths);
trackPaths = trackPaths.concat(pianoTrackPaths);

const forestAudio = new Audio('./audio/Nature_Forest.wav');
const grasslandsAudio = new Audio('./audio/Nature_Grasslands.wav');
const oceanAudio = new Audio('./audio/Nature_Ocean.wav');
const rainAudio = new Audio('./audio/Nature_Rain.wav');
const fireplaceAudio = new Audio('./audio/Nature_Fireplace.mp3');
const cafeAudio = new Audio('./audio/Nature_Cafe.mp3');
const backgroundAudios = [forestAudio, grasslandsAudio, oceanAudio, rainAudio, fireplaceAudio, cafeAudio];

const forestCheckbox = document.getElementById('forest');
const grasslandsCheckbox = document.getElementById('grasslands');
const oceanCheckbox = document.getElementById('ocean');
const rainCheckbox = document.getElementById('rain');
const fireplaceCheckbox = document.getElementById('fireplace');
const cafeCheckbox = document.getElementById('cafe');
const checkboxes = [forestCheckbox, grasslandsCheckbox, oceanCheckbox, rainCheckbox, fireplaceCheckbox, cafeCheckbox];

let changedTrack = null; 

properBtn.addEventListener("click", () => {
  if (started == false) {
    playing = true;
    audioContext = new AudioContext();
    console.log("Started the Audio Context");
    properBtn.textContent = 'PAUSE MUSIC';
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
      console.log(0);
      while (i < gainNodes.length) {
        if (i%5 != 0){
          console.log(i);
          gainNodes[i].gain.value = 0;
        } else {
          console.log(i + "mod");
          currentlyPlaying.push(gainNodes[i]);
        }
        i++;
      }
      setInterval(changeTrack, 2 * oneBar);
    });
  } else { // if the audio is already playing/paused
    if (audioContext.state === 'running') {
      playing = false;
      audioContext.suspend().then(function () {
        properBtn.textContent = 'RESUME MUSIC';
      });
    } else if (audioContext.state === 'suspended') {
      playing = true;
      audioContext.resume().then(function () {
        properBtn.textContent = 'PAUSE MUSIC';
      });
    }
  }
});

// we can change the range of values for the volume (currently 0-100) if the changes aren't noticable enough
musicVolume.addEventListener("input", function(slider) {
  for (const track of currentlyPlaying) {
    track.gain.value = slider.currentTarget.value / 100;
  }
  let value = (this.value-this.min)/(this.max-this.min)*100
  this.style.background = 'linear-gradient(to right, rgb(5, 22, 56) 0%, rgb(5, 22, 56) ' + value + '%, rgb(187, 219, 255) ' + value + '%, rgb(187, 219, 255) 100%)'
})

changeButton.addEventListener("click", () =>{
  if (playing){
    if (likeCheckbox.checked) {
      likeCheckbox.click();
    }
    for (i = 0; i < currentlyPlaying.length; i++) {
      currentlyPlaying[i].gain.value = 0;
      let oldTrack = currentlyPlaying[i];
      let newTrack;
      let newTrackNumber
      while (true){
        newTrackNumber = getRndInteger((i) * 5, ((i+1) * 5) -1);
        newTrack = gainNodes[newTrackNumber];
        if (newTrack != oldTrack){
          break;
        }
      }
      updateTrackDisplay(i+1, newTrackNumber);
      newTrack.gain.value = musicVolume.value / 100;
      currentlyPlaying[i] = newTrack;
    }
  }
});

muteButton.addEventListener("click", () =>{
  if (playing) {
    playing = false;
    audioContext.suspend().then(function () {
      properBtn.textContent = 'RESUME MUSIC';
    });
  }
  for (const checkbox of checkboxes) {
    if (checkbox.checked) {
      checkbox.click();
    }
  }
})

function changeTrack() {
  if (playing){
    
    if (!likeCheckbox.checked) { 
      const typeToChange = getRndInteger(1, 6);
      console.log(typeToChange);
      if (typeToChange == 5) { //sets one track at random to silent for 1 bar to create a sort of beat droppy effect
        const typeToMute = getRndInteger(1, 5);
        const trackToChange = currentlyPlaying[typeToMute - 1];
        trackToChange.gain.value = 0;
        setTimeout(() => {
          trackToChange.gain.value = musicVolume.value / 100;
        }, oneBar);
      } else { //swaps one track for another of the same type. sometimes changes it for itself causing no change so that the changes don't feel as consistent.
        const trackToChange = currentlyPlaying[typeToChange - 1]; //trackToChange is actually a gain node, not a track
        trackToChange.gain.value = 0;
        const newTrackNumber = getRndInteger((typeToChange-1) * 5, (typeToChange * 5) -1)
        const newTrack = gainNodes[newTrackNumber];//[getRndInteger((typeToChange - 1) * 5, (typeToChange * 5) - 1)];
        newTrack.gain.value = musicVolume.value / 100;
        currentlyPlaying[typeToChange - 1] = newTrack;
        updateTrackDisplay(typeToChange, newTrackNumber);


      }
    } 
    else {
      if (changedTrack != null) {
        changedTrack.gain.value = 0;
      } 
      let setTracks = [];
      for (i = 0; i < currentlyPlaying.length; i++) {
        setTracks[i] = currentlyPlaying[i];
      }
      for (const track of setTracks) {
        track.gain.value = musicVolume.value / 100;
      }
      const typeToChange = getRndInteger(1, 6);
      console.log(typeToChange);
      if (typeToChange == 5) { //sets one track at random to silent for 1 bar to create a sort of beat droppy effect
        const typeToMute = getRndInteger(1, 5); // ?
        const trackToChange = setTracks[typeToMute - 1];
        trackToChange.gain.value = 0;
        setTimeout(() => {
          trackToChange.gain.value = musicVolume.value / 100;
        }, oneBar);
      } else { //swaps one track for another of the same type. sometimes changes it for itself causing no change so that the changes don't feel as consistent.
        const trackToChange = setTracks[typeToChange - 1]; //trackToChange is actually a gain node, not a track
        trackToChange.gain.value = 0;
        const newTrackNumber = getRndInteger((typeToChange-1) * 5, (typeToChange * 5) -1);
        const newTrack = gainNodes[newTrackNumber];
        newTrack.gain.value = musicVolume.value / 100;
        setTracks[typeToChange - 1].gain.value = 0;
        changedTrack = newTrack;
        updateTrackDisplay(typeToChange, newTrackNumber);


      }
    }
  }
  
}

function updateTrackDisplay(typeToChange, newTrackNumber){
  if (typeToChange == 1){
    document.getElementById("pDrums").innerHTML = (newTrackNumber + 1);
  }
  else if (typeToChange == 2){
    document.getElementById("pGuitar").innerHTML = (newTrackNumber - 4);
  }
  else if (typeToChange == 3){
    document.getElementById("pMelody").innerHTML = (newTrackNumber - 9);
  }
  else if (typeToChange == 4){
    document.getElementById("pPiano").innerHTML = (newTrackNumber - 14);
  }
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

function playBackgroundNoise() {
  for (const checkbox of checkboxes) {
    const index = checkboxes.indexOf(checkbox);
    if (checkbox.checked) {
      backgroundAudios[index].play();
      backgroundAudios[index].loop = true;
    } else {
      backgroundAudios[index].pause();
    }
  }
}

backgroundVolume.addEventListener("input", function(slider) {
  for (const audio of backgroundAudios) {
    audio.volume = slider.currentTarget.value / 100;
  }
  let value = (this.value-this.min)/(this.max-this.min)*100
  this.style.background = 'linear-gradient(to right, rgb(8, 72, 90) 0%, rgb(8, 72, 90) ' + value + '%, rgb(218, 249, 251) ' + value + '%, rgb(218, 249, 251) 100%)';
})

