

const BASEURL = "https://musichost.myhomedrivekolens.my.id"
const auth = () =>{
    return `&u=truenas_admin&t=54d3946c3ac11114d649e9b6789182e8&s=abc&v=1.16.1&c=Postman&f=json`
}
const getlist = (search="", songCount=10, songOffset=0) => {
    return BASEURL + `/rest/search3?query=${search}&songCount=${songCount}&songOffset=${songOffset}${auth()}`
} 

const getThumbnailURL = (id, size = 100)=>{
    if (!id) return console.error("please see your id music")
    return `${BASEURL}/rest/getCoverArt?id=${id}&size=${size}${auth()}`
}

const getLiveSongURL = (id) =>{
    if (!id) return console.error("please see your id music")
    return`${BASEURL}/rest/stream?id=${id}${auth()}`
}

const getRandomSongURL = (limit=5) =>{
    return `${BASEURL}/rest/getRandomSongs?size=${limit}${auth()}`
}

const musicContainer = document.getElementById("music-container");

// VARIABEL 
let isPlaying = false; // Status apakah musik sedang diputar
let currentTime = 0; // Waktu saat ini dalam detik (02:54)
let totalDuration = 0; // Total durasi musik dalam detik (05:32)
let progressInterval; // Variable untuk menyimpan interval timer
let idBefore;
let songlistMetadata = [];
let dataMusic = [];
let currentAudiovolume = 1;

// AMBIL ELEMEN 
const playBtn = document.getElementById('playBtn'); // Tombol play/pause
const playIcon = document.getElementById('playIcon'); // Icon play
const pauseIcon = document.getElementById('pauseIcon'); // Icon pause
const progressFill = document.getElementById('progressFill'); // Bar progress kuning
const progressBar = document.getElementById('progressBar'); // Container progress bar
const currentTimeEl = document.getElementById('currentTime'); // Teks waktu saat ini
const heartBtn = document.getElementById('heartBtn'); // Tombol like
const volumeBtn = document.getElementById('volumeBtn'); // Tombol volume
const totalDurationelement = document.getElementById("duration")
const audioControl = document.getElementById("audioplayer");
const prevBTN = document.getElementById("prev-btn");
const nextBTN = document.getElementById("next-btn");
const inputSearch = document.getElementById("inputsearch");
const musicSearchtop = document.getElementById("music-container-search");
const popupwin = document.getElementById("musicSearch-dialog")
const artisID = document.getElementById("artistlistid");
// FUNGSI HELPER

// Fungsi untuk format detik menjadi MM:SS
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Fungsi untuk update tampilan progress bar
function updateProgress() {
    const percentage = (currentTime / totalDuration) * 100;
    progressFill.style.width = percentage + '%';
    currentTimeEl.textContent = formatTime(currentTime);
}

async function getMusicListAndSearch(search=""){
    const songlist = await fetch(getlist(search))
    const hasil = await songlist.json()
    return hasil
}


async function appendToMusic() {
    try{
        const songlist = await fetch(getRandomSongURL(20)).then(f => f.json());
        const songs = songlist['subsonic-response'].randomSongs?.song || [];
        document.getElementById("loaderMusicsong").remove()
        songs.forEach(element => {
            if(!songlistMetadata.includes(element.id)){
                songlistMetadata.push(element.id)
                musicContainer.appendChild(musicsongs(element.title, element.artist, element.id, getThumbnailURL(element.id)))
            }
        });
    }catch(err){
        console.error(err);
        document.getElementById("textdownload").textContent = "Retry?"
         document.getElementById("textdownload").addEventListener("click", ()=>{
            appendToMusic();
         })
        // alert("EROR WHEN GET DATA TO SERVER PLEASE SEE YOUR CONNECTION")
    }
}

appendToMusic()

function chekQueue(id){
    console.log(dataMusic.length)
    if(!dataMusic.includes(id)){
        dataMusic.push(id);
    }
    if(dataMusic.length>=songlistMetadata.length-3){
        console.log("[INFO] CALL NEW SONGS")
        appendToMusic()
    }
}


