import { AccountModel } from "../../data/account";

export class LoginPagePresenter{
    #view = null;
    #model = new AccountModel();

    constructor(view) {
        this.#view = view;
    }

    present() {
        const main = this.#view.select();
        this.#view.setTo(main);
        this.#view.afterRender();
    }

    async login(formData){
        return await this.#model.login(formData);
    }
}