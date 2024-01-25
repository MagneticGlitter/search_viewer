import './index.css';
import SearchBar from './searchBar/SearchBar';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

function App() {
  return (
    <div className="bg-main">
      <Router>
        <SearchBar />
      </Router>
      {/* <ListView /> */}
    </div>
  );
}

export default App;
