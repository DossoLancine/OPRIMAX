<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <title>Santé autour de moi – Abidjan</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet-routing-machine@latest/dist/leaflet-routing-machine.css" />
    <link rel="manifest" href="manifest.json">
    <meta name="theme-color" content="#0a9396">

    <link rel="apple-touch-icon" sizes="192x192" href="icon-192.png">
    <link rel="apple-touch-icon" sizes="512x512" href="icon-512.png">

    <style>
        body {
            margin: 0;
            font-family: Arial, Helvetica, sans-serif;
            background: #f4f6f8
        }

        header {
            background: #0a9396;
            color: #fff;
            padding: 15px;
            text-align: center
        }

        #map {
            height: 50vh
        }

        .controls {
            display: flex;
            background: #fff
        }

        .controls button {
            flex: 1;
            padding: 10px;
            border: none;
            font-weight: bold;
            cursor: pointer;
            transition: 0.3s;
        }

        .controls button.active {
            background: #94d2bd
        }

        #list {
            padding: 10px
        }

        .place {
            background: #fff;
            margin-bottom: 10px;
            padding: 10px;
            border-radius: 6px;
            transition: all 0.3s;
            cursor: pointer;
        }

        .place:hover {
            transform: scale(1.02);
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
        }

        .place.clinic {
            background: #ffe5e5;
            color: #900;
        }

        .place.pharmacy {
            background: #e5f7ff;
            color: #006699;
        }

        .distance {
            float: right;
            font-weight: bold
        }

        .loading {
            text-align: center;
            padding: 20px
        }

        /* MODAL ITINERAIRE */
        #routeModal {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, .6);
            display: none;
            z-index: 9999;
        }

        #routeContent {
            background: #fff;
            width: 95%;
            max-width: 900px;
            height: 90%;
            margin: 5% auto;
            border-radius: 10px;
            overflow: hidden;
            display: flex;
            flex-direction: column;
        }

        #routeHeader {
            background: #0a9396;
            color: #fff;
            padding: 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        #routeMap {
            flex: 1
        }

        #closeRoute {
            background: #fff;
            border: none;
            padding: 6px 10px;
            border-radius: 5px;
            font-weight: bold;
            cursor: pointer;
        }

        #routeInfo {
            padding: 10px;
            background: #edf6f9;
            font-size: 14px;
        }
    </style>
</head>

