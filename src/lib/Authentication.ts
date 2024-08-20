export const isAuthenticated = () => {
    const inputToken = localStorage.getItem('token')
    const envToken = import.meta.env.VITE_TOKEN

    console.log(envToken)

    if(!inputToken) return false;

    return inputToken === envToken;
}