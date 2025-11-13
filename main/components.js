const cutString = (str, maxWidht, endPrefix) =>{
    return str.length > maxWidht ? str.slice(0,maxWidht) + (endPrefix? endPrefix:"") : str
}


const musicsongs = (title, artist, musicId=1, imageSRC="")=>{
            const doc = document.createElement("div")
            doc.classList.add = "container-music"
            doc.innerHTML = `<div>
                <div class="interflex" id="Music1">
                    <div id="anchor">
                        <svg width="90" height="90" class="circle-slider">
                            <circle cx="50%" cy="50%" r="30"></circle>
                            <circle cx="50%" cy="50%" r="30"></circle>
                        </svg>
                        <img src="${imageSRC}" alt="" id="image">
                    </div>
                    <div id="title">
                        <p id="nameSong">${cutString(title, 30, "..")}</p>
                        <p id="penyanyi">${artist}</p>
                    </div>
                    <!-- From Uiverse.io by catraco -->
                    <label class="container">
                        <input id="${musicId}" type="checkbox" musicid="${musicId}" onclick="playpausebtn('${musicId}')">
                        <svg viewBox="0 0 384 512" height="1em" xmlns="http://www.w3.org/2000/svg" class="play">
                            <path
                                d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z">
                            </path>
                        </svg>
                        <svg viewBox="0 0 320 512" height="1em" xmlns="http://www.w3.org/2000/svg" class="pause">
                            <path
                                d="M48 64C21.5 64 0 85.5 0 112V400c0 26.5 21.5 48 48 48H80c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H48zm192 0c-26.5 0-48 21.5-48 48V400c0 26.5 21.5 48 48 48h32c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H240z">
                            </path>
                        </svg></label>
                </div>
                <hr>
            </div>`;
            return doc
        }

    const article = (Artis, imageSRC) =>{

        const doc = document.createElement("div")
        doc.innerHTML = `
            <article class="artist" role="listitem">
                <img class="artist__cover" alt="Artist cover" src="${imageSRC}" />
                <h3 class="artist__name">${Artis}</h3>
                <p class="artist__meta">...</p>
            </article>

        `

        return doc
    }


const playlistPPage = () =>{
    const element = document.createElement("iframe");
    element.classList.add("iramefav")
    const favPage = "../playlistpage/favpage.html"
    element.src = favPage;
    return element;
}

/* 

<tr data-audio="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3">
                        <td class="song-index">
                            <span class="song-number">1</span>
                            <i class="fas fa-play play-icon"></i>
                            <i class="fas fa-pause playing-icon"></i>
                        </td>
                        <td class="song-title">Bohemian Rhapsody</td>
                        <td>Queen</td>
                        <td>A Night at the Opera</td>
                        <td>5:55</td>
                    </tr>

*/

const songrow = (songnum,audioID, artist, title, album,duration) =>{
    album = album == "[Unknown Album]"? ".....": album
    const element = document.createElement("tr")
    element.setAttribute("data-audio", audioID);
    element.innerHTML = `
        <td class="song-index">
            <span class="song-number">${songnum}</span>
            <i class="fas fa-play play-icon"></i>
            <i class="fas fa-pause playing-icon"></i>
        </td>
        <td class="song-title title">${title}</td>
        <td>${artist}</td>
        <td>${album}</td>
        <td>${duration}</td>
    `
    return element
}

const songsearchList = (imageSRC, title, artist, duration, songID) =>{
    const li = document.createElement("li")
    li.classList.add("song-item");
    li.setAttribute("data-song", songID)
    li.innerHTML = `
            <img
              src="${imageSRC}"
              alt="About You Album Artwork"
              class="song-image"
              width="55"
              height="55"
            />
            <div class="song-info">
              <p class="song-title">${title}</p>
              <p class="song-artist">${artist}</p>
            </div>
            <div class="song-duration">${duration}</div>
        `
    return li
}

const pforile = () =>{
    const iframe = document.createElement("iframe");
    iframe.classList.add("iramefav")
    iframe.src = "./profile/Index.html"
    return iframe
}