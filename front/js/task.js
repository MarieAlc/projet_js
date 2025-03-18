
/*recuperation element html */
const inputTache = document.getElementById("nouvelle-tache")
const boutonAjouter = document.getElementById("ajouter")
const boutonToutes = document.getElementById("toutes-taches")
const boutonTachesAFaire = document.getElementById("a-faire")
const boutonTachesFaite = document.getElementById("taches-terminer")

const listeTaches = document.getElementById("liste-taches")

/* creation de tableau vide pour y mettre les listes filtrer */

let toutesLesTaches = []
let tachesEnCours = []
let tachesTerminer = []
let corbeille = []

/* recuperer l'API'*/

fetch("https://api-one-jade-90.vercel.app/todos")

    /* récupération des données */

.then(response => response.json())
.then(data => {
    toutesLesTaches = data[0].todolist
    mettreAJourListes()
    afficherTaches(toutesLesTaches)
})

/* fonction pour mettre a jour les liste suivant le status faite ou non */

function mettreAJourListes (){
    tachesEnCours = toutesLesTaches.filter(tache => ! tache.is_complete)
    tachesTerminer = toutesLesTaches.filter(tache => tache.is_complete)
}

/* Ajouter une nouvelle tâche manuel*/
const form = document.getElementById("tacheForm")

form.addEventListener("submit", (e) => {
    e.preventDefault()

    const texte = inputTache.value.trim()

    if (texte !== "") {
        /* recupere le prenom stocker dans le local storage */
        const idTache = localStorage.getItem("prenom")
        /* creation de la nouvelle tache */
        const nouvelleTache = {
            text: texte ,
            created_at : new Date().toISOString(),
            id: idTache,
            is_complete: false
        }
        fetch('https://api-one-jade-90.vercel.app/todos', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(nouvelleTache)
        }).then(()=>{

            /* pousse la tache dans la liste */ 
            toutesLesTaches.push(nouvelleTache)
            mettreAJourListes()
            afficherTache(texte, nouvelleTache.created_at, nouvelleTache.id, false)
            inputTache.value = ""    
        })
    }

})

function afficherTaches(taches) {   
    /* permmet de vider l'ecran */  
    listeTaches.innerHTML=""
    /* parcourir le tableau pour afficher les taches et les details */
    taches.forEach(tache => {
        afficherTache(tache.text, tache.created_at, tache.id, tache.is_complete)        
    })
}

function afficherTache (texte,created_at,id, is_complete){
    
    /* creation de la liste */    
    const li = document.createElement("li")      
    
    /* cree une checkbox pour valider la tache */
    
    const checkbox = document.createElement("input")
    checkbox.type="checkbox"
    checkbox.checked = is_complete

    /* permet de modifie le statut de tache completer : oui ou non */

    const statutTache = document.createElement("p")
    statutTache.textContent = `Tâche complétée : ${is_complete ? "Oui" : "Non"}`

    /* utilisation de la checkbox */ 

    checkbox.addEventListener("change",()=>{

        is_complete = checkbox.checked           
        const tacheModifiee = toutesLesTaches.find(t => t.id === id)
        if(tacheModifiee){
            tacheModifiee.is_complete = checkbox.checked

            fetch(`https://api-one-jade-90.vercel.app/todos${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(tacheModifiee),
        })
        }

        mettreAJourListes()
        afficherTaches(boutonTachesFaite.classList.contains("active") ? tachesTerminer :
            boutonTachesAFaire.classList.contains("active") ? tachesEnCours :
            toutesLesTaches)
    })

    li.appendChild(checkbox)
    li.appendChild(document.createTextNode("  "+ texte))
    
    /* boutton detail */ 
    
    const boutonDetails= document.createElement("button")
    boutonDetails.textContent="🔍 Details"
    boutonDetails.className = "btn_detail"
    /* creation dune div pour pouvoir afficher et masque */ 
    const divDetails = document.createElement("div")
    divDetails.style.display="none"
    divDetails.className="detail"
    
    
    /* creation du paragraphe qui vas afficher la date et l'heure et l'id*/ 
    
    const detail = document.createElement("p")
    
    detail.textContent= `Créé par l'id n° : ${id} , le : ${new Date(created_at).toLocaleString()}`
    
    /* relie la div a la parti detail */ 
    
    divDetails.appendChild(detail)  
    divDetails.appendChild(statutTache)
    /* cache et ouvre le detail */ 
    
    boutonDetails.addEventListener("click", ()=>{
        divDetails.style.display = divDetails.style.display === "none"?"block":"none"
    })
    
    /*  Bouton supprimer / resataurer / corbeille */
    
    const boutonSupprimer = document.createElement("button")
    
    boutonSupprimer.textContent = "❌"
    boutonSupprimer.className= "btn_supprimer"

    boutonSupprimer.addEventListener("click", ()=>{
        fetch(`https://api-one-jade-90.vercel.app/todos${id}`, {
        method: "DELETE"
    }).then(()=>{
        mettreAJourListes()
        afficherTaches(toutesLesTaches)
        afficherCorbeille()

    })
        const tacheSuprimmer = toutesLesTaches.find(t => t.id === id)
        /* pousse la tache suprimmer dans la corbeil */
       if (tacheSuprimmer) {
        corbeille.push(tacheSuprimmer)     
       
       }
       toutesLesTaches = toutesLesTaches.filter(t => t.id !== id)

    }) 
    function afficherCorbeille(){

        const divCorbeille = document.getElementById("corbeille")
        
        if (corbeille.length === 0) {
            /*Cache la corbeille si elle est vide*/
            divCorbeille.style.display = "none" 
            return
        }
        corbeille.forEach(tache => {
            const li = document.createElement("li")
            li.textContent = tache.text
    
            const boutonRestaurer = document.createElement("button")
            boutonRestaurer.textContent = "♻️ Restaurer"
            boutonRestaurer.className="btn_restaurer"
    
            boutonRestaurer.addEventListener("click", () => {
                /* restaure la tache dans la liste principale */
                toutesLesTaches.push(tache)
                fetch('https://api-one-jade-90.vercel.app/todos', {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(tache)
                })
                .then( response => response.json())
                .then(()=>{

                    mettreAJourListes()
                    afficherTaches(toutesLesTaches)
                })
    
                /* supprimer la tâche de la corbeille */
                corbeille = corbeille.filter(t => t.id !== tache.id)
                afficherCorbeille()
            })
    
            li.appendChild(boutonRestaurer)
            divCorbeille.appendChild(li)
        })
        divCorbeille.style.display = "block"
    }


    li.appendChild(boutonSupprimer)
    li.appendChild(boutonDetails)
    li.appendChild(divDetails)      
    listeTaches.appendChild(li) 
}

boutonToutes.addEventListener("click",() => {
    afficherTaches(toutesLesTaches)
})

boutonTachesAFaire.addEventListener("click",() => {
    afficherTaches(tachesEnCours)
})

boutonTachesFaite.addEventListener("click",() => {
    afficherTaches(tachesTerminer)
})