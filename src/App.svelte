<script>
    import {isAuthenticated} from "./lib/Authentication.ts";
    import Dashboard from "./pages/Dashboard.svelte";
    import Login from "./pages/Login.svelte";
    import Documentation from "./pages/Documentation.svelte";
    import Header from "./components/Header.svelte";

    let isAuth = isAuthenticated();
    const auth = () => {
        isAuth = isAuthenticated();
    }

    let url = window.location.href;

    const logout = () => {
        localStorage.removeItem('token');

        isAuth = false;
    }
</script>

{#if isAuth }
    <Header on:logout={logout}/>

    {#if url.includes('documentation') }
        <Documentation />
    {:else }
        <Dashboard on:logout={auth}/>
    {/if}
{:else }
    <Login on:login-attempt={auth}/>
{/if}

