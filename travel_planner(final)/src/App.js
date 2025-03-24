import './App.css';
import { useState } from 'react';
import { Nav } from './home_components/index'
import Router from './Router';
import { useJsApiLoader, LoadScript } from "@react-google-maps/api";
import { LoadScriptProvider } from './LoadScriptContext';

const libraries = ["places", "maps"];

function App() {
  const [location, setLocation] = useState(null);

  // const { isLoaded } = useJsApiLoader({
  //   id: 'google-map-script',
  //   googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  //   libraries,
  //   region: 'KR',
  //   language: 'ko',
  // });


  return (
    <LoadScript
      googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
      libraries={libraries}
      region='KR'
      language='ko'>
      <LoadScriptProvider value={{ location, setLocation }}>
        <div className="App">
          <Nav />
          <Router />
        </div>
      </LoadScriptProvider>
    </LoadScript>
  );
}

export default App;
