function drawWater(){
  svg.append("g")
  .selectAll("path")
  .data(data['water'].features)
  .join("path")
  .attr("class","water")
  .attr("d", path)
  .attr("fill", 'transparent')
  .on('mouseover', function (d, i) {
    tiles.hover.previous = tiles.hover.current
    tiles.hover.current = "Ocean"
    draw()
  })
}
