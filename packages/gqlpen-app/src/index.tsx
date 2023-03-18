import { render } from 'solid-js/web';
import { App } from './App';
import './index.css';

const root = document.getElementById('root');

if (window.chrome && chrome.runtime && chrome.runtime.id) {
    import('./web-ext.css');
}

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
    throw new Error(
        'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got mispelled?'
    );
}

render(() => <App />, root!);
