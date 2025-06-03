export class DetailPagePresenter{

    #view = null;

    constructor(view){
        this.#view = view;
    }

    present(){
        const main = this.#view.select();
        this.#view.setTo(main);
        this.#view.afterRender();   
    }

}