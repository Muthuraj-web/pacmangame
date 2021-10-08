import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import App from './App';

const rootElement = document.getElementById('root');
ReactDOM.render(
	<StrictMode>
		<App cellSize={25} villainCount={5} />
	</StrictMode>,
	rootElement
);
