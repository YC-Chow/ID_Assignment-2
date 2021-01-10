const APIController = (function(){

    const clientId = ' ';
    const clientSecret = ' ';

    const _getToken = async () => {
        const result = await fetch('https://accounts.spotify.com/api/token',{
            method: 'POST',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
            },
            body: 'grant-type=client=credentials'
        });

        const data = await result.json();
        return data.access_token;
    }

    const _getGenres = async(token) => {
        const result = await fetch('https://api.spotify.com/v1/browse/categories?locale=sv_US',{
            method = 'GET',
            headers: {'Authorization' : 'Bearer ' + token}
        });

        const data = await result.json();
        return data.categories.items;
    }

    const _getPlaylistByGenre = async(token,genreID) => {
        const limit = 10;

        const result = await fetch(`https://api.spotify.com/v1/browse/categories/${genreID}/playlists?limit=${limit}`,{
            method = 'GET',
            headers: {'Authorization' : 'Bearer ' + token}
        });

        const data = await result.json();
        return data.playlists.items;
    }

    const _getTracks = async(token, tracksEndPoint) => {
        const limit = 10
        const result = await fetch(`${tracksEndPoint}?limit=${limit}`,{
            method = 'GET',
            headers: {'Authorization' : 'Bearer ' + token}
        });

        const data = await result.json();
        return data.items;
    }

    const _getTrack = async(token, tracksEndPoint) => {
        const limit = 10
        const result = await fetch(`${tracksEndPoint}`,{
            method = 'GET',
            headers: {'Authorization' : 'Bearer ' + token}
        });

        const data = await result.json();
        return data;
    }

    return {
        getToken(){
            return _getToken();
        },
        getGenres (token) {
            return _getGenres(token);
        },
        getPlaylistByGenre(token, genreID){
            return _getPlaylistByGenre(token, genreID);
        },
        getTracks(token, tracksEndPoint){
            return _getTracks(token, tracksEndPoint);
        },
        getTrack(token, tracksEndPoint){
            return _getTrack(token, tracksEndPoint);
        }
    }
})();

//UI
const UIController = (function() {

    //object to hold references to html selectors
    const DOMElements = {
        selectGenre: '#select_genre',
        selectPlaylist: '#select_playlist',
        buttonSubmit: '#btn_submit',
        divSongDetail: '#song-detail',
        hfToken: '#hidden_token',
        divSonglist: '.song-list'
    }

    //public methods
    return {

        //method to get input fields
        inputField() {
            return {
                genre: document.querySelector(DOMElements.selectGenre),
                playlist: document.querySelector(DOMElements.selectPlaylist),
                tracks: document.querySelector(DOMElements.divSonglist),
                submit: document.querySelector(DOMElements.buttonSubmit),
                songDetail: document.querySelector(DOMElements.divSongDetail)
            }
        },

        // need methods to create select list option
        createGenre(text, value) {
            const html = `<option value="${value}">${text}</option>`;
            document.querySelector(DOMElements.selectGenre).insertAdjacentHTML('beforeend', html);
        }, 

        createPlaylist(text, value) {
            const html = `<option value="${value}">${text}</option>`;
            document.querySelector(DOMElements.selectPlaylist).insertAdjacentHTML('beforeend', html);
        },

        // need method to create a track list group item 
        createTrack(id, name) {
            const html = `<a href="#" class="list-group-item list-group-item-action list-group-item-light" id="${id}">${name}</a>`;
            document.querySelector(DOMElements.divSonglist).insertAdjacentHTML('beforeend', html);
        },

        // need method to create the song detail
        createTrackDetail(img, title, artist) {

            const detailDiv = document.querySelector(DOMElements.divSongDetail);
            // any time user clicks a new song, we need to clear out the song detail div
            detailDiv.innerHTML = '';

            const html = 
            `
            <div class="row col-sm-12 px-0">
                <img src="${img}" alt="">        
            </div>
            <div class="row col-sm-12 px-0">
                <label for="Genre" class="form-label col-sm-12">${title}:</label>
            </div>
            <div class="row col-sm-12 px-0">
                <label for="artist" class="form-label col-sm-12">By ${artist}:</label>
            </div> 
            `;

            detailDiv.insertAdjacentHTML('beforeend', html)
        },

        resetTrackDetail() {
            this.inputField().songDetail.innerHTML = '';
        },

        resetTracks() {
            this.inputField().tracks.innerHTML = '';
            this.resetTrackDetail();
        },

        resetPlaylist() {
            this.inputField().playlist.innerHTML = '';
            this.resetTracks();
        },
    }

})();

const APPController = (function(UICtrl,APICtrl){

    const DOMInputs = UICtrl.inputField();

    //get genre on page load
    const loadGenres = async() => {
        //get tokens
        const token = await APICtrl.getToken();

        //get genres
        const genres = await APICtrl.getGenres(token);

        genres.forEach(element => UICtrl.createGenre(element.name, element.id));        
    }
    
    //create genre change event listener
    DOMInputs.genre.addEventListener('change', async () =>{
        // reset of fields due to change of genre
        UICtrl.resetPlaylist();
        
        const token = UICtrl.getStoredToken().token;

        const genreSelect = UICtrl.inputField().genre;

        const genreID = genreSelect.options[genreSelect.selectedIndex].value;

        const playlist = await APICtrl.getPlaylistByGenre(token,genreID);
        
        console.log(playlist)

    });
    //create song selection change event listener
    DOMInputs.songs.addEventListener('click', async(e) => {
        //prevent page reset
        e.preventDefault();
    });
    
    //create submit button click event listner
    DOMInputs.submit.addEventListener('click', async(e) => {
        //prevent page reset
        e.preventDefault();
    });
})
