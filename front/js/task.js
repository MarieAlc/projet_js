/* Récupération des éléments HTML */
const inputTache = document.getElementById("nouvelle-tache");
const boutonAjouter = document.getElementById("ajouter");
const boutonToutes = document.getElementById("toutes-taches");
const boutonTachesAFaire = document.getElementById("a-faire");
const boutonTachesFaite = document.getElementById("taches-terminer");
const listeTaches = document.getElementById("liste-taches");

/* Création de tableaux vides pour y mettre les listes filtrées */
let toutesLesTaches = [];
let tachesEnCours = [];
let tachesTerminer = [];
let corbeille = [];

/* Récupérer l'API */
fetch("https://api-one-jade-90.vercel.app/todos")
    .then(response => response.json())
    .then(data => {
        toutesLesTaches = data[0].todolist;
        mettreAJourListes();
        afficherTaches(toutesLesTaches);
    });

/* Fonction pour mettre à jour les listes suivant le statut (faite ou non) */
function mettreAJourListes() {
    tachesEnCours = toutesLesTaches.filter(tache => !tache.is_complete);
    tachesTerminer = toutesLesTaches.filter(tache => tache.is_complete);
}

/* Ajouter une nouvelle tâche manuellement */
const form = document.getElementById("tacheForm");

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const texte = inputTache.value.trim();

    if (texte !== "") {
        /* Récupère le prénom stocké dans le localStorage */
        const idTache = localStorage.getItem("prenom");

        /* Création de la nouvelle tâche */
        const nouvelleTache = {
            text: texte,
            created_at: new Date().toISOString(),
            id: idTache,
            is_complete: false
        };

        fetch("https://api-one-jade-90.vercel.app/todos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(nouvelleTache)
        })
        .then(response => response.json())
        .then(data => {
            // Mettre à jour l'ID avec celui retourné par l'API
            nouvelleTache.id = data.id;
            toutesLesTaches.push(nouvelleTache);
            mettreAJourListes();
            afficherTache(texte, nouvelleTache.created_at, nouvelleTache.id, false);
            inputTache.value = "";
        })
    }
});

function afficherTaches(taches) {
    /* Permet de vider l'écran */
    listeTaches.innerHTML = "";

    /* Parcourir le tableau pour afficher les tâches et les détails */
    taches.forEach(tache => {
        afficherTache(tache.text, tache.created_at, tache.id, tache.is_complete);
    });
}

function afficherTache(texte, created_at, id, is_complete) {
    /* Création de la liste */
    const li = document.createElement("li");

    /* Crée une checkbox pour valider la tâche */
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = is_complete;

    /* Permet de modifier le statut de tâche complétée : oui ou non */
    const statutTache = document.createElement("p");
    statutTache.textContent = `Tâche complétée : ${is_complete ? "Oui" : "Non"}`;

    /* Utilisation de la checkbox */
    checkbox.addEventListener("change", () => {
        is_complete = checkbox.checked;
        const tacheModifiee = toutesLesTaches.find(t => t.id === id);

        if (tacheModifiee) {
            tacheModifiee.is_complete = checkbox.checked;

            fetch(`https://api-one-jade-90.vercel.app/todos/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(tacheModifiee),
            });
        }

        mettreAJourListes();
        afficherTaches(
            boutonTachesFaite.classList.contains("active") ? tachesTerminer :
            boutonTachesAFaire.classList.contains("active") ? tachesEnCours :
            toutesLesTaches
        );
    });

    li.appendChild(checkbox);
    li.appendChild(document.createTextNode("  " + texte));

    /* Bouton détail */
    const boutonDetails = document.createElement("button");
    boutonDetails.textContent = "🔍 Details";
    boutonDetails.className = "btn_detail";

    /* Création d'une div pour pouvoir afficher et masquer */
    const divDetails = document.createElement("div");
    divDetails.style.display = "none";
    divDetails.className = "detail";

    /* Création du paragraphe qui va afficher la date, l'heure et l'ID */
    const detail = document.createElement("p");
    detail.textContent = `Créé par l'id n° : ${id} , le : ${new Date(created_at).toLocaleString()}`;

    /* Relie la div à la partie détail */
    divDetails.appendChild(detail);
    divDetails.appendChild(statutTache);

    /* Cache et ouvre le détail */
    boutonDetails.addEventListener("click", () => {
        divDetails.style.display = divDetails.style.display === "none" ? "block" : "none";
    });

    /* Bouton supprimer / restaurer / corbeille */
    const boutonSupprimer = document.createElement("button");
    boutonSupprimer.textContent = "❌";
    boutonSupprimer.className = "btn_supprimer";

    boutonSupprimer.addEventListener("click", () => {
        fetch(`https://api-one-jade-90.vercel.app/todos/${id}`, {
            method: "DELETE"
        })
        .then(response => {
            if (response.ok) {
                const tacheSupprimee = toutesLesTaches.find(t => t.id === id);
                if (tacheSupprimee) {
                    corbeille.push(tacheSupprimee); // Ajouter à la corbeille
                    sauvegarderCorbeille(); // Sauvegarder la corbeille
                }
                toutesLesTaches = toutesLesTaches.filter(t => t.id !== id);
                mettreAJourListes();
                afficherTaches(toutesLesTaches);
                afficherCorbeille();
            }
        })
    });

    li.appendChild(boutonSupprimer);
    li.appendChild(boutonDetails);
    li.appendChild(divDetails);
    listeTaches.appendChild(li);
}

/* Charger la corbeille depuis le localStorage au démarrage */
if (localStorage.getItem("corbeille")) {
    corbeille = JSON.parse(localStorage.getItem("corbeille"));
    afficherCorbeille();
}

/* Fonction pour sauvegarder la corbeille dans le localStorage */
function sauvegarderCorbeille() {
    localStorage.setItem("corbeille", JSON.stringify(corbeille));
}

function afficherCorbeille() {
    const divCorbeille = document.getElementById("corbeille");
    divCorbeille.innerHTML = "";

    if (corbeille.length === 0) {
        divCorbeille.style.display = "none";
        return;
    }

    corbeille.forEach(tache => {
        const li = document.createElement("li");
        li.textContent = tache.text;

        const boutonRestaurer = document.createElement("button");
        boutonRestaurer.textContent = "♻️ Restaurer";
        boutonRestaurer.className = "btn_restaurer";

        boutonRestaurer.addEventListener("click", () => {
            if (!toutesLesTaches.find(t => t.id === tache.id)) {
                fetch("https://api-one-jade-90.vercel.app/todos", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(tache)
                })
                .then(response => response.json())
                .then(data => {
                    tache.id = data.id;
                    toutesLesTaches.push(tache);
                    corbeille = corbeille.filter(t => t.id !== tache.id);
                    sauvegarderCorbeille();
                    mettreAJourListes();
                    afficherTaches(toutesLesTaches);
                    afficherCorbeille();
                })
            }
        });

        li.appendChild(boutonRestaurer);
        divCorbeille.appendChild(li);
    });

    divCorbeille.style.display = "block";
}

boutonToutes.addEventListener("click", () => {
    afficherTaches(toutesLesTaches);
});

boutonTachesAFaire.addEventListener("click", () => {
    afficherTaches(tachesEnCours);
});

boutonTachesFaite.addEventListener("click", () => {
    afficherTaches(tachesTerminer);
});