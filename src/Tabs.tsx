import type { ParentComponent } from 'solid-js';

export const Tabs: ParentComponent = (props) => {
    return <div class="tabs">{props.children}</div>;
};

export const Tab: ParentComponent<{ onClick: () => void, active?: boolean }> = (props) => {
    return (
        <button class={`tab tab-bordered ${props.active && 'tab-active'}`} onClick={props.onClick}>
            {props.children}
        </button>
    );
};
