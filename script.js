const playerBtn = document.querySelector(".buttons__play")
const forwardBtn = document.querySelector(".buttons__forward")
const backwardBtn = document.querySelector(".buttons__backward")
const playIcon = `<i class="fa-solid fa-play"></i>`
const pauseIcon = `<i class="fa-solid fa-pause"></i>`
const soundButton = document.querySelector(".soundBtn")
const soundOn = `<i class="fa-solid fa-volume-high"></i>`
const soundOf = `<i class="fa-solid fa-volume-xmark"></i>`
const timeline = document.querySelector('.timeline');
const albumCover = document.querySelector(".infos__albumCover")
const audio = document.querySelector("audio")
const pageBackground = document.querySelector(".page_background")
const songName = document.querySelector(".infos__songName")
const artist = document.querySelector(".infos__artist")
playerBtn.innerHTML = playIcon
soundButton.innerHTML = soundOn


//handle the change event of the input range button and update the timeline
timeline.addEventListener('change', changeSeek);

//call changeTimelinePosition() when the "ontimeupdate" event is triggered
audio.ontimeupdate = changeTimelinePosition;

//sound on and of
soundButton.addEventListener('click', toggleSound)

let index = 0;

async function fetchData(){
	const response = await fetch("./music.json")
	const data = await response.json()
	console.log(data);
	let totalSongs = data.length - 1

	forwardBtn.addEventListener('click', () =>  goToNextSong(totalSongs, data))

	backwardBtn.addEventListener('click', () => goToPrevSong(totalSongs, data))
	
	songName.innerHTML = data[index].title
	artist.innerHTML = data[index].artist
	albumCover.src = data[index].cover
	audio.src = data[index].audio
	pageBackground.style.background = `url(${data[index].cover}) no-repeat right / cover fixed`
}
fetchData()

function changeBackgroundWidth(percentagePosition){
	pageBackground.style.width = 100 - percentagePosition + `%`
}


function goToNextSong(totalSongs, data){
	if(index == totalSongs){
		index = 0
	}else if(index !== totalSongs){
		index++
	}
	songName.innerHTML = index + " - " + data[index].title
	artist.innerHTML = data[index].artist
	albumCover.src = data[index].cover
	audio.src = data[index].audio
	pageBackground.style.background = `url(${data[index].cover}) no-repeat right / cover fixed`
	playerBtn.innerHTML = playIcon
	timeline.style.backgroundSize = "0% 100%"
	//reset page bg width to 100%
	pageBackground.style.width = "100%"
}

function goToPrevSong (totalSongs, data){
	if(index == 0){
		index = totalSongs
	}else if(index !== 0){
		index--
	}
	songName.innerHTML = index + " - " + data[index].title
	artist.innerHTML = data[index].artist
	albumCover.src = data[index].cover
	audio.src = data[index].audio
	pageBackground.style.background = `url(${data[index].cover}) no-repeat right / cover fixed`
	playerBtn.innerHTML = playIcon
	timeline.style.backgroundSize = "0% 100%"
	//reset page bg width to 100%
	pageBackground.style.width = "100%"
}

//timeline progression and page background width will be update by the following calculation
function changeTimelinePosition() {
	const percentagePosition = (100*audio.currentTime) / audio.duration; //store the percentage of the curent time
	timeline.style.backgroundSize = `${percentagePosition}% 100%`; //update the bg's width size
	timeline.value = percentagePosition;
	console.log(percentagePosition);
	changeBackgroundWidth(percentagePosition)
}


function toggleSound () {
	audio.muted = !audio.muted;
	soundButton.innerHTML = audio.muted ? soundOf : soundOn;
}

function changeSeek () {
	const time = (timeline.value * audio.duration) / 100;
	console.log(audio.duration);
	audio.currentTime = time;
}

//display play btn when sound ended
audio.onended = audioEnded;
//sound on and of
playerBtn.addEventListener('click', toggleAudio);

function toggleAudio () {
	if (audio.paused) {
	  audio.play();
	  playerBtn.innerHTML = pauseIcon;
	} else {
	  audio.pause();
	  playerBtn.innerHTML = playIcon;
	}
}

function audioEnded () {
	playerBtn.innerHTML = playIcon;
}
