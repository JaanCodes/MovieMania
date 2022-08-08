const movieSearchBox = document.getElementById('movie-search-box')
const searchList = document.getElementById('search-list')
const resultGrid = document.getElementById('result-grid')


// load movies from API 
async function loadMovies(searchTerm){
    const URL = `https://omdbapi.com/?s=${searchTerm}&page=1&apikey=fc1fef96`
    const res = await fetch(`${URL}`)
    const data = await res.json()
    if(data.Response == 'True') displayMovieList(data.Search)
}

function findMovies(){
    let searchTerm = (movieSearchBox.value).trim()
    if(searchTerm.length > 0){
        searchList.classList.remove('hide-search__list')
        loadMovies(searchTerm)
    }
    else{
        searchList.classList.add('hide-search__list')
    }
}

function displayMovieList(movies){
    searchList.innerHTML = ""
    for(let idx = 0 ; idx < movies.length ; idx++){
        let movieListItem = document.createElement('div') // create a div for every movie
        movieListItem.dataset.id = movies[idx].imdbID   //setting movie id in data-id
        movieListItem.classList.add('search__list--item')
        if(movies[idx].poster != "N/A"){
            moviePoster = movies[idx].Poster
        }
        else{
            moviePoster = "./assets/image_not_found.png"
        }
        movieListItem.innerHTML = `
            <div class="search__list-item--thumbnail">
                <img src="${moviePoster}" alt="">
            </div>
            <div class="search__item--info">
                <h3>${movies[idx].Title}</h3>
                <p>${movies[idx].Year}</p>
            </div>
        `
        searchList.appendChild(movieListItem)
    }
    loadMovieDetails()
}

function loadMovieDetails(){
    const searchListMovies = searchList.querySelectorAll('.search__list--item')
    searchListMovies.forEach(movie => {
        movie.addEventListener('click', async () => {
            searchList.classList.add('hide-search__list')
            movieSearchBox.value = ""
            const result = await fetch(`http://www.omdbapi.com/?i=${movie.dataset.id}&apikey=fc1fef96`)
            const movieDetails = await result.json()
            displayMovieDetails(movieDetails)
        })
    })
}


function displayMovieDetails(details){
    resultGrid.innerHTML = `
        <div class="movie__poster">
            <img src="${(details.Poster != "N/A") ? details.Poster : "./assets/image_not_found.png"}" alt="">
        </div>
        <div class="movie__info">
            <h3 class="movie__info--title">${details.Title}</h3>
            <ul class="movie__info--misc">
                <li class="movie__info--year">Year: ${details.Year}</li>
                <li class="movie__info--rated">Ratings: ${details.Rated}</li>
                <li class="movie__info--released">Released: ${details.Released}</li>
            </ul>
            <p class="movie__info--genre"><b>Genre:</b> ${details.Genre}</p>
            <p class="movie__info--writer"><b>Writer:</b> ${details.Writer}</p>
            <p class="movie__info--actors"><b>Actors:</b> ${details.Actors}</p>
            <p class="movie__info--plot"><b>Plot:</b> ${details.Plot}</p>
            <p class="movie__info--language"><b>Language:</b> ${details.Language}</p>
            <p class="movie__info--awards"><b><i class="fas fa-award"></i></b> ${details.Awards}</p>
        </div>
    `
}


window.addEventListener('click', (event) => {
    if(event.target.className != "form__control"){
        searchList.classList.add('hide-search__list')
    }
})