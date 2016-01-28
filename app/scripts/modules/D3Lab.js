$(document).ready(function(){
  var objets;
  var objetShapes = {buildings:[], roads:[], amenities:[], naturals:[]};

  $.get("data/eure.json").success(function(data){
     objets = data;
     objetShapes = {buildings:[], roads:[], amenities:[], naturals:[]};

      for (var i = 0; i < objets.length; i++){
        if (objets[i].hasOwnProperty("building") && objets[i].building === true) {
         objetShapes.buildings.push(window.Shapes.createBuilding(objets[i]));
       }
       else if (objets[i].hasOwnProperty("amenity")){
         objetShapes.amenities.push(window.Shapes.createAmenity(objets[i]));
       }
       else if (objets[i].hasOwnProperty("highway")) {
         objetShapes.roads.push(window.Shapes.createRoad(objets[i]));
       }
       else if (objets[i].hasOwnProperty("natural")) {
         objetShapes.naturals.push(window.Shapes.createNatural(objets[i]));
       }
     }

     draw();
  });

  function draw() {
    var zoom = d3.behavior.zoom()
      .scaleExtent([1, 10])
      .on("zoom", zoomed);

    var container = d3.select("div")
      .append("svg")
      .attr("width", $(window).width())
      .attr("height", $(window).height())
      .call(zoom)
      .append("g");

    function zoomed() {
      container.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    }

      for (var i = 0; i < objetShapes.naturals.length; i++)
        container.append("path")
        .attr("d", objetShapes.naturals[i].toSvgPath())
        .attr("stroke", "black")
        .attr("fill", "green");

      for (var i = 0; i < objetShapes.amenities.length; i++)
        container.append("path")
        .attr("d", objetShapes.amenities[i].toSvgPath())
        .attr("stroke", "black")
        .attr("fill", "blue");

      for (var i = 0; i < objetShapes.roads.length; i++)
        container.append("path")
        .attr("d", objetShapes.roads[i].toSvgPath())
        .attr("stroke", "black")
        .attr("fill", "none");

      for (var i = 0; i < objetShapes.buildings.length; i++) {
        container.append("path")
        .attr("d", objetShapes.buildings[i].toSvgPath())
        .attr("compteur", i)
        .attr("stroke", "black")
        .attr("fill", "grey")
        .on("click", function(){
          var compteur = d3.select(this).attr("compteur");
          var id = objetShapes.buildings[compteur].id();
          var nom = objetShapes.buildings[compteur].getName();
          var surface = objetShapes.buildings[compteur].getArea();

          if(document.getElementById("text"))  {
            var textInfo = document.getElementById("text");
            textInfo.parentNode.removeChild(textInfo);
          }
          if (document.getElementById("box")) {
            var boxInfo = document.getElementById("box");
            boxInfo.parentNode.removeChild(boxInfo);
          }
          d3.selectAll("path[style]").attr("style", null);

          d3.select(this).style("fill", "red");

          var coordonneesSouris = [0, 0];
          coordonneesSouris = d3.mouse(this);
          var x = coordonneesSouris[0]+5;
          var y = coordonneesSouris[1]+18;

          var text = container.append('text')
            .style("fill", "white")
            .attr("id", "text")
            .attr("x", x)
            .attr("y", y);
            text.append("tspan")
            .attr("x", x)
            .attr("y", y)
            .text("ID : " + id);
            text.append("tspan")
            .attr("x", x)
            .attr("y", y + 15)
            .text("Surface : " + surface + " m²");
            /*text.append("tspan")
            .attr("x", x)
            .attr("y", y + 30)
            .text("Nom : " + nom);*/

          var bbox = text[0][0].getBBox();
          var rect = container.insert('rect', 'text')
            .attr("id", "box")
            .attr('x', bbox.x - 5)
            .attr('y', bbox.y - 5)
            .attr('width', bbox.width + 10)
            .attr('height', bbox.height + 10)
            .attr("fill", "black")
            .attr("opacity", "0.8");
        })
        .on("mouseover", function(){
          d3.select(this)
          .attr("fill", "yellow");
        })
        .on("mouseout", function(){
          d3.select(this)
          .attr("fill", "grey");
        });
        }
  }
});
