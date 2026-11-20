import { createContent , getContent , updateContent , deleteContent } from "./api.js";
// import { renderAdminCards } from "./ui.js";
// import {  } from "./favourites.js";

const addBtn = document.querySelector('#addBtn')
const modal = document.querySelector('#modal-content')
const content = document.querySelector('#content')
const liste = document.querySelector('#movies')

let movies = []

async function get() {
    movies = await getContent()
    console.log(movies)
    renderMovies()
}
get()

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
    content.innerHTML = `
    <h2 class="text-2xl font-bold mb-4">${isEdit ? 'Modify' : 'Add'} Content</h2>
    <input id="f_title" class="w-full p-2 mb-3 bg-[#2b2b34] rounded" placeholder="Title"
        value="${isEdit ? movie.title : ''}">
    <input id="f_image" class="w-full p-2 mb-3 bg-[#2b2b34] rounded" placeholder="Image URL"
        value="${isEdit ? movie.image : ''}">
    <select id="f_type" class="w-full p-2 mb-4 bg-[#2b2b34] rounded">
        <option value="Movies">Movies</option>
        <option value="Series">Series</option>
    </select>
    <div class="flex gap-2">
        <button id="f_save" class="px-4 py-2 bg-red-500 rounded">Save</button>
        <button id="f_cancel" class="px-4 py-2 bg-gray-700 rounded">Cancel</button>
    </div>
    `

    if(isEdit) document.querySelector('#f_type').value = movie.type
    document.querySelector('#f_cancel').addEventListener('click', closeModal)
    document.querySelector('#f_save').addEventListener('click', () => {
    const title = document.querySelector('#f_title').value.trim()
    const image = document.querySelector('#f_image').value.trim()
    const type = document.querySelector('#f_type').value
    if(!title) return alert('title should be exist')

    if(isEdit){
        movie.title = title
        movie.image = image
        movie.type = type
    }else{
        movies.push({ id: Date.now(), title, image, type})
    }
    renderMovies()
    closeModal()

})
}

function showDelete(movie) {
    content.innerHTML = `
        <h2 class="text-2xl font-bold mb-4">Delete</h2>
        <p class="mb-6">Do you want to delete <b>${movie.title}</b> ?</p>
        <div class="flex gap-2">
            <button id="d_yes" class="px-4 py-2 bg-red-500 rounded">Yes, delete</button>
            <button id="d_no" class="px-4 py-2 bg-gray-700 rounded">Cancel</button>
        </div>
    `
    document.querySelector('#d_no').addEventListener('click', closeModal)
    document.querySelector('#d_yes').addEventListener('click', () => {
        movies = movies.filter(m => m.id !== movie.id)
        renderMovies()
        closeModal()
    })
}

addBtn.addEventListener('click',()=>{
    showForm()
    openModal()
})

function renderMovies() {
    liste.innerHTML =''
    movies.forEach(movie => {
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
        const td_rating = document.createElement('td')
        const star = document.createElement('span')
        star.textContent = ' ★'
        star.className = 'text-yellow-300 font-bold'
        td_rating.textContent = '4.8 '
        td_rating.className = 'p-4 text-gray-300'
        td_rating.append(star)
        // Actions
        const td_actions = document.createElement('td')
        td_actions.className = 'p-4'
        const btn_modifty = document.createElement('button')
        btn_modifty.textContent = 'Modify'
        btn_modifty.className = 'px-3 py-1 mr-2 bg-blue-500 text-white rounded'
        btn_modifty.addEventListener('click',()=>{
            showForm(movie)
            openModal()
        })
        const btn_delete = document.createElement('button')
        btn_delete.textContent = 'Delete'
        btn_delete.className = 'px-3 py-1 bg-red-500 text-white rounded'
        btn_delete.addEventListener('click',()=>{
            showDelete(movie)
            openModal()
        })
        td_actions.append(btn_modifty,btn_delete)
        tr.append(td_title,td_type,td_rating,td_actions)
        liste.append(tr)
    });
}