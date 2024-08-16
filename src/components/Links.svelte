<script>
    import {LinkSquare01Icon} from "hugeicons-svelte";

    const cards = [
        {
            title: "Grafana",
            url: "http://85.215.185.110:9376",
            color: "#f58431"
        },
        {
            title: "Swagger",
            url: "http://flexi.kikker234.nl/swagger",
            color: "#92e985"
        },
        {
            title: "Docs",
            url: "",
            color: "#3f8df4"
        },
        {
            title: "Seq",
            url: "",
            color: "#f4e03f"
        }
    ]

</script>

<div class="flex gap-3">
    {#each cards as card}
        <div style="background-color: {card.color}" class="card text-primary-content w-full">
            <div class="card-body">
                <h1 class="card-title">{card.title}</h1>

                <div class="card-actions justify-end">
                    <a target="_blank" href="{card.url}">
                        <div class="btn">
                            <p>Open</p>
                            <LinkSquare01Icon
                                    size={24}
                                    color={"#ffffff"}
                                    variant={"stroke"}
                            />
                        </div>
                    </a>
                </div>
            </div>
        </div>
    {/each}
</div>