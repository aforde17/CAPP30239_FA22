


// // Copyright 2021 Observable, Inc.
// // Released under the ISC license.
// // https://observablehq.com/@d3/line-chart
// // Copyright 2021 Observable, Inc.
// // Released under the ISC license.
// // https://observablehq.com/@d3/stacked-bar-chart

function StackedBarChart(data, {
    x = (d, i) => i, // given d in data, returns the (ordinal) x-value
    y = d => d, // given d in data, returns the (quantitative) y-value
    z = () => 1, // given d in data, returns the (categorical) z-value
    title, // given d in data, returns the title text
    marginTop = 30, // top margin, in pixels
    marginRight = 0, // right margin, in pixels
    marginBottom = 30, // bottom margin, in pixels
    marginLeft = 40, // left margin, in pixels
    width = 640, // outer width, in pixels
    height = 400, // outer height, in pixels
    xDomain, // array of x-values
    xRange = [marginLeft, width - marginRight], // [left, right]
    xPadding = 0.1, // amount of x-range to reserve to separate bars
    yType = d3.scaleLinear, // type of y-scale
    yDomain, // [ymin, ymax]
    yRange = [height - marginBottom, marginTop], // [bottom, top]
    zDomain, // array of z-values
    offset = d3.stackOffsetDiverging, // stack offset method
    order = d3.stackOrderNone, // stack order method
    yFormat, // a format specifier string for the y-axis
    yLabel, // a label for the y-axis
    colors = d3.schemeTableau10, // array of colors
  } = {}) {
    // Compute values.
    const X = d3.map(data, x);
    const Y = d3.map(data, y);
    const Z = d3.map(data, z);
  
    // Compute default x- and z-domains, and unique them.
    if (xDomain === undefined) xDomain = X;
    if (zDomain === undefined) zDomain = Z;
    xDomain = new d3.InternSet(xDomain);
    zDomain = new d3.InternSet(zDomain);
  
    // Omit any data not present in the x- and z-domains.
    const I = d3.range(X.length).filter(i => xDomain.has(X[i]) && zDomain.has(Z[i]));
  
    // Compute a nested array of series where each series is [[y1, y2], [y1, y2],
    // [y1, y2], …] representing the y-extent of each stacked rect. In addition,
    // each tuple has an i (index) property so that we can refer back to the
    // original data point (data[i]). This code assumes that there is only one
    // data point for a given unique x- and z-value.
    const series = d3.stack()
        .keys(zDomain)
        .value(([x, I], z) => Y[I.get(z)])
        .order(order)
        .offset(offset)
      (d3.rollup(I, ([i]) => i, i => X[i], i => Z[i]))
      .map(s => s.map(d => Object.assign(d, {i: d.data[1].get(s.key)})));
  
    // Compute the default y-domain. Note: diverging stacks can be negative.
    if (yDomain === undefined) yDomain = d3.extent(series.flat(2));
  
    // Construct scales, axes, and formats.
    const xScale = d3.scaleBand(xDomain, xRange).paddingInner(xPadding);
    const yScale = yType(yDomain, yRange);
    const color = d3.scaleOrdinal(zDomain, colors);
    const xAxis = d3.axisBottom(xScale).tickSizeOuter(0);
    const yAxis = d3.axisLeft(yScale).ticks(height / 60, yFormat);
  
    // Compute titles.
    if (title === undefined) {
      const formatValue = yScale.tickFormat(100, yFormat);
      title = i => `${X[i]}\n${Z[i]}\n${formatValue(Y[i])}`;
    } else {
      const O = d3.map(data, d => d);
      const T = title;
      title = i => T(O[i], i, data);
    }
  
    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;");
  
    svg.append("g")
        .attr("transform", `translate(${marginLeft},0)`)
        .call(yAxis)
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick line").clone()
            .attr("x2", width - marginLeft - marginRight)
            .attr("stroke-opacity", 0.1))
        .call(g => g.append("text")
            .attr("x", -marginLeft)
            .attr("y", 10)
            .attr("fill", "currentColor")
            .attr("text-anchor", "start")
            .text(yLabel));
  
    const bar = svg.append("g")
      .selectAll("g")
      .data(series)
      .join("g")
        .attr("fill", ([{i}]) => color(Z[i]))
      .selectAll("rect")
      .data(d => d)
      .join("rect")
        .attr("x", ({i}) => xScale(X[i]))
        .attr("y", ([y1, y2]) => Math.min(yScale(y1), yScale(y2)))
        .attr("height", ([y1, y2]) => Math.abs(yScale(y1) - yScale(y2)))
        .attr("width", xScale.bandwidth());
  
    if (title) bar.append("title")
        .text(({i}) => title(i));
  
    svg.append("g")
        .attr("transform", `translate(0,${yScale(0)})`)
        .call(xAxis);
  
    return Object.assign(svg.node(), {scales: {color}});
}





// Introducing timeparse to work with the datess
let timeParse = d3.timeParse("%m/%d/%Y"); // parse time to JS format so code can read it

//var deathsByMonthByType;

