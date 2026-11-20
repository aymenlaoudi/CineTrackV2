const API_URL = "https://raw.githubusercontent.com/ouchad97/cinetrack-api/main/cinetrack-data.json";

export async function request(path, options = {}) {
    const res = await fetch(API_URL + path, {
    headers: { "Content-Type": "application/json" },
    ...options,
});
    if (!res.ok) throw new Error(`Erreur ${res.status}`);
        return res.json();
}

// Ajouter un contenu
export const createContent = (data) =>
    request("/contents", { method: "POST", body: JSON.stringify(data) });

// createContent , getContent , updateContent , deleteContent

// recuperer tous les contenus
export const getContent = () =>
    request("/contents");


// modifier un contenu
export const updateContent = (id, data) =>
    request(`/contents/${id}`,{
        method: "PUT",
        body: JSON.stringify(data)
    })


// supprimer un contenu
export const deleteContent = (id) =>
    request(`/contents/${id}`, {
        method: "DELETE"
    })


