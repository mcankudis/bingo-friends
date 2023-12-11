import { Component, JSX } from 'solid-js';
import { Variant } from '../Variant';

type ButtonProps = {
    variant: Variant;
    type?: 'submit' | 'button';
    children: JSX.Element | string;
    onClick?: () => void;
};

export const Button: Component<ButtonProps> = (props) => {
    const { variant, onClick } = props;

    const getColors = (variant: Variant) => {
        switch (variant) {
            case 'primary':
                return 'bg-blue-500 hover:bg-blue-700';
            case 'secondary':
                return 'bg-gray-500 hover:bg-gray-700';
            case 'success':
                return 'bg-green-500 hover:bg-green-700';
            case 'danger':
                return 'bg-red-500 hover:bg-red-700';
            case 'warning':
                return 'bg-yellow-500 hover:bg-yellow-700';
        }
    };

    const colors = getColors(variant);
    const type = props.type ?? 'button';

    return (
        <button
            type={type}
            class={`${colors} text-white font-bold py-2 px-4 rounded`}
            onClick={onClick}
        >
            {props.children}
        </button>
    );
};
