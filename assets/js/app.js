// @TODO: YOUR CODE HERE!

// Step 1: Create SVG Canvas
var svgWidth = 940;
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
// ==============================
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
        .domain([5, d3.max(chartData, d => d.poverty)])
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
    
    // Step 7: Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .attr("text-align","center")
      .offset([80, -60])
      .html(function(d) {
        return (`<b><u>${d.abbr}</u></b>
                 <br>Poverty: ${d.poverty}%
                 <br>Healthcare: ${d.healthcareHigh}%`);
      });

    
    // Step 8: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    // Set the radius for each dot that will appear in the graph.
    // Note: Making this a function allows us to easily call
    // it in the mobility section of our code.
    var circRadius;
    function crGet() {
    circRadius = 15;
    }
    crGet();


    // Step 9: Create Circles
    // ==============================

    // Grouping for our dots and their labels.
    var circlesGroup = svg.selectAll("g theCircles").data(chartData).enter();


    //Step 10: To create circles for data point in scatter plot
    circlesGroup = chartGroup.selectAll("circle")
    .data(chartData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcareHigh))
    .attr("r", circRadius)
    .attr("fill", "steelblue")
    .attr("opacity", ".8")
    .attr("class", function(d) {
      return "stateCircle " + d.abbr;})
    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    //Hover rules
    .on("mouseover", function(d) {
      // Show the tooltip
      toolTip.show(d, this);
      // Highlight the state circle's border
      d3.select(this).style("stroke", d3.color("#000000"));
    })
    .on("mouseout", function(d) {
      // Remove the tooltip
      toolTip.hide(d);
      // Remove highlight
      d3.select(this).style("stroke", "#e3e3e3");
    });




  //Step 11: To append state abbr to circle scatter data points
  // ==============================
   circlesGroup = chartGroup.selectAll("text")
    .data(chartData)
    .enter()
    .append("text")
    // We return the abbreviation to .text, which makes the text the abbreviation.
    .text((d) => {
      console.log(d.abbr)
      return d.abbr;
    })
    // // Now place the text using our scale.
    .attr("dx", function(d) {
      return xLinearScale(d["poverty"]);
    })
    .attr("dy", function(d) {
      // When the size of the text is the radius,
      // adding a third of the radius to the height
      // pushes it into the middle of the circle.
      return yLinearScale(d["healthcareHigh"]) + circRadius / 2.5;
    })
    .attr("font-size", 8)
    .attr("fill","white")
    .attr("text-anchor","middle");




  //Step 12: To create D3 Axes
  // ==============================
  // Create axes labels
  //// Title Label
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText text-center")
      .attr("style", "font-weight:bold" )
      .text(" Lacks Healthcare (%)");

    //// X-axis Label
    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText text-center")
      .attr("style", "font-weight:bold")
      .text("In Poverty (%)");

}); 




// helpful cites
// Parsing csv data: http://learnjsdata.com/read_data.html
// removing properties from objects: https://stackoverflow.com/questions/3455405/how-do-i-remove-a-key-from-a-javascript-object