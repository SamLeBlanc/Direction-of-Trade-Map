// Functions to collect the user-selected map settings
const getDirection = () => $('#direction-select').val()
const getLinks = () => $('#links-checkbox').is(':checked')
const getCapitals = () => $('#capitals-checkbox').is(':checked')

const centerHeading = () => {
  let innerWidth = window.innerWidth;
  let headingWidth = parseInt($('.heading').css('width'));
  $('.heading').css('left', 0.5 * (innerWidth - headingWidth))
}

// Creates the hotkey infrastructure that allows for fast changing of settings
// After any of the hotkeys are pressed, the map is redrawn
// E: toggle exports // I: toggle imports // N: toggle net exports
// C: toggle capitals // L: toggle links
const initializeHotkeys = () => {
  centerHeading()
  d3.select("body")
    .on("keydown", e => {
      if(e.keyCode === 67){ // C
        $('#capitals-checkbox').prop('checked', !getCapitals());
      } else if (e.keyCode === 69){ // E
        $("#direction-select").val("export");
      } else if (e.keyCode === 73){ // I
        $("#direction-select").val("import");
      } else if (e.keyCode === 78){ // N
        $("#direction-select").val("net");
      } else if (e.keyCode === 76){ // L
        $('#links-checkbox').prop('checked', !getLinks());
      }
      draw() // redraw map after hotkey is pressed
  });
}
