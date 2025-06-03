import L from 'leaflet';

export class Maps{

    #map = null;
    #marker = null;
    #latitude = null;
    #longitude = null;

    constructor(){
        this.#map = L.map('map').setView([0, 0], 3);
    }

    getUserLocation(){
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition((position) => {
                this.#latitude = position.coords.latitude;
                this.#longitude = position.coords.longitude;
                resolve({lat: this.#latitude, lon: this.#longitude});
            }, (error) => {
                this.#latitude = null;
                this.#longitude = null;
                reject("Access denied");
            },{
                enableHighAccuracy: true,
            });
        });
    }

    bindPopup(marker, message){
        marker.bindPopup(message);
    }

    async initMap(){
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18,
            minZoom: 3,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.#map);

        try{
            const {lat, lon} = await this.getUserLocation();

            this.#marker = L.marker([lat, lon],{
            icon: L.icon({
                iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
                iconSize: [40, 40],
                iconAnchor: [20, 40],
                popupAnchor: [0, -40]
            })
            }).addTo(this.#map);
            this.bindPopup(this.#marker, 
                `<b style="font-size: 17px">You are here</b>
                <br>
                <p>Latitude: ${lat}</p>
                <p>Longitude: ${lon}</p>`
            );
            this.#map.flyTo([lat, lon], 16);
            this.#marker.on('click', () => {
                this.#map.flyTo([lat, lon], 16);
                this.#marker.openPopup();   
            });
        }catch(error){
            throw new Error();
        }
        
    }

    addInteraction(){
        this.#map.on('click', (e) => {
            const {lat, lng} = e.latlng;
            this.#latitude = lat;
            this.#longitude = lng;
            if(this.#marker){
                this.#marker.setLatLng([lat, lng]);
                this.bindPopup(this.#marker, 
                    `<b style="font-size: 17px">Set your location :</b>
                    <br>
                    <p>Latitude: ${lat}</p>
                    <p>Longitude: ${lng}</p>`
                );
                this.#marker.openPopup();
            }else{
                const newMarker = L.marker([lat, lng],{
                    icon: L.icon({
                        iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
                        iconSize: [40, 40],
                        iconAnchor: [20, 40],
                        popupAnchor: [0, -40]
                    })
                    }).addTo(this.#map);

                newMarker.bindPopup(
                    `<b style="font-size: 17px">Set your location : </b>
                    <br>
                    <p>Latitude: ${lat}</p>
                    <p>Longitude: ${lng}</p>`
                );

                this.#marker = newMarker;
                this.#marker.openPopup();

                this.#map.flyTo([lat, lng], 16);

                this.#marker.on('click', () => {
                    this.#map.flyTo([lat, lng], 16);
                    this.#marker.openPopup();
                });
                
            }
            
        });
    }

    getMap(){
        return this.#map;
    }

    getLatAndLong(){
        return {
            latitude: this.#latitude,
            longitude: this.#longitude
        };
    }

    setMarker([lat, lon]){

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18,
            minZoom: 3,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.#map);

        if(typeof lat === 'undefined' || typeof lon === 'undefined'){
            return;
        }

        this.#marker = L.marker([lat,lon],{
            icon: L.icon({
                iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
                iconSize: [40, 40],
                iconAnchor: [20, 40],
                popupAnchor: [0, -40]
            })
        }).addTo(this.#map);

        this.bindPopup(this.#marker, 
            `<b style="font-size: 17px">Story located here : </b>
            <br>
            <p>Latitude: ${lat}</p>
            <p>Longitude: ${lon}</p>`
        );

        this.#map.flyTo([lat, lon], 16);
    }

}