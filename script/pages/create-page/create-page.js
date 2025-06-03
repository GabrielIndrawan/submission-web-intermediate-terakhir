import { Maps } from "../../features/maps";
import { Camera } from "../../features/camera";
import { CreatePagePresenter } from "./create-page-presenter";
import { dataURLtoFile } from "../../utils";

export class CreatePage {

    #presenter = null;
    #camera = null;
    #maps = null;

    constructor() {
        this.#presenter = new CreatePagePresenter(this);
        this.#camera = new Camera();
    }

    render(){
        return `
            <div class="create-story">
                <div class="create-story-container">
                    <form class="create-story-form" id="content">
                        <h1>Create Story</h1>
                        <label for="Description">Description:</label>
                        <textarea id="Description" name="description" required></textarea>
                        <br>
                        <label for="map">Location:</label>
                        <div id="map" class="map" style="width: 100%; height: 300px;">
                        </div>
                        <div class="error-message" id="map-error-message"></div>
                        <label for="latitude">Latitude:</label>
                        <input type="text" id="latitude" name="lat" readonly>
                        <label for="longitude">Longitude:</label>
                        <input type="text" id="longitude" name="lon" readonly>
                        <br>
                        <label for="photo">Photo:</label>
                        <input type="file" id="photo" name="photo" accept="image/*" required>
                        <br>
                        <label for="Description">Take a Photo Now ? :</label>
                        <video id="photo-get"></video>
                        <br>
                        <button type="button" class="take-photo-button">Take and download Photo</button>
                        <canvas id="canvas" class="canvas" hidden></canvas>
                        <a id="download-link" href="#" download="photo.jpg" hidden>Download Photo</a>
                        <div class="error-message" id="error-message" hidden></div>
                        <br>
                        <div>
                            <button type="submit">Create</button>
                            <button type="button" class="cancel-button">Cancel</button>
                        </div>
                        <br>
                    </form>
                </div>
            </div>
        `;
    }

    async afterRender(){ 
        const createStoryButton = document.querySelector('.create-story-button');
        const cancelButton = document.querySelector('.cancel-button');
        const takePhotoButton = document.querySelector('.take-photo-button');
        const createForm = document.querySelector('.create-story-form');
        const errorMessage = document.getElementById('error-message');
        const logoutButton = document.querySelector('.logout-button');
        const photoInput = document.getElementById("photo");
        let link;

         createForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            errorMessage.removeAttribute('hidden');
            errorMessage.textContent = 'Loading...';
            const formData = new FormData(createForm);

            console.log(formData.get("lat"));
            console.log(formData.get("lon"));

            if(photoInput.files.length === 0){
                const photoFile = dataURLtoFile(link, "photo.jpg");
                formData.set("photo", photoFile);
            }
            
            try{
                const response = await this.#presenter.addData(formData);

                if(!response.ok){
                    const result = await response.json();
                    throw new Error("Error: " + result.message);
                }

                alert("Story created successfully!");
                this.#camera.stopCamera();
                location.hash = '/';
            }catch (error) {
                errorMessage.textContent = error.message;
            }
        });

        createStoryButton.setAttribute('hidden', true);
        logoutButton.setAttribute('hidden', true);
        cancelButton.addEventListener('click', () => {
            this.#camera.stopCamera();
            location.hash = '/';
        });

        takePhotoButton.addEventListener('click', async () => {
            const video = document.querySelector('#photo-get');
            const canvas = document.getElementById('canvas');
            const downloadLink = document.getElementById('download-link');
            const photoInput = document.getElementById('photo');

            try {
                link = await this.#camera.takePhoto(video, canvas);
                photoInput.removeAttribute('required');

                canvas.removeAttribute('hidden');
                downloadLink.removeAttribute('hidden');
                downloadLink.href = link;


            } catch (error) {
                console.error('Error taking photo:', error);
            }
        });

        window.addEventListener("hashchange",()=>{
            this.#camera.stopCamera();
        });

        await this.showMap();
        this.getLatitudeAndLongitude();
        
    }


    async setCamera(){
        const video = document.querySelector('#photo-get');
        const canvas = document.getElementById('canvas');

        await this.#camera.startCamera(video);
    }

    async showMap(){
        this.#maps = new Maps();
        try{
            await this.#maps.initMap();
        }catch(error){
            const mapErrorMessage = document.getElementById("map-error-message");
            mapErrorMessage.innerText = "Izinkan mencari lokasi anda untuk mendapatkan nilai default."
        }
        this.#maps.addInteraction();
    }

    select(){
        return document.querySelector("main");
    }

    getLatitudeAndLongitude(){
        const {latitude, longitude} = this.#maps.getLatAndLong();
        const latitudeInput = document.getElementById('latitude');
        const longitudeInput = document.getElementById('longitude');
        latitudeInput.value = latitude || 0;
        longitudeInput.value = longitude || 0;

        const map = document.getElementById('map');
        map.addEventListener('click', (event) => {
            const {latitude, longitude} = this.#maps.getLatAndLong();
            latitudeInput.value = latitude;
            longitudeInput.value = longitude;
        })
    }

    setErrorMessage({message, text, beforeFunction}){
        beforeFunction(message);
        message.innerText = text;
    }


    setToAndGetError(main){
        main.innerHTML = this.render();
        return document.getElementById("error-message");
    }

    show(){
        this.#presenter.present();
    }
}