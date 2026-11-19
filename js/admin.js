import { fetchData } from "./api.js";

const movies = await fetchData('https://raw.githubusercontent.com/ouchad97/cinetrack-api/main/cinetrack-data.json')

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
        img.className = 'w-4'
        const p = document.createElement('p')
        p.className = 'text-lg font-bold text-white'
        p.textContent = movie.title
        div.append(img,p)
        td_title.append(div)

        // Type
        const td_type = document.createElement('td')
        td_type.className = 'p-4 text-gray-300'
        td_type.textContent = movie.type
        
        // Rating
        const td_rating = document.createElement('td')
        td_rating.className = 'p-4 text-gray-300'
        // Actions
        const td_actions = document.createElement('td')
        td_actions.className = 'p-4'
        const btn_modifty = document.createElement('button')
        btn_modifty.textContent = 'Modify'
        btn_modifty.className = 'px-3 py-1 mr-2 bg-blue-500 text-white rounded'
        const btn_delete = document.createElement('button')
        btn_delete.className = 'px-3 py-1 bg-red-500 text-white rounded'
        td_actions.append(btn_modifty,btn_delete)
        tr.append(td_title,td_type,td_actions)
        liste.append(tr)












        // th.classList = 'list_movies grid grid-cols-[30px_70px] w-full gap-4 py-4 px-4 bg-[#222227] flex items-center'

        
        // th.append(img)
        // th.append(p)
        // title_list.append(th)

        // let type = movie.type
        // const th_type = document.createElement('th')
        // const p_type = document.createElement('p')
        // p.textContent = type
        // p.classList = 'p-4 bg-black text-white'
        // th_type.append(p_type)
        // type_list.append(th_type)
    });
}
renderMovies()