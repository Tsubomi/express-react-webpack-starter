import * as React from 'react';
import { createRoot } from 'react-dom/client';

import { FileExplorer } from './components/FileExplorer';

import "./styles.css";

export function App() {
    return (
        <FileExplorer />
    );
}

export function start() {
    const rootElem = document.getElementById('main');
    if (!rootElem) {
        throw new Error("Root element with id 'main' not found.");
    }
    const root = createRoot(rootElem);
    root.render(<App />);
}
