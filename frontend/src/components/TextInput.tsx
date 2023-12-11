import { Component, createSignal } from 'solid-js';

interface TextInputProps {
    type?: 'text' | 'password';
    placeholder?: string;
    value: string;
    onChange: (value: string) => void;
}

export const TextInput: Component<TextInputProps> = (props) => {
    const [value, setValue] = createSignal(props.value);

    const type = props.type ?? 'text';

    const handleChange = (event: Event) => {
        const target = event.target as HTMLInputElement;
        const value = target.value;
        setValue(value);
        props.onChange(value);
    };

    return (
        <div class="flex flex-col">
            <input
                type={props.type}
                value={value()}
                placeholder={props.placeholder}
                onChange={handleChange}
                class="border bg-gray-200    px-2 py-1 rounded-md"
            />
        </div>
    );
};
