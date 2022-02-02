function initializeHotkeys(){
  d3.select("body")
    .on("keydown", function(e) {
      if(e.keyCode === 67){ // C
        document.getElementById("capitals-checkbox").checked = !document.getElementById("capitals-checkbox").checked;
      } else if (e.keyCode === 69){ // E
        document.getElementById("direction-checkbox").checked = false;
      } else if (e.keyCode === 73){ // I
        document.getElementById("direction-checkbox").checked = true;
      } else if (e.keyCode === 76){ // L
        document.getElementById("links-checkbox").checked = !document.getElementById("links-checkbox").checked;
      }
      draw()
  });
}
