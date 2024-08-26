<script>
    import SvelteMarkdown from 'svelte-markdown'
    import {onMount} from "svelte";

    let markdown = '';
    let key = 0;

    onMount(async () => {
        markdown = await (import('../assets/documentation.md').then((result) => {
            key++;

            return result.markdown;
        }));
    });
</script>

<div class="hero bg-base-200 min-h-screen">
    <div class="hero-content">
        {#key key}
            <div class="hero-content bg-base-100 rounded-lg">
                {#if markdown}
                    <div class="">
                        <SvelteMarkdown bind:source={markdown}/>
                    </div>
                {/if}
            </div>
        {/key}
    </div>
</div>

<style>
    :global(h1) {
        @apply text-4xl font-bold text-center;
    }

    :global(h2) {
        @apply text-3xl font-bold;
    }

    :global(h3) {
        @apply text-2xl font-bold;
    }

    :global(h4) {
        @apply text-xl font-bold;
    }

    :global(h5) {
        @apply text-lg font-bold;
    }

    :global(h6) {
        @apply text-base font-bold;
    }

    :global(p) {
        @apply text-base;
    }

    :global(ul) {
        @apply list-disc;
    }

    :global(ol) {
        @apply list-decimal;
    }

    :global(li) {
        @apply text-base;
    }

    :global(table) {
        @apply w-full;
    }

    :global(th), :global(td) {
        @apply border
    }
</style>