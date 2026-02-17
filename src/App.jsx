import { useRef, useState } from "react";
import Fab from "@mui/material/Fab";
import Tooltip from "@mui/material/Tooltip";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import TransitMap from "./components/TransitMap";
import SearchBar from "./components/SearchBar";

function App() {
  const mapApiRef = useRef(null);
  const [searchValue, setSearchValue] = useState("");

  const handleRecenter = () => {
    mapApiRef.current?.recenter();
  };

  const handleSearchSubmit = (query) => {
    mapApiRef.current?.search(query);
  };

  return (
    <main className="app-shell">
      <TransitMap ref={mapApiRef} />

      <div className="app-overlay app-overlay-top">
        <SearchBar
          value={searchValue}
          onChange={setSearchValue}
          onSubmit={handleSearchSubmit}
        />
      </div>

      <div className="app-overlay app-overlay-bottom">
        <Tooltip title="Recenter map">
          <Fab
            aria-label="Recenter map"
            color="primary"
            onClick={handleRecenter}
            className="recenter-button"
          >
            <MyLocationIcon />
          </Fab>
        </Tooltip>
      </div>
    </main>
  );
}

export default App;
