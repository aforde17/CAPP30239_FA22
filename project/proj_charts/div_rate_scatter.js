let height_div = 400,
    width_div = 600,
    margin_div = ({ top: 25, right: 30, bottom: 35, left: 40 })
    padding_div = 35;
  
const svg_div = d3.select("#div_chart")
    .append("svg")
    .attr("viewBox", [0, 0, width_div, height_div]);

d3.csv('../../data/scatter_data.csv').then(data => {

  for (let d of data) {
    d.div_rate_19 = +d.div_rate_19;
    d.div_rate_20 = +d.div_rate_20; // using timeParse function we created above
  }

  console.log(data)
  const groups = ["Came into effect before March 22", "Came into effect before March 29", "Came into effect before April 5",
  "Came into effect before April 12", "No Statewide order"]

// // Quantize evenly breakups domain into range buckets
  // Color scale: give me a specie name, I return a color

  const color = d3.scaleOrdinal()
    .domain(groups)
    .range(["#003f5c", "#58508d" , "#bc5090", "#ff6361", "#ffa600"]); //Sunset Color Scheme

  let x = d3.scaleLinear()
    .domain([0, 5]).nice()
    .range([margin_div.left, width_div - margin_div.right]);

  let y = d3.scaleLinear()
    .domain([0, 5]).nice()
    .range([height_div - margin_div.bottom, margin_div.top]);

  svg_div.append("g")
    .attr("transform", `translate(0,${height_div - margin_div.bottom})`)
    .attr("class", "x-axis")
    .call(d3.axisBottom(x).tickSize(-height_div + margin_div.top + margin_div.bottom))

  svg_div.append("g")
    .attr("transform", `translate(${margin_div.left},0)`)
    .attr("class", "y-axis")
    .call(d3.axisLeft(y).tickSize(-width_div + margin_div.left + margin_div.right))

  svg_div.append("g")
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
      .attr("cx", function (d) { return x(d.div_rate_19); } )
      .attr("cy", function (d) { return y(d.div_rate_20); } )
      .style("fill", function (d) { return color(d.group) } )
    .join("circle")
    .attr("r", 2)
    .attr("opacity", 0.75);

    // Drawing a horizontal line to de-lineate change from one year to another
    svg_div.append("line")          // attach a line
      .style("stroke", "black")  // colour the line
      .attr("x1", 570)     // x position of the first end of the line
      .attr("y1", 26)      // y position of the first end of the line
      .attr("x2", 40)     // x position of the second end of the line
      .attr("y2", 365); 

      var legend = svg_div.append('g')
      .attr('class', 'legend')
      .attr('transform', 'translate(' + (padding_div + 12) + ', 30)');

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
      
      svg_div.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", width_div)
        .attr("y", height_div - 6)
        .text("2019 Rate per 1000 persons");
      
      svg_div.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("y", 15)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text("2020 Rate per 1000 persons");
  

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
  
  svg_div.append("g")
    .call(makeAnnotations)
      

  const tooltip_div = d3.select("body").append("div")
    .attr("class", "svg-tooltip")
    .style("position", "absolute")
    .style("visibility", "hidden");

  d3.selectAll("circle")
    .on("mouseover", function(event, d) {
      d3.select(this).attr("fill", "red");
      tooltip_div
        .style("visibility", "visible")
        .html(`State: ${d.State}<br />2019 Divorce rate: ${d.div_rate_19}<br />2020 Divorce Rate: ${d.div_rate_20}`);
    })
    .on("mousemove", function(event) {
      tooltip_div
        .style("top", (event.pageY - 10) + "px")
        .style("left", (event.pageX + 10) + "px");
    })
    .on("mouseout", function() {
      d3.select(this).attr("fill", "black");
      tooltip_div.style("visibility", "hidden");
    })
    
});