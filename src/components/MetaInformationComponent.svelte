<script lang="ts">
    import type { MetaInformation } from '../util/featureDataProcessor';

    let { data } : { data: MetaInformation } = $props();

    const localDate = $derived(new Date(data.meta.last_update).toLocaleString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }));
</script>

<div class="meta-container">
    <div class="sub-disclaimer warning-box">
        Last update: {localDate}
    </div>
</div>

<style>
    .meta-container {
        margin-bottom: 1rem;
    }
</style>