<body>

    <header>
        <h2>🏥 Santé autour de moi</h2>
        <p>Pharmacies & Cliniques proches</p>
    </header>

    <div id="map"></div>

    <div class="controls">
        <button class="active" onclick="setFilter('all',this)">Tous</button>
        <button onclick="setFilter('pharmacy',this)">Pharmacies</button>
        <button onclick="setFilter('hospital',this)">Cliniques</button>
    </div>

    <div id="list">
        <div class="loading">📍 Localisation en cours...</div>
    </div>

    <!-- MODAL ITINERAIRE -->
    <div id="routeModal">
        <div id="routeContent">
            <div id="routeHeader">
                <span>🧭 Itinéraire</span>
                <button id="closeRoute">Fermer</button>
            </div>
            <div id="routeInfo">
                <strong>Départ :</strong> Votre position<br>
                <strong>Arrivée :</strong> <span id="routeDestination">---</span><br>
                <strong>⏱ Temps estimé :</strong> <span id="routeTime">Calcul...</span>
            </div>
            <div id="routeMap"></div>
        </div>
    </div>


    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <script src="https://unpkg.com/leaflet-routing-machine@latest/dist/leaflet-routing-machine.js"></script>

    <script>

        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register("/sw.js")
                .then(() => console.log("Service Worker installé"))
                .catch(err => console.error("Erreur SW:", err));
        }
        
        let map, routeMap, routingControl;
        let userPos;
        let places = [];
        let markers = [];
        let filterType = "all";

        /* =====================
           GEOLOCALISATION
        ===================== */
        if (!navigator.geolocation) {
            alert("Géolocalisation non supportée");
        } else {
            navigator.geolocation.getCurrentPosition(
                successLocation,
                () => alert("Veuillez autoriser la localisation"),
                { enableHighAccuracy: true }
            );
        }

        function successLocation(position) {
            userPos = [position.coords.latitude, position.coords.longitude];
            initMap();
            loadFromCache();
            fetchPlaces();
        }

        /* =====================
           MAP PRINCIPALE
        ===================== */
        function initMap() {
            map = L.map('map').setView(userPos, 14);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap'
            }).addTo(map);

            L.circleMarker(userPos, {
                radius: 8, color: 'blue', fillColor: 'blue', fillOpacity: 1
            }).addTo(map).bindPopup("Vous êtes ici").openPopup();
        }

        /* =====================
           FETCH OPENSTREETMAP
        ===================== */
        function fetchPlaces() {
            const query = `
[out:json];
(
 node["amenity"="pharmacy"](around:5000,${userPos[0]},${userPos[1]});
 node["amenity"="hospital"](around:5000,${userPos[0]},${userPos[1]});
 node["amenity"="clinic"](around:5000,${userPos[0]},${userPos[1]});
);
out;`;

            fetch("https://overpass-api.de/api/interpreter", {
                method: "POST",
                body: query
            })
                .then(r => r.json())
                .then(data => {
                    places = data.elements.map(p => ({
                        id: p.id,
                        type: p.tags.amenity,
                        name: p.tags.name || "Sans nom",
                        lat: p.lat,
                        lon: p.lon
                    }));
                    saveCache();
                    calculateDistances();
                })
                .catch(() => {
                    document.getElementById("list").innerHTML =
                        "<div class='loading'>Erreur de chargement</div>";
                });
        }

        /* =====================
           DISTANCE
        ===================== */
        function calculateDistances() {
            places.forEach(p => {
                p.distance = getDistance(
                    userPos[0], userPos[1], p.lat, p.lon
                );
            });
            places.sort((a, b) => a.distance - b.distance);
            render();
        }

        function getDistance(lat1, lon1, lat2, lon2) {
            const R = 6371;
            const dLat = (lat2 - lat1) * Math.PI / 180;
            const dLon = (lon2 - lon1) * Math.PI / 180;
            const a = Math.sin(dLat / 2) ** 2 +
                Math.cos(lat1 * Math.PI / 180) *
                Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLon / 2) ** 2;
            return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
        }

        /* =====================
           CACHE
        ===================== */
        function saveCache() {
            localStorage.setItem("abj_places", JSON.stringify(places));
        }
        function loadFromCache() {
            const cache = localStorage.getItem("abj_places");
            if (cache) {
                places = JSON.parse(cache);
                calculateDistances();
            }
        }

        /* =====================
           UI
        ===================== */
        function render() {
            markers.forEach(m => map.removeLayer(m));
            markers = [];

            const list = document.getElementById("list");
            list.innerHTML = "";

            places.filter(p => {
                if (filterType === "all") return true;
                return p.type === filterType ||
                    (filterType === "hospital" && p.type === "clinic");
            }).forEach(p => {
                // Choix couleur icône
                let iconColor = (p.type === "pharmacy") ? "green" : "red";
                let customIcon = L.icon({
                    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${iconColor}.png`,
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34],
                    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
                    shadowSize: [41, 41]
                });

                // Marker avec popup distance depuis l'utilisateur
                const marker = L.marker([p.lat, p.lon], { icon: customIcon })
                    .addTo(map)
                    .bindPopup(`<strong>${p.name}</strong><br>${p.type}<br>Distance: ${p.distance.toFixed(2)} km`);
                markers.push(marker);

                // Liste principale sans temps
                list.innerHTML += `
    <div class="place ${p.type === 'pharmacy' ? 'pharmacy' : 'clinic'}">
      <strong>${p.name}</strong> (${p.distance.toFixed(2)} km)<br>
      <button onclick="openRoute(${p.lat},${p.lon},'${p.name.replace(/'/g, "")}')">
        Itinéraire
      </button>
    </div>`;
            });
        }

        function setFilter(type, btn) {
            filterType = type;
            document.querySelectorAll(".controls button")
                .forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            render();
        }

        /* =====================
           ITINERAIRE INTERNE AVEC TEMPS ESTIMÉ
        ===================== */
        function openRoute(lat, lon, name = "Destination") {
            document.getElementById("routeModal").style.display = "block";

            document.getElementById("routeDestination").innerText = name;
            document.getElementById("routeTime").innerText = "Calcul...";

            if (routeMap) {
                routeMap.remove();
            }

            routeMap = L.map("routeMap").setView(userPos, 13);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap'
            }).addTo(routeMap);

            routingControl = L.Routing.control({
                waypoints: [
                    L.latLng(userPos[0], userPos[1]),
                    L.latLng(lat, lon)
                ],
                addWaypoints: false,
                draggableWaypoints: false,
                routeWhileDragging: false,
                show: false,
                lineOptions: {
                    styles: [{ color: '#0a9396', weight: 6 }]
                }
            })
                .on('routesfound', function (e) {
                    const route = e.routes[0];
                    const timeSec = route.summary.totalTime;
                    const minutes = Math.round(timeSec / 60);

                    document.getElementById("routeTime").innerText =
                        minutes + " min environ";
                })
                .addTo(routeMap);
        }

        /* =====================
           FERMETURE MODAL
        ===================== */
        document.getElementById("closeRoute").onclick = () => {
            document.getElementById("routeModal").style.display = "none";
            if (routeMap) {
                routeMap.remove();
                routeMap = null;
            }
        };
    </script>

</body>

</html>