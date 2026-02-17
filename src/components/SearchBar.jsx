import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";

function SearchBar({ value, onChange, onSubmit }) {
  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(value.trim());
  };

  return (
    <form className="search-bar-form" onSubmit={handleSubmit}>
      <TextField
        fullWidth
        size="small"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search places (e.g. Shinjuku, Tokyo Station)"
        variant="outlined"
        className="search-bar-input"
        inputProps={{ "aria-label": "Search places on map" }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
        }}
      />
    </form>
  );
}

export default SearchBar;
