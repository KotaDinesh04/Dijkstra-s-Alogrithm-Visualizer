import React, { useState } from 'react'
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { indices, revIndices, adjL, places, getPath, connections } from '../Algo'
import { Button } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import 'leaflet/dist/leaflet.css';

const MainPage = () => {
    const indiaCoordinates = {
        "Delhi": [28.6139, 77.2090],
        "Agra": [27.1767, 78.0081],
        "Jaipur": [26.9124, 75.7873],
        "Mumbai": [19.0760, 72.8777],
        "Goa": [15.2993, 74.1240],
        "Chennai": [13.0827, 80.2707],
        "Bangalore": [12.9716, 77.5946],
        "Kolkata": [22.5726, 88.3639],
        "Darjeeling": [27.0415, 88.2622],
        "Varanasi": [25.3220, 82.9876],
        "Hyderabad": [17.3850, 78.4867],
        "Pune": [18.5204, 73.8567],
        "Amritsar": [31.6340, 74.8723],
        "Shimla": [31.1048, 77.1734],
        "Manali": [32.2396, 77.1887],
        "Leh": [34.1526, 77.5773],
        "Udaipur": [24.5854, 73.7125],
        "Rishikesh": [30.0869, 78.2676],
        "Haridwar": [29.9457, 78.1642],
        "Ooty": [11.4137, 76.6933],
        "Mysore": [12.2958, 76.6394],
        "Ahmedabad": [23.0225, 72.5714],
        "Surat": [21.1702, 72.8311],
        "Lucknow": [26.8467, 80.9462],
        "Patna": [25.5948, 85.1376],
        "Guwahati": [26.1445, 91.7362],
        "Shillong": [25.5788, 91.8933],
        "Kochi": [9.9312, 76.2673],
        "Thiruvananthapuram": [8.5241, 76.9366],
        "Jodhpur": [26.2389, 73.0247],
        "Ajmer": [26.4499, 74.6399],
        "Chandigarh": [30.7333, 76.7794],
        "Nagpur": [21.1458, 79.0882],
        "Indore": [22.7196, 75.8577],
        "Bhopal": [23.2599, 77.4126],
        "Raipur": [21.2514, 81.6296],
        "Agartala": [23.8315, 91.2868],
        "Gwalior": [26.2183, 78.1828],
        "Vijayawada": [16.5063, 80.6480],
        "Nagaland": [26.1584, 94.5624],  // Assuming Kohima as reference for Nagaland
        "Bhubaneswar": [20.2961, 85.8189],
        "Patiala": [30.3397, 76.3982],
        "Srinagar": [34.0836, 74.7973],
        "Chandrapur": [19.9611, 79.2906],
        "Jammu": [32.7266, 74.8570],
        "Tirunelveli": [8.7101, 77.7261],
        "Mangalore": [12.9141, 74.8560],
        "Ranchi": [23.3441, 85.3096],
        "Udhampur": [32.9375, 75.1458],
        "Rourkela": [22.2607, 84.7904],
        "Dhanbad": [23.8006, 86.4392],
        "Kozhikode": [11.2588, 75.7804],
        "Gokarna": [14.5551, 74.3128],
        "Madurai": [9.9250, 78.1193],
        "Pondicherry": [11.9416, 79.8083],
        "Kullu": [32.0007, 77.1051],
        "Tirupati": [13.6288, 79.4192],
        "Kanchipuram": [12.8315, 79.7066],
        "Khajuraho": [24.8510, 79.9197],
        "Chikmagalur": [13.3177, 75.7805],
        "Mahabalipuram": [12.6190, 80.2203],
        "Coimbatore": [11.0168, 76.9558],
        "Varkala": [8.7331, 76.7166],
        "Kumarakom": [9.6003, 76.5228],
        "Alleppey": [9.4981, 76.3388],
        "Hampi": [15.3350, 76.4610],
        "Jaisalmer": [26.9124, 70.9115],
        "Kedarnath": [30.7333, 79.0700],
        "Nainital": [29.3793, 79.4543],
        "Bikaner": [28.0220, 73.3114],
        "Cherrapunji": [25.2914, 91.7362],
        "Chirala": [15.8314, 80.3667],
        "Bardez": [15.5561, 73.7516],  // Assuming Goa as reference for Bardez
        "Pondicherry": [11.9416, 79.8083],
        "Chikmagalur": [13.3177, 75.7805],
        "Tawang": [27.5577, 91.8619]
    };
    

    const [route, setRoute] = useState([]);
    const [source, setSource] = useState("");
    const [destination, setDestination] = useState("");
    const [start, setStart] = useState(null);
    const [end, setEnd] = useState(null);

    const createMap = async () => {
        let path = await getPath(source, destination);
        setRoute(path);
    }

    const handleSourceChange = async (e, val) => {
        setSource(val);
    }
    const handleDestinationChange = async (e, val) => {
        setDestination(val);
    }





    const handleSubmit = async (e) => {
        e.preventDefault();
        await createMap(source, destination);
        const diffInDays = end.diff(start, 'days');
        // console.log(diffInDays);
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
