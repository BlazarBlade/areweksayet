<script lang="ts">
    import {onMount} from 'svelte';
    import {type MetaInformation, processFeatureData, type TableInstance} from './util/featureDataProcessor';
    import rawJson from '../data/features.json';
    import FeatureTableComponent from './components/FeatureTableComponent.svelte';
    import ResourceTableComponent from './components/ResourceTableComponent.svelte';
    import MetaInformationComponent from './components/MetaInformationComponent.svelte';

    const tables: TableInstance[] = processFeatureData(rawJson);
    const metaInformation = tables.find((table) => table.type === 'MetaInformation') as MetaInformation;

    let isDark = $state(false);
    let globalLocked = $state(true);

    // Track the editable state for each table
    let editableTables = $state<{ [key: string]: any }>({});

    // Initialize editable tables
    tables.forEach((table, index) => {
        if (table.type === 'FeatureTable') {
            editableTables[index] = [...table.features];
        }
    });

    onMount(() => {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const savedTheme = localStorage.getItem('theme');
        isDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
        applyTheme();
    });

    function toggleTheme() {
        isDark = !isDark;
        applyTheme();
    }

    function applyTheme() {
        document.body.classList.toggle('dark', isDark);
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }

    function toggleGlobalLock() {
        globalLocked = !globalLocked;
        return;

        // if (globalLocked) {
        //     // Reset all tables to original when locking
        //     tables.forEach((table, index) => {
        //         if (table.type === 'FeatureTable') {
        //             editableTables[index] = [...table.features];
        //         }
        //     });
        // }
    }

    function exportAllToJSON() {
        const exportData = tables.map((table, index) => {
            if (table.type === 'MetaInformation')
            {
                table.meta.last_update = new Date().toISOString();
                return {
                    name: table.name,
                    meta: table.meta
                }
            }
            if (table.type === 'FeatureTable') {
                return {
                    name: table.name,
                    features: editableTables[index] || table.features
                };
            } else if (table.type === 'ResourceTable') {
                return {
                    name: table.name,
                    resources: table.resources
                };
            }
            return table;
        });
        return JSON.stringify(exportData, null, 4);
    }

    function saveAllChanges() {
        const json = exportAllToJSON();
        const blob = new Blob([json], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'features.json';
        a.click();
        URL.revokeObjectURL(url);
    }

    function copyAllToClipboard() {
        const json = exportAllToJSON();
        navigator.clipboard.writeText(json).then(() => {
            alert('All changes copied to clipboard!');
        });
    }

    // Check if there are any changes across all tables
    let hasAnyChanges = $derived(tables.some((table, index) => {
        if (table.type === 'FeatureTable') {
            return JSON.stringify(editableTables[index]) !== JSON.stringify(table.features);
        }
        return false;
    }));
</script>

<button class="theme-toggle" type="button" onclick={toggleTheme} aria-label="Toggle dark mode" aria-pressed={isDark}>
    <span class="icon" aria-hidden="true">{isDark ? '🌙' : '☀️'}</span>
    <span class="label">{isDark ? 'Dark' : 'Light'}</span>
</button>

<div class="disclaimer">
    Unofficial fan-made page; not linked to RocketWerkz or KSA development.
</div>

<h1>Are we <code>Kitten Space Agency</code> yet?</h1>

<p><strong class="extra">&#x1f389; Yes!, Pre-alpha since 14th November 2025 &#x1f389;</strong></p>

<p>
    Kitten Space Agency reached its first public pre-alpha milestone on
    <code>14th November 2025</code>. Work continues toward wider feature completeness by the KSA dev team and modders.
</p>

<hr>

<div class="sub-disclaimer warning-box">
    Feature list is speculative, entirely unofficial and not based on any real roadmap.
</div>
<div class="sub-disclaimer warning-box">
    Progress tracking and status indicators are a community interpretation, not official statements.
</div>

<MetaInformationComponent data={metaInformation} />
<hr>

<div class="global-controls">
    <h2>KSA ecosystem features</h2>
    <div class="control-buttons">
        <button
                class="global-lock-toggle"
                onclick={toggleGlobalLock}
                aria-label={globalLocked ? "Unlock all tables" : "Lock all tables"}
                title={globalLocked ? "Unlock to edit all tables" : "Lock all tables"}
        >
            {globalLocked ? "🔒 Unlock All" : "🔓 Lock All"}
        </button>
        {#if !globalLocked && hasAnyChanges}
            <button class="btn-save" onclick={saveAllChanges}>💾 Save All Changes</button>
            <button class="btn-copy" onclick={copyAllToClipboard}>📋 Copy All to Clipboard</button>
        {/if}
    </div>
</div>

{#each tables as table, index}
    {#if table.type === 'FeatureTable'}
        <FeatureTableComponent {table} bind:isLocked={globalLocked} bind:editableFeatures={editableTables[index]}/>
    {:else if table.type === 'ResourceTable'}
        <ResourceTableComponent {table}/>
    {/if}
{/each}

<a class="github-ribbon" href="https://github.com/mihemihe/areweksayet">Fork me on GitHub</a>
