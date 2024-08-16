<script>
    import Links from "../components/Links.svelte";
    import {createEventDispatcher} from "svelte";
    import Header from "../components/Header.svelte";
    import Logs from "../components/Logs.svelte";

    const dispatch = createEventDispatcher();

    const logout = () => {
        localStorage.removeItem('token');

        dispatch("logout");
    }
</script>

<Header on:logout={logout}/>

<div class="p-16 gap-12 flex flex-col">
    <Links/>

    <Logs/>
</div>
