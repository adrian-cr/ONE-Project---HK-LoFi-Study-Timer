const html = document.querySelector("html");
const clickText = document.querySelector("#start-overlay p")
const mainScreen = document.querySelector(".main-screen");
const mainVid = document.getElementById("main-video-background");
const hiwOverlay = document.getElementById("hiw-overlay");
const creditsOverlay = document.getElementById("credits-overlay");
const activeScreen = document.querySelector(".active-screen");
const vid = document.getElementById("video-background");
const restScreen = document.querySelector(".rest-screen");
const allScreens = document.querySelectorAll("section");
const toggleButton = document.getElementById("toggle-button");
const flowButton = document.getElementById("flow-button");
const statusBanner = document.getElementById("status-banner");
const textBanner = document.getElementById("complementary-text-banner");
const songNameBanner = document.getElementById("song-name-banner");
const timer = document.getElementById("timer");
const restImage = document.getElementById("rest-image");
const sounds = {
  "rest": document.getElementById("rest-sound"),
  "select": document.getElementById("select-sound"),
  "stop": document.getElementById("stop-sound"),
  "timeUp": document.getElementById("time-up-sound"),
  "wind": document.getElementById("wind-sound"),
};
const vidInfo = {
  dirtmouth: {
    name: "Dirtmouth",
    fileName: "dirtmouth",
    fileId: "9jjqgk4tdxdplx0a7x846",
    fileKey: "t813fq5ldcyznbbneoylxl45y"
  },
  greenpath: {
    name: "Greenpath",
    fileName: "greenpath",
    fileId: "a8ndpymjhe1rv9jog4luh",
    fileKey: "gnrau60f60n30gkyuxq73ycnw"
  },
  cityOfTears: {
    name: "City of Tears",
    fileName: "city_of_tears",
    fileId: "vactdvl5dkovtjstohu6f",
    fileKey: "v5oh2tl1de1acbn33njrpbj67"
  },
  restingGrounds: {
    name: "Resting Grounds",
    fileName: "resting_grounds",
    fileId: "8yrjf9z15ukuw8us979pi",
    fileKey: "q8h2wg1s1y7eh102515t7ttia"
  },
  mainTheme: {
    name: "Hollow Knight (Main Theme)",
    fileName: "main_theme",
    fileId: "azcig9omjmnxxrdph6gvd",
    fileKey: "7ta5lr7cxomznp922gh9jmzav"
  }
};

let shortBreaks = 0;
let stage;
let screenStatus;
let vidSource = document.getElementById("video-source");
let nextTrack = 1;
let playingTrack = 0;
let time = 1500;
let intervalId;

function changeScreenStatus (sStatus="empty") {
  //Possible values: "main," "active," "rest," and "empty"
  if (sStatus!=="empty"){
    html.setAttribute("status", sStatus);
    }
  else {
    html.setAttribute("status", "empty");
  }
  screenStatus = sStatus;
}

function hideAllScreens() {
   allScreens.forEach(e => {
     let list = e.classList.value.split(" ");
     if (!list.includes("hidden")){
       e.classList.add("hidden");
     }
   })
 }

 function unhideScreen(screen) {
  //Possible values: "main," "active," "rest," and "empty"
  let screenObj = document.querySelector(`.${screen}-screen`);
  screenObj.classList.remove("hidden");
}

function showOption(option) {
  sounds.stop.play()
  sounds.wind.pause();
  mainVid.pause();
  if (option==="hiw"){
    hiwOverlay.style.display = "flex";
  } else if (option==="credits") {
    creditsOverlay.style.display = "flex";
  }
}

function backToMain() {
  hiwOverlay.style.display = "none";
  creditsOverlay.style.display = "none";
  mainVid.play();
  sounds.wind.play()
}

function start() {
  sounds.select.play();
  if (!mainVid.paused){
    mainVid.pause();
  }
  if (!sounds.wind.paused){
    sounds.wind.pause();
  }
  if (!timeUp.paused){
    sounds.timeUp.pause();
    sounds.timeUp.currentTime = 0;
  }
  setTimeout(() => {
  clearInterval(intervalId);
  intervalId = null;
  stage = "focus";
  changeScreenStatus();
  }, 100);
  setTimeout(() => {
    hideAllScreens();
    time = 1500;
    formatTimer();
    timer.hidden = false;
  }, 1200);
  setTimeout(() => {
    unhideScreen("active")
    changeScreenStatus("active");
    play();
    songNameBanner.hidden = false;
    toggleButton.hidden = false;
    statusBanner.innerText = "Time to focus!";
    textBanner.innerText = "The only way to victory is forwards.";
    restImage.style.display = "none";
    songNameBanner.innerText = `Song: ${Object.keys(vidFileNames)[playingTrack]}`;
    flowButton.hidden = true;
  }, 1500);
  setTimeout(()=>{
    startStopTimer();
  }, 1500)
}

