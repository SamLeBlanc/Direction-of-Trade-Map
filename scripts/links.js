const createLinkArray = (CountryA, CountryB="") => {
  let countryData = data['2020'].filter(d => (d.CountryA == CountryA && d.Direction == getDirection()))
  countryData = CountryB ? countryData.filter(d => d.CountryB == CountryB) : countryData
  let links = countryData.map( d => {
    return {
      'CountryA' : d.CountryA, 'source': [+d.CapA_Lon, +d.CapA_Lat], 'value' : +d.Value,
      'CountryB' : d.CountryB, 'target': [+d.CapB_Lon, +d.CapB_Lat], 'weight': 2*(+d.Value)**0.2
    }
  })
  return links
}

function createLinks(i){
  tiles.hover.previous = tiles.hover.current
  tiles.hover.current = i.properties.name
  if (tiles.hover.current != tiles.hover.previous){
    links = createLinkArray(tiles.hover.current)
    links = links.sort((a,b) => d3.descending(+a.weight, +b.weight))
    num_links = parseInt(document.getElementById('links-number').value)
    links = links.slice(0, num_links);
    if (tiles.held.current) links = createLinkArray(tiles.held.current,tiles.hover.current)
    draw()
  }
}

const getLinkColor = () => (getDirection() == 'import') ? 'blue' : 'purple'

function drawLinks(){
  if (!document.getElementById("links-checkbox").checked) return g.append("g")
  d3.selectAll('.link').remove()
  const lonks = g.append("g")
    .selectAll("myPath")
    .data(links)
    .enter()
    .append("path")
    .attr("class","link")
    .attr('d', d => lngLatToArc(d, 'source', 'target', 3)) // Higher number equals less bend
    .style("stroke-width", d => d.weight/2 )
    .style('stroke',getLinkColor())
    .on('mouseover', function (d, i) {
        if (!tiles.held.current){
          updateInfo2(i)
           d3.select(this)
           .style('stroke', 'green');
       }
    })
    .on('mouseout', function (d, i) {
      document.getElementById("info-2").style.color = "lightblue"
         d3.select(this)
              .style('stroke', getLinkColor());
    });
  return lonks
}

function updateInfo2(i){
  document.getElementById("info-2").style.color = "black"
  if (tiles.held.current) {
    CountryA = tiles.held.current,
    CountryB = i.properties.name;
    interCountryData = data['2020']
                        .filter( e => e.CountryA == tiles.held.current &&
                          e.Direction == getDirection() &&
                          e.CountryB == CountryB)
    value = interCountryData[0] ? parseFloat(interCountryData[0].Value) : 0
  } else {
    CountryA = i.CountryA;
    CountryB = i.CountryB,
    value = i.value
  }
  let countrySum = d3.sum(data['2020'].filter( e => e.CountryA == CountryA && e.Direction == getDirection()).map(e => +e.Value))
  let percent = Math.round(100*value/countrySum);
  let isImport = document.getElementById("direction-checkbox").checked
  let action = isImport ? "provided" : "received";

  string = `Of which, ${CountryB} ${action} $${scaleNum(value)} ${scaleMBT(value)} (${percent}%).`
  document.getElementById("info-2").textContent = string
}

// This function takes an object, the key names where it will find an array of lng/lat pairs, e.g. `[-74, 40]`
// And a bend parameter for how much bend you want in your arcs, the higher the number, the less bend.
function lngLatToArc(d, sourceName, targetName, bend){
  // If no bend is supplied, then do the plain square root
  bend = bend || 1;
  // `d[sourceName]` and `d[targetname]` are arrays of `[lng, lat]`
  // Note, people often put these in lat then lng, but mathematically we want x then y which is `lng,lat`

  let sourceLngLat = d[sourceName],
      targetLngLat = d[targetName];

  if (!(targetLngLat && sourceLngLat)) return "M0,0,l0,0z"

  let sourceXY = projection(sourceLngLat),
      targetXY = projection(targetLngLat);

  let sourceX = sourceXY[0],
      sourceY = sourceXY[1];

  let targetX = targetXY[0],
      targetY = targetXY[1];

  let dx = targetX - sourceX,
      dy = targetY - sourceY;

  let dr = Math.sqrt(dx * dx + dy * dy)*bend;

  // To avoid a whirlpool effect, make the bend direction consistent regardless of whether the source is east or west of the target
  var west_of_source = (targetX - sourceX) < 0;
  if (west_of_source) {
    return "M" + targetX + "," + targetY + "A" + dr + "," + dr + " 0 0,1 " + sourceX + "," + sourceY;
  } else {
    return "M" + sourceX + "," + sourceY + "A" + dr + "," + dr + " 0 0,1 " + targetX + "," + targetY;
  }
}
