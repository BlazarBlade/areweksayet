<script lang="ts">
    import type {FeatureTable} from '../util/featureDataProcessor';
    import Legend from './LegendComponent.svelte';
    import {parseMarkdownLinks} from "../util/markdownLinkParser";
    import {DEFAULT_STATE, SUPPORT_STATUS_ITEMS} from "../util/supportStatusConfig";

    let {table, isLocked = $bindable(true), editableFeatures = $bindable([...table.features])}: {
        table: FeatureTable;
        isLocked?: boolean;
        editableFeatures?: any[];
    } = $props();

    const id = table.name.replace(/\s+/g, '-');

    // Edit mode state
    let draggedIndex: number | null = $state(null);
    let commentPreviews = $state<{ [key: number]: boolean }>({});

    // Simple helper to parse [text](url) in comments
    function parseComment(text: string) {
        let parsed = parseMarkdownLinks(text, (text, url) => `<a href="${url}" target="_blank">${text}</a>`);
        return parsed.replacedText;
    }

    function addNewRow() {
        editableFeatures = [...editableFeatures, {
            name: "New Feature",
            core: SUPPORT_STATUS_ITEMS[DEFAULT_STATE].state,
            mod: SUPPORT_STATUS_ITEMS[DEFAULT_STATE].state,
            comment: ""
        }];
    }

    function deleteRow(index: number) {
        editableFeatures = editableFeatures.filter((_, i) => i !== index);
    }

    function handleDragStart(index: number) {
        draggedIndex = index;
    }

    function handleDragOver(e: DragEvent, index: number) {
        e.preventDefault();
        if (draggedIndex !== null && draggedIndex !== index) {
            const newFeatures = [...editableFeatures];
            const draggedItem = newFeatures[draggedIndex];
            newFeatures.splice(draggedIndex, 1);
            newFeatures.splice(index, 0, draggedItem);
            editableFeatures = newFeatures;
            draggedIndex = index;
        }
    }

    function handleDragEnd() {
        draggedIndex = null;
    }

    function toggleCommentPreview(index: number) {
        commentPreviews[index] = !commentPreviews[index];
    }
</script>

<h3>
    {table.name}
    <a href="#{id}" class="anchor-link">🔗</a>
</h3>

<Legend features={editableFeatures}/>

<table {id} class="features-table">
    <thead>
    <tr>
        {#if !isLocked}
            <th class="drag-handle-header"></th>
        {/if}
        <th class="features-row">Feature</th>
        <th class="core-row">Core</th>
        <th class="mod-row">Mod</th>
        <th class="comments-row">Comments</th>
        {#if !isLocked}
            <th class="actions-header">Actions</th>
        {/if}
    </tr>
    </thead>
    <tbody>
    {#each editableFeatures as feature, index}
        <tr
                draggable={!isLocked}
                ondragstart={() => handleDragStart(index)}
                ondragover={(e) => handleDragOver(e, index)}
                ondragend={handleDragEnd}
                class:dragging={draggedIndex === index}
        >
            {#if !isLocked}
                <td class="drag-handle">⋮⋮</td>
            {/if}
            <td>
                {#if isLocked}
                    {feature.name}
                {:else}
                    <input type="text" bind:value={feature.name} class="input-feature-name"/>
                {/if}
            </td>
            <td class={(isLocked ? feature.core : '') + ' core-row'}>
                {#if isLocked}
                    <!-- Show tick/cross as before -->
                {:else}
                    <select bind:value={feature.core} class="select-status">
                        {#each SUPPORT_STATUS_ITEMS as item}
                            <option value={item.state}>{item.char} {item.short}</option>
                        {/each}
                    </select>
                {/if}
            </td>
            <td class={(isLocked ? feature.mod : '') + ' mod-row'}>
                {#if isLocked}
                    <!-- Show tick/cross as before -->
                {:else}
                    <select bind:value={feature.mod} class="select-status">
                        {#each SUPPORT_STATUS_ITEMS as item}
                            <option value={item.state}>{item.char} {item.short}</option>
                        {/each}
                    </select>
                {/if}
            </td>
            <td>
                {#if isLocked}
                    {@html parseComment(feature.comment)}
                {:else}
                    <div class="comment-editor">
                        <textarea bind:value={feature.comment} class="textarea-comment" rows="3"></textarea>
                        <button class="btn-preview" onclick={() => toggleCommentPreview(index)}>
                            {commentPreviews[index] ? "Edit" : "Preview"}
                        </button>
                        {#if commentPreviews[index]}
                            <div class="comment-preview">
                                {@html parseComment(feature.comment)}
                            </div>
                        {/if}
                    </div>
                {/if}
            </td>
            {#if !isLocked}
                <td class="actions-cell">
                    <button class="btn-delete" onclick={() => deleteRow(index)} title="Delete row">🗑️</button>
                </td>
            {/if}
        </tr>
    {/each}
    </tbody>
</table>

{#if !isLocked}
    <button class="btn-add-row" onclick={addNewRow}>
        ➕ Add New Row
    </button>
{/if}
