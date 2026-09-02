import React, { useState } from 'react'
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { places, getPath, cities } from '../Algo'
import { Button } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import 'leaflet/dist/leaflet.css';

const MainPage = () => {
    const indiaCoordinates = cities;

    const [route, setRoute] = useState([]);
    const [totalDistance, setTotalDistance] = useState(null);
    const [source, setSource] = useState("");
    const [destination, setDestination] = useState("");
    const [start, setStart] = useState(null);
    const [end, setEnd] = useState(null);

    const createMap = async () => {
        const result = getPath(source, destination);
        if (result && result.found) {
            setRoute(result.path);
            setTotalDistance(result.distance);
        } else {
            setRoute([]);
            setTotalDistance(null);
        }
    }

    const handleSourceChange = async (e, val) => {
        setSource(val || "");
    }
    const handleDestinationChange = async (e, val) => {
        setDestination(val || "");
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        await createMap(source, destination);
        if (start && end) {
            const diffInDays = end.diff(start, 'days');
            // console.log(diffInDays);
        }
    }


    return (
        <div className='main-container'>
            <div className="home-container">
                <form onSubmit={handleSubmit} className='home-form'>
                    <div className="home-inputs">

                        <Autocomplete
                            style={{ marginTop: "1vh" , backgroundColor: "white"}}
                            disablePortal
                            options={places}
                            id='source'
                            value={source}
                            sx={{ width: 259 }}
                            onChange={handleSourceChange}
                            renderInput={(params) => <TextField {...params} label="Source" />}
                        />
                        <Autocomplete
                            style={{ marginTop: "1vh" , backgroundColor: "white"}}
                            disablePortal
                            options={places}
                            value={destination}
                            id='destination'
                            sx={{ width: 259 }}
                            onChange={handleDestinationChange}
                            renderInput={(params) => <TextField {...params} label="Destination" />}
                        />
                        <div className="date-container">
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={['DatePicker']}>
                                    <DatePicker label="Start Date" value={start} onChange={(date) => setStart(date)}/>
                                </DemoContainer>
                            </LocalizationProvider>
                        </div>
                        <div className="date-container">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['DatePicker']}>
                                <DatePicker label="End Date" value={end} onChange={(date) => setEnd(date)} />
                            </DemoContainer>
                        </LocalizationProvider>

                        </div>
                    </div>
                    <div className="submit-btn">
                        <Button type='submit' variant='contained'>Submit</Button>
                    </div>
                </form>
            </div>
            <div className="map-container">
                <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ width: "100%", height: "100%" }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    {places && places.length > 0 && places.map((place) => {
                        const coords = indiaCoordinates[place];
                        if (coords) {
                            const [lat, lng] = coords;
                            return (
                                <Marker position={[lat, lng]} key={place}>
                                    <Popup>{place}</Popup>
                                </Marker>
                            );
                        }
                        return null;
                    })}
                    {route.length > 0 && (
                        <Polyline positions={route.map(node => indiaCoordinates[node])} color="red" />
                    )}
                </MapContainer>
            </div>
        </div>
    )
}

export default MainPage
