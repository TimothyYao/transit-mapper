import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import mapboxgl from "mapbox-gl";
import "../styles/map.css";

const TOKYO_CENTER = [139.6503, 35.6762];
const TOKYO_ZOOM = 11;

const TRANSIT_SOURCE_ID = "transit-placeholder-source";
const TRANSIT_LAYER_ID = "transit-placeholder-layer";

const TRANSIT_PLACEHOLDER_DATA = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "Future Transit Line" },
      geometry: {
        type: "LineString",
        coordinates: [
          [139.7006, 35.6896], // Shinjuku
          [139.7671, 35.6812], // Tokyo
          [139.8107, 35.7101], // Ueno
        ],
      },
    },
  ],
};

const PLACE_LOOKUP = {
  shinjuku: [139.7006, 35.6896],
  shibuya: [139.7016, 35.6598],
  "tokyo station": [139.7671, 35.6812],
  ueno: [139.7774, 35.7128],
  ikebukuro: [139.711, 35.7289],
  ginza: [139.7638, 35.6717],
};

const normalizeQuery = (query) => query.trim().toLowerCase();

const TransitMap = forwardRef(function TransitMap(_props, ref) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;

  useEffect(() => {
    if (!mapboxToken || !mapContainerRef.current) {
      return undefined;
    }

    mapboxgl.accessToken = mapboxToken;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: TOKYO_CENTER,
      zoom: TOKYO_ZOOM,
      dragRotate: false,
      touchPitch: false,
      antialias: true,
    });

    mapRef.current = map;

    map.on("load", () => {
      if (!map.getSource(TRANSIT_SOURCE_ID)) {
        map.addSource(TRANSIT_SOURCE_ID, {
          type: "geojson",
          data: TRANSIT_PLACEHOLDER_DATA,
        });
      }

      if (!map.getLayer(TRANSIT_LAYER_ID)) {
        map.addLayer({
          id: TRANSIT_LAYER_ID,
          type: "line",
          source: TRANSIT_SOURCE_ID,
          paint: {
            "line-color": "#1976d2",
            "line-width": 4,
            "line-opacity": 0.85,
          },
        });
      }
    });

    return () => {
      mapRef.current = null;
      map.remove();
    };
  }, [mapboxToken]);

  useImperativeHandle(
    ref,
    () => ({
      recenter() {
        if (!mapRef.current) {
          return;
        }

        mapRef.current.easeTo({
          center: TOKYO_CENTER,
          zoom: TOKYO_ZOOM,
          duration: 800,
        });
      },
      search(query) {
        if (!mapRef.current) {
          return;
        }

        if (!query) {
          mapRef.current.easeTo({
            center: TOKYO_CENTER,
            zoom: TOKYO_ZOOM,
            duration: 800,
          });
          return;
        }

        const normalizedQuery = normalizeQuery(query);
        const coordinateMatch = normalizedQuery.match(
          /^(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)$/,
        );

        if (coordinateMatch) {
          const latitude = Number.parseFloat(coordinateMatch[1]);
          const longitude = Number.parseFloat(coordinateMatch[2]);

          if (
            Number.isFinite(latitude) &&
            Number.isFinite(longitude) &&
            Math.abs(latitude) <= 90 &&
            Math.abs(longitude) <= 180
          ) {
            mapRef.current.flyTo({
              center: [longitude, latitude],
              zoom: 12.5,
              duration: 900,
            });
          }
          return;
        }

        const placeCenter = PLACE_LOOKUP[normalizedQuery];
        if (placeCenter) {
          mapRef.current.flyTo({
            center: placeCenter,
            zoom: 13,
            duration: 900,
          });
        }
      },
    }),
    [],
  );

  if (!mapboxToken) {
    return (
      <section className="map-error">
        VITE_MAPBOX_TOKEN is missing. Add it to your environment before running
        the app.
      </section>
    );
  }

  return (
    <section className="map-wrapper">
      <div ref={mapContainerRef} className="map-container" />
    </section>
  );
});

export default TransitMap;
