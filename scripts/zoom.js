let currentZoom = 1

// Define the D3 zoom element, restrict zooms to between 1 and 8
const zoom = d3.zoom()
  .scaleExtent([1, 8])
  .on("zoom", zoomed);

// Function that gets called when zoom is changed
function zoomed({transform}) {
  // Update the variable for easy access of current zoom level
  currentZoom = transform.k
  // Update map to display the proper zoom factor
  land.attr("transform", transform);
}
