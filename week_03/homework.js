
/* Homework 3 - Akila Forde */
/* Bar chart for Chicago Library Visits for January 2022 */

d3.csv("library_visits_jan22.csv").then(data => {

    for (let d of data) {
        d.num = +d.num; //force a number
    };

    const height = 600,
          width = 800,
          margin = ({ top: 25, right: 30, bottom: 35, left: 50 });

    let svg = d3.select("#chart")
        .append("svg")
        .attr("viewBox", [0, 0, width, height]); // for resizing element in browser
    
    let x = d3.scaleBand()
        .domain(data.map(d => d.branch)) // data, returns array
        .range([margin.left, width - margin.right]) // pixels on page
        .padding(0.1);
    
    let y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.num)]).nice() // nice rounds the top num
        .range([height - margin.bottom, margin.top]); //svgs are built from top down, so this is reversed
    
    /* Update: simplfied axes */
    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom + 5})`) // move location of axis
        .call(d3.axisBottom(x));
    
    svg.append("g")
        .attr("transform", `translate(${margin.left - 5},0)`)
        .call(d3.axisLeft(y));

    let bar = svg.selectAll(".bar") // create bar groups
        .append("g")
        .data(data)
        .join("g")
        .attr("class", "bar");

    bar.append("rect") // add rect to bar group
        .attr("fill", "#F33A6A")
        .attr("x", d => x(d.branch)) // x position attribute
        .attr("width", x.bandwidth()) // this width is the width attr on the element
        .attr("y", d => y(d.num)) // y position attribute
        .attr("height", d => y(0) - y(d.num)); // this height is the height attr on element
    
    bar.append('text') // add labels
        .text(d => d.cases)
        .attr('x', d => x(d.branch) + (x.bandwidth()/2))
        .attr('y', d => y(d.num) + 15)
        .attr('text-anchor', 'middle')
        .style('fill', 'white');

    bar.append('text')  // Add Title *not currently working and not sure why*
        .attr('x', (width / 2))
        .attr('y', 0 - (margin.top / 2))
        .attr('text-anchor', 'middle')
        .style('font-size', '18px')
        .text('Chicago Library Visits for January 2022');

});