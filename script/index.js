import '../styles/style.css';
import {loadPage} from './routes';
import 'leaflet/dist/leaflet.css';
import { checkServiceWorker } from './utils';

export let serviceWorker;
document.addEventListener('DOMContentLoaded', async () => {

    loadPage();
    let showSkipContent = false;
    
    async function registerServiceWorker(){

        if(!checkServiceWorker){
            console.log("service worker is not supported.");
            return;
        };

        let register;
        try{
            register = await navigator.serviceWorker.register("sw.bundle.js");
            console.log(`Service Worker registered : ${register.scope}`);
        }catch(error){
            console.log("Error registering Service Worker: ", error);
        }finally{
            return register;
        }
        
    }

    window.addEventListener('keydown',(event)=>{
        if(event.key === 'Tab'){
            showSkipContent = true;
            showSkiptoContent();
        }
        if(event.key === "Enter" && showSkipContent){
            const skipToContent = document.querySelector('.skip-to-content');
            skipToContent.setAttribute("hidden", true);
            const target = document.getElementById('content');
            target.scrollIntoView({ behavior: 'smooth' });
            showSkipContent = false;
        }
    })

    window.addEventListener('hashchange', () => {

        const hash = window.location.hash.slice(1);
        if(hash.split('/').length - 1 === 2){
            window.scrollTo({top: 0, behavior: 'instant'});
            return;
        }
        
        document.startViewTransition(() => {
            loadPage();
        })
    });

    function showSkiptoContent(){
        const skipToContent = document.querySelector('.skip-to-content');
        addScrollBehavior(skipToContent);
        skipToContent.removeAttribute('hidden');
        setTimeout(() => {
            skipToContent.setAttribute('hidden', true);
            showSkipContent = false;
        }, 2500);
    }

    function addScrollBehavior(element){
        element.addEventListener('click', function (e) {
          e.preventDefault(); // prevent URL change
          const target = document.getElementById('content');
          element.setAttribute("hidden", true);
          target.scrollIntoView({ behavior: 'smooth' });
        });
    }

    serviceWorker = await registerServiceWorker();

});