import { fetchData, getComments, createComment } from "./api.js";
import { showFavourite, isFav, togFavorite} from "./favourites.js";
const data = await fetchData('https://raw.githubusercontent.com/ouchad97/cinetrack-api/main/cinetrack-data.json')
console.log(data);


const test = document.querySelector('#test')

let showsPerPage = 8 ;
let currentPage = 1 ;
let currentdata = data

function showMovies(data) {
    test.innerHTML = ""

    let startIndex = (currentPage - 1) * showsPerPage
    let endIndex = startIndex + showsPerPage

    const Movies = data.slice(startIndex, endIndex);

    if(Movies.length === 0){
        test.innerHTML = "<div style='grid-column: 1 / -1' class='bg-white rounded-xl shadow-xl p-8 text-center text-3xl font-bold text-gray-500'>Tv show Introvable</div>"
        return
    }
    Movies.forEach(movie =>{
        let id = movie.id
        let title = movie.title
        let type = movie.type
        let releaseYear = movie.releaseYear
        let duration = movie.duration
        let image = movie.image
        let genres = movie.genres
        let directors = movie.directors

        const card = document.createElement('div')
        card.classList = "bg-[#00002B] p-4 rounded-2xl hover:scale-97 transition duration-100 cursor-pointer"
        card.id = `card_${id}`
        test.append(card)
        const fav = isFav(movie.id)
        card.innerHTML = `
        <div class="flex flex-col gap-4 justify-between">
        <div class="relative">
        <img class="rounded-lg" src="${image}">
        <button class="fav-btn p-2 rounded-full bg-black/60 text-red-500 text-2xl absolute top-2 right-2" data-id="${id}">${fav ? '♥' : '♡'}</button>
        </div>
        <div>
        <p class="text-white font-bold text-lg">${title} (${releaseYear})</p>
        </div>
        </div>
        `
        const favBtn = card.querySelector('.fav-btn')
        favBtn.addEventListener('click',(e)=>{
            e.stopPropagation()
            togFavorite(movie)
            favBtn.textContent = isFav(movie.id) ? '♥' : '♡'
            showFavourite(()=>showMovies(data))
        })
    })
}

showFavourite(() => showMovies(data))
showMovies(data)

const filter = document.querySelector('#filter')

function filterShows() {
    const shows = filter.value
    if(shows == ""){return showMovies(data)}
    if(shows == 'Tout'){return showMovies(data)}
    let movieType = data.filter(movie => movie.type == "movie")
    if(shows == 'Movies'){return showMovies(movieType)}
    let seriesType = data.filter(serie => serie.type == "series")
    if(shows == 'Series'){return showMovies(seriesType)}
    currentPage = 1
}
filter.addEventListener('change',() => {
    const select =  filterShows()
    console.log(select)
})
const search = document.querySelector('#search')
function searchShows() {
    const shows = search.value.toLowerCase().trim()
    let searchShows = data.filter(show => show.title.toLowerCase().startsWith(shows))
    currentPage = 1
    showMovies(searchShows)
}
search.addEventListener('input',() => {
    const s = searchShows()
    console.log(s);
})

const btns = document.querySelectorAll('#pagination button')
btns.forEach(function (btn,index) {
    btn.addEventListener('click',function () {
        currentPage = index + 1
        filterShows(data)
    })
})

const cards = document.querySelector('#test')
const modal = document.querySelector('#modal-card')
const content = document.querySelector('#content-modal')
cards.addEventListener('click', (e) => {
    const card = e.target.closest('[id^="card_"]')
    if(!card) return

    const id = card.id.replace('card_','')
    const movie = data.find(m => m.id == id)
    if (!movie) return
    const duration = (movie.type === "movie") ? `${movie.duration} min` : `${movie.seasons.length} seasons`;
    const pseudoSaved = localStorage.getItem('pseudo') || ''
    content.innerHTML = `
    <button class="close-modal absolute top-2 right-4 text-2xl">X</button>
    <div class="grid grid-cols-2 gap-4">
        <div>
            <img class="rounded-xl" src="${movie.image}">
        </div>
        <div class="flex flex-col justify-center gap-4">
            <h2 class="text-2xl font-bold">Title : ${movie.title}</h2>
            <hr>
            <span class="font-semibold">Type : ${movie.type}</span>
            <span class="font-semibold">Duration : ${duration}</span>
            <span class="font-semibold">Description : ${movie.description}</span>
            <span class="font-semibold">Genres : ${movie.genres}</span>
        </div>
    </div>

    <hr class="my-4">
    <h3 class="text-xl font-bold mb-2">Comments</h3>
    <div id="comments">Chargement...</div>

    <input id="c_author" class="w-full bg-white text-gray-800 p-2 rounded mt-2"
        placeholder="Your name" value="${pseudoSaved}">
    <textarea id="c_text" class="w-full bg-white text-gray-800 p-2 rounded mt-2"
        placeholder="Your comment"></textarea>
    <p id="c_error" class="text-red-500 text-sm"></p>
    <button id="c_send" class="mt-2 px-4 py-2 bg-red-500 text-white rounded">Post</button>
    <p id="c_status" class="text-sm"></p>
    `
    const close_modal = content.querySelector('.close-modal')
    close_modal.addEventListener('click',()=>{
        modal.classList.add('hidden')
    })
    modal.classList.remove('hidden')
    modal.classList.add('flex')
    const box = content.querySelector('#comments')

    async function loadComments() {
        const list = await getComments(movie.id)
        if (list.length === 0) {
            box.innerHTML = '<p class="text-gray-500">Aucun commentaire</p>'
            return
        }
        box.innerHTML = list.map(c => `
            <div class="bg-[#222227] rounded p-2 mb-2">
                <div class="flex justify-between text-xs text-gray-400">
                    <span class="font-bold text-white">${c.author}</span>
                    <span>${new Date(c.createdAt).toLocaleDateString()}</span>
                </div>
                <p class="mt-1">${c.text}</p>
            </div>
        `).join('')
    }
    loadComments()
    content.querySelector('#c_send').addEventListener('click', async () => {
        const author = content.querySelector('#c_author').value.trim()
        const text   = content.querySelector('#c_text').value.trim()
        const errorP  = content.querySelector('#c_error')
        const statusP = content.querySelector('#c_status')

        errorP.textContent = ''
        statusP.textContent = ''

        if (!author) { errorP.textContent = 'Nom obligatoire'; return }
        if (!text)   { errorP.textContent = 'Commentaire obligatoire'; return }

        localStorage.setItem('pseudo', author)

        try {
            await createComment({
                contentId: String(movie.id),
                author: author,
                text: text,
                createdAt: new Date().toISOString()
            })
            content.querySelector('#c_text').value = ''
            statusP.className = 'text-sm text-green-500'
            statusP.textContent = 'Commentaire ajouté ✓'
            loadComments()
        } catch {
            statusP.className = 'text-sm text-red-500'
            statusP.textContent = "Erreur d'envoi"
        }
    })
})
    modal.addEventListener('click',(e) =>{
        if(e.target === modal){
            modal.classList.add('hidden')
        }
    })
