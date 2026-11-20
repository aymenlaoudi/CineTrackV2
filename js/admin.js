import { createContent , getContent , updateContent , deleteContent } from "./api.js";
import { renderAdminCards } from "./ui.js";
import {  } from "./favourites.js";



const liste = document.querySelector('#movies')
function renderMovies() {
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
        const btn_delete = document.createElement('button')
        btn_delete.textContent = 'Delete'
        btn_delete.className = 'px-3 py-1 bg-red-500 text-white rounded'
        td_actions.append(btn_modifty,btn_delete)
        tr.append(td_title,td_type,td_rating,td_actions)
        liste.append(tr)

    });
}
renderMovies()



