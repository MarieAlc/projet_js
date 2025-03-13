const form = document.getElementById("form")
const prenomInput = document.getElementById("prenom")

/* Empeche le rechargement et stock le prenom en local storage */

form.addEventListener('submit', (event) =>{

    /* empeche le rechargement de la page apres validation du form */

    event.preventDefault()    

    /* .trim retire les espace */ 

    const prenom = prenomInput.value.trim()

    if(!prenom){
        alert ("Entrez votre prénom")
    }else {
            localStorage.setItem("prenom", prenom)
            window.location.href="tasks.html"
        }
        /* stockage du prenom dans le localstorage */

    })