<script lang="ts">
	import { ui } from '$lib/ui.svelte';
	import { fade } from 'svelte/transition';
</script>

{#if ui.isOsdOpen}
	<div class="osd-container" in:fade={{ duration: 50 }}>
		<div class="osd-tabs-row">
			{#each ui.osdTree as tab, i}
				<div
					class="osd-tab-icon"
					class:active={ui.activeTabIdx === i}
					class:focus={ui.activeTabIdx === i && ui.osdMode === 'TABS'}
				>
					{tab.icon}
				</div>
			{/each}
		</div>

		<div class="osd-body">
			<div class="osd-tab-label">{ui.osdTree[ui.activeTabIdx].label}</div>

			<div class="osd-items-list">
				{#each ui.osdTree[ui.activeTabIdx].items as item, i}
					<div
						class="osd-item"
						class:selected={ui.activeItemIdx === i && ui.osdMode === 'ITEMS'}
						class:editing={ui.activeItemIdx === i && ui.osdMode === 'EDIT'}
					>
						<div class="item-header">
							<span class="item-name">{item.label}</span>
							<span class="item-value">{item.value()}</span>
						</div>
						<div class="bar-container">
							<!-- Добавили деление на 100, чтобы ширина была корректной -->
							<div class="bar" style="width: {(item.value() / item.max) * 100}%"></div>
						</div>
					</div>
				{/each}
			</div>
		</div>

		<div class="osd-footer">
			{#if ui.osdMode === 'TABS'}
				ВЫБОР ВКЛАДКИ: [▲▼] ДАЛЕЕ: [ВЫБРАТЬ]
			{/if}
			{#if ui.osdMode === 'ITEMS'}
				ВЫБОР ПАРАМЕТРА: [▲▼] ИЗМЕНИТЬ: [ВЫБРАТЬ]
			{/if}
			{#if ui.osdMode === 'EDIT'}
				РЕГУЛИРОВКА: [▲▼] НАЗАД: [ВЫБРАТЬ]
			{/if}
		</div>
	</div>
{/if}

<style>
	.osd-container {
		position: absolute;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		bottom: 20%;
		left: 50%;
		transform: translateX(-50%);
		width: 400px; /* Фиксированная ширина лучше для OSD */
		height: 400px;
		background: #0000aa;
		border: 2px solid #ffffff;
		box-shadow: 6px 6px 0 #000;
		color: #fff;
		font-family: 'Courier New', monospace;
		z-index: 100000; /* Выше всех слоев */
		padding: 4px;
		image-rendering: pixelated;
		text-shadow: 2px 2px 0 #000;
	}

	.osd-tabs-row {
		display: flex;
		justify-content: space-around;
		background: #000;
		padding: 8px 4px;
		gap: 5px;
		border-bottom: 2px solid #fff;
	}

	.osd-tab-icon {
		font-size: 18px;
		color: #555;
		transition: all 0.1s;
	}
	.osd-tab-icon.active {
		color: #fff;
	}
	.osd-tab-icon.focus {
		color: #ffff00;
		transform: scale(1.2);
		text-shadow: 0 0 8px #ffff00;
	}

	.osd-tab-label {
		font-size: 12px;
		padding: 2px 10px;
		background: #fff;
		color: #0000aa;
		text-align: center;
		font-weight: bold;
		text-shadow: none;
	}

	.osd-items-list {
		padding: 10px 5px;
	}

	.osd-item {
		margin-bottom: 10px;
		padding: 4px;
	}

	.item-header {
		display: flex;
		justify-content: space-between;
		font-size: 12px;
		margin-bottom: 4px;
	}

	.osd-item.selected {
		outline: 1px solid #fff;
		background: rgba(255, 255, 255, 0.2);
	}

	.bar-container {
		height: 8px;
		background: #000;
		border: 1px solid #fff;
		position: relative;
	}

	.bar {
		height: 100%;
		background: #fff;
	}

	.osd-item.editing .item-name,
	.osd-item.editing .item-value {
		color: #ffff00;
	}

	.osd-item.editing .bar {
		background: #ffff00;
		box-shadow: 0 0 10px #ffff00;
	}

	.osd-footer {
		border-top: 1px solid #fff;
		margin-top: 5px;
		padding: 6px 0;
		font-size: 9px;
		text-align: center;
		color: #aaa;
	}
</style>
