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

const getSpesificSong = (id) =>{
    if (!id) return console.error("please see your id music")
    return `${BASEURL}/rest/getSong?id=${id}${auth()}`
}

