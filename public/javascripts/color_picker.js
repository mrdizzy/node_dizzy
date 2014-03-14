;(function($) {
    // function to sort array into groups
    function inGroupsOf(arr, n){
      var ret = [];
      var group = [];
      var len = arr.length;
      var per = len * (n / len);

      for (var i = 0; i < len; ++i) {
        group.push(arr[i]);
        if ((i + 1) % n == 0) {
          ret.push(group);
          group = [];
        }
      }
      if (group.length) ret.push(group);
      return ret;
    };
        
  $.fn.colorPicker = function(options) {
  var that = this;
    var settings = $.extend({},  $.fn.colorPicker.defaultOptions, options);
    var colour_groups = inGroupsOf(Object.keys(settings.colour_list), settings.colours_per_page)
    
    var pointer = 0;
    // find grid containing the default selected colour
    for (var i=0; i < colour_groups.length; i++) {
      var result = colour_groups[i].indexOf(settings.default_color)
      if(result > -1) {
      pointer = i;
        break;
      }
    }
    //static container
    var $static_container = $('<div></div>').addClass('dizzycp-static_container')
    var $text_label_for_colour = $('<div>' + settings.colour_list[settings.default_color] + '</div>').addClass("dizzycp-text_label_for_colour")
    var $big_colour_square_frame = $('<div></div>').addClass('dizzycp-big_colour_square_frame')
    var $big_colour_square_swatch = $('<div></div>').css("background-color", settings.default_color).addClass('dizzycp-big_colour_square_swatch')
    
    $big_colour_square_frame.append($big_colour_square_swatch)
    var $swatch = $('<div></div>').addClass("dizzycp-swatch_container")
    $swatch.append($big_colour_square_frame).append($text_label_for_colour)
    
    // container to fade in
    var $container_to_fade_in = $static_container.clone().addClass("dizzycp-container_to_fade_in")
    
    // compile containers
    $static_container.append($swatch)

    // Colour grids
    var counter = 0;
    
     var $divs = []
    colour_groups.forEach(function(colours) {
        var $div = $("<div></div>")
        $divs.push($div)
        $.fn.colorPicker.formatColours($div, colours, settings.swatches_per_row);
        if(counter != pointer ) {
            $div.css({display:"none"})
        }
        counter++
    })
    
     var $table = $('<table></table>').addClass("dizzycp").prepend("<td class='dizzycp-left'>&laquo</td>");
     var $td = $('<td></td>').addClass("dizzycp-swatch_cell").html($divs)
     $table.append($td).append("<td class='dizzycp-right'>&raquo;</td>")    

    $container_to_fade_in.append($table)
        
    var $wrapper = $('<div></div>').append($static_container).append($container_to_fade_in)
    $wrapper.css("position", "relative")
   // Hover over a swatch
    $wrapper.on('mouseenter', 'div.dizzycp-small_swatch_frame', function() {    
        var chosen_colour = $(this).data("colour");
        $big_colour_square_swatch.css("background-color",chosen_colour)
        $text_label_for_colour.text(settings.colour_list[chosen_colour])        
        that.trigger('dizzy-cp:hoverColor', chosen_colour)
    })      
    
    // Click on a swatch    
    $wrapper.on('click', 'div.dizzycp-small_swatch_frame', function() {
        $container_to_fade_in.hide();
    })  
    
    // Enter big swatch    
    $big_colour_square_frame.mouseenter(function() {   
        $static_container.addClass("dizzycp-container_selected")
        $container_to_fade_in.addClass("dizzycp-container_selected")
        $container_to_fade_in.fadeIn();
    })
    
    // Leave wrapper
    $wrapper.mouseleave(function() {  
        $static_container.removeClass("dizzycp-container_selected")
        $container_to_fade_in.removeClass("dizzycp-container_selected")  
        $container_to_fade_in.fadeOut();
    })   
   
   // Navigate between palettes
   this.on('click', '.dizzycp-left', function() {
       if(pointer > 0) {
           $divs[pointer].hide();
           pointer = pointer -1;
           $divs[pointer].show();
       }
   })
   
 this.on('click', '.dizzycp-right', function() {
   if(pointer < $divs.length - 1) {
       $divs[pointer].hide();
       pointer = pointer + 1;
       $divs[pointer].show();
       }
   })
 this.html($wrapper)
    
  return this;
  }
  $.fn.colorPicker.formatColours = function($div, colours, per_row) {
  var counter = 0;
      colours.forEach(function(colour) {
      if(counter == per_row) { // break row
          $div.append("<br/>")
          counter = 0;
      } 
        $swatch = $("<div class='dizzycp-small_swatch_frame'><div class='dizzycp-small_swatch' style='background-color:" + colour + "'></div></div>").data("colour", colour)
        $div.append($swatch)
        counter++;
    })
    }
    $.fn.colorPicker.defaultOptions ={
            colours_per_page: 16,
            default_color: '#cd5c5c',
            swatches_per_row: 4
        }
})(jQuery)