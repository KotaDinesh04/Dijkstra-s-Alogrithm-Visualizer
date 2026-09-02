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


export let indices = new Map();
export let revIndices = new Map();
export let adjL = [];

// Build lookup maps for index <-> city name
export const buildIndices = () => {
    indices = new Map();
    revIndices = new Map();
    for (let i = 0; i < places.length; i++) {
        indices.set(places[i], i);
        revIndices.set(i, places[i]);
    }
};

// Build adjacency list for Dijkstra graph
export const buildAdjL = () => {
    adjL = Array.from({ length: places.length }, () => []);
    connections.forEach((con) => {
        const u = indices.get(con.from);
        const v = indices.get(con.to);
        if (u !== undefined && v !== undefined) {
            adjL[u].push({ v, distance: con.distance });
            adjL[v].push({ v: u, distance: con.distance });
        }
    });
};

// Initialize graph structures
buildIndices();
buildAdjL();

/**
 * Executes Dijkstra's Algorithm with a Min-Priority Queue.
 * @param {string} source - Origin city name
 * @param {string} destination - Target city name
 * @returns {{ path: string[], distance: number, found: boolean, error?: string }}
 */
export const getPath = (source, destination) => {
    if (!source || !destination) {
        return { path: [], distance: 0, found: false, error: "Please select both source and destination." };
    }
    if (!indices.has(source) || !indices.has(destination)) {
        return { path: [], distance: 0, found: false, error: "Invalid city selected." };
    }
    if (source === destination) {
        return { path: [source], distance: 0, found: true };
    }

    const srcIdx = indices.get(source);
    const destIdx = indices.get(destination);

    const parent = Array.from({ length: places.length }, (_, index) => index);
    const distances = new Array(places.length).fill(Infinity);
    distances[srcIdx] = 0;

    // Min-Priority Queue tracking { node, dist }
    const pq = [{ node: srcIdx, dist: 0 }];

    while (pq.length > 0) {
        // Always extract the node with the lowest tentative distance
        pq.sort((a, b) => a.dist - b.dist);
        const curr = pq.shift();

        // Skip stale entries
        if (curr.dist > distances[curr.node]) continue;

        // Early exit: destination reached with optimal distance
        if (curr.node === destIdx) break;

        for (const edge of adjL[curr.node]) {
            const nextDist = curr.dist + edge.distance;
            if (nextDist < distances[edge.v]) {
                distances[edge.v] = nextDist;
                parent[edge.v] = curr.node;
                pq.push({ node: edge.v, dist: nextDist });
            }
        }
    }

    if (distances[destIdx] === Infinity) {
        return { path: [], distance: Infinity, found: false, error: `No route exists between ${source} and ${destination}.` };
    }

    // Reconstruct shortest path from parent pointers
    const path = [];
    let curr = destIdx;
    path.push(revIndices.get(curr));
    while (curr !== srcIdx && curr !== parent[curr]) {
        curr = parent[curr];
        path.push(revIndices.get(curr));
    }
    path.reverse();

    return { path, distance: distances[destIdx], found: true };
};

/**
 * Generator that records every step of Dijkstra for visualizer animation.
 * @param {string} source
 * @param {string} destination
 * @returns {Array<Object>} List of step events
 */
export const getDijkstraSteps = (source, destination) => {
    if (!source || !destination || !indices.has(source) || !indices.has(destination)) {
        return [];
    }

    const srcIdx = indices.get(source);
    const destIdx = indices.get(destination);
    const steps = [];

    const parent = Array.from({ length: places.length }, (_, index) => index);
    const distances = new Array(places.length).fill(Infinity);
    const settled = new Set();
    distances[srcIdx] = 0;

    const pq = [{ node: srcIdx, dist: 0 }];
    steps.push({
        type: 'INIT',
        source,
        destination,
        message: `Initialized Dijkstra from ${source}`
    });

    while (pq.length > 0) {
        pq.sort((a, b) => a.dist - b.dist);
        const curr = pq.shift();
        const currPlace = revIndices.get(curr.node);

        if (curr.dist > distances[curr.node]) continue;

        settled.add(curr.node);
        steps.push({
            type: 'VISIT_NODE',
            node: currPlace,
            dist: curr.dist,
            settled: Array.from(settled).map(i => revIndices.get(i)),
            queue: pq.map(item => ({ city: revIndices.get(item.node), dist: item.dist })),
            message: `Visiting ${currPlace} (Shortest Distance: ${curr.dist} km)`
        });

        if (curr.node === destIdx) {
            steps.push({
                type: 'DESTINATION_REACHED',
                node: currPlace,
                dist: curr.dist,
                message: `Reached destination ${currPlace} in ${curr.dist} km!`
            });
            break;
        }

        for (const edge of adjL[curr.node]) {
            const nextPlace = revIndices.get(edge.v);
            const nextDist = curr.dist + edge.distance;

            if (nextDist < distances[edge.v]) {
                const oldDist = distances[edge.v];
                distances[edge.v] = nextDist;
                parent[edge.v] = curr.node;
                pq.push({ node: edge.v, dist: nextDist });

                steps.push({
                    type: 'RELAX_EDGE',
                    from: currPlace,
                    to: nextPlace,
                    edgeDistance: edge.distance,
                    oldDist: oldDist === Infinity ? '∞' : oldDist,
                    newDist,
                    message: `Relaxed edge ${currPlace} ➔ ${nextPlace}: Updated distance to ${nextDist} km`
                });
            }
        }
    }

    if (distances[destIdx] !== Infinity) {
        const path = [];
        let curr = destIdx;
        path.push(revIndices.get(curr));
        while (curr !== srcIdx && curr !== parent[curr]) {
            curr = parent[curr];
            path.push(revIndices.get(curr));
        }
        path.reverse();

        steps.push({
            type: 'COMPLETE',
            path,
            distance: distances[destIdx],
            message: `Shortest path found: ${path.join(' ➔ ')} (${distances[destIdx]} km)`
        });
    }

    return steps;
};
