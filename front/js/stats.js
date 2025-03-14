
fetch('http://localhost:3000/todos')
    .then(response => response.json())
    .then(data => {
        const toutesLesTaches = data[0].todolist
        const tachesTerminees = toutesLesTaches.filter(tache => tache.is_complete)
        const tachesEnCours = toutesLesTaches.filter(tache => !tache.is_complete)

        document.getElementById("total-taches").textContent = `📋 Total des tâches : ${toutesLesTaches.length}`
        document.getElementById("taches-terminees").textContent = `✅ Tâches terminées : ${tachesTerminees.length}`
        document.getElementById("taches-en-cours").textContent = `⏳ Tâches en cours : ${tachesEnCours.length}`
    
    })

    /* cree un graphique en bar avec google chart */

    google.charts.load('current', {packages: ['corechart']})
    google.charts.setOnLoadCallback(drawChart)
    
    function drawChart() {
        fetch('http://localhost:3000/todos')
            .then(response => response.json())
            .then(data => {
                const toutesLesTaches = data[0].todolist
                const tachesTerminees = toutesLesTaches.filter(t => t.is_complete).length
                const tachesEnCours = toutesLesTaches.filter(t => !t.is_complete).length
    
                /* préparer les données pour Google Charts */
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
    
                /* afficher le graphique dans le div chart_div */

                const chart = new google.visualization.ColumnChart (document.getElementById('chart_div'))
                chart.draw(dataTable, options)
            })
    
    }