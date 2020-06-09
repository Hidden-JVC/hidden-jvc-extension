import { parse } from 'open-jvcode';

export default function (form) {
    const textarea = form.querySelector('#hidden-form textarea#message_topic');

    const buttons = document.querySelectorAll('[data-edit]');
    for (const btn of buttons) {
        btn.addEventListener('click', () => {
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;

            const before = textarea.value.substring(0, start);
            const selected = textarea.value.substring(start, end);
            const after = textarea.value.substring(end, textarea.value.length);

            const edit = btn.dataset.edit;
            switch (edit) {
                case 'bold':
                    textarea.value = `${before}**${selected}**${after}`;
                    break;
                case 'italic':
                    textarea.value = `${before}*${selected}*${after}`;
                    break;
                case 'underline':
                    textarea.value = `${before}<ins>${selected}</ins>${after}`;
                    break;
                case 'del':
                    textarea.value = `${before}~~${selected}~~${after}`;
                    break;
                case 'spoil':
                    textarea.value = `${before}<spoil>${selected}</spoil>${after}`;
                    break;
            }
            textarea.focus();
            textarea.selectionEnd = end;
            updatePreview();
        });
    }

    textarea.addEventListener('keyup', updatePreview);

    function updatePreview() {
        const textarea = document.querySelector('#hidden-form textarea#message_topic');
        const preview = document.querySelector('#hidden-form .previsu-editor');
        preview.innerHTML = parse(textarea.value);
    }
}
