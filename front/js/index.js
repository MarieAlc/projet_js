const form = document.getElementById("form");
const prenomInput = document.getElementById("prenom");

/* Empêche le rechargement et stocke le prénom dans le localStorage */
form.addEventListener("submit", (event) => {
    /* Empêche le rechargement de la page après validation du formulaire */
    event.preventDefault();

    /* .trim retire les espaces */
    const prenom = prenomInput.value.trim();

    if (!prenom) {
        alert("Entrez votre prénom");
    } else {
        /* Stockage du prénom dans le localStorage */
        localStorage.setItem("prenom", prenom);
        window.location.href = "tasks.html";
    }
});