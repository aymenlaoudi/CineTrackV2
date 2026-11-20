import { createContent , getContents , updateContent , deleteContent } from "./api.js";
import { showMessage } from "./ui.js";
// import { renderAdminCards, showMessage } from "./ui.js";
// import {  } from "./favourites.js";
import { validateForm } from "./validation.js";

const addBtn = document.querySelector('#addBtn')
const modal = document.querySelector('#modal-content')
const content = document.querySelector('#content')
const liste = document.querySelector('#movies')
const status = document.querySelector('#status')
const search = document.querySelector('#search_admin')


let movies = []

async function load() {
    showMessage(status, "Chargement")
    try{
        movies = await getContents()
        showMessage(status, "")
        renderMovies(movies)
    } catch (e){
        showMessage(status,"Error : impossible de charger les données","error")
    }
}
load()

function openModal() {
    modal.classList.remove('hidden')
    modal.classList.add('flex')
}

function closeModal() {
    modal.classList.add('hidden')
    modal.classList.remove('flex')
    content.innerHTML = ''
}

function showForm(movie = null) {
    const isEdit = movie !== null
    let amount = ''
    if(isEdit && movie.type == 'movie') amount = movie.duration
    if(isEdit && movie.type == 'series') amount = movie.seasons.length
    content.innerHTML = `
    <h2 class="text-2xl font-bold mb-4">${isEdit ? 'Modify' : 'Add'} Content</h2>

    <div class="grid grid-cols-2 gap-4">
    <div class="col-span-2">
    <input id="f_title" class="w-full p-2 mb-3 bg-[#2b2b34] rounded" placeholder="Title"
        value="${isEdit ? movie.title : ''}">
    <p id="err_title" class="text-red-500 text-sm mb-2"></p>
    </div>
    <div class="col-span-2">
    <input id="f_image" class="w-full p-2 mb-3 bg-[#2b2b34] rounded" placeholder="Image URL"
        value="${isEdit ? movie.image : ''}">
    <p id="err_image" class="text-red-500 text-sm mb-2"></p>
    </div>
    <div>
    <select id="f_type" class="w-full p-2 mb-4 bg-[#2b2b34] rounded">
        <option value="">-- Type --</option>
        <option value="movie">Movies</option>
        <option value="series">Series</option>
    </select>
    <p id="err_type" class="text-red-500 text-sm mb-2"></p>
    </div>
    <div>
    <input id="f_year" class = "w-full p-2 mb-3 bg-[#2b2b34] rounded" placeholder="Year of show"
        value="${isEdit ? movie.releaseYear : ''}">
    <p id="err_releaseYear" class="text-red-500 text-sm mb-2"></p>
    </div>
    <div class="col-span-2">
    <input id="f_amount" class="w-full p-2 bg-[#2b2b34] rounded" placeholder="Duration (film) ou nombre de saisons (série)"
        value="${amount}">
    <p id="err_amount" class="text-red-500 text-sm mb-2"></p>
    </div>
    <div>
    <input id="f_genres" class = "w-full p-2 mb-3 bg-[#2b2b34] rounded" placeholder="Genres"
        value="${isEdit ? movie.genres : ''}">
    </div>
    <div>
    <input id="f_countries" class = "w-full p-2 mb-3 bg-[#2b2b34] rounded" placeholder="productionCountries"
        value="${isEdit ? movie.productionCountries : ''}">
    </div>
    <div>
    <input id="f_directors" class = "w-full p-2 mb-3 bg-[#2b2b34] rounded" placeholder="Directors"
        value="${isEdit ? movie.directors : ''}">
    </div>
    <div>
    <input id="f_desc" class = "w-full p-8 mb-3 bg-[#2b2b34] rounded" placeholder="Description"
        value="${isEdit ? movie.description : ''}">
    </div>
    <div class="flex gap-2 mt-4">
        <button id="f_save" class="px-4 py-2 bg-red-500 rounded">Save</button>
        <button id="f_cancel" class="px-4 py-2 bg-gray-700 rounded">Cancel</button>
    </div>
    `

    if(isEdit) document.querySelector('#f_type').value = movie.type
    document.querySelector('#f_cancel').addEventListener('click', closeModal)
    document.querySelector('#f_save').addEventListener('click',() => save(movie))
}
async function save(movie) {
    const amount = Number(document.querySelector('#f_amount').value)
    const type = document.querySelector('#f_type').value

    const data = {
        title: document.querySelector('#f_title').value.trim(),
        image: document.querySelector('#f_image').value.trim(),
        type: type,
        releaseYear: Number(document.querySelector('#f_year').value),
        amount: amount,
        genres: document.querySelector('#f_genres').value.split(",").map(g => g.trim()),
        productionCountries: document.querySelector('#f_countries').value.split(",").map(g => g.trim()),
        directors: document.querySelector('#f_directors').value.split(",").map(g => g.trim()),
        description: document.querySelector('#f_desc').value.trim()
    }

    // effacer les anciennes erreurs
    document.querySelector('#err_title').textContent = ''
    document.querySelector('#err_image').textContent = ''
    document.querySelector('#err_type').textContent = ''
    document.querySelector('#err_releaseYear').textContent = ''
    document.querySelector('#err_amount').textContent = ''

    // valider
    const errors = validateForm(data)
    if (errors.title) document.querySelector('#err_title').textContent = errors.title
    if (errors.image) document.querySelector('#err_image').textContent = errors.image
    if (errors.type) document.querySelector('#err_type').textContent = errors.type
    if (errors.releaseYear) document.querySelector('#err_releaseYear').textContent = errors.releaseYear
    if (errors.amount) document.querySelector('#err_amount').textContent = errors.amount
    if (Object.keys(errors).length > 0) return

    // préparer l'objet à envoyer
    delete data.amount
    if (type == 'movie') {
        data.duration = amount
    } else {
        data.seasons = []
        for (let i = 1; i <= amount; i++) {
            data.seasons.push({ number: i })
        }
    }

    try {
        if (movie) {
            const updated = await updateContent(movie.id, { ...movie, ...data })
            movies = movies.map(m => m.id == movie.id ? updated : m)
        } else {
            const created = await createContent(data)
            movies.push(created)
        }
        renderMovies(movies)
        closeModal()
        showMessage(status, "Enregistré avec succès", "success")
    } catch (e) {
        showMessage(status, "Erreur lors de l'enregistrement", "error")
    }
}


