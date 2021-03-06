// Functions pertaining to the links (lines) between countries (press L)

// Creates an array with the data for creating links between countries
// Each link contains the names of the linked countries, the source and target coordinates, and
// the link value (the amount of trade in millions) and weight (calculated width of the link)
// Can be called with only countryA or can be called with both countryA and countryB
// If only countryA, it will return links between countryA and all other countries (up to ~200)
// If both countryA and countryB, then only one link (between the two coutnries) will be returned
const createLinkArray = (countryA, countryB = "") => {
  // Get all applicable links for only countryA
  let countryData = getSingleCountryData(countryA, getDirection())

  // If countryB was provided, filter data to only include the one link between countryA and countryB
  countryData = countryB ? countryData.filter(d => d.CountryB == countryB) : countryData

  // Use the map command to map data into actual links by adding it to the dictionary
  let links = countryData.map( d => {
    return {
      'CountryA' : d.CountryA,
      'CountryB' : d.CountryB,
      'source': [+d.CapA_Lon, +d.CapA_Lat],
      'target': [+d.CapB_Lon, +d.CapB_Lat],
      'value' : +d.Value, // actual trade value (in millions of USD)
      'weight': 2*(+d.Value)**0.2 // formula to calculate realtive width of link
    }
  })

  // Sort links according to weight (so the most common trade routes are on top)
  links = links.sort((a,b) => d3.descending(+a.weight, +b.weight))
  return links
}

// Update the link arrays to hold the new links, and redraw the map.
const updateLinks = i => {
  if (tiles.held.current) {
    // Get single link between held country and hovered country
    links = createLinkArray(tiles.held.current, tiles.hover.current)
    draw()
  } else if (tiles.hover.current != tiles.hover.previous){
    // Get links between hovered country and all other countries
    links = createLinkArray(tiles.hover.current)
    // Slice array to only include the number of requested links based on settings
    number_of_links = parseInt($("#links-number").val())
    links = links.slice(0, number_of_links);
    draw()
  }
}

// Get the color of the link based on the trade direction of interest
const getLinkColor = () => {
  let direction = getDirection();
  if (direction == 'import') return 'blue'
  if (direction == 'export') return 'purple'
  if (direction == 'net') return 'orange'
}

// Remove all links form the map based on class name .link
const removeAllLinks = () => d3.selectAll('.link').remove();

// Returns boolean based on whether links 'should' be displayed currently
const displayLinks = () => (getLinks() && tiles.hover.current != "Ocean");

// Draw the links on the map if the option is selected.
function drawLinks(){
  if (!displayLinks()) return land.append("g")
  removeAllLinks()
  const lonks = land.append("g")
    .selectAll("myPath")
    .data(links)
    .enter()
    .append("path")
    .attr("class","link")
    .attr('d', d => linkToArc(d, 3))
    .style("stroke-width", d => d.weight/2 )
    .style('stroke', getLinkColor())
    .on('mouseover', function (d, i) {
        if (!tiles.held.current){
          updateSubtitle2(i)
          d3.select(this).style('stroke', 'green');
       }
    })
    .on('mouseout', function (d, i) {
      $('#info-2').empty();
      d3.select(this).style('stroke', getLinkColor());
    });
  return lonks
}

// Updates the second subtitle under the map title
// The second subtitle desrcribes the interchange between countryA and CountryB
const updateSubtitle2 = i => {
  // Color text black to display subtitle
  $('#info-2').css('color','black')

  // Get countryA and countryB names and the value of link
  if (tiles.held.current) {
    // If a country is hovered over while another is held
    countryA = tiles.held.current; countryB = i.properties.name;
    value = getInterCountrySum(countryA, countryB, getDirection())
  } else {
    // If the link itself is hovered over
    countryA = i.CountryA; countryB = i.CountryB;
    value = i.value
  }

  // Get country sum to caclulate the percentage of trade accounted for by the link
  let countrySum = getSingleCountrySum(countryA, getDirection())
  let percent = Math.round(100*value/countrySum);

  // Use direction to get proper past tense verb for subtitle
  let direction = getDirection();
  if (direction == 'import') action = 'provided'
  if (direction == 'export') action = 'received'
  if (direction == 'net') action = 'accounted for'

  // Combine the above gathered info into a single string and set as subtitle
  $('#info-2').html(`Of which, <span class='info-2-countryB'>${countryB}</span> ${action} $${scaleNum(value)} ${scaleMBT(value)} (${percent}%).`)
  $('.info-2-countryB').css({'color': 'hotpink', '-webkit-text-stroke': '0.8px black'})
}

// Determine the path of the link between countryA and countryB
// Based on the bend factor, where a lower number means more bend
const linkToArc = (d, bend = 1) => {
  // Get longitude and latitude of source and target points
  let sourceLngLat = d['source'], targetLngLat = d['target'];

  // If either of the previous arrays are invalid, return a 'null line'
  if (!(targetLngLat && sourceLngLat)) return "M0,0,l0,0z";

  // Use projection to calculate SVG coordinates of source and target locations
  let sourceXY = projection(sourceLngLat), targetXY = projection(targetLngLat);

  // Split up source and target arrays into the seperate x and y SVG coordinates
  let sourceX = sourceXY[0], sourceY = sourceXY[1];
  let targetX = targetXY[0], targetY = targetXY[1];

  // Calculate change in x and y, from target to source
  let dx = targetX - sourceX, dy = targetY - sourceY;

  // Calculate the arc of link, accounting for the given bend factor
  let dr = Math.sqrt(dx * dx + dy * dy) * bend;

  // To avoid a whirlpool effect, and make the bend direction consistent,
  // determine whether the target was west or east of the source
  var west_of_source = (targetX - sourceX) < 0;

  // Return d attribute of path determined by whether target was west of source
  if (west_of_source) {
    return "M" + targetX + "," + targetY + "A" + dr + "," + dr + " 0 0,1 " + sourceX + "," + sourceY;
  } else {
    return "M" + sourceX + "," + sourceY + "A" + dr + "," + dr + " 0 0,1 " + targetX + "," + targetY;
  }
}
