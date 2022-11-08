


// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/line-chart


const height = 500,
width = 800,
margin = ({ top: 15, right: 30, bottom: 35, left: 40 });

const svg = d3.select("#chart_1")
.append("svg")
.attr("viewBox", [0, 0, width, height]);


d3.json('a3cleanedonly2015.json').then((data) => {  
    deaths = data;

    // Introducing timeparse to work with the datess
    let timeParse = d3.timeParse("%m/%d/%Y"); // parse time to JS format so code can read it

    // for (let d of deaths) {
    //     d.Date = timeParse(d.Date); // using timeParse function we created above
    // }


    // Grouping data by date
    // deathsByDate = d3.nest()
    //     .key(function(d) {return d.Date;})
    //     .rollup(v => v.length)
    //     .entries(d);

    deathsByDate = Array.from(d3.rollup(deaths, v => v.length, d => d.Date),
                            ([date, value]) => ({date: date, value: value}));


    

    
    
    for (let d of deathsByDate) {
        d.date = timeParse(d.date)
        d.value = +d.value;
    }

    /// Sort by date
    deathsByDate = deathsByDate.slice().sort(function(x, y){
        return d3.ascending(x.date, y.date);
        })
    console.log(deathsByDate);


    //console.log(deathsByDate[1]);

        
    let x = d3.scaleTime()
        .domain(d3.extent(deathsByDate, d => d.date)) // returns an array
        .range([margin.left, width - margin.right]);

    let y = d3.scaleLinear()
        .domain([0,d3.max(deathsByDate, d => d.value)]).nice() // nice to round up axis tick
        .range([height - margin.bottom, margin.top]);

    svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .attr("class", "y-axis") // adding a class to y-axis for scoping
        .call(d3.axisLeft(y)
        .tickSizeOuter(0)
        //.tickFormat(d => d + "%") // format to include %
        .tickSize(-width + margin.right + margin.left) // modified to meet at end of axis
        );

    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).tickSizeOuter(0));

    svg.append("text")
        .attr("class", "x-label")
        .attr("text-anchor", "end")
        .attr("x", width - margin.right)
        .attr("y", height)
        .attr("dx", "0.5em")
        .attr("dy", "-0.5em") 
        .text("Date");

    svg.append("text")
        .attr("class", "y-label")
        .attr("text-anchor", "end")
        .attr("x", -margin.top/2)
        .attr("dx", "-0.5em")
        .attr("y", 10)
        .attr("transform", "rotate(-90)")
        .text("Number of Deaths");

    let line = d3.line()
        .x(d => x(d.date))
        .y(d => y(d.value))
        .curve(d3.curveNatural); // more: https://observablehq.com/@d3/d3-line#cell-244

    svg.append("path")
        .datum(deathsByDate)
        .attr("class", "line")
        .attr("d", line)
        .attr("fill", "none")
        .attr("stroke", "steelblue");

});