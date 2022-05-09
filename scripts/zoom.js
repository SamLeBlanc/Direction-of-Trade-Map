// Functions pertaining to the zooming of the map

// Set default zoom level to 1
let currentZoom = 1

// Define the D3 zoom element, restrict zooms to between 1 and 8
const zoom = d3.zoom()
  .scaleExtent([1, 8])
  .on("zoom", zoomed);

// Updates the zoom settings. Called every time the map zoom is changed. It applied
// the zoom the land tile and update a variable for easy access.
function zoomed({transform}) {
  // Update the variable for easy access of current zoom level
  currentZoom = transform.k
  // Update map to display the proper zoom factor
  land.attr("transform", transform);
}
