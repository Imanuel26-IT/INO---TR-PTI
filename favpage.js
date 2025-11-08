// Tunggu sampai semua HTML dimuat
document.addEventListener('DOMContentLoaded', () => {

    // START SALIN: Logika interaksi playlist favorit
    const songRows = Array.from(document.querySelectorAll('.song-list tbody tr'));
    const homeButton = document.querySelector('.home-button');
    const playButton = document.querySelector('.play-button');
    const playButtonIcon = playButton ? playButton.querySelector('i') : null;
    const audioPlayer = document.getElementById('audioPlayer');

    let currentlyPlayingRow = songRows.find((row) => row.classList.contains('playing')) || null;
    let currentIndex = currentlyPlayingRow ? songRows.indexOf(currentlyPlayingRow) : null;

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
        audioPlayer.addEventListener('play', () => updatePlayButtonIcon(true));

        audioPlayer.addEventListener('pause', () => {
            if (!audioPlayer.ended) {
                updatePlayButtonIcon(false);
            }
        });

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
    }

    // 2. LOGIKA UNTUK ANIMASI TOMBOL HOME SAAT SCROLL
    window.addEventListener('scroll', () => {
        if (window.scrollY > 150) { 
            homeButton.classList.add('show');
        } else {
            homeButton.classList.remove('show');
        }
    });

    homeButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // END SALIN: Logika interaksi playlist favorit
});