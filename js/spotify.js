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
})