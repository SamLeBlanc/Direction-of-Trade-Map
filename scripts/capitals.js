const drawCapitals = () => {
  // Create an empty array to store capital locations
  const capitalLocations = [];

  // For each capital in raw dataset, extract latitude and longitude values
  data['capitals'].forEach( row => capitalLocations.push({'lat': +row.Cap_Lat, 'lon': +row.Cap_Lon}));

  // Using D3, place markers at the location of each national capital
  land.append("g")
    .selectAll("circle")
    .data(capitalLocations)
    .enter()
    .append("circle")
    .attr("class","capital")
    .attr("cx", d => projection([d.lon,d.lat])[0]) // use projection to calculate SVG coordinates
    .attr("cy", d => projection([d.lon,d.lat])[1]) // use projection to calculate SVG coordinates
    .attr("r", "2px")
    .attr("fill", "black")
}
