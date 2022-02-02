const scaleMBT = val => {
  // note: values are all in millions as default
  if (val > 1000000) return "trillion"
  return (val > 1000) ? "billion" : "million"
}

const scaleNum = val => {
  if (val > 1000000) val = val/1000000
  if (val > 1000) val = val/1000
  if (val < 10) return val.toFixed(1)
  return Math.round(val)
}

const updateTitle = i => {
  let countryA = tiles.held.current ? tiles.held.current : i.properties.name;
  document.getElementById("tit-country").textContent = countryA;
  let titleDirection = getDirection() == 'import' ? 'Imports to' : 'Exports from'
  document.getElementById("tit-direction").textContent = titleDirection;
}

const updateInfo1 = i => {
  let countryA = tiles.held.current ? tiles.held.current : i.properties.name;
  let countrySum = d3.sum(data['2020'].filter( e => e.CountryA == countryA && e.Direction == getDirection()).map(e => +e.Value))
  let string = `In 2020, ${countryA} had $${scaleNum(countrySum)} ${scaleMBT(countrySum)} worth of ${getDirection()}s.`
  document.getElementById("info-1").textContent = string
}

const colorScale = d3.scaleThreshold()
.domain([0, 100, 1000, 10000, 100000, 1000000])
.range(["#FEE08B", "#FFFFBF", "#E6F598", "#ABDDA4", "#66C2A5", "#3288BD", "#5E4FA2"]);

const getCountryFill = d => {
  if (tiles.held.current == d.properties.name) return "hotpink"
  if (tiles.hover.current == "Ocean" && !tiles.held.current) return fillNationalSum(d)
  else return fillCountrySingle(d)
}

const fillCountrySingle = d => {
  let countryA = tiles.held.current ? tiles.held.current : tiles.hover.current
  let interCountryData = data['2020'].filter(
    e => e.CountryA == countryA &&
    e.Direction == getDirection() &&
    e.CountryB == d.properties.name)
  let value = interCountryData[0] ? parseFloat(interCountryData[0].Value) : 0
  return colorScale(value)
}

const fillNationalSum = d => {
  let sum = d3.sum(data['2020']
              .filter(e => e.CountryA == d.properties.name && e.Direction == getDirection())
              .map(e => +e.Value))
  return colorScale(sum)
}




const redrawSingleCountry = countryName => {
  const onHeldClick = (d,i) => {
    tiles.held.current = (tiles.held.current == i.properties.name) ? "" : i.properties.name;
    draw()
  }
  g.select(`#${countryName}`).remove();
  g.append("g")
    .selectAll("path")
    .data(data['countries'].features.filter(d => d.properties.name == countryName))
    .join("path")
    .attr("class","country-highlighted")
    .attr("id", (d, i) => d.properties.name)
    .attr("d", path)
    .attr("stroke", "hotpink")
    .attr("stroke-width", Math.max(1.5, 3-currentZoom/2))
    .attr("fill", (d, i) => getCountryFill(d))
    .on("click", (d,i) => onHeldClick(d,i))
}

const drawAllCountries = () => {
  g.append("g")
    .selectAll("path")
    .data(data['countries'].features)
    .join("path")
    .attr("class","country")
    .attr("id", (d, i) => d.properties.name)
    .attr("d", path)
    .attr("fill", (d, i) => getCountryFill(d))
    .on('mouseover', function (d, i) {
      createLinks(i)
      updateTitle(i)
      updateInfo1(i)
      if(tiles.held.current){
        updateInfo2(i)
        redrawSingleCountry(tiles.hover.current)
        lonks.remove();
        lonks = drawLinks()
      } else {
        document.getElementById('info-2').style.color = 'lightblue'
        d3.select(this)
          .style('fill', 'hotpink');
      }
    })
    .on("click", function(d,i) {
      if (tiles.held.current == i.properties.name) tiles.held.current = ""
      else tiles.held.current = i.properties.name
    })
}
