export class NotFoundPagePresenter{

    #view = null;

    constructor(view){
        this.#view = view;
    }

    present(){
        const main = this.#view.select();
        this.#view.setTo(main);
    }
}