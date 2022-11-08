let height = 500,
    width = 800,
    margin = ({ top: 25, right: 30, bottom: 35, left: 30 })
    innerWidth = width - margin.left - margin.right;

const svg = d3.select("#chart_5")
  .append("svg")
  .attr("viewBox", [0, 0, width, height]);

d3.json("a3cleanedonly2015.json").then(data => {
    let timeParse = d3.timeParse("%m/%d/%Y");

  let states = new Set();

  for (let d of data) {
    d.Date = timeParse(d.Date);
    d.Month = d3.timeMonth(d.Date);
    states.add(d.State);
  }

  deaths =  Array.from(d3.flatRollup(data, v => v.length, d => d.Month, d => d.State),
                                ([month, state, deaths]) => ({month:month, state:state, deaths:deaths}));


  deaths = deaths.slice().sort(function(x, y){
        return d3.ascending(x.month, y.month);
        })

  console.log(deaths)

  let x = d3.scaleTime()
    .domain(d3.extent(deaths, d => d.month))
    .range([margin.left, width - margin.right]);

  let y = d3.scaleLinear()
    .domain(d3.extent(deaths, d => d.deaths))
    .range([height - margin.bottom, margin.top]);

  svg.append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x));

  svg.append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).tickSize(-innerWidth).tickFormat(d => d));

  let line = d3.line()
    .x(d => x(d.month))
    .y(d => y(d.deaths));
 
  for (let state of states) {
    let stateData = deaths.filter(d => d.state === states);

    let g = svg.append("g")
      .attr("class", "country")
      .on('mouseover', function () {
        d3.selectAll(".highlight").classed("highlight", false);
        d3.select(this).classed("highlight", true);
      });

    if (state === "IL") {
      g.classed("highlight", true);
    }

    g.append("path")
      .datum(stateData)
      .attr("fill", "none")
      .attr("stroke", "#ccc")
      .attr("d", line)

    let lastEntry = stateData[stateData.length - 1]; //last piece of data to position text x and y

    g.append("text")
      .text(state)
      .attr("x", 12)
      .attr("y", 20)
      .attr("dominant-baseline", "middle")
      .attr("fill", "#999");
  }
  
});