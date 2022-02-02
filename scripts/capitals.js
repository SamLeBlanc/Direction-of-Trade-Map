const drawCapitals = () => {
  const capitalLocations = [];
  data['capitals'].forEach( row => capitalLocations.push({'lat': +row.Cap_Lat, 'lon': +row.Cap_Lon}));

  g.append("g")
    .selectAll("circle")
    .data(capitalLocations).enter()
    .append("circle")
    .attr("class","capital")
    .attr("cx", d => projection([d.lon,d.lat])[0])
    .attr("cy", d => projection([d.lon,d.lat])[1])
    .attr("r", "2px")
    .attr("fill", "black")
}
