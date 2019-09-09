// @TODO: YOUR CODE HERE!

// // reading csv data
let dataKeys = [];
let chartData = []; 


d3.csv("./assets/data/data.csv").then(function(data) {
    // to create an array of Keys to be observed 
    dataKeys = Object.keys(data[0]);
    // console.log(dataKeys);
    dataKeys.pop(); // to remove obsecure data point from the keys
    console.log(dataKeys);
    // console.log(dataKeys[0]); // to test index of array 

    // to parse csv data 
    data.forEach(function(d){
        // to fix data types of the numeric cols 
        d.id = +d.id; 
        for (i = 3; i <= dataKeys.length ; i++) {
            d[dataKeys[i]] = +d[dataKeys[i]];
        }
        // to remove obsecure data keys from the object 
        delete d["-0.385218228"];
        delete d["undefined"];
    console.log(d);
    // to assign finalized array to global variable and set the objects into an array
    chartData.push(d);
    })
}); 

// to view finalized data 
console.log('-------------')
console.log(chartData); 



// helpful cites
// Parsing csv data: http://learnjsdata.com/read_data.html
// removing properties from objects: https://stackoverflow.com/questions/3455405/how-do-i-remove-a-key-from-a-javascript-object