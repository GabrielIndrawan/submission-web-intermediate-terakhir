import { CreatePage } from "./pages/create-page/create-page";
import { DetailPage } from "./pages/detail-page/detail-page";
import { LoginPage } from "./pages/login/login";
import { MainPage } from "./pages/main-page/main-page";
import { NotFoundPage } from "./pages/not-found-page/not-found-page";
import { RegisterPage } from "./pages/register-page/register";

export const routes = {
    '/register': () => new RegisterPage(),
    '/': () => new MainPage(),
    '/login': () => new LoginPage(),
    '/create': () => new CreatePage(),
}

function getRoute(){
    try{
        let hash = window.location.hash.slice(1);
        if(hash === ''){
            location.hash = '/login';
            return ;
        }
        const load = routes[hash] || (() => new NotFoundPage());
        const slashCount = hash.split('/').length - 1;
        if(slashCount === 2){
            return;
        }
        return load;
    }catch(error){
        console.log(error)
    }
    
}

export function loadPage(){

    const loadPage = getRoute();
    let page = null;

    if(typeof loadPage === 'undefined'){
        return;
    }
    
    page = loadPage();
    page.show();
}