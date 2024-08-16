<script>
    import {isAuthenticated} from "./lib/Authentication.ts";
    import Dashboard from "./pages/Dashboard.svelte";
    import Login from "./pages/Login.svelte";

    let isAuth = isAuthenticated();
    const auth = () => {
        isAuth = isAuthenticated();
    }
</script>

{#if isAuth }
    <Dashboard on:logout={auth}/>
{:else }
    <Login on:login-attempt={auth}/>
{/if}

