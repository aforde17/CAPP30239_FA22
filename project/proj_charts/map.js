const tooltip = d3.select("body")
  .append("div")
  .attr("class", "svg-tooltip")
  .style("position", "absolute")
  .style("visibility", "hidden");

const height_map = 610,
  width_map = 975;

const svg_map = d3.select("#sah_map")
  .append("svg")
  .attr("viewBox", [0, 0, width_map, height_map]);

Promise.all([
  d3.csv("../data/sah_map_data.csv"),
  d3.json("libs/counties-albers-10m.json")
]).then(([data, us]) => {
  const dataById = {};

  for (let d of data) {
    dataById[d.id] = d;
  }

  const states = topojson.feature(us, us.objects.states);
  console.log(states)
  console.log(dataById)

  const path = d3.geoPath();

  const groups = ["Came into effect before March 22", "Came into effect before March 29", "Came into effect before April 5",
           "Came into effect before April 12", "No Statewide order"]

  // // Sunset color scheme
  const color = d3.scaleOrdinal()
    .domain(groups)
    .range(["#003f5c", "#58508d" , "#bc5090", "#ff6361", "#ffa600"]);
  
  console.log(groups)
  console.log(color)

    d3.select("#legend")
    .node()
    .appendChild(
      Legend(
        d3.scaleOrdinal(
          ["By March 22", "By March 29", "By April 5",
           "By April 12", "No Statewide order"],
           ["#003f5c", "#58508d" , "#bc5090", "#ff6361", "#ffa600"]
        ),
        { title: "Stay-at-Home order enacted", width: 520 }
      ));

  svg_map.append("g")
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
    
});