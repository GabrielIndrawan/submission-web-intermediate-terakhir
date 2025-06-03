import { NotFoundPagePresenter } from "./not-found-page-presenter";

export class NotFoundPage{

    #presenter = null;

    constructor(){
        this.#presenter = new NotFoundPagePresenter(this);
    }

    render(){
        return `
            <h1>Sorry page not Found !!!</h1>
        `;
    }

    select(){
        return document.querySelector("main");
    }

    setTo(main){
        main.innerHTML = this.render();
    }

    show(){
        this.#presenter.present();
    }
}