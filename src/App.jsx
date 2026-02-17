import { useCallback, useMemo, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import {
  AppBar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Map, { Layer, Marker, Popup, Source } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const DRAWER_WIDTH = 280;
const SHINKANSEN_SOURCE_ID = "tokaido-shinkansen-route";
const SHINKANSEN_LAYER_ID = "tokaido-shinkansen-line";
const DEFAULT_MAP_STYLE = "mapbox://styles/mapbox/navigation-night-v1";

const mapStyles = [
  { label: "Navigation Night", value: DEFAULT_MAP_STYLE },
  { label: "Dark", value: "mapbox://styles/mapbox/dark-v11" },
  { label: "Light", value: "mapbox://styles/mapbox/light-v11" },
  { label: "Streets", value: "mapbox://styles/mapbox/streets-v12" },
  { label: "Outdoors", value: "mapbox://styles/mapbox/outdoors-v12" },
  { label: "Satellite", value: "mapbox://styles/mapbox/satellite-v9" },
];

const shinkansenRoute = {
  type: "Feature",
  properties: { name: "Tokaido Shinkansen" },
  geometry: {
    type: "LineString",
    coordinates: [
      [139.7671, 35.6812], // Tokyo
      [139.7387, 35.6285], // Shinagawa
      [139.6234, 35.4680], // Shin-Yokohama
      [139.1598, 35.2550], // Odawara
      [139.0778, 35.1033], // Atami
      [138.9283, 35.1230], // Mishima
      [138.7330, 35.1615], // Shin-Fuji
      [138.3880, 34.9750], // Shizuoka
      [138.0900, 34.7700], // Hamamatsu
      [137.3820, 34.7030], // Toyohashi
      [136.8990, 35.1700], // Nagoya
      [136.2910, 35.3150], // Maibara approx
      [135.7588, 34.9855], // Kyoto
    ],
  },
};

const stations = [
  { name: "Tokyo", coordinates: [139.7671, 35.6812] },
  { name: "Shinagawa", coordinates: [139.7387, 35.6285] },
  { name: "Shin-Yokohama", coordinates: [139.6234, 35.4680] },
  { name: "Odawara", coordinates: [139.1598, 35.2550] },
  { name: "Atami", coordinates: [139.0778, 35.1033] },
  { name: "Mishima", coordinates: [138.9283, 35.1230] },
  { name: "Shin-Fuji", coordinates: [138.7330, 35.1615] },
  { name: "Shizuoka", coordinates: [138.3880, 34.9750] },
  { name: "Hamamatsu", coordinates: [138.0900, 34.7700] },
  { name: "Toyohashi", coordinates: [137.3820, 34.7030] },
  { name: "Nagoya", coordinates: [136.8990, 35.1700] },
  { name: "Maibara", coordinates: [136.2910, 35.3150] },
  { name: "Kyoto", coordinates: [135.7588, 34.9855] },
];

const routeLineLayer = {
  id: SHINKANSEN_LAYER_ID,
  type: "line",
  source: SHINKANSEN_SOURCE_ID,
  layout: {
    "line-cap": "round",
    "line-join": "round",
  },
  paint: {
    "line-color": "#D32F2F",
    "line-width": 6,
    "line-opacity": 0.85,
    "line-dasharray": [3, 2],
  },
};

function App() {
  const mapRef = useRef(null);
  const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [currentMapStyle, setCurrentMapStyle] = useState(DEFAULT_MAP_STYLE);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [activeStation, setActiveStation] = useState(null);

  const fitRouteBounds = useCallback(() => {
    const map = mapRef.current?.getMap();
    if (!map) {
      return;
    }

    const [firstLongitude, firstLatitude] = shinkansenRoute.geometry.coordinates[0];
    const bounds = shinkansenRoute.geometry.coordinates.reduce(
      (nextBounds, [longitude, latitude]) =>
        nextBounds.extend([longitude, latitude]),
      new mapboxgl.LngLatBounds(
        [firstLongitude, firstLatitude],
        [firstLongitude, firstLatitude],
      ),
    );

    map.fitBounds(bounds, {
      padding: 60,
      duration: 800,
    });
  }, []);

  const stationMarkers = useMemo(
    () =>
      stations.map((station) => (
        <Marker
          key={station.name}
          longitude={station.coordinates[0]}
          latitude={station.coordinates[1]}
          anchor="center"
        >
          <Tooltip title={station.name} arrow>
            <Box
              component="button"
              type="button"
              onClick={() => setActiveStation(station)}
              sx={{
                width: 14,
                height: 14,
                borderRadius: "50%",
                border: "2px solid #fff",
                backgroundColor: "#D32F2F",
                boxShadow: "0 1px 3px rgba(0,0,0,0.35)",
                cursor: "pointer",
              }}
            />
          </Tooltip>
        </Marker>
      )),
    [],
  );

  const handleDrawerToggle = useCallback(() => {
    setIsMobileDrawerOpen((isOpen) => !isOpen);
  }, []);

  const handleDrawerClose = useCallback(() => {
    setIsMobileDrawerOpen(false);
  }, []);

  const handleMapStyleChange = useCallback(
    (nextMapStyle) => {
      setCurrentMapStyle(nextMapStyle);
      if (isSmallScreen) {
        setIsMobileDrawerOpen(false);
      }
    },
    [isSmallScreen],
  );

  const drawerContent = (
    <>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6">Shinkansen Viewer</Typography>
        <Typography variant="body2" color="text.secondary">
          Map Styles
        </Typography>
      </Box>
      <Divider />
      <List sx={{ py: 0 }}>
        {mapStyles.map((styleOption) => (
          <ListItem key={styleOption.value} disablePadding>
            <ListItemButton
              selected={currentMapStyle === styleOption.value}
              onClick={() => handleMapStyleChange(styleOption.value)}
            >
              <ListItemText primary={styleOption.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </>
  );

  if (!mapboxToken) {
    return (
      <Box
        sx={{
          display: "grid",
          placeItems: "center",
          width: "100%",
          height: "100vh",
          p: 3,
        }}
      >
        <Typography align="center" color="text.secondary">
          VITE_MAPBOX_TOKEN is missing. Add it to your environment before
          running the app.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        height: "100vh",
        bgcolor: "background.default",
        color: "text.primary",
      }}
    >
      <Drawer
        variant={isSmallScreen ? "temporary" : "permanent"}
        open={isSmallScreen ? isMobileDrawerOpen : true}
        onClose={handleDrawerClose}
        ModalProps={{ keepMounted: true }}
        anchor="left"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
          },
        }}
      >
        {drawerContent}
      </Drawer>

      <Box
        sx={{
          flexGrow: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          height: "100vh",
        }}
      >
        <AppBar
          position="static"
          color="inherit"
          elevation={0}
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          <Toolbar variant="dense">
            {isSmallScreen && (
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleDrawerToggle}
                aria-label="toggle map style drawer"
                sx={{ mr: 1 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Typography variant="h6" component="h1" noWrap>
              Tokyo ↔ Kyoto Shinkansen Route
            </Typography>
          </Toolbar>
        </AppBar>

        <Box sx={{ flexGrow: 1, minHeight: 0 }}>
          <Map
            ref={mapRef}
            mapboxAccessToken={mapboxToken}
            initialViewState={{
              longitude: 137.5,
              latitude: 35.3,
              zoom: 6.3,
            }}
            mapStyle={currentMapStyle}
            onLoad={fitRouteBounds}
            style={{ width: "100%", height: "100%" }}
            attributionControl
          >
            <Source
              id={SHINKANSEN_SOURCE_ID}
              type="geojson"
              data={shinkansenRoute}
            >
              <Layer {...routeLineLayer} />
            </Source>

            {stationMarkers}

            {activeStation && (
              <Popup
                longitude={activeStation.coordinates[0]}
                latitude={activeStation.coordinates[1]}
                anchor="top"
                onClose={() => setActiveStation(null)}
                closeButton
                closeOnClick={false}
                offset={12}
              >
                <Typography variant="body2">{activeStation.name}</Typography>
              </Popup>
            )}
          </Map>
        </Box>
      </Box>
    </Box>
  );
}

export default App;
