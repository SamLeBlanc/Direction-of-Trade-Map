function drawLegend() {

let keys = [0, 10, 100, 1000, 10000, 100000, 1000000];
if (getDirection() == 'net') keys = [-1000000,-100000,-10000,-1000,-100,0,100,1000,10000,100000,1000000];

try { legend.remove() } catch {}

legend = svg.append("g")

const format = d3.format("0.1s");

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

// Add one dot in the legend for each name.
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
