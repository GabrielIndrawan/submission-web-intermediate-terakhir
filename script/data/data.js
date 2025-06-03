export class Data{

    #baseUrl = 'https://story-api.dicoding.dev/v1';
    #authorization = null;

    constructor(authorization){
        this.#authorization = authorization;
    }

    async getAllData(){
        try{
            const response = await fetch(`${this.#baseUrl}/stories`,{
                headers:{
                    authorization: `Bearer ${this.#authorization}`,
                }
            });
            const result = await response.json(); 
            return result;
        }catch (error) {
            console.error('Error fetching data:', error);
        }    
    }

    async addData(formData){
        const response = await fetch('https://story-api.dicoding.dev/v1/stories', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.#authorization}`,
            },
            body: formData,
        });

        return response;
    }

}