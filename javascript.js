
document.getElementById("addsale").addEventListener("click", function() {
    document.getElementById("overlay").style.display = "block";
});


// CHARTS //

function plotChart(data) {
    const xField = document.getElementById("xAxis").value;
    const yField = document.getElementById("yAxis").value;

    const width = 928;
    const height = 400;
    const marginTop = 20;
    const marginRight = 30;
    const marginBottom = 30;
    const marginLeft = 40;

    // Group data by `xField` and sum `yField`
    const groupedData = Array.from(
        d3.group(data, d => d[xField]),
        ([key, values]) => ({
            [xField]: key, // Grouping field value
            [yField]: d3.sum(values, d => +d[yField] || 0) // Sum the `yField` values
        })
    );

    if (xField === 'date') {
        groupedData.sort((a, b) => new Date(a[xField]) - new Date(b[xField]));
    }

    const x = (xField === 'date')
        ? d3.scaleUtc()
            .domain(d3.extent(groupedData, d => new Date(d[xField])))
            .range([marginLeft, width - marginRight])
        : d3.scalePoint() // Using scalePoint for categorical fields
            .domain(groupedData.map(d => d[xField]))
            .range([marginLeft, width - marginRight])
            .padding(0.5);

    const y = d3.scaleLinear()
        .domain([0, d3.max(groupedData, d => +d[yField] || 0)]) // Using grouped data for max value
        .range([height - marginBottom, marginTop]);

    // Set up the line generator based on the grouped data
    const line = d3.line()
        .defined(d => d[xField] && d[yField]) // Only plot points with valid data
        .x(d => x(xField === 'date' ? new Date(d[xField]) : d[xField]))
        .y(d => y(+d[yField] || 0));

    // Create SVG container
    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

    // Add the x-axis
    svg.append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(d3.axisBottom(x).ticks(width / 80).tickFormat(d3.timeFormat("%b %d,%Y")).tickSizeOuter(0));

    // Add the y-axis
    svg.append("g")
        .attr("transform", `translate(${marginLeft},0)`)
        .call(d3.axisLeft(y).ticks(height / 40))
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick line").clone()
            .attr("x2", width - marginLeft - marginRight)
            .attr("stroke-opacity", 0.1));

    // Append the line path using grouped data
    svg.append("path")
        .datum(groupedData)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", line);

    // Clear previous chart if present
    document.getElementById("chart").innerHTML = "";
    // Append the new chart to the #chart container
    document.getElementById("chart").appendChild(svg.node());
}

document.getElementById("plotChart").addEventListener("click", function () {
    plotChart(mysalesrecord); // Passing the mysalesrecord array to the chart function
});

// BAR CHART //

// function filters a dataset to include only the records that match a specific month and year//
function filterByMonth(data, month) {
    if (!month) return data; // No filter applied
    const [year, monthNum] = month.split("-");
    return data.filter(d => {
        const recordDate = new Date(d.date);
        return (
            recordDate.getFullYear() === +year && recordDate.getMonth() + 1 === +monthNum
        );
    });
}

function plotBarChart(data) {
    const xField = document.getElementById("xFieldBarChart").value; // Dynamic field (e.g., state, item)
    const month = document.getElementById("filterMonth").value; // Filter month

    console.log("Plotting bar chart for xField:", xField, "Filtered by month:", month);

    // Apply month filter
    const filteredData = filterByMonth(data, month);

    // Group data by the selected `xField` and calculate cumulative counts
    const groupedData = Array.from(
        d3.group(filteredData, d => d[xField]),
        ([key, values]) => ({
            [xField]: key, // Grouping field value (e.g., item, discount)
            count: values.length, // Counts occurrences
            quantity: d3.sum(values, d => +d.quantity || 0) // Sum quantities if needed
        })
    );

    const width = 928;
    const height = 500;
    const marginTop = 20;
    const marginRight = 30;
    const marginBottom = 30;
    const marginLeft = 40;

    // Define scales
    const x = d3.scaleBand()
        .domain(groupedData.map(d => d[xField])) // Used groupedData to define domain
        .range([marginLeft, width - marginRight])
        .padding(0.1);

        const y = d3.scaleLinear()
        .domain([0, d3.max(groupedData, d => d.quantity)]) // Used `count` for non-quantity fields
        .range([height - marginBottom, marginTop]);

    // Create SVG container
    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto;");

    // Draw bars
    svg.append("g")
        .attr("fill", "#bfdbfe")
        .selectAll("rect")
        .data(groupedData) 
        .join("rect")
        .attr("x", d => x(d[xField]))
        .attr("y", d => y(d.quantity)) 
        .attr("height", d => y(0) - y(+d.quantity))
        .attr("width", x.bandwidth());

    // Add x-axis
    svg.append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(d3.axisBottom(x).tickSizeOuter(0));

    // Add y-axis
    svg.append("g")
        .attr("transform", `translate(${marginLeft},0)`)
        .call(d3.axisLeft(y))
        .call(g => g.select(".domain").remove());

    // Clear previous bar chart
    document.getElementById("barChart").innerHTML = "";
    document.getElementById("barChart").appendChild(svg.node());
}
document.getElementById("plotBarChart").addEventListener("click", function () {
    plotBarChart(mysalesrecord); // Passed the mysalesrecord array to the chart function
});


