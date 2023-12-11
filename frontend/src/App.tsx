import { Route, Router } from '@solidjs/router';
import { For, type Component } from 'solid-js';

import { Toaster } from 'solid-toast';
import { routes } from './navigation/routes';

export const App: Component = () => {
    return (
        <>
            <Router>
                <For each={routes}>
                    {({ path, component }) => <Route path={path} component={component} />}
                </For>
            </Router>

            <Toaster />
        </>
    );
};
