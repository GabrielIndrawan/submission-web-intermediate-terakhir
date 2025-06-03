import { RegisterPresenter } from "./register-presenter";

export class RegisterPage{

    #presenter = null;

    constructor(){
        this.#presenter = new RegisterPresenter(this);
    }

    render(){
        return `
            <div class="register-page">
                <div class="register-form-container" id="content">
                    <form id="register-form" class="register-page-form">
                        <h2>Register Page</h2>
                        <label for="username">Username:</label>
                        <input type="text" id="username" name="username" class="register-page-input" required>
                        <br>
                        <label for="email">Email:</label>
                        <input type="email" id="email" name="email" class="register-page-input" required>
                        <br>
                        <label for="password">Password:</label>
                        <input type="password" id="password" name="password" class="register-page-input" required>
                        <button type="submit">Register</button>
                        <div class="error-message" hidden></div>
                        <p>Already have an account? <a href="#/login">Login here</a></p>
                    </form>
                </div>
            </div>`;
    }

    afterRender(){
        const registerForm = document.getElementById('register-form');
        const errorMessage = document.querySelector('.error-message');
        registerForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            errorMessage.removeAttribute('hidden');
            const formData = new FormData(registerForm);
            try{
                errorMessage.textContent = 'Loading...';
                const response = await this.#presenter.register(formData);
                const result = await response.json();

                if(!response.ok){
                    throw new Error("Error: " + result.message);
                }

                alert('Registration successful! Please login to continue.');
                errorMessage.setAttribute('hidden', true);
                location.hash = '/login';
            }catch(error){
                errorMessage.textContent = error.message;
                console.error('Error Registering:', error.message);
            }
            
        });
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