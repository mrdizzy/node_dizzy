var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');

var url = 'http://www.colorhexa.com/color-names';



request(url, function(err, resp, body) {
    var $ = cheerio.load(body)
    var counter = 0;
    var results = {};
    var description = "";
   $('#color-list li a').each(function() {
       if (counter == 0) {
       description = $(this).text()
       
       counter++;
       } else {
           results[$(this).text()] = description;
           counter = 0;
       }
   })
   var color_objects = [];
   Object.keys(results).forEach(function(color) {
       color_objects.push({hex: color})
   })
   var sorted = sortColours(color_objects);
   var html = "<html><body>";
   sorted.forEach(function(hex) {
       html = html + "<div style='height:40px; width:40px;padding:5px;display:inline-block;background-color:" + hex.hex + ";'></div>";
   })
   html = html + "</body></html>"
   fs.writeFile("colors.html", html, function(err) {
    if(err) {
        console.log(err);
    } else {
        console.log("The file was saved!");
    }
}); 
    });
    
    
    
  function sortColours(colors) {
    for (var c = 0; c < colors.length; c++) {
        /* Get the hex value without hash symbol. */
        
        var hex = colors[c].hex.substring(1);
         
        /* Get the RGB values to calculate the Hue. */
        var r = parseInt(hex.substring(0,2),16)/255;
        var g = parseInt(hex.substring(2,4),16)/255;
        var b = parseInt(hex.substring(4,6),16)/255;
 
        /* Getting the Max and Min values for Chroma. */
        var max = Math.max.apply(Math, [r,g,b]);
        var min = Math.min.apply(Math, [r,g,b]);
 
        /* Variables for HSV value of hex color. */
        var chr = max-min;
        var hue = 0;
        var val = max;
        var sat = 0;
 
        if (val > 0) {
            /* Calculate Saturation only if Value isn't 0. */
            sat = chr/val;
            if (sat > 0) {
                if (r == max) { 
                    hue = 60*(((g-min)-(b-min))/chr);
                    if (hue < 0) {hue += 360;}
                } else if (g == max) { 
                    hue = 120+60*(((b-min)-(r-min))/chr); 
                } else if (b == max) { 
                    hue = 240+60*(((r-min)-(g-min))/chr); 
                }
            }
        }
         
        /* Modifies existing objects by adding HSV values. */
        colors[c].hue = hue;
        colors[c].sat = sat;
        colors[c].val = val;
    }
    var new_colours = [];
    colors.forEach(function(color) {
      if(color.sat > 0.55) {
          new_colours.push(color)
      }  
      
    })
    /* Sort by Hue. */
    return new_colours.sort(function(a,b){return a.hue - b.hue;});
}