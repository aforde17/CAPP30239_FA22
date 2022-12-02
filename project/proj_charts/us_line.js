let height = 400,
    width = 600,
    margin = ({ top: 25, right: 30, bottom: 50, left: 50 });
    padding = 35

    const svg = d3.select("#us_line")
    .append("svg")
    .attr("viewBox", [0, 0, width, height]);

    d3.csv("../../data/us_mar_div.csv").then(data => {
        let timeParse = d3.timeParse("%Y");
      
        let rates = new Set();

        for (let d of data) {
            d.Year = timeParse(d.Year);
            d.value = +d.value;
            rates.add(d.variable);
          }
        
        let x = d3.scaleTime()
            .domain(d3.extent(data, d => d.Year))
            .range([margin.left, width - margin.right]);

        let y = d3.scaleLinear()
            .domain([0, 10])
            .range([height - margin.bottom, margin.top]);

        svg.append("g")
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .attr("class", "x-axis")
            .call(d3.axisBottom(x).tickSize(-height + margin.top + margin.bottom))
        
        svg.append("g")
            .attr("transform", `translate(${margin.left},0)`)
            .attr("class", "y-axis")
            .call(d3.axisLeft(y).tickSize(-width + margin.left + margin.right))
        
        let line = d3.line()
            .x(d => x(d.Year))
            .y(d => y(d.value));
        
        // Set colors for the Categories
        seriesColors = ["Marriages", "Divorces"]
        colorRange = ["#d3273e", "#0000A8"]
        var color = d3.scaleOrdinal().domain(seriesColors).range(colorRange);

        for (let rate of rates) {
            let rateData = data.filter(d => d.variable === rate);
        
            let g = svg.append("g")
              .attr("class", "rate")
              .on('mouseover', function () {
                d3.selectAll(".highlight").classed("highlight", false);
                d3.select(this).classed("highlight", true);
              });
        
            if (rate === "Marriages") {
              g.classed("highlight", true);
            }
        
            g.append("path")
              .datum(rateData)
              .attr("fill", "none")
              .attr("stroke", function (d) { return color(rate);})
              .attr("d", line)
        
            let lastEntry = rateData[rateData.length - 1]; //last piece of data to position text x and y
        
            g.append("text")
              .text(rate)
              .attr("x", x(lastEntry.Year) - 49)
              .attr("y", y(lastEntry.value) + 15)
              .attr("dominant-baseline", "middle")
              .attr("fill", function (d) { return color(rate);});

              g.append("text")
              .attr("class", "x label")
              .style("font", "100px")
              .attr("text-anchor", "end")
              .attr("x", width)
              .attr("y", height )
              .text("Year");
            
              g.append("text")
              .attr("class", "y label")
              .attr("text-anchor", "end")
              .attr("y", 15)
              .attr("dy", ".0.01em")
              .attr("transform", "rotate(-90)")
              .text("Rate per 1000 people");
        
        
          }
          
        });
        