prevBTN.addEventListener("click", ()=>{
    const fillterId = songlistMetadata
    console.log("[INFO]: queue num "+fillterId.length)
    const findIdinArray = fillterId.indexOf(idBefore);
    audioControl.pause();
    currentTime = 0;
    audioControl.currentTime = 0
    const indexFind = findIdinArray-1
    if(indexFind < 0){
        isPlaying = false;
        playpausebtn(fillterId[fillterId.length-1])
        chekQueue(fillterId[fillterId.length-1])
    }else{
        isPlaying = false;
        chekQueue(fillterId[indexFind])
        playpausebtn(fillterId[indexFind])
    }
    chekQueue()
})

nextBTN.addEventListener("click", ()=>{
    const fillterId = songlistMetadata
    console.log("[INFO]: queue num "+fillterId.length)
    const findIdinArray = fillterId.indexOf(idBefore);
    audioControl.pause();
    currentTime = 0;
    audioControl.currentTime = 0
    const indexFind = findIdinArray+1
    if(indexFind >= fillterId.length){
        isPlaying = false;
        playpausebtn(fillterId[0])
        chekQueue(fillterId[0])
    }else{
        isPlaying = false;
        playpausebtn(fillterId[indexFind])
        chekQueue(fillterId[indexFind])
    }

})


// EVENT LISTENER - PLAY/PAUSE

audioControl.addEventListener("timeupdate", ()=>{
    totalDuration = audioControl.duration
    currentTime = audioControl.currentTime || 0
    totalDurationelement.textContent = formatTime(totalDuration)
    updateProgress();
})

audioControl.addEventListener("ended", ()=>{
    const fillterId = songlistMetadata
    console.log("[INFO]: queue num "+fillterId.length)
    const findIdinArray = fillterId.indexOf(idBefore);
    audioControl.pause();
    currentTime = 0;
    audioControl.currentTime = 0
    const indexFind = findIdinArray+1

    if(indexFind >= fillterId.length){
        isPlaying = false;
        playpausebtn(fillterId[0])
        chekQueue(fillterId[0])
    }else{
        isPlaying = false;
        playpausebtn(fillterId[indexFind])
        chekQueue(fillterId[indexFind])
    }

})



async function playpausebtn(id){
    isPlaying = !isPlaying; // Toggle status playing
    
    if(idBefore != id && idBefore && id != 0){
        console.log("masuk")
        currentTime = 0;
        updateProgress();
        document.getElementById(idBefore).checked = false;
        document.getElementById(idBefore).removeAttribute("checked")
        isPlaying = true;
    }
    
    if(id != 0){
        idBefore = id
    }else if(id == 0 && !idBefore){
        id = songlistMetadata[0]
        idBefore = id
    }
    console.log("[INFO]: GOING TO ID: "+ id)
    const idnow = id == 0 ? idBefore : id
    try{
        if (isPlaying){
            audioControl.src = getLiveSongURL(idnow);
            document.getElementById(idnow).setAttribute("checked", "checked")
            document.getElementById(idnow).checked = true;
            playIcon.style.display = 'none'; // Sembunyikan icon play
            pauseIcon.style.display = 'block'; // Tampilkan icon pause
            if(currentTime > 0){
                audioControl.currentTime = currentTime
                audioControl.play()
            }else{
                audioControl.play();
            }

        } else {
            // Saat pause diklik
            audioControl.pause()
            playIcon.style.display = 'block'; // Tampilkan icon play
            pauseIcon.style.display = 'none'; // Sembunyikan icon pause
            clearInterval(progressInterval);
            document.getElementById(idnow).checked = false;
            document.getElementById(idnow).removeAttribute("checked")
        }
    }
    catch(err) {
        console.error(err)
    }
}




// EVENT LISTENER - PROGRESS BAR CLICK
progressBar.addEventListener('click', (e) => {
    audioControl.pause()
    const rect = progressBar.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    currentTime = pos * totalDuration;
    audioControl.currentTime = currentTime
    audioControl.play()
    updateProgress();
});


