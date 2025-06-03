import { Data } from "../../data/data";
import { getToken } from "../../token";

export class CreatePagePresenter {
    #view = null;
    #model = null;

    constructor(view) {
        this.#view = view;
        this.#model = new Data(getToken());
    }

    async present() {
        const main = this.#view.select();
        const errorMessage = this.#view.setToAndGetError(main);
        this.#view.afterRender();
        try{
            await this.#view.setCamera();
        }catch(e){
            this.#view.setErrorMessage({
                message: errorMessage,
                text: "Camera is rejected, please enable camera if you want to take picture.",
                beforeFunction: (message) => {
                    message.removeAttribute("hidden");
                }
            });
        }
    }

    async addData(formData){
        return await this.#model.addData(formData);
    }
}