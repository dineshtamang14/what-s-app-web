import './App.css';
import Chat from './Chat';
import Sidebar from './Sidebar';

function App() {
  return (
    <div className="App">
      <h1>lets build whatsapp</h1>

      {/* Siderbar */}
      <Sidebar />

      {/* Chat component */}
      <Chat />
    </div>
  );
}

export default App;
