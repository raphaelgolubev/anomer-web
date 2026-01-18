<script lang="ts">
	import { onMount } from 'svelte';

	import TerminalInput from '$lib/components/TerminalInput.svelte';
	import LineWriter from '$lib/components/LineWriter.svelte';

	let isInputActive = $state(false);
	let printable = $state<string[]>([]);

	function handleWriterComplete() {
		isInputActive = true;
	}

	onMount(() => {
		printable = [
			'Инициализация...',
			'Проверка прав доступа...',
			'Ошибка: не удалось получить права доступа',
			'Запрашиваю имя пользователя...',
			'Введите свое имя:'
		];
	});

	function userInput(value: string) {
		printable = [
			'Поиск в базе данных...',
			'Пользователь найден.',
			`Подтвердите, что Вы являетесь пользователем  "${value}"`,
			'Введите пароль:'
		];
	}
</script>

{#key printable}
	<LineWriter lines={printable} speed={10} onComplete={handleWriterComplete} />
{/key}

<TerminalInput prefix="guest@system:~$" onEnter={userInput} />
