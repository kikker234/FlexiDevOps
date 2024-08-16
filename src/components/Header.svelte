<script>
    import {createEventDispatcher} from "svelte";

    const dispatch = createEventDispatcher();

    const logout = () => {
        dispatch("logout");
    }
</script>

<div class="navbar bg-base-300 shadow-xl">
    <div class="flex-1">
        <p class="text-xl px-3">FlexiApi</p>
    </div>
    <div class="flex-none">
        <ul class="menu menu-horizontal px-1">
            <button class="btn btn-error text-white" on:click={logout}>Logout</button>
        </ul>
    </div>
</div>