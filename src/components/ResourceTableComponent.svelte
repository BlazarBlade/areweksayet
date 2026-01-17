<script lang="ts">
    import type {ResourceTable} from '../util/featureDataProcessor';

    let {table}: { table: ResourceTable } = $props();
    const id = table.name.replace(/\s+/g, '-');
</script>

<h3>
    {table.name}
    <a href="#{id}" class="anchor-link">🔗</a>
</h3>

<table {id} class="resources-table">
    <thead>
    <tr>
        <th></th>
        <th>Info / URLs</th>
    </tr>
    </thead>
    <tbody>
    {#each table.resources as resource}
        <tr>
            <td>{resource.name}</td>
            <td>
                {#if resource.url}
                    <a href={resource.url} target="_blank">{resource.url_name || resource.name}</a>
                {:else}
                    Not ready yet
                {/if}
            </td>
        </tr>
    {/each}
    </tbody>
</table>
