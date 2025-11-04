import { useEffect } from "react";
import "@/App.css";

function App() {
  useEffect(() => {
    // Redirection automatique vers le site smartphone
    window.location.href = '/s25/index.html';
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Redirection vers EA Mobile S25 Ultra...
        </p>
      </header>
    </div>
  );
}

export default App;