// BUBBLE MAP //
// Load the TopoJSON data and Ensure US data is loaded into the function calculateOrderCountsByState() {
// Calculate order counts by state

 // Function to calculate order counts by state
 
 function calculateOrderCountsByState() {
    const orderCountsByState = new Map();

    mysalesrecord.forEach(d => {
        const state = d.usstate.replace(/^"|"$/g, '').trim(); // State format
        const quantity = +d.quantity || 0; // Ensuring quantity is numeric
        if (orderCountsByState.has(state)) {
            orderCountsByState.set(state, orderCountsByState.get(state) + quantity);
        } else {
            orderCountsByState.set(state, quantity);
        }
    });

    console.log("Contents of mysalesrecord:", mysalesrecord);
    console.log("Order Counts by State (Sales Volume):", Array.from(orderCountsByState.entries())); // Check this in console

    return orderCountsByState;
}



function plotMap() {

    d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json").then(us => { 
        console.log("IDs in TopoJSON:", us.objects.states.geometries.map(d => d.id));
        
        const stateOrderCountsMap = calculateOrderCountsByState();

        // Map state IDs to state names for easier lookup
        const idToStateNameMap = {
            "01": "Alabama", "02": "Alaska", "04": "Arizona", "08": "Colorado", "12": "Florida",
            "13": "Georgia", "18": "Indiana", "20": "Kansas", "23": "Maine", "25": "Massachusetts",
            "27": "Minnesota", "34": "New Jersey", "37": "North Carolina", "38": "North Dakota", "40": "Oklahoma",
            "42": "Pennsylvania", "46": "South Dakota", "48": "Texas", "56": "Wyoming", "09": "Connecticut",
            "29": "Missouri", "54": "West Virginia", "17": "Illinois", "35": "New Mexico", "05": "Arkansas",
            "06": "California", "10": "Delaware", "11": "District of Columbia", "15": "Hawaii", "19": "Iowa",
            "21": "Kentucky", "24": "Maryland", "26": "Michigan", "28": "Mississippi", "30": "Montana",
            "33": "New Hampshire", "36": "New York", "39": "Ohio", "41": "Oregon", "47": "Tennessee",
            "49": "Utah", "51": "Virginia", "53": "Washington", "55": "Wisconsin", "60": "American Samoa",
            "66": "Guam", "69": "Northern Mariana Islands", "31": "Nebraska", "45": "South Carolina", "72": "Puerto Rico",
            "78": "Virgin Islands", "16": "Idaho", "32": "Nevada", "50": "Vermont", "22": "Louisiana", "44": "Rhode Island"
        };

        // Transform the entire states object to GeoJSON once
        const statesGeoJSON = topojson.feature(us, us.objects.states);

        // Prepare data array with state names and order counts
        const data = Array.from(stateOrderCountsMap, ([state, population]) => {
            // Find the state ID based on the state name in idToStateNameMap
            const stateId = Object.keys(idToStateNameMap).find(id => idToStateNameMap[id] === state);
            
            // Log a warning if stateId is not found
            if (!stateId) {
                console.warn(`No matching ID found for state name: ${state}`);
                return null;
            }

            // Look up the specific state feature by ID
            const geometry = statesGeoJSON.features.find(f => f.id === stateId);
        
            if (!geometry) {
                console.warn(`No geometry found for state: ${state} with ID: ${stateId}`);
                return null;
            }
        
            // Return state, population, and geometry
            return { state, population, geometry };
        }).filter(d => d !== null);  // Filters out any null values
      
        console.log("Data array for bubbles with geometry check:", data);

        const radius = d3.scaleSqrt()
            .domain([0, d3.max(data, d => d.population)])
            .range([0, 40]);

        // Set up path generator with Albers USA projection for correct scaling
        const projection = d3.geoAlbersUsa().scale(1300).translate([487.5, 305]);
        const path = d3.geoPath(projection);

        const mapSvg = d3.create("svg")
            .attr("width", 975)
            .attr("height", 610)
            .attr("viewBox", [0, 0, 975, 610])
            .attr("style", "width: 100%; height: auto;");

        const tooltip = d3.select("body")
            .append("div")
            .attr("class", "tooltip")
            .style("position", "absolute")
            .style("background", "rgba(40, 67, 135, 0.7)")
            .style("color", "#fff")
            .style("padding", "5px")
            .style("border-radius", "5px")
            .style("pointer-events", "none")
            .style("opacity", 0);
           

        // Draw the U.S. map background (nation)
        mapSvg.append("path")
            .datum(topojson.feature(us, us.objects.nation))
            .attr("fill", "#bfdbfe")
            .attr("d", path);

        // Draw state borders
        mapSvg.append("path")
            .datum(topojson.mesh(us, us.objects.states, (a, b) => a !== b))
            .attr("fill", "none")
            .attr("stroke", "white")
            .attr("stroke-linejoin", "round")
            .attr("d", path);

        // Draw bubbles for each state
        mapSvg.append("g")
            .attr("fill", "#1d4ed8")
            .attr("fill-opacity", 0.4)
            .attr("stroke", "#1d4ed8")
            .attr("stroke-width", 0.5)
          .selectAll("circle")
          .data(data)
          .join("circle")
            .attr("transform", d => {
                const centroid = d3.geoCentroid(d.geometry);  // Use d3.geoCentroid directly on the GeoJSON feature
                console.log("Centroid for", d.state, ":", centroid);  // Log valid centroids
                return `translate(${projection(centroid)})`;
            })
            
            .attr("r", d => radius(d.population))
    // Add interactive tooltip behavior
    .on("mouseover", (event, d) => {
        tooltip
            .style("opacity", 1)
            .html(`<strong>${d.state}</strong><br>Sales Volume: ${d.population}`)
            .style("left", `${event.pageX + 10}px`)
            .style("top", `${event.pageY + 10}px`);
    })
    .on("mouseout", () => {
        tooltip.style("opacity", 0);
    });

            

        document.getElementById("mapContainer").innerHTML = "";
        document.getElementById("mapContainer").appendChild(mapSvg.node());

    }).catch(error => {
        console.error("Error loading TopoJSON or generating map:", error);
    });
    
}

