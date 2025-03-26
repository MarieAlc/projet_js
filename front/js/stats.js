fetch("https://api-one-jade-90.vercel.app/todos")
    .then(response => response.json())
    .then(data => {
        const toutesLesTaches = data[0].todolist
        const tachesTerminees = toutesLesTaches.filter(tache => tache.is_complete).length
        const tachesEnCours = toutesLesTaches.filter(tache => !tache.is_complete).length

        // Mise à jour des statistiques sur la page
        document.getElementById("total-taches").textContent = `📋 Total des tâches : ${toutesLesTaches.length}`
        document.getElementById("taches-terminees").textContent = `✅ Tâches terminées : ${tachesTerminees}`
        document.getElementById("taches-en-cours").textContent = `⏳ Tâches en cours : ${tachesEnCours}`

        // Charger Google Charts et dessiner le graphique après réception des données
        google.charts.load('current', { packages: ['corechart'] })
        google.charts.setOnLoadCallback(() => drawChart(tachesTerminees, tachesEnCours))
    })

/* Fonction pour créer le graphique */
function drawChart(tachesTerminees, tachesEnCours) {
    const dataTable = google.visualization.arrayToDataTable([
        ['Statut', 'Nombre'],
        ['Terminées', tachesTerminees],
        ['En cours', tachesEnCours]
    ])

    const options = {
        title: 'Statistiques des Tâches',
        is3D: true,
        colors: ['#1abc9c']
    }

    const chart = new google.visualization.ColumnChart(document.getElementById("chartDiv"))
    chart.draw(dataTable, options)
}