addBtn.addEventListener('click',()=>{
    showForm()
    openModal()
})

function renderMovies(list ) {
    liste.innerHTML =''
    list.forEach(movie => {
        const tr = document.createElement('tr')
        tr.className = 'border-b border-gray-700'

        // Title (image + title)
        const td_title = document.createElement('td')
        td_title.className = 'p-4'
        const div = document.createElement('div')
        div.className = 'flex items-center gap-4'
        const img = document.createElement('img')
        img.src = movie.image
        img.className = 'w-16'
        const p = document.createElement('p')
        p.className = 'text-lg font-bold text-white'
        p.textContent = movie.title
        div.append(img,p)
        td_title.append(div)

        // Type
        const td_type = document.createElement('td')
        const p_type = document.createElement('span')
        p_type.textContent = movie.type
        p_type.className = 'bg-gray-800 p-4 rounded-2xl'
        td_type.className = 'p-4 text-gray-300'
        td_type.append(p_type)
        // Rating
        const td_year = document.createElement('td')
        const year = document.createElement('span')
        year.textContent = movie.releaseYear
        year.className = 'font-bold'
        td_year.className = 'p-4 text-gray-300 text-center'
        td_year.append(year)
        // Actions
        const td_actions = document.createElement('td')
        td_actions.className = 'p-4 text-center'
        const btn_modifty = document.createElement('button')
        btn_modifty.textContent = 'Modify'
        btn_modifty.className = 'px-3 py-1 mr-2 bg-blue-500 text-white rounded text-center'
        btn_modifty.addEventListener('click',()=>{
            showForm(movie)
            openModal()
        })
        const btn_delete = document.createElement('button')
        btn_delete.textContent = 'Delete'
        btn_delete.className = 'px-3 py-1 bg-red-500 text-white rounded'
        btn_delete.addEventListener('click', async () => {
            if (!confirm(`Supprimer « ${movie.title} » ?`)) return
            try {
                await deleteContent(movie.id)
                movies = movies.filter(m => m.id !== movie.id)
                renderMovies(movies)
                showMessage(status, "Supprimé avec succès", "success")
            } catch (e) {
                showMessage(status, "Erreur lors de la suppression", "error")
            }
        })
        td_actions.append(btn_modifty,btn_delete)
        tr.append(td_title,td_type,td_year,td_actions)
        liste.append(tr)
    });
}

function searchAdmin() {
    const shows = search.value.toLowerCase().trim()
    let searchShow = movies.filter(show => show.title.toLowerCase().startsWith(shows))
    renderMovies(searchShow)
}

search.addEventListener('input',searchAdmin)