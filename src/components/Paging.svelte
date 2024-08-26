<script>

    export let pageSize
    export let list
    export let trimmed

    let page = 1;

    $: page, updateTrimmed()

    const nextPage = () => {
        let maxPage = Math.ceil(list.length / pageSize);
        if (page >= maxPage) return;

        page++;
    }

    const prevPage = () => {
        if (page === 1) return;

        page--;
    }

    const updateTrimmed = () => {
        let start = (page - 1) * pageSize;
        let end = start + pageSize;

        trimmed = list.slice(start, end);
    }

</script>
<div class="flex justify-center">
    <div class="join">
        <button class="btn btn-primary join-item" on:click={prevPage}>Previous page</button>
        <input bind:value={page} type="number" class="input input-bordered join-item"/>
        <button class="btn btn-primary join-item" on:click={nextPage}>Next page</button>
    </div>
</div>

<div class="text-center">
    Showing {page} of {Math.ceil(list.length / pageSize)} pages
</div>