d3.json('a3cleanedonly2015.json').then((data) => {
    deaths = data;

    for (let d of deaths) {
        d.Date = timeParse(d.Date); // using timeParse function we created above
        d.Month = d3.timeMonth(d.Date); // Group by month
    }

    deathsByMonthByType = Array.from(d3.flatRollup(deaths, v => v.length, d => d.Month, d => d.Manner_of_death),
                                ([month, manner_of_death, deaths]) => ({month:month, manner_of_death:manner_of_death, deaths:deaths}));

    deathsByMonthByType = deathsByMonthByType.slice().sort(function(x, y){
                                    return d3.ascending(x.month, y.month);
                                    })
    console.log(deathsByMonthByType)

    const death_types = ["Shot", "Shot and Tasered", "Tasered", "Other"]

    chart = StackedBarChart(deathsByMonthByType, {
        x: d => d.month,
        y: d => d.deaths,
        z: d => d.manner_of_death,
        xDomain: d3.groupSort(deathsByMonthByType, D => d3.sum(D, d => -d.deaths), d => d.month),
        yLabel: "Number of Deaths",
        zDomain: death_types,
        colors: d3.schemeSpectral[death_types.length],
        width: 600,
        height: 500
    })

});






















































///// MY CODE



// // set the dimensions and margins of the graph
// const height = 500,
//     width = 800,
//     margin = ({ top: 15, right: 30, bottom: 35, left: 40 });

// // append the svg object to the body of the page
// var svg = d3.select("#chart_2")
//   .append("svg")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)
//   .append("g")
//     .attr("transform",
//           "translate(" + margin.left + "," + margin.top + ")");


// d3.json('a3cleanedonly2015.json').then((data) => {  
//     deaths = data;

//     // Introducing timeparse to work with the datess
//     let timeParse = d3.timeParse("%m/%d/%Y"); // parse time to JS format so code can read it

//     for (let d of deaths) {
//         d.Date = timeParse(d.Date); // using timeParse function we created above
//         d.Month = d3.timeMonth(d.Date); // Group by month
//     }


//     // Grouping data by date
//     // deathsByDate = d3.nest()
//     //     .key(function(d) {return d.Date;})
//     //     .rollup(v => v.length)
//     //     .entries(d);

//     deathsByMonthByType = d3.rollup(deaths, v => v.length, d => d.Month, d => d.Manner_of_death);


//     /// Function to unroll the grouped roll-ups from https://observablehq.com/@bayre/unrolling-a-d3-rollup
//     function unroll(rollup, keys, label = "value", p = {}) {
//         return Array.from(rollup, ([key, value]) => 
//           value instanceof Map 
//             ? unroll(value, keys.slice(1), label, Object.assign({}, { ...p, [keys[0]]: key } ))
//             : Object.assign({}, { ...p, [keys[0]]: key, [label] : value })
//         ).flat();
//     }

//     grouped_deaths = unroll(deathsByMonthByType, ["month", "manner_of_death"], "deaths")


//     for (let d of grouped_deaths) {
//         d.deaths = +d.deaths;
//     }

//     /// Sort by date
//     grouped_deaths = grouped_deaths.slice().sort(function(x, y){
//         return d3.ascending(x.month, y.month);
//         })

//     // Re-grouping by manner of death for the bar chart
//     grouped_deaths =  Array.from(d3.groups(grouped_deaths, d => d.manner_of_death),
//                             ([key, value]) => ({key: key, value: value}))

//     console.log(grouped_deaths);

        
//     let x = d3.scaleTime()
//         .domain(d3.extent(grouped_deaths, d => d.month)) // returns an array
//         .range([margin.left, width - margin.right]);

//     let y = d3.scaleLinear()
//         .domain([0,d3.max(grouped_deaths, d => d.value)]).nice() // nice to round up axis tick
//         .range([height - margin.bottom, margin.top]);

//     svg.append("g")
//         .attr("transform", `translate(${margin.left},0)`)
//         .attr("class", "y-axis") // adding a class to y-axis for scoping
//         .call(d3.axisLeft(y)
//         .tickSizeOuter(0)
//         //.tickFormat(d => d + "%") // format to include %
//         //.tickSize(-width + margin.right + margin.left) // modified to meet at end of axis
//         );

//     svg.append("g")
//         .attr("transform", `translate(0,${height - margin.bottom})`)
//         .call(d3.axisBottom(x).tickSizeOuter(0));
    
//     const subgroups = ["Shot", "Shot and Tasered", "Tasered", "Other"]
//     const color = d3.scaleOrdinal(subgroups,['#e41a1c','#377eb8','#4daf4a', '#228B22']);
    
//     // const stackedData = d3.stack()
//     //     .keys(subgroups)(grouped_deaths);
//     // console.log(stackedData)

//     svg.append("g")
//     .selectAll("g")
//     .data(grouped_deaths)
//     .join("g")
//     .attr("fill", d => color(d.key))
//     .selectAll("rect")
//     .data(d => d.value.deaths)
//     .join("rect")
//     .attr("x", d => x(d.value.manner_of_death))
//     .attr("y", d => y(d[1]))
//     .attr("height", d => y(d[0]) - y(d[1]))
//     //.attr("width",x.bandwidth());

//     let legendGroup = svg
//     .selectAll(".legend-group")
//     .data(subgroups)
//     .join("g")
//     .attr("class", "legend-group");

//     legendGroup
//     .append("circle")
//     .attr("cx", (d, i) => (10 + (i * 75)))
//     .attr("cy",10)
//     .attr("r", 3)
//     .attr("fill", (d, i) => color(i));
    
//     legendGroup
//     .append("text")
//     .attr("x", (d, i) => (20 + (i * 75)))
//     .attr("y",15)
//     .text((d, i) => subgroups[i]);

// //
// });