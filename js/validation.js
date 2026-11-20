export function validateForm(d) {
    const errors = {};
    const year = new Date().getFullYear();
    if (!d.title) errors.title = "Titre obligatoire";
    if (!d.type) errors.type = "Choisis un type";
    if (!(d.releaseYear >= 1900 && d.releaseYear <= year))
        errors.releaseYear = `Année entre 1900 et ${year}`;
    try { new URL(d.image); } catch { errors.image = "URL invalide"; }
    if (!(d.amount > 0)) errors.amount = "Durée ou nombre de saisons obligatoire";
    return errors;
}