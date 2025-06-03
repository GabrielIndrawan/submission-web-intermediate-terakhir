import { AccountModel } from "../../data/account";

export class RegisterPresenter{
    #view = null;
    #model = new AccountModel();

    constructor(view){
        this.#view = view;
    }

    present(){
        const main = this.#view.select();
        this.#view.setTo(main);
        this.#view.afterRender();
    }

    async register(formData){
        return await this.#model.register(formData);
    }

}