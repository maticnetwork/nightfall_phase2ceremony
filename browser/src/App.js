import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <button
          onClick={() =>
            window.applyContrib({
              circuits: ['deposit'],
              type: 'contribution',
              name: 'appjs',
              contribData: 'randomData',
              branch: 'main',
            })
          }
        >
          Learn React
        </button>
      </header>
    </div>
  );
}

export default App;
