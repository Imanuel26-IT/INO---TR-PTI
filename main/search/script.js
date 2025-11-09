const songresult = document.getElementById("songresult");


async function catchMusicSearch(data = []){
  console.log("[IFRAME-catchMusicSearch] Function called!");
  console.log("[IFRAME-catchMusicSearch] Data received:", data);
  console.log("[IFRAME-catchMusicSearch] Data length:", data.length);
  await data.forEach(e=>{
    songresult.appendChild(songsearchList(getThumbnailURL(e.id, 200), e.title, e.artist, window.parent.formatTime(e.duration), e.id))
  })
  
  const songItems = document.querySelectorAll('.song-item');
  // Event listener untuk menandai lagu yang sedang diputar
  songItems.forEach(item => {
    item.addEventListener('click', function() {
      songItems.forEach(i => i.classList.remove('playing'));
      console.log(this.getAttribute("data-song"))
      window.parent.playpausebtn(this.getAttribute("data-song"))
      this.classList.add('playing');
    });
  });


}
