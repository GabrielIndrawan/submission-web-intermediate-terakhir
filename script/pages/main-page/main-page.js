import { DetailPage } from "../detail-page/detail-page.js";
import {MainPagePresenter} from "./main-page-presenter.js";
import {Data} from "../../data/data.js";
import { getToken, takeToken } from "../../token.js";
import { Maps } from "../../features/maps.js";
import { subscribed } from "../../utils.js";

export class MainPage{
    #presenter = null;
    #stories = null;
    #isViewBookmark = false;

    constructor(){ 
        this.#presenter = new MainPagePresenter(this, getToken());
    }

    render(){
        return `
            <div class="main-page">
                <h1>Welcome to the Main Page</h1>
                <section class="content-settings">
                    <button class="settings-button" id="view-bookmarks-button">BookMarked List</button>
                    <button class="settings-button" id="subscribe-button">Subscribe</button>
                </section>
                <div id="subscribe-warning-text" class="error-message" hidden></div>
                <h2 id="content">Story List</h2>
                <section class="story-list" id="story-list">
                    <div id="data-list">
                    </div>
                    <div hidden class="error-message"></div>
                </section>
            </div>`;
    }

    showButtons(){
        const createButton = document.querySelector('.create-story-button');
        const logoutButton = document.querySelector('.logout-button');

        logoutButton.removeAttribute('hidden');
        createButton.removeAttribute('hidden');

        logoutButton.addEventListener('click', () => {
            location.hash = '/login';
            takeToken();
            logoutButton.setAttribute('hidden', true);
            createButton.setAttribute('hidden', true);
        });
    }

    async afterRender(){
        const subscribeButton = document.getElementById('subscribe-button');
        const subscribeWarning = document.getElementById('subscribe-warning-text');
        const viewBookMarksButton = document.getElementById('view-bookmarks-button');
        const list = document.getElementById('data-list');

        subscribeButton.addEventListener('click',async (event)=>{
            subscribeWarning.innerText = "Loading...";
            subscribeWarning.removeAttribute("hidden");

            if(!subscribed){
                const result = await this.#presenter.setSubscription();
                if(!result){
                    subscribeWarning.innerText = "Anda tidak mengizinkan notifikasi...";
                }
                subscribed = result;
                subscribeWarning.setAttribute("hidden", true);
                event.target.innerText = "Unsubscribe";
                return;
            }else{
                const result = await this.#presenter.setUnsubscribe();
                subscribed = !result;
                if(!subscribed){
                     subscribeWarning.innerText = "Anda belum subscribe sama sekali";
                }
                subscribeWarning.setAttribute("hidden", true);
                event.target.innerText = "Subscribe";
            }
            
        });

        viewBookMarksButton.addEventListener('click', async (event)=>{
            if(!this.#isViewBookmark){
                list.innerHTML = "";
                const savedStories = await this.#presenter.getAllSavedStory();
                this.#isViewBookmark = true;
                this.populateData(savedStories);
                event.target.innerText = "Normal List";
            }else{
                list.innerHTML = "";
                this.#isViewBookmark = false;
                this.populateData(this.#stories);
                event.target.innerText = "BookMarked List";
            }
        });

    }

    populateData(stories){

        if(!this.#isViewBookmark){
            this.#stories = stories;
        };

        const dataList = document.getElementById('data-list');
        try{
        stories.forEach((story, index) => {
            console.log("test");
            const storyItem = document.createElement('article');
            storyItem.className = 'story-item';

            storyItem.setAttribute('tabindex', '0');
            storyItem.setAttribute('id', story.id);

            storyItem.innerHTML = (!this.#isViewBookmark)?`
                <h3>${story.name}</h3>
                <p>${story.description}</p>
                <img src="${story.photoUrl}" alt="${story.name}" class="story-image" height="100px">
                <p style="color: gray">Date: ${story.createdAt}</p>
                <button class="bookmark-button" id="bookmark-button-${index}">Save Story</button>
            `
            :
            `   <h3>${story.name}</h3>
                <p>${story.description}</p>
                <img src="${story.photoUrl}" alt="${story.name}" class="story-image" height="100px">
                <p style="color: gray">Date: ${story.createdAt}</p>
                <button class="unbookmark-button" id="unbookmark-button-${index}">Unsave Story</button>
            `;
            dataList.appendChild(storyItem);

            const detailPage = new DetailPage(this.#stories[index]);
            const storyId = storyItem.getAttribute('id');
            
            storyItem.addEventListener('click', () => {
                const thumbnailImage = storyItem.querySelector(".story-image");
                location.hash = `#/story/${storyId}`; 
                thumbnailImage.style.viewTransitionName = "image";
                document.startViewTransition(()=>{
                    detailPage.show();  
                });
            });

            if(!this.#isViewBookmark){
                const bookMarkButton = document.getElementById(`bookmark-button-${index}`);
                bookMarkButton.addEventListener('click', async (event) => {
                    event.stopPropagation();
                    const status = await this.#presenter.saveStory(story);
                    console.log(status);
                    if(!status){
                        alert("Anda sudah membookmark story ini, mohon cek di bookmark list...");
                        return;
                    }
                    alert("Story saved...");
                });
                return ;
            }
            
            const unBookMarkButton = document.getElementById(`unbookmark-button-${index}`);
            unBookMarkButton.addEventListener('click', async (event)=>{
                event.stopPropagation();
                await this.#presenter.deleteStory(story);
                dataList.innerHTML = "";
                this.populateData(await this.#presenter.getAllSavedStory());
                alert("Story unsaved...");
            });

        });
        }catch(error){
            console.log("error:", error);
        }
    }

    select(){
        return document.querySelector("main");
    }

    setErrorMessage({message, text, beforeFunction}){
        beforeFunction(message);
        message.innerText = text;
    }

    setToAndGetError(main){
        main.innerHTML = this.render();
        return document.querySelector(".error-message");
    }

    show(){
        this.#presenter.present();
    }
}