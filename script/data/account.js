export class AccountModel{

    async register(formData){
        const response = await fetch('https://story-api.dicoding.dev/v1/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: formData.get('username'),
                email: formData.get('email'),
                password: formData.get('password'),
            }),
        });
        return response;
    }

    async login(formData){
        const response = await fetch('https://story-api.dicoding.dev/v1/login',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: formData.get('email'),
                password: formData.get('password'),
            }),
        })
        return response;
    }

}