// Scale number ending based on the size in million, billion, trillion
// Goes with scaleNum()
const scaleMBT = val => {
  // note: values are all in millions as default
  if (Math.abs(val) > 1000000) return "trillion"
  return (Math.abs(val) > 1000) ? "billion" : "million"
}

// Scale the number to fit with the million, billion, trillions ending
// Goes with scaleMBT()
const scaleNum = val => {
  if (Math.abs(val) > 1000000) val = val/1000000
  if (Math.abs(val) > 1000) val = val/1000
  if (Math.abs(val) < 10) return val.toFixed(1)
  return Math.round(val)
}

const updateTitle = (i=null) => {
  if (i == null || tiles.hover.current == "Ocean"){
    let titleDirection = $('#direction-select').find(":selected").text()
    $('.title').html(`<span id="title-country">Worldwide</span> <span id="title-direction">${titleDirection.slice(0,-4)}</span>`)
  } else {
    let countryA = tiles.held.current ? tiles.held.current : i.properties.name;
    let direction = getDirection()
    if (direction == 'import') titleDirection = 'Imports to'
    if (direction == 'export') titleDirection = 'Exports from'
    if (direction == 'net') titleDirection    = 'Net Exports from'
    $('.title').html(`<span id="title-direction">${titleDirection}</span> <span id="title-country">${countryA}</span>`)
  }
}

const updateSubtitle1 = i => {
  let string = ""
  if (tiles.hover.current != "Ocean"){
    let countryA = tiles.held.current ? tiles.held.current : i.properties.name;
    let countrySum = getSingleCountrySum(countryA, getDirection())
    let direc = getDirection() == 'net' ? 'net export' : getDirection()
    string = `In 2020, ${countryA} had $${scaleNum(countrySum)} ${scaleMBT(countrySum)} worth of ${direc}s.`
  }
  document.getElementById("info-1").textContent = string
}

const getSingleCountryData = (countryA, direction) => {
  return data['2020'].filter( e => e.CountryA == countryA && e.Direction == direction )
}

const getSingleCountrySum = (countryA, direction) => {
  if (direction != 'net') {
    return d3.sum(getSingleCountryData(countryA, direction).map(e => +e.Value))
  } else {
    return (
      d3.sum(getSingleCountryData(countryA, 'export').map(e => +e.Value)) -
      d3.sum(getSingleCountryData(countryA, 'import').map(e => +e.Value))
    )
  }
}

const getInterCountryData = (countryA, countryB, direction) => {
  return data['2020'].filter( e => e.CountryA == countryA && e.CountryB == countryB && e.Direction == direction )
}

const getInterCountrySum = (countryA, countryB, direction) => {
  if (direction != 'net') {
    return d3.sum(getInterCountryData(countryA, countryB, direction).map(e => +e.Value))
  } else {
    return (
      d3.sum(getInterCountryData(countryA, countryB, 'export').map(e => +e.Value)) -
      d3.sum(getInterCountryData(countryA, countryB, 'import').map(e => +e.Value))
    )
  }}

const getColor = x => {
  if (getDirection() != 'net') return colorImportExport(x)
  else return colorNetExports(x)
}

const colorImportExport = x => {
  if (x < 0.1) return "#ddd"
  const breaks = [0, 10, 100, 1000, 10000, 100000, 1000000, 2000000];
  const colors = ["#FFFFD6","#FFFFB5", "#E6F598", "#ABDDA4", "#66C2A5", "#3288BD", "#5E4FA2","#6d4895"];
  let count = 0;
  breaks.forEach(n => { if(n<x) count++ });
  const a = breaks[count-1],
        b = breaks[count];
  const colorA = colors[count-1],
        colorB = colors[count];
  const t = (x-a)/(b-a)
  return d3.interpolateLab(colorA, colorB)(t)
}

const colorNetExports = x => {
  if (x == 0) return "#ddd"
  const breaks = [-1000000,-100000,-10000,-1000,-100,0,100,1000,10000,100000,1000000];
  const colors = ["#9e160e","#d73027","#f46d43","#fdae61","#fee08b","#ddd","#d9ef8b","#a6d96a","#66bd63","#1a9850","#0a6b33"]
  let count = 0;
  breaks.forEach(n => { if(n<x) count++ });
  const a = breaks[count-1],
        b = breaks[count];
  const colorA = colors[count-1],
        colorB = colors[count];
  const t = (x-a)/(b-a)
  return d3.interpolateLab(colorA, colorB)(t)
}

const getCountryFill = d => {
  if (tiles.held.current == d.properties.name) return "hotpink"
  if (tiles.hover.current == "Ocean" && !tiles.held.current) return fillNationalSum(d)
  else return fillCountrySingle(d)
}

const fillCountrySingle = d => {
  let countryA = tiles.held.current ? tiles.held.current : tiles.hover.current
  let countryB = d.properties.name
  let interCountrySum = getInterCountrySum(countryA, countryB, getDirection())
  return getColor(interCountrySum)
}

const fillNationalSum = d => getColor(getSingleCountrySum(d.properties.name, getDirection()))

const redrawSingleCountry = countryName => {
  const onHeldClick = (d,i) => {
    tiles.held.current = (tiles.held.current == i.properties.name) ? "" : i.properties.name;
    draw()
  }
  land.select(`#${countryName}`).remove();
  land.append("g")
    .selectAll("path")
    .data(data['countries'].features.filter(d => d.properties.name == countryName))
    .join("path")
    .attr("class","country-highlighted")
    .attr("id", (d, i) => d.properties.name)
    .attr("d", (d, i) => {
      if (d.properties.size == "small") return drawSmallCountry(d)
      return path(d)
    })
    .attr("stroke", "hotpink")
    .attr("stroke-width", Math.max(1.5, 3-currentZoom/2))
    .attr("fill", (d, i) => getCountryFill(d))
    .on("click", (d,i) => onHeldClick(d,i))
}

const drawSmallCountry = d => {
  coords = d.geometry.coordinates[0][0]
  avg_lon = d3.median(coords.map(c => c[0]))
  avg_lat = d3.median(coords.map(c => c[1]))
  lon = projection([avg_lon,avg_lat])[0]
  lat = projection([avg_lon,avg_lat])[1]
  r = 3
  return `M ${lon}, ${lat} m -${r}, 0 a ${r},${r} 0 1,0 ${2*r},0 a ${r},${r} 0 1,0 -${2*r},0`
}

const drawAllCountries = () => {
  land.append("g")
    .selectAll("path")
    .data(data['countries'].features.sort((a,b) => d3.ascending(a.properties.size, b.properties.size)))
    .join("path")
    .attr("class","country")
    .attr("id", (d, i) => d.properties.name)
    .attr("d", (d, i) => {
      if (d.properties.size == "small") return drawSmallCountry(d)
      return path(d)
    })
    .attr("fill", (d, i) => getCountryFill(d))
    .on('mouseover', function (d, i) {
      updateHoveredTile(i)
      updateLinks(i)
      updateTitle(i)
      updateSubtitle1(i)
      if(tiles.held.current){
        updateSubtitle2(i)
        redrawSingleCountry(tiles.hover.current)
        removeAllLinks()
        lonks = drawLinks()
      } else {
        $('#info-2').empty();
        d3.select(this)
          .style('fill', 'hotpink');
      }
    })
    .on("click", function(d,i) {
      if (tiles.held.current == i.properties.name) tiles.held.current = ""
      else tiles.held.current = i.properties.name
    })
}

const updateHoveredTile = i => {
  tiles.hover.previous = tiles.hover.current
  tiles.hover.current = i.properties.name
}
