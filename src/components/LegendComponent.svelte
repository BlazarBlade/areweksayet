<script lang="ts">
  import { SUPPORT_STATUS_ITEMS } from '../util/supportStatusConfig';

  let { features = [] }: { features?: any[] } = $props();

  // Get a set of all status states currently present in the table
  const usedStatuses = $derived(new Set(
          features.flatMap(f => [f.core, f.mod])
  ));

  // Filter items: show if alwaysShow is true OR if the status is used in the table
  const visibleItems = $derived(
          SUPPORT_STATUS_ITEMS.filter(item => item.alwaysShow || usedStatuses.has(item.state))
  );
</script>

<div class="legend">
  {#each visibleItems as item}
        <span class="legend-item {item.state}">
            {item.char} {item.description}
        </span>
  {/each}
</div>