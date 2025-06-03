import { checkServiceWorker, subscribed, urlBase64ToUint8Array } from "../utils";
import { VAPID_KEY } from "../vapid-key";

export class Subscribtion{

    #baseUrl = 'https://story-api.dicoding.dev/v1';
    #authorization = null;
    #subscription = null;

    constructor(authorization){
        this.#authorization = authorization;
    }


    async subscribeToServer(register){

        if(!register){
            console.log("Service worker is not supported");
            return ;
        }

        const key = urlBase64ToUint8Array(VAPID_KEY);

        try{
            this.#subscription = await register.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey : key
            })

            this.#subscription = this.#subscription.toJSON();
            delete this.#subscription.expirationTime;

            const response = await fetch(`${this.#baseUrl}/notifications/subscribe`,{
                method: "POST",
                headers: {
                    authorization: `Bearer ${this.#authorization}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(this.#subscription)
            })

            if(!response.ok){
                
                return false;
            }

            const data = await response.json();
            alert(data.message);

            return true;
        }catch(error){
            console.log("error Subscribing: ", error);
            return false;
        }   
    }

    async unSubscribeToServer(){
        try{
            const {endpoint} = this.#subscription;
            const response = await fetch(`${this.#baseUrl}/notifications/subscribe`,{
                method: "DELETE",
                headers: {
                    authorization: `Bearer ${this.#authorization}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({endpoint})
            })
            const data = await response.json();
            alert(data.message);

            return true;
        }catch(error){
            console.log("error unSubscribing: ", error);
            return false;
        }
    }

}