// EVENT LISTENER - HEART BUTTON

heartBtn.addEventListener('click', () => {
    heartBtn.classList.toggle('active'); // Toggle class active
});


// EVENT LISTENER - VOLUME BUTTON

volumeBtn.classList.toggle('muted');
volumeBtn.addEventListener('click', () => {
    volumeBtn.classList.toggle('muted'); // Toggle class muted
    if(volumeBtn.classList.toggle("unmuted")){
        audioControl.volume = 0
    }else{
        audioControl.volume = currentAudiovolume
    }
});

document.getElementById("slidervolume").style.display="none";

volumeBtn.addEventListener("mouseover", ()=>{
    document.getElementById("slidervolume").style.display="";
    document.querySelector("body").addEventListener("click", ()=>{
        document.getElementById("slidervolume").style.display="none";
    })

})



document.getElementById("mainVolume").addEventListener("input", ()=>{
    audioControl.volume = document.getElementById("mainVolume").value/100
})


// DRAG FUNCTIONALITY - VARIABEL

let isDragging = false; // Status apakah sedang drag


// DRAG FUNCTIONALITY - FUNGSI UPDATE

// Fungsi untuk update progress berdasarkan posisi mouse
function updateProgressFromEvent(e) {
    const rect = progressBar.getBoundingClientRect();
    let pos = (e.clientX - rect.left) / rect.width;
    
    // Batasi posisi antara 0 dan 1 (0% - 100%)
    pos = Math.max(0, Math.min(1, pos));
    
    // Update waktu current berdasarkan posisi
    currentTime = pos * totalDuration;
    
    // Update tampilan progress bar
    updateProgress();
}


// DRAG FUNCTIONALITY - EVENT LISTENERS

// Event saat mouse ditekan pada progress bar (mulai drag)
progressBar.addEventListener('mousedown', (e) => {
    isDragging = true;
    progressBar.classList.add('dragging'); // Tambah class untuk visual feedback
    updateProgressFromEvent(e);
});

// Event saat mouse bergerak (sedang drag)
document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        updateProgressFromEvent(e);
    }
});

// Event saat mouse dilepas (selesai drag)
document.addEventListener('mouseup', () => {
    if (isDragging) {
        isDragging = false;
        progressBar.classList.remove('dragging'); // Hapus class dragging
    }
});

// INISIALISASI

// Set tampilan awal progress bar
updateProgress();


function debounce(func, timeout = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args); // Spread args langsung
    }, timeout);
  };
}

let search = '';
const debouncedSearch = debounce(async() => {
    search = inputSearch.value.replace(/\s+/g, '');
    console.log(search);
    if(!search == ' '){
        console.log("[INFO] wait to fetch")
        musicSearchtop.innerHTML = ''
        const songlist = await getMusicListAndSearch(inputSearch.value) || [];
        if(songlist.length <= 0) return
        const songs = songlist['subsonic-response'].searchResult3?.song || [];
        console.log(songs)
        console.log(songlist)
        songs.forEach(element => {
            console.log(element.id)
            musicSearchtop.appendChild(musicsongs(element.title, element.artist, element.id, getThumbnailURL(element.id)))
        });
    }
}, 500);


inputSearch.addEventListener("keydown", ()=>{
    debouncedSearch()
})

popupwin.style.display = "none"
inputSearch.addEventListener("focus", ()=>{
    popupwin.style.display = ""
    popupwin.style.opacity = 1
})

async function getAlbumthumniail() {
    const randomSongs = await fetch(getRandomSongURL(5)).then(f=>f.json())
    const randomSsongArtist = await randomSongs['subsonic-response'].randomSongs.song
    const getRandomsongArtist = randomSsongArtist.map(f=> f.artist)
    const getRandomsongID = randomSsongArtist.map(f=> f.id)
    
    getRandomsongID.forEach((v,t,a) => {
        artisID.appendChild(article(getRandomsongArtist[t], getThumbnailURL(v, 300)))
    });
}   

getAlbumthumniail()