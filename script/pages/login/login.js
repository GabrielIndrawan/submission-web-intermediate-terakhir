import { Data } from "../../data/data";
import { setToken, token } from "../../token";
import { LoginPagePresenter } from "./login-presenter";

export class LoginPage{
    #presenter = null;

    constructor() {
        this.#presenter = new LoginPagePresenter(this);
    }

    render(){
        return `
            <div class="login-page">
                <div class="register-form-container" id="content">
                    <form id="login-form" class="register-page-form">
                        <h2>Login Page</h2>
                        <label for="email">Email:</label>
                        <input type="email" id="email" name="email" required>
                        <label for="password">Password:</label>
                        <input type="password" id="password" name="password" required>
                        <button type="submit">Login</button>
                        <div class="error-message" hidden></div>
                        <p>Don't have an account? <a href="#/register">Register here</a></p>
                    </form>
                </div>
            </div>`;
    }

    afterRender(){
        const form = document.getElementById('login-form');
        const createButton = document.querySelector('.create-story-button');
        const logoutButton = document.querySelector('.logout-button');
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            const errorMessage = document.querySelector('.error-message');
            errorMessage.removeAttribute('hidden');
            const formData = new FormData(form);
            try{
                errorMessage.textContent = 'Loading...';
                const response = await this.#presenter.login(formData);
                const result = await response.json();
                if(!response.ok){
                    throw new Error("Error: " + result.message);
                }

                setToken(result.loginResult.token);
                location.hash = '/';
                createButton.removeAttribute('hidden');
                logoutButton.removeAttribute('hidden');
                alert("Login successful!");
            }catch (error) {
                errorMessage.textContent = error.message;
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