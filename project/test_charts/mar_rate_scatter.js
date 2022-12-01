let height = 400,
    width = 600,
    margin = ({ top: 25, right: 30, bottom: 35, left: 40 });
    padding = 35
  
const svg = d3.select("#mar_chart")
    .append("svg")
    .attr("viewBox", [0, 0, width, height]);

d3.csv('../../data/scatter_data.csv').then(data => {

  for (let d of data) {
    d.mar_rate_19 = +d.mar_rate_19;
    d.mar_rate_20 = +d.mar_rate_20; // using timeParse function we created above
  }

  console.log(data)
  const groups = ["Came into effect before March 22", "Came into effect before March 29", "Came into effect before April 5",
  "Came into effect before April 12", "No Statewide order"]

// // Quantize evenly breakups domain into range buckets
  // Color scale: give me a specie name, I return a color

  const color = d3.scaleOrdinal()
    .domain(groups)
    .range(["#003f5c", "#58508d" , "#bc5090", "#ff6361", "#ffa600"]);

  let x = d3.scaleLinear()
    .domain([0, 26]).nice()
    .range([margin.left, width - margin.right]);

  let y = d3.scaleLinear()
    .domain([0, 26]).nice()
    .range([height - margin.bottom, margin.top]);

  svg.append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .attr("class", "x-axis")
    .call(d3.axisBottom(x).tickSize(-height + margin.top + margin.bottom))

  svg.append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .attr("class", "y-axis")
    .call(d3.axisLeft(y).tickSize(-width + margin.left + margin.right))

  svg.append("g")
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
      .attr("cx", function (d) { return x(d.mar_rate_19); } )
      .attr("cy", function (d) { return y(d.mar_rate_20); } )
      .style("fill", function (d) { return color(d.group) } )
    .join("circle")
    .attr("r", 2)
    .attr("opacity", 0.75);

    // Drawing a horizontal line to de-lineate change from one year to another
    svg.append("line")          // attach a line
      .style("stroke", "black")  // colour the line
      .attr("x1", 570)     // x position of the first end of the line
      .attr("y1", 26)      // y position of the first end of the line
      .attr("x2", 40)     // x position of the second end of the line
      .attr("y2", 365); 

      var legend = svg.append('g')
      .attr('class', 'legend')
      .attr('transform', 'translate(' + (padding + 12) + ', 30)');
  

    // Legend
    legend.selectAll('rect')
        .data(groups)
        .enter()
        .append('rect')
        .attr('x', 0)
        .attr('y', function(d, i){
            return i * 18;
        })
        .attr('width', 12)
        .attr('height', 12)
        .attr('fill', function(d, i){
            return color(i);
        });
    
    legend.selectAll('text')
        .data(groups)
        .enter()
        .append('text')
        .text(function(d){
            return d;
        })
        .attr('x', 18)
        .attr('y', function(d, i){
            return i * 18;
        })
        .attr('text-anchor', 'start')
        .attr('alignment-baseline', 'hanging');
      
      
      svg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height - 6)
        .text("2019 Rate per 1000 persons");
      
      svg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("y", 15)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text("2020 Rate per 1000 persons");

  
  // Attempting to include an annotation for the black line
  // Features of the annotation
  const annotations = [
    {
      note: {
        label: "Below this line, 2020 rate < 2019 rate and above the line, 2020 rate > 2019 rate",
        title: "Equality between 2019 and 2020 rates"
      },
      x: 380,
      y: 150,
      dy: 50,
      dx: 50
    }
    ]
  
  const makeAnnotations = d3.annotation()
    .annotations(annotations)
  
  svg.append("g")
    .call(makeAnnotations)

  const tooltip = d3.select("body").append("div")
    .attr("class", "svg-tooltip")
    .style("position", "absolute")
    .style("visibility", "hidden");

  d3.selectAll("circle")
    .on("mouseover", function(event, d) {
      d3.select(this).attr("fill", "red");
      tooltip
        .style("visibility", "visible")
        .html(`State: ${d.State}<br />2019 Marriage rate: ${d.mar_rate_19}<br />2020 Marriage Rate: ${d.mar_rate_20}`);
    })
    .on("mousemove", function(event) {
      tooltip
        .style("top", (event.pageY - 10) + "px")
        .style("left", (event.pageX + 10) + "px");
    })
    .on("mouseout", function() {
      d3.select(this).attr("fill", "black");
      tooltip.style("visibility", "hidden");
    })
    
});