function playToggle() {
  startStopTimer();
  if (vid.paused) {
    play();
    toggleButton.innerText = "Pause";
  }
  else {
    sounds.stop.play();
    toggleButton.innerText = "Resume";
    pause();
  }

}

function play() {
  vid.play();
  vid.style.display = "unset";
  songNameBanner.style.visibility = "unset";
}

function pause() {
  vid.pause();
  vid.style.display = "none";
  songNameBanner.style.visibility = "hidden";
}

function rest() {
  pause();
  sounds.rest.play();
  hideAllScreens();
  setTimeout(()=>{
    unhideScreen("active");
    changeScreenStatus("active");
    statusBanner.innerText = "Time to rest!";
    textBanner.innerText = "Check your phone. Grab a snack. Get ready for your next focus lap.";
    restImage.style.display = "unset";
    flowButton.innerText = "Skip Rest"
    songNameBanner.hidden = true;
    toggleButton.hidden = true;
    flowButton.hidden = false;
}, 200);

}

function timeUp() {
  stage = "timeUp";
  changeScreenStatus();
  setTimeout(() => {
    hideAllScreens();
    unhideScreen("active");
  }, 1000);
  setTimeout(() => {
    changeScreenStatus("active");
    sounds.timeUp.play();
    sounds.timeUp.loop = true;
    timer.hidden = true;
    statusBanner.innerText = "Time up!";
    textBanner.innerText = "Time for soul-focusing. Gather your strength and carry on, for success awaits you.";
    flowButton.innerText = "Continue";
  }, 1500);
}

function playNextVideo() {
  let trackDict = vidInfo[Object.keys(vidInfo)[nextTrack]];
  vidSource.setAttribute("src", `https://dl.dropboxusercontent.com/scl/fi/${trackDict["fileId"]}/${trackDict["fileName"]}.mp4?rlkey=${trackDict["fileKey"]}`)
  vid.load();
  vid.play();
  songNameBanner.innerText = `Song: ${trackDict["name"]}`;
  (nextTrack<Object.values(vidInfo).length - 1) ? nextTrack++ : nextTrack = 0;
}

function startStopTimer() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
    return
  }
  intervalId = setInterval(() => {
    if (time > 1) {
      time--
      formatTimer();
    }
    else {
      nextStage();
      formatTimer();
    }
  }, 1000);
}

function nextStage() {
  if (stage==="focus"){
    stage = "rest";
    if (shortBreaks<3){
      time = 300;
      shortBreaks++;

    }
    else {
      shortBreaks = 0;
      time = 1800;
    }
    rest();
  }
  else {
    time = 0;
    startStopTimer();
    timeUp();
  }

}

function formatTimer() {
  let timeToFormat = new Date(time * 1000);
  let formattedTime = timeToFormat.toLocaleTimeString("en-US", {minute:"2-digit", second:"2-digit"});
  timer.innerText = formattedTime;
}

let overlay = document.getElementById("start-overlay");

overlay.addEventListener("click", ()=>{
  clickText.innerText = null;
  sounds.wind.volume = 0;
  sounds.wind.play()
  sounds.wind.loop = true;
  setTimeout(() =>{sounds.wind.volume = 0.1;}, 100);
  setTimeout(() =>{sounds.wind.volume = 0.2;}, 100);
  setTimeout(() =>{sounds.wind.volume = 0.3;}, 200);
  setTimeout(() =>{sounds.wind.volume = 0.4;}, 300);
  setTimeout(() =>{sounds.wind.volume = 0.5;}, 400);
  setTimeout(() =>{sounds.wind.volume = 0.6;}, 500);
  setTimeout(() =>{sounds.wind.volume = 0.7;}, 600);
  setTimeout(() =>{sounds.wind.volume = 0.8;}, 700);
  setTimeout(() => {mainVid.play();}, 800);
  setTimeout(() =>{overlay.style.animation = "fadeOut 1500ms forwards";}, 1500);
});
