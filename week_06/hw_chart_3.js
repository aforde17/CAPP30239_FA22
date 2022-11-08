var monthData = [];

var margin = {top: 20, right: 20, bottom: 30, left: 50};
var width  = 800 - margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;
    padding = 1;

let timeParse = d3.timeParse("%m/%d/%Y");

// Create the SVG drawing area
var svg = d3.select("body")
          .append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Get the data
d3.json('a3cleanedonly2015.json').then((data) => {

    // Parse into var constructionData

    for (let d of data) {
        d.Date = timeParse(d.Date); // using timeParse function we created above
        d.Month = d3.timeMonth(d.Date); // Group by month
    }
    // $.each(data, function (index, element) {

    //     element.date = parseTime(element.date)
    //     el

    //     monthData.push({
    //         'date': parseTime(element.date),
    //         'value': element.value
    //     })
    // });

    monthData = Array.from(d3.flatRollup(data, v => v.length, d => d.Month),
    ([month, deaths]) => ({month:month, deaths:deaths}));

    console.log(monthData)

    // Determine the first and last dates in the data set
    var dayExtent = d3.extent(monthData, function (d) { return d.month; });

    console.log(dayExtent)
    // Create one bin per day, use an offset to include the first and last days
    var dayBins = d3.timeMonths(d3.timeMonth.offset(dayExtent[0],-1),
                              d3.timeMonth.offset(dayExtent[1], 1));

    console.log(dayBins)
    var x = d3.scaleTime()
                .domain(dayExtent)
                .rangeRound([0, width]);

    // Scale the range of the data in the y domain
    var y = d3.scaleLinear()
		   	    .domain([0, 150])		   
               .range([height, 0]);

    var xAxis = d3.axisBottom(x)
                   .tickArguments([d3.timeMonth.every(1)]);

    // Set the parameters for the histogram
    var histogram = d3.histogram()
                       .value(function(d) { return d.month; })
                       .domain(x.domain())
                       .thresholds(x.ticks(dayBins.length));

    // Group the data for the bars
    var bins = histogram(monthData);



    // Append the bar rectangles to the svg element
    svg.selectAll("rect")
         .data(bins)
         .enter().append("rect")
         .attr("class", "bar")
         .attr("x", d => x(d.x0) + (padding / 2))
         .attr("y", d => y(d.length))
         .attr("width", d => x(d.x1) - x(d.x0))
         .attr("height", d => height - y(d.length))
         .attr("fill", "steelblue");

    // Add the x axis
    svg.append("g")
         .attr("transform", "translate(0," + height + ")")
         .call(xAxis);

    // Add the y axis
    svg.append("g")
         .call(d3.axisLeft(y).ticks(d3.max(bins, function(d) { return d.length; })))
         .append("text")
         .attr("fill", "#000")
         .attr("transform", "rotate(-90)")
         .attr("y", 6)
         .attr("dy", "0.71em")
         .style("text-anchor", "end")
         .text("Number of events");        
});



// // Simple Histogram

// var margin = {top: 10, right: 30, bottom: 30, left: 50},
// width = 960 - margin.left - margin.right,
// height = 500 - margin.top - margin.bottom;


// // var formatDate = d3.time.format("%m/%y");
// // var formatCount = d3.format(",.0f");


// // var xAxis = d3.svg.axis().scale(x)
// // .orient("bottom").tickFormat(formatDate);

// // var yAxis = d3.svg.axis().scale(y)
// // .orient("left").ticks(6);

// // Create the SVG drawing area
// var svg = d3.select("body")
// .append("svg")
// .attr("width", width + margin.left + margin.right)
// .attr("height", height + margin.top + margin.bottom)
// .append("g")
// .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// // Introducing timeparse to work with the datess
// let timeParse = d3.timeParse("%m/%d/%Y"); // parse time to JS format so code can read it


// d3.json('a3cleanedonly2015.json').then((data) => {

//     deaths = data;

//     for (let d of deaths) {
//         d.Date = timeParse(d.Date); // using timeParse function we created above
//         d.Month = d3.timeMonth(d.Date); // Group by month
//     }

//     deathsByMonth = Array.from(d3.flatRollup(deaths, v => v.length, d => d.Month),
//     ([month, deaths]) => ({month:month, deaths:deaths}));

//     console.log(deathsByMonth)

//   const x = d3.scaleTime()
//     .domain(d3.extent(data, d => d.month)).nice()
//     .range([margin.left, width - margin.right]);
  
//   const y = d3.scaleLinear()
//     .range([height - margin.bottom, margin.top])
//     .domain([0,150]);
    
//   svg.append("g")
//     .attr("transform", `translate(0,${height - margin.bottom + 5})`)
//     .call(d3.axisBottom(x));

//  		  // Determine the first and list dates in the data set
//            var monthExtent = d3.extent(deathsByMonth, function(d) { return d.month; });

//            // Create one bin per month, use an offset to include the first and last months
//            var monthBins = d3.timeMonth(d3.timeMonth.offset(monthExtent[0],-1),
//                                           d3.timeMonth.offset(monthExtent[1],1));
 
//            // Use the histogram layout to create a function that will bin the data
//                     // Scale the range of the data in the y domain

//             var xAxis = d3.axisBottom(x)
//                             .tickArguments([d3.timeDay.every(1)]);

//             // Set the parameters for the histogram
//             var binByMonth = d3.histogram()
//                                 .value(function(d) { return d.months; })
//                                 .domain(x.domain())
//                                 .thresholds(x.ticks(monthBins.length));


//            // Bin the data by month
//            var histData = binByMonth(deathsByMonth);
 
//            // Scale the range of the data by setting the domain
//            //x.domain(d3.extent(monthBins));
//            y.domain([0, d3.max(histData, function(d) { return d.y; })]);
 
//            // Set up one bar for each bin
//            // Months have slightly different lengths so calculate the width for each bin
//            // Note: dx, the width of the histogram bin, is in milliseconds so convert the x value
//            // into UTC time and convert the sum back to a date in order to help calculate the width
//            // Thanks to npdoty for pointing this out in this stack overflow post:
//            // http://stackoverflow.com/questions/17745682/d3-histogram-date-based
//             // Append the bar rectangles to the svg element
//             svg.selectAll("rect")
//             .data(monthBins)
//             .enter().append("rect")
//             .attr("class", "bar")
//             .attr("x", 1)
//             .attr("transform", function(d) { 
//             return "translate(" + x(d.x0) + "," + y(d.length) + ")"; 
//             })
//             .attr("width", function(d) { 
//             return x(d.x1) - x(d.x0) -1 ; 
//             })
//             .attr("height", function(d) {
//             return height - y(d.length); 
//             });
 
//            // Add the X Axis
//            svg.append("g")
//                .attr("class", "x axis")
//                .attr("transform", "translate(0," + height + ")")
//                .call(xAxis);
 
//       // Add the y axis
//       svg.append("g")
//       .call(d3.axisLeft(y).ticks(d3.max(monthBins, function(d) { return d.length; })))
//       .append("text")
//       .attr("fill", "#000")
//       .attr("transform", "rotate(-90)")
//       .attr("y", 6)
//       .attr("dy", "0.71em")
//       .style("text-anchor", "end")
//       .text("Number of events");        

//          });