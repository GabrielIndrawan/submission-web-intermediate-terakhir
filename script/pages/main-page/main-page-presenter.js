import {Data} from '../../data/data.js';
import { IndexedDB } from '../../data/save-indexDB.js';
import { Subscribtion } from '../../data/subscription.js';
import { serviceWorker } from '../../index.js';
import { getToken } from '../../token.js';
import {MainPage} from './main-page.js';

export class MainPagePresenter {

    #view = null;
    #model = null;
    #data = null;
    #subscribeData = null;
    #indexedDatabase = null;

    constructor(view) {
        this.#view = view;
        this.#model = new Data(getToken());
        this.#subscribeData = new Subscribtion(getToken());
        this.#indexedDatabase = new IndexedDB("story");
    }

    async setData(){
        this.#data = await this.#model.getAllData();
    }

    async setSubscription(){
        return await this.#subscribeData.subscribeToServer(serviceWorker);
    }

    async setUnsubscribe(){
        return await this.#subscribeData.unSubscribeToServer(serviceWorker);
    }

    async getAllSavedStory(){
        return await this.#indexedDatabase.getAllData();
    }

    async saveStory(data){
        return await this.#indexedDatabase.inputData(data);
    }

    async deleteStory(data){
        await this.#indexedDatabase.deleteData(data);
    }

    async present(){
        const main = this.#view.select();
        const errorMessage = this.#view.setToAndGetError(main);
        try{
            this.#view.setErrorMessage({
                message: errorMessage,
                text: "Loading...",
                beforeFunction: (message) => {
                    message.removeAttribute('hidden');
                }
            })
            this.#view.showButtons();
            await this.setData();
            const {listStory} = this.#data;
            await this.#view.populateData(listStory);
            await this.#view.afterRender();
            this.#view.setErrorMessage({
                message: errorMessage,
                text: "",
                beforeFunction: (message)=>{
                    message.setAttribute('hidden',true);
                }
            })
        }catch (error) {
            this.#view.setErrorMessage({
                message: errorMessage,
                text: "Your session has expired, please login again or you're offline",
                beforeFunction: (message) => {}
            })   
        }
        
    }
}