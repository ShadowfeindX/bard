<style>
    div {
        background-color: black;
        border: red solid 1px;
        color: white;
        align-content: center;
        text-align: center;
        /* width: auto; */
        /* height: auto; */
        margin: .5em;
    }

    .profile {
        grid-area: p;
    }

    .details {
        grid-area: d;
    }

    .equip {
        grid-area: e;
    }

    .history {
        grid-area: h;
    }

    .origin {
        grid-area: o;
    }

    .country {
        grid-row: o;
        grid-column: o / span 3;
    }

    .dob {
        grid-row: o;
        grid-column: 4 / span 2;
    }

    .race {
        grid-row: o;
        grid-column: 6 / span 2;
    }

    .notes {
        /* grid-area: ; */
        display: none;
    }
    
    :global(main) {
        /* grid-auto-flow: column; */
        grid-template-columns: repeat(12, 1fr);
        grid-template-rows: repeat(12, 1fr);
        grid-template-areas: 
        'p p p p . . . . . . . .'
        'p p p p d d d d d d d d'
        'p p p p d d d d d d d d'
        'p p p p d d d d d d d d'
        'p p p p d d d d d d d d'
        'p p p p d d d d d d d d'
        'o o o o o o o h h h h h'
        'e e e e e e e h h h h h'
        'e e e e e e e h h h h h'
        'e e e e e e e h h h h h'
        'e e e e e e e h h h h h'
        'e e e e e e e h h h h h';
    }


</style>

<script>
    const layout = ['profile', 'details', 'origin', 'equip', 'history', 'notes'];
    const origins = ['country', 'dob', 'race']
</script>

{#each layout as n, i}
    <div class={n} id={n}>{n}</div>
{/each}

{#each origins as n, i}
    <div class={n} id={n}>{n}</div>
{/each}