# 🎬 CinéTrack V2

CinéTrack est une application web qui permet de découvrir, gérer et commenter des films et des séries via une API MockAPI.

## ✨ Fonctionnalités

### Catalogue
- Afficher les films et les séries.
- Rechercher un titre.
- Filtrer par type (Films / Séries).
- Naviguer avec la pagination.
- Afficher les détails dans une modal.
- Ajouter et supprimer des favoris.
- Sauvegarder les favoris avec LocalStorage.
- Lire les commentaires d'un film ou d'une série.
- Ajouter un commentaire (nom + texte obligatoires).
- Mémoriser le pseudo avec LocalStorage.

### Administration
- Afficher tous les contenus dans un tableau.
- Rechercher un contenu.
- Ajouter un film ou une série.
- Modifier un contenu existant.
- Supprimer un contenu avec confirmation.
- Valider le formulaire (titre, type, année, URL, durée/saisons).
- Afficher des messages de succès et d'erreur.

## 🛠️ Technologies utilisées

- HTML
- Tailwind CSS
- JavaScript (ES Modules)
- Fetch API
- MockAPI (REST)
- LocalStorage

## 📁 Structure du projet
CinéTrack/
├── index.html
├── admin.html
├── README.md
├── img/
└── js/
├── api.js
├── ui.js
├── validation.js
├── favourites.js
├── main.js
└── admin.js


## 🔌 API — MockAPI

**Endpoint :** `https://6afaf1a3730c1d152f32cf9e.mockapi.io/api/v1`

### Routes utilisées

| Méthode | URL | Rôle |
|---|---|---|
| GET | `/contents` | Lister tous les contenus |
| POST | `/contents` | Ajouter un contenu |
| PUT | `/contents/:id` | Modifier un contenu |
| DELETE | `/contents/:id` | Supprimer un contenu |
| GET | `/comments?contentId=:id` | Lister les commentaires d'un titre |
| POST | `/comments` | Ajouter un commentaire |

## 🌐 Démo

[Visiter CinéTrack](https://cinetrack-13s602jya-aymen-bc72.vercel.app/)

---

© 2026 CinéTrack. Tous droits réservés.