// @TODO: YOUR CODE HERE!

// Step 1: Create SVG Canvas
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);


// Step 2: Read CSV data

d3.csv("./assets/data/data.csv").then(function(data) {

    // variables 
    let dataKeys = [];
    const chartData = [];


    // to create an array of Keys to be observed 
        dataKeys = Object.keys(data[0]);
    // console.log(dataKeys);
         dataKeys.pop(); // to remove obsecure data point from the keys
        console.log(dataKeys);
    // console.log(dataKeys[0]); // to test index of array 

    // Step 3: Parse Data/Cast as numbers
    // ==============================
        data.forEach(function(d){
            // to fix data types of the numeric cols 
            d.id = +d.id; 
            for (i = 3; i <= dataKeys.length ; i++) {
             d[dataKeys[i]] = +d[dataKeys[i]];
            };
    // to remove obsecure data keys from the object 
        delete d["-0.385218228"];
        delete d["undefined"];
        delete d["columns"];
        
        // console.log(d);
       chartData.push(d);
    });


    // console.log('-----data object--------')
    // finalized data for chart
    console.log(`Length of Chart Data: ${chartData.length}`);
    console.log(chartData);

/**
 * Our Objective is to make a response multi-axis graph for the following items:
 * x-axis: In Poverty(%) | Age (Median) | Household Income (Median)
 * y-axis: Lacks Healthcare (%) | Smokes (%) | Obese (%)
 * 
 * The values will the be the states abbreviations
 */
  
      // Step 4: Create scale functions
      // ==============================
      var xLinearScale = d3.scaleLinear()
        .domain([8, d3.max(chartData, d => d.poverty)])
        .range([10, width]);
  
      var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(chartData, d => d.healthcareHigh)])
        .range([height, 0]);
  
      // Step 5: Create axis functions
      // ==============================
      var bottomAxis = d3.axisBottom(xLinearScale);
      var leftAxis = d3.axisLeft(yLinearScale);
  
      // Step 6: Append Axes to the chart
      // ==============================
      chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);
  
      chartGroup.append("g")
        .call(leftAxis);

    // Step 7: Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
    .data(chartData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcareHigh))
    .attr("r", "15")
    .attr("fill", "pink")
    .attr("opacity", ".5");

    
    // Step 8: Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.abbr}<br>Hair length: ${d.poverty}<br>Hits: ${d.healthcareHigh}`);
      });

    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("click", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

    // Create axes labels
    //// Title Label
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Lacks Healthcare (%)");

    //// X-axis Label
    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("In Poverty (%)");

}); 







// helpful cites
// Parsing csv data: http://learnjsdata.com/read_data.html
// removing properties from objects: https://stackoverflow.com/questions/3455405/how-do-i-remove-a-key-from-a-javascript-object