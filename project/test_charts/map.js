const tooltip = d3.select("body")
  .append("div")
  .attr("class", "svg-tooltip")
  .style("position", "absolute")
  .style("visibility", "hidden");

const height = 610,
  width = 975;

const svg = d3.select("#chart")
  .append("svg")
  .attr("viewBox", [0, 0, width, height]);

Promise.all([
  d3.csv("../../data/sah_map_data.csv"),
  d3.json("../libs/counties-albers-10m.json")
]).then(([data, us]) => {
  const dataById = {};

  for (let d of data) {
    //d.rate = +d.rate;
    //making a lookup table from the array (unemployment data)
    dataById[d.id] = d;
  }

  const states = topojson.feature(us, us.objects.states);
  console.log(states)
  console.log(dataById)

  const path = d3.geoPath();

  const groups = ["Came into effect before March 22", "Came into effect before March 29", "Came into effect before April 5",
           "Came into effect before April 12", "No Statewide order"]

  // // Quantize evenly breakups domain into range buckets
  const color = d3.scaleOrdinal()
    .domain(groups)
    .range(["#400020", "#804080" , "#C080C0", "#D9B3D9", "#F2E6F2"]);
  
  console.log(groups)
  console.log(color)

    d3.select("#legend")
    .node()
    .appendChild(
      Legend(
        d3.scaleOrdinal(
          ["By March 22", "By March 29", "By April 5",
           "By April 12", "No Statewide order"],
          ["#400020", "#804080" , "#C080C0", "#D9B3D9", "#F2E6F2"]
        ),
        { title: "Stay-at-Home order enacted" }
      ));

  svg.append("g")
    .selectAll("path")
    .data(states.features)
    .join("path")
    .attr("stroke", "#999")
    .attr("fill", "white")
    .attr("fill", d => (d.id in dataById) ? color(dataById[d.id].Group) : '#ccc')
    .attr("d", path)
    .on("mousemove", function (event, d) {
      let info = dataById[d.id];
      tooltip
        .style("visibility", "visible")
        .html(`${info.State}<br>${info.Group}`)
        .style("top", (event.pageY - 10) + "px")
        .style("left", (event.pageX + 10) + "px");
      d3.select(this).attr("fill", "goldenrod");
    })
    .on("mouseout", function () {
      tooltip.style("visibility", "hidden");
      d3.select(this).attr("fill", d => (d.id in dataById) ? color(dataById[d.id].Group) : '#ccc');
    });
  // // Quantize evenly breakups domain into range buckets
  // const color = d3.scaleQuantize()
  //   .domain([0, 10]).nice()
  //   .range(d3.schemeBlues[5]);

  // const path = d3.geoPath();

  // d3.select("#legend")
  //   .node()
  //   .appendChild(
  //     Legend(
  //       d3.scaleOrdinal(
  //         ["Came into effect before March 22", "Came into effect before March 29", "Came into effect before April 5",
  //          "Came into effect before April 12", "No Statewide order"],
  //         ["#400020", "#804080" , "#C080C0", "#D9B3D9", "#F2E6F2"]
  //       ),
  //       { title: "Stay-at-Home order enacted" }
  //     ));

  // svg.append("g")
  //   .selectAll("path")
  //   .data(states.features)
  //   .join("path")
  //   .attr("fill", d => (d.id in dataById) ? color(dataById[d.id].Group) : '#ccc')
  //   .attr("d", path)
  //   .on("mousemove", function (event, d) {
  //     let info = dataById[d.id];
  //     tooltip
  //       .style("visibility", "visible")
  //       .html(`${info.State}<br>${info.Group}%`)
  //       .style("top", (event.pageY - 10) + "px")
  //       .style("left", (event.pageX + 10) + "px");
  //     d3.select(this).attr("fill", "goldenrod");
  //   })
  //   .on("mouseout", function () {
  //     tooltip.style("visibility", "hidden");
  //     d3.select(this).attr("fill", d => (d.id in dataById) ? color(dataById[d.id].Group) : '#ccc');
  //   });
});