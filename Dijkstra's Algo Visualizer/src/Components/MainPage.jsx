import React, { useState } from 'react'
import { indices, revIndices, adjL, places, getPath, connections } from '../Algo'
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
        "Raipur": [21.2514, 81.6296]
    };

    const [route, setRoute] = useState([]);
    const [source, setSource] = useState("");
    const [destination, setDestination] = useState("");

    const createMap = async() => {
        let path = await getPath(source, destination);
        //console.log(adjL);
        console.log(path);
    }

    const handleSourceChange = async(e) => {
        setSource(e.target.value); 
        //console.log(source);      
    }
    const handleDestinationChange = async(e) => {
        setDestination(e.target.value); 
        //console.log(destination);      
    }

    const handleSubmit = async(e) => {
        e.preventDefault();
        createMap(source, destination);
        console.log(source, destination);
    }


    return (
        <div>
            <form action="/">
                <input type="text" id='source' onChange={handleSourceChange}/>
                <input type="text" id='destination' onChange={handleDestinationChange}/>
                <button type='submit' onClick={handleSubmit}>Click</button>
            </form>
        </div>
    )
}

export default MainPage
