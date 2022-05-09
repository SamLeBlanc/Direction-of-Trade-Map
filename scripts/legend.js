// Draw the map legend
const drawLegend = () => {
  // Keys to use in import and export maps
  let keys = [0,10,100,1000,10000,100000,1000000];

  // Keys to use in net export maps
  if (getDirection() == 'net') {
    keys = [-1000000,-100000,-10000,-1000,-100,0,100,1000,10000,100000,1000000];
  }

  // Remove the legend if it exists
  try {
    legend.remove()
  } catch {}

  // Create a new group for the legend elements
  legend = svg.append("g")

  // Set number format for legend
  const format = d3.format("0.1s");

  // Create the legend dots
  legend.append("g")
    .selectAll("mydots")
    .data(keys)
    .enter()
    .append("circle")
      .attr("cx", 15)
      .attr("cy", function(d,i){ return 200 + i*20}) // 100 is where the first dot appears. 25 is the distance between dots
      .attr("r", 7)
  		.attr("stroke","black")
  		.attr("stroke-width","1")
      .style("fill", function(d){ return getColor(d)})

  // Add the legend labels
  legend.append("g")
    .selectAll("mylabels")
    .data(keys)
    .enter()
    .append("text")
      .attr("class","legend-label")
      .attr("x", 30)
      .attr("y", function(d,i){ return 205 + i*20}) // 100 is where the first dot appears. 25 is the distance between dots
      .style("fill", function(d){ return getColor(d)})
      .text(function(d){ return format(1000000*d).replace(/G/,"B")})
      .attr("text-anchor", "left")
  		.style("font-weight","bold")
      .style("stroke","black")
      .style("alignment-baseline", "middle")
  }
