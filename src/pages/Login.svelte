<script>
    import {createEventDispatcher} from "svelte";

    const dispatch = createEventDispatcher();

    const submitForm = (e) => {
        e.preventDefault();

        const token = e.target.tokenInput.value;
        localStorage.setItem('token', token);

        // fire login-attempt event
        dispatch('login-attempt', {token})
    }

</script>

<div class="hero bg-base-200 min-h-screen">
    <div class="hero-content text-center">
        <form method="GET" class="join join-vertical" on:submit={submitForm}>
            <input name="tokenInput" id="tokenInput" type="password" placeholder="Private access token"
                   class="input input-bordered w-full max-w-xs mb-6" required/>

            <button class="btn btn-primary">Login</button>
        </form>
    </div>
</div>