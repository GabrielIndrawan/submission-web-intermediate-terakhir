let token = null;
const TOKEN_KEY = 'story-token';

export function setToken(newToken){
    token = newToken;
    sessionStorage.setItem(TOKEN_KEY, token);
}

export function getToken(){
    return token || sessionStorage.getItem(TOKEN_KEY);
}

export function takeToken(){
    sessionStorage.setItem(TOKEN_KEY, null);
}