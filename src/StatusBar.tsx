import { Icon } from 'solid-heroicons';
import { cog_6Tooth } from 'solid-heroicons/solid';
import type { Component, ParentComponent } from 'solid-js';
import {
    HeaderSettingsModal,
    HeaderSettingsModalButton,
} from './HeaderSettingsModal';

const StatusBar: Component = () => {
    return (
        <div class="flex h-6 items-stretch bg-neutral px-1">
            <div class="grow"></div>
            <StatusBarButton>
                <HeaderSettingsModalButton>
                    <Icon path={cog_6Tooth} class="h-4 w-4" />
                </HeaderSettingsModalButton>
            </StatusBarButton>
            <HeaderSettingsModal />
        </div>
    );
};

const StatusBarButton: ParentComponent = ({ children }) => {
    return (
        <div class="flex cursor-pointer items-center px-1 hover:bg-neutral-800">
            {children}
        </div>
    );
};

export default StatusBar;
