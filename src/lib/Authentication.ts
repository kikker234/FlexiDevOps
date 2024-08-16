export const isAuthenticated = () => {
    const inputToken = localStorage.getItem('token')
    const envToken = import.meta.env.VITE_TOKEN

    if(!inputToken) return false;

    return inputToken === envToken;
}