// Function for the pop form where you will enter the Data about sales

function closePopup() {
    document.getElementById("overlay").style.display = "none";
}
const mysalesrecord= [];

document.getElementById("addnclose").addEventListener("click", function () {
    let sale = {
        date: document.getElementById("datenum").value,
        customer: document.getElementById("cst").value,
        quantity: document.getElementById("qty").value,
        usstate: document.getElementById("ste").value,
        discount: document.getElementById("disc").value,
        item: document.getElementById("itm").value
    };
    
    mysalesrecord.push(sale);

// Create a new HTML element to display this entry
  let entryRow = document.createElement("tr");

// Set up each cell in the row
  entryRow.innerHTML = `
      <td>${sale.date}</td>
      <td>${sale.customer}</td>
      <td>${sale.quantity}</td>
      <td>${sale.usstate}</td>
      <td>${sale.discount}</td>
      <td>${sale.item}</td>
      <td>
            <div class="actions">
                 <button type="button" class="edit-button">Edit</button>
                 <button type="button" class="done-button">Done</button>
                 <button type="button" class="delete-button">Delete</button>
            </div>
      </td>
  `;

// Append the new row to the table body
document.getElementById("tableBody").appendChild(entryRow);

// Retrieve buttons inside entryRow
const editButton = entryRow.querySelector(".edit-button");
const doneButton = entryRow.querySelector(".done-button");
const deleteButton = entryRow.querySelector(".delete-button");

// Add event listener for editing
editButton.addEventListener("click", function() {
    entryRow.contentEditable = true;
    entryRow.style.backgroundColor = "#ffedd5"; 
});

// Add event listener for ending editing
    doneButton.addEventListener("click", function() {
    entryRow.contentEditable = false;
    entryRow.style.backgroundColor = "";

 // Update mysalesrecord with the modified values
    const index = [...entryRow.parentNode.children].indexOf(entryRow);
    mysalesrecord[index] = {
        date: entryRow.cells[0].textContent,
        customer: entryRow.cells[1].textContent,
        quantity: +entryRow.cells[2].textContent,
        usstate: entryRow.cells[3].textContent,
        discount: entryRow.cells[4].textContent,
        item: entryRow.cells[5].textContent
    };
    plotMap(); 
});

deleteButton.addEventListener("click", function() {
    const index = [...entryRow.parentNode.children].indexOf(entryRow);
    mysalesrecord.splice(index, 1); // Remove from mysalesrecord
    entryRow.remove(); // Remove the row from the table
     // Re-plot the map after deleting the entry
     plotMap(); 
});

plotMap();

});