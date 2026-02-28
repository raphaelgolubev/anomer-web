<script lang="ts">
    import { page } from '$app/state';
    import LineWriter from '$lib/components/LineWriter.svelte';

    // создаем производное состояние (derived state)
    // оно будет автоматически обновляться при изменении page.status
    const printable = $derived.by(() => {
        const status = page.status;
        const message = page.error?.message || 'Неизвестная ошибка';

        const base = [
            'Загрузка...',
            '[ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ ]',
            `Получен ответ от сервера: Код ${status}`
        ];

        if (status === 404) {
            return [
                ...base,
                'Ошибка: Страница не найдена.',
                'Запрошенный ресурс перемещен или никогда не существовал.'
            ];
        } 
        
        if (status === 500) {
            return [
                ...base,
                'Критический сбой системы.',
                `Детали: ${message}`,
                'Наши инженеры уже уведомлены.'
            ];
        }

        // дефолтный вариант для остальных ошибок
        return [
            ...base,
            `Произошла непредвиденная ошибка: ${message}`
        ];
    });
</script>

<!-- используем ключ {#key}, чтобы перезапускать анимацию печати при смене ошибки -->
{#key page.status}
    <LineWriter
        lines={printable}
        onComplete={() => console.log('Печать завершена')}
    />
{/key}
