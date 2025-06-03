import { Maps } from "../../features/maps";
import { DetailPagePresenter } from "./detail-page-presenter";

export class DetailPage {

    #presenter = null;
    #story = null;
    #maps = null;

    constructor(story){
        this.#story = story;
        this.#presenter = new DetailPagePresenter(this);
    }

    render(){
        return `
            <div class="detail-story">
                <div class="detail-story-container">
                    <h1>${this.#story.name}</h1>
                    <br>
                    <img src="${this.#story.photoUrl}" alt="story detail image" class="story-detail-image"
                    style="view-transition-name: image;">
                    <br>
                    <div class="story-content">
                        <h2>Description : </h2>
                        <p>
                            ${this.#story.description}
                        </p>
                        <br>
                        <h2>Location : </h2>
                        <p>
                            <div id="map" class="map">
                            </div>
                        </p>
                        <div class="error-message" id="map-error-message"></div>
                    </div>
                    <button class="back-button">Back</button>
                    <br>
                    <p style="color: gray;">${this.#story.createdAt}</p>
                </div>
            </div>
        `;
    }

    setMap(){
        if(this.#story.lat && this.#story.lon){
            this.#maps = new Maps();
            this.#maps.setMarker([this.#story.lat, this.#story.lon]);
            return ;
        }

        const mapErrorMessage = document.querySelector('#map-error-message');
        const mapElement = document.querySelector("#map");
        mapElement.setAttribute("hidden", true);
        mapErrorMessage.innerHTML = "This story has no location.";
    }

    select(){
        return document.querySelector("main");
    }

    setTo(main){
        main.innerHTML = this.render();
    }

    afterRender(){
        const backButton = document.querySelector('.back-button');
        this.setMap();
        backButton.addEventListener('click', () => {
            window.location.hash = '/';
        });
    }

    show(){
        this.#presenter.present();
    }
}