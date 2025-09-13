import * as React from 'react';
import { createRoot } from 'react-dom/client';

interface AppProps {
    name: string;
}

interface AppState {
    time: string;
}

export class App extends React.Component<AppProps, AppState> {

    constructor(props: AppProps) {
        super(props);
        this.state = {
            time: ''
        }
    }

    componentDidMount() {
        void this.getTime();
        setInterval(() => {
            void this.getTime()
        }, 2000);
    }

    render() {
        const {name} = this.props;
        const {time} = this.state;
        return <><h1>{name}</h1><div>{time}</div></>;
    }

    private getTime = async () => {
        const response = await fetch('/api/time', { method: 'GET' });
        if (response.ok) {
            this.setState({time: await response.text()});
        }
    }

}

export function start() {
    const rootElem = document.getElementById('main');
    if (!rootElem) {
        throw new Error("Root element with id 'main' not found.");
    }
    const root = createRoot(rootElem);
    root.render(<App name="Hello World" />);
}
