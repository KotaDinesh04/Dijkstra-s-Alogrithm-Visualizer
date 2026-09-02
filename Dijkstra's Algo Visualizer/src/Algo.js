export const cities = {
    "Delhi": [28.6139, 77.2090],
    "Chandigarh": [30.7333, 76.7794],
    "Amritsar": [31.6340, 74.8723],
    "Jaipur": [26.9124, 75.7873],
    "Agra": [27.1767, 78.0081],
    "Lucknow": [26.8467, 80.9462],
    "Varanasi": [25.3220, 82.9876],
    "Patna": [25.5948, 85.1376],
    "Kolkata": [22.5726, 88.3639],
    "Bhubaneswar": [20.2961, 85.8189],
    "Ahmedabad": [23.0225, 72.5714],
    "Mumbai": [19.0760, 72.8777],
    "Pune": [18.5204, 73.8567],
    "Goa": [15.2993, 74.1240],
    "Bhopal": [23.2599, 77.4126],
    "Nagpur": [21.1458, 79.0882],
    "Hyderabad": [17.3850, 78.4867],
    "Bangalore": [12.9716, 77.5946],
    "Chennai": [13.0827, 80.2707],
    "Kochi": [9.9312, 76.2673]
};

export const places = Object.keys(cities);

export const connections = [
    // North Corridor
    { from: "Delhi", to: "Chandigarh", distance: 240 },
    { from: "Delhi", to: "Jaipur", distance: 270 },
    { from: "Delhi", to: "Agra", distance: 230 },
    { from: "Delhi", to: "Lucknow", distance: 550 },
    { from: "Chandigarh", to: "Amritsar", distance: 230 },
    { from: "Jaipur", to: "Agra", distance: 240 },
    { from: "Jaipur", to: "Ahmedabad", distance: 660 },

    // Central & East Corridor
    { from: "Agra", to: "Lucknow", distance: 330 },
    { from: "Agra", to: "Bhopal", distance: 580 },
    { from: "Lucknow", to: "Varanasi", distance: 320 },
    { from: "Varanasi", to: "Patna", distance: 280 },
    { from: "Varanasi", to: "Kolkata", distance: 680 },
    { from: "Varanasi", to: "Bhopal", distance: 790 },
    { from: "Patna", to: "Kolkata", distance: 580 },
    { from: "Kolkata", to: "Bhubaneswar", distance: 440 },
    { from: "Bhubaneswar", to: "Chennai", distance: 1220 },
    { from: "Bhubaneswar", to: "Hyderabad", distance: 1050 },

    // West Corridor
    { from: "Ahmedabad", to: "Mumbai", distance: 530 },
    { from: "Ahmedabad", to: "Bhopal", distance: 590 },
    { from: "Mumbai", to: "Pune", distance: 150 },
    { from: "Mumbai", to: "Goa", distance: 580 },
    { from: "Mumbai", to: "Nagpur", distance: 820 },
    { from: "Pune", to: "Hyderabad", distance: 560 },
    { from: "Pune", to: "Goa", distance: 450 },

    // Central Crossroads
    { from: "Bhopal", to: "Nagpur", distance: 350 },
    { from: "Nagpur", to: "Hyderabad", distance: 500 },
    { from: "Nagpur", to: "Kolkata", distance: 1120 },

    // South Corridor
    { from: "Goa", to: "Bangalore", distance: 560 },
    { from: "Goa", to: "Kochi", distance: 750 },
    { from: "Hyderabad", to: "Bangalore", distance: 570 },
    { from: "Hyderabad", to: "Chennai", distance: 630 },
    { from: "Bangalore", to: "Chennai", distance: 350 },
    { from: "Bangalore", to: "Kochi", distance: 540 },
    { from: "Chennai", to: "Kochi", distance: 690 }
];


export let adjL = [];
export let indices = new Map();
export let revIndices = new Map();
export let distances = []
export let parent = []

//Fuctions:
const buildIndices = ()=>{
    for(let i=0; i<places.length; i++) {
        indices.set(places[i],i);
        revIndices.set(i,places[i]);
    }
    // console.log(indices);
    // console.log(revIndices);
}

const buildAdjL = ()=>{
    adjL = Array.from({length:places.length},()=>[]);
    connections.forEach((con)=>{
        adjL[indices.get(con.from)].push(new Edge(indices.get(con.to),con.distance));
        adjL[indices.get(con.to)].push(new Edge(indices.get(con.from),con.distance));
    });
    // console.log(adjL);
}

const buildDisatanceArr = (source)=>{
    parent = Array.from({length: places.length},(_,index)=>index);
    distances = new Array(places.length).fill(Infinity);
    distances[source] = 0;
    const pq = [new Pair(source,0)];
    while(pq.length > 0) {
        const curr = pq.shift();
        adjL[curr.node].forEach((neg)=>{
            if(neg.distance + curr.dist < distances[neg.v]) {
                distances[neg.v] = neg.distance + curr.dist;
                pq.push(new Pair(neg.v,distances[neg.v]));
                parent[neg.v] = curr.node;
            }
        });
    }
    // console.log(parent);
}

export const getPath = (source,destination) =>{
    buildDisatanceArr(indices.get(source));
    let path = [];
    let node = indices.get(destination);
    path.push(revIndices.get(node));
    while(node != parent[node]) {
        path.push(revIndices.get(parent[node]));
        node = parent[node];
    }
    path.reverse();
    // path.forEach((i)=>{
    //     console.log(revIndices.get(i));
    // });
    // console.log(path);
    return path;
}


//Classes:
class Edge {
    constructor(v,distance) {
        this.v = v;
        this.distance = distance;
    }
}

class Pair {
    constructor(node,dist) {
        this.node = node;
        this.dist = dist;
    }
}

//Function calls
const main = ()=>{
    buildIndices();
    buildAdjL();
    //getPath("Delhi","Mumbai");
}

main();
