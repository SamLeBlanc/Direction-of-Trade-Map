const zoom = d3.zoom()
.scaleExtent([1, 8])
.on("zoom", zoomed);

function zoomed({transform}) {
  currentZoom = transform.k
  g.attr("transform", transform);
}
