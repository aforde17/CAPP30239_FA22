/* D3 Line Chart */

const height = 500,
    width = 800,
    margin = ({ top: 15, right: 30, bottom: 35, left: 40 });
    
const svg = d3.select("#chart")
    .append("svg")
    .attr("viewBox", [0, 0, width, height]); // Not dependent on data - performance boost

d3.csv('long-term-interest-canada.csv').then(data => {
    
    let timeParse = d3.timeParse("%Y-%m");

    for (let d of data) {
        d.Num = +d.Num; // Coerce to be a number
        d.Month = timeParse(d.Month)
    };

    let x = d3.scaleTime()
        .domain(d3.extent(data, d => d.Month)) // extent pulls the longest and the smallest number
        .range([margin.left, width-margin.right])
        .nice(); // Note: not sure why the monthly scale starts at 2020 instead of January

    let y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.Num)])
        .range([height - margin.bottom, margin.top]);


    console.log(data);

        // Draws Y Scale
    svg.append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .attr("class", "y-axis")
    .call(d3.axisLeft(y).tickSizeOuter(0).tickFormat(d => d + "%").tickSize(-width));
    
    // Draws X Scale
    svg.append("g") // Appending the group
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .attr("class", "x-axis")
      .call(d3.axisBottom(x).tickSizeOuter(0));


    // Labels for the X Axis
    svg.append("text")
      .attr("class", "x-label")
      .attr("text-anchor", "end")
      .attr("x", width - margin.right)
      .attr("y", height)
      .attr("dx", "0.5em")
      .attr("dy", "-0.5em") 
      .text("Year");
    
    // Labels for the Y Axis
    svg.append("text")
      .attr("class", "y-label")
      .attr("text-anchor", "end")
      .attr("x", -margin.top/2)
      .attr("dx", "-0.5em")
      .attr("y", 10)
      .attr("transform", "rotate(-90)")
      .text("Interest rate");

    let line = d3.line() //Line generator in d3
        .x(d => x(d.Month))
        .y(d => y(d.Num))

    svg.append("path")
        .datum(data)
        .attr("d", line)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
  });