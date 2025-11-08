// Tunggu sampai semua HTML dimuat
let listLoveSong = JSON.parse(localStorage.getItem("fav") )|| [];

let currentTime = 0; // Waktu saat ini dalam detik (02:54)
let totalDuration = 0; // Total durasi musik dalam detik (05:32)
let progressInterval; // Variable untuk menyimpan interval timer
let isDragging = false;


function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
const audioPlayer = document.getElementById('audioPlayer');
const progressFill = document.getElementById('progressFill'); // Bar progress kuning
const progressBar = document.getElementById('progressBar'); // Container progress bar
const currentTimeEl = document.getElementById('currentTime');
const duration = document.getElementById("duration");

function updateProgress() {
    const percentage = (currentTime / totalDuration) * 100;
    progressFill.style.width = percentage + '%';
    currentTimeEl.textContent = formatTime(currentTime);
}

progressBar.addEventListener('click', (e) => {
    const rect = progressBar.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    currentTime = pos * totalDuration;
    updateProgress();
});
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

function asad(){
    // START SALIN: Logika interaksi playlist favorit
    const songRows = Array.from(document.querySelectorAll('.song-list tbody tr'));
    const playButton = document.querySelector('.play-button');
    const playButtonIcon = playButton ? playButton.querySelector('i') : null;
    let currentlyPlayingRow = songRows.find((row) => row.classList.contains('playing')) || null;
    let currentIndex = currentlyPlayingRow ? songRows.indexOf(currentlyPlayingRow) : null;
    const inputlevel = document.getElementById("inputLevel")
    const prevBTN = document.getElementById("prev-btn");
    const nextBTN = document.getElementById("next-btn");
    const songTime = document.getElementById("songtime");
    audioPlayer.volume = inputlevel.value/100;
    
    const updatePlayButtonIcon = (isPlaying) => {
        if (!playButtonIcon) {
            return;
        }
        
        playButtonIcon.classList.toggle('fa-play', !isPlaying);
        playButtonIcon.classList.toggle('fa-pause', isPlaying);
    };
    
    const markRowAsPlaying = (row) => {
        songRows.forEach((item) => item.classList.remove('playing'));
        
        if (!row) {
            return;
        }
        
        row.classList.add('playing');
        currentlyPlayingRow = row;
        currentIndex = songRows.indexOf(row);
    };
    
    const pauseCurrentRowVisual = () => {
        if (currentlyPlayingRow) {
            currentlyPlayingRow.classList.remove('playing');
        }
    };
    
    const clearPlaybackState = () => {
        pauseCurrentRowVisual();
        currentlyPlayingRow = null;
        currentIndex = null;
    };
    
    const playRow = (row) => {
        if (!row || !audioPlayer) {
            return;
        }
        
        const source = row.dataset.audio;
        
        if (!source) {
            console.warn('Tidak ada sumber audio untuk baris ini.');
            return;
        }
        
        if (audioPlayer.getAttribute('src') !== source) {
            duration.textContent = "WAIT.."
            audioPlayer.src = source;
        }
        
        markRowAsPlaying(row);
        
        audioPlayer.play().catch((error) => {
            console.error('Gagal memutar audio:', error);
            clearPlaybackState();
            audioPlayer.removeAttribute('src');
        });
    };
    
    if (currentlyPlayingRow && audioPlayer) {
        const initialSource = currentlyPlayingRow.dataset.audio;
        
        if (initialSource) {
            audioPlayer.src = initialSource;
        } else {
            pauseCurrentRowVisual();
            currentlyPlayingRow = null;
            currentIndex = null;
        }
    }
    
    updatePlayButtonIcon(false);
    
    // 1. LOGIKA UNTUK DAFTAR LAGU (PLAY/PAUSE)
    songRows.forEach((row, index) => {
        row.style.setProperty('--row-delay', `${0.12 + index * 0.06}s`);
        
        row.addEventListener('click', () => {
            console.log("hlo")
            if (!audioPlayer) {
                return;
            }
            
            if (row === currentlyPlayingRow && !audioPlayer.paused) {
                audioPlayer.pause();
                pauseCurrentRowVisual();
            } else if (row === currentlyPlayingRow && audioPlayer.paused) {
                playRow(row);
            } else {
                playRow(row);
            }
        });
    });

    if (playButton) {
        playButton.addEventListener('click', () => {
            if (!audioPlayer) {
                return;
            }

            if (currentlyPlayingRow) {
                if (audioPlayer.paused) {
                    playRow(currentlyPlayingRow);
                } else {
                    audioPlayer.pause();
                    pauseCurrentRowVisual();
                }
            } else if (songRows.length > 0) {
                playRow(songRows[0]);
            }
        });
    }

    if (audioPlayer) {
        audioPlayer.addEventListener('play', () => {
            updatePlayButtonIcon(true)
            const titleEl = currentlyPlayingRow.querySelector(".title").textContent;
            document.getElementById("musicTITLE").textContent = titleEl
        });

        audioPlayer.addEventListener("playing", ()=>{
            totalDuration = audioPlayer.duration
            setTimeout(()=>{
                duration.textContent = formatTime(totalDuration);
            },500)
        })
        audioPlayer.addEventListener('pause', () => {
            if (!audioPlayer.ended) {
                updatePlayButtonIcon(false);
            }
        });

        audioPlayer.addEventListener("timeupdate", ()=>{
            currentTime = audioPlayer.currentTime
            updateProgress()
            currentTimeEl.textContent = formatTime(currentTime)
        })

        audioPlayer.addEventListener('ended', () => {
            const nextRow = currentIndex !== null ? songRows[currentIndex + 1] : null;

            if (nextRow) {
                playRow(nextRow);
            } else {
                pauseCurrentRowVisual();
                updatePlayButtonIcon(false);
                audioPlayer.currentTime = 0;
            }
        });
        nextBTN.addEventListener("click",() =>{
            const nextRow = currentIndex !== null ? songRows[currentIndex + 1] : null;

            if (nextRow) {
                playRow(nextRow);
            } 
        })

        prevBTN.addEventListener("click",() =>{
            const nextRow = currentIndex !== null ? songRows[currentIndex - 1] : null;

            if (nextRow) {
                playRow(nextRow);
            }
        })

        
    }
    

    
    inputlevel.addEventListener("input", ()=>{
        audioPlayer.volume = inputlevel.value/100;
    })

}


document.addEventListener('DOMContentLoaded', async() => {
    listLoveSong.forEach(async(id, index)=>{
        const { ["subsonic-response"]: subsonic } = await (await fetch(getSpesificSong(id))).json();
        await document.getElementById("favmusic").appendChild(songrow((index+1), getLiveSongURL(id), subsonic.song.artist, subsonic.song.title,subsonic.song.album,formatTime(subsonic.song.duration)))
        asad()
    })
});

