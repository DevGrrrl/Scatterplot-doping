d3
  .json(
    "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
  )
  .then(function(data) {
    calculateSecondsBehindFastest(data);
  });

//calculate minutes behind fastest time
function calculateSecondsBehindFastest(d) {
  //copy data to avoid mutation
  var dataCopy = [];
  d.map(function(cyclist) {
    var obj = Object.assign({}, cyclist);
    dataCopy.push(obj);
  });
  var fastestTime = d[0].Seconds;
  dataCopy.map(function(cyclist) {
    var secondsBehind = cyclist.Seconds - fastestTime;
    var minutes = Math.floor(secondsBehind / 60);
    var seconds = secondsBehind - minutes * 60;
    var timeParse = d3.timeParse("%M:%S");
    var theTime = timeParse(minutes + ":" + seconds);
    cyclist.dateTime = theTime;
    return cyclist;
  });
  svgElements(dataCopy);
}

var xScale;
var yScale;

var margin = { top: 90, right: 200, bottom: 80, left: 70 };

var chartWidth = 800 - margin.left - margin.right;
var chartHeight = 600 - margin.top - margin.bottom;

function svgElements(cyclists) {
  var dataset = cyclists;

  var svg = d3
    .select("#chart")
    .append("svg")
    .attr("height", chartHeight + margin.bottom + margin.top)
    .attr("width", chartWidth + margin.left + margin.right)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  //Title & headings
  svg
    .append("text")
    .text("Doping in Professional Bicycle Racing")
    .attr("class", "heading")
    .attr("x", 135)
    .attr("y", -50);

  svg
    .append("text")
    .text("35 Fastest times up Alpe d'Huez")
    .attr("class", "subheading")
    .attr("x", 220)
    .attr("y", -20);

  svg
    .append("text")
    .text("Normalized to 13.8km distance")
    .attr("class", "smallheading")
    .attr("x", 247)
    .attr("y", 0);

  //Keys

  svg
    .append("circle")
    .attr("cx", 500)
    .attr("cy", 200)
    .attr("r", 5)
    .attr("fill", "#E3B94F");
  svg
    .append("text")
    .attr("class", "key")
    .attr("x", 520)
    .attr("y", 205)
    .text("No doping allegations");

  svg
    .append("circle")
    .attr("cx", 500)
    .attr("cy", 225)
    .attr("r", 5)
    .attr("fill", "rgb(194, 111, 251)");
  svg
    .append("text")
    .attr("class", "key")
    .attr("x", 520)
    .attr("y", 230)
    .text("Riders with doping allegations");

  //create scales

  var ranking = dataset.map(function(e) {
    return e.Place;
  });

  yScale = d3
    .scaleLinear()
    .domain([d3.min(ranking), d3.max(ranking) + 1])
    .range([0, chartHeight]);

  var timeParse = d3.timeParse("%M:%S");
  var maxTime = timeParse("03:10");
  var minTime = timeParse("00:00");

  xScale = d3
    .scaleTime()
    .domain([
      maxTime,
      d3.min(dataset, function(d) {
        return d.dateTime;
      })
    ])
    .range([0, chartWidth]);

  var allTimes = dataset.map(e => {
    return e.secondsBehind;
  });

  // create axes

  var xAxis = d3
    .axisBottom(xScale)
    .ticks(6)
    .tickFormat(d3.timeFormat("%M:%S"), 6);

  svg
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", "translate(0," + chartHeight + ")")
    .call(xAxis);

  var yAxis = d3.axisLeft(yScale);

  svg
    .append("g")
    .attr("class", "y-axis")
    .call(yAxis);

  //create svgElements
  svg
    .append("g")
    .selectAll("circle")
    .data(dataset)
    .enter()
    .append("circle")
    .attr("cx", function(d) {
      return xScale(d.dateTime);
    })
    .attr("cy", function(d) {
      return yScale(d.Place);
    })
    .attr("r", 5)
    .attr("fill", function(d) {
      return d.Doping.length > 0 ? "rgb(194, 111, 251)" : "#E3B94F";
    })

    .on("mouseover", function(d) {
      d3
        .select(this)
        .attr("stroke", "rgb(1, 1, 1)")
        .style("cursor", "pointer");

      d3
        .select("#tooltip")
        .style("background-color", "#E3B94F")
        .style("opacity", "0.8")
        .style("left", 100 + "px")
        .style("top", 100 + "px")
        .style("display", "block")

        .html(
          d.Name +
            ": " +
            d.Nationality +
            "</br>" +
            d.Year +
            ", Time: " +
            d.Time +
            "</br>" +
            "</br>" +
            d.Doping
        );
    })
    .on("mouseout", function() {
      d3.select("#tooltip").style("display", "none");
      d3
        .select(this)
        .attr("stroke", "none")
        .style("cursor", "default");
    });

  svg
    .append("g")
    .selectAll("text")
    .data(dataset)
    .enter()
    .append("text")
    .text(function(d) {
      return d.Name;
    })
    .attr("x", function(d) {
      return xScale(d.dateTime) + 10;
    })
    .attr("y", function(d) {
      return yScale(d.Place) + 5;
    })
    .style("font-family", "sans-serif")
    .style("font-size", 12)
    .attr("class", "names");

  svg
    .append("text")
    .text("Minutes behind fastest time")
    .attr("class", "xInfo")
    .attr("y", chartHeight + margin.top - 35)
    .attr("x", 340);

  svg
    .append("text")
    .text("Ranking")
    .attr("class", "yInfo")
    .attr("y", -35)
    .attr("transform", "rotate(-90)")
    .attr("x", -55);
}
