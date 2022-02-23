let data = {};
let links = [];
let lonks;
let legend;

let tiles = {
  'hover' : {
    'previous' : '',
    'current' : 'Ocean' },
  'held' :  {
    'previous' : '',
    'current' : ''}
}

const loadData = () => {
  Promise.all([
    d3.json("data/countries2.geojson"),
    d3.csv("data/capitals.csv"),
    d3.csv("data/2020data.csv")
  ]).then(
    function (init) {
      data = { 'countries':init[0], 'capitals':init[1], '2020':init[2] }
      drawWater()
      draw()
    })
}

function draw(){
  land.selectAll("*").remove();
  drawAllCountries()
  lonks = drawLinks()
  if (getCapitals()) drawCapitals()
  drawLegend()
}
