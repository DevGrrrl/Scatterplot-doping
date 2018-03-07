let dat;

d3
  .json(
    "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
  )
  .then(function(data) {
    calculateSecondsBehindFastest(data);
    // fancyTimeFormat(data);
  });

// function calculateSecondsBehindFastest(d) {
//   //think about non-mutatio  of array
//   var fastestTime = d[0].Seconds;
//   var cyclists = d.map(function(cyclist) {
//     var timeBehindSeconds = cyclist.Seconds - fastestTime;
//     var mins = Math.floor(timeBehindSeconds / 60);
//     var seconds = timeBehindSeconds - mins * 60;
//
//     cyclist.secondsBehindFastest = mins + ":" + seconds;
//     //instead return minutes & seconds behind fastestTime
//     console.log(cyclist.secondsBehindFastest);
//     return cyclist;
//   });
//
//   svgElements(cyclists);
//   // console.log(d);
// }
//calculate minutes behind fastest time
function calculateSecondsBehindFastest(d) {
  //think about non-mutatio  of array
  var dateTimes = [];
  var fastestTime = d[0].Seconds;
  var cyclists = d.map(function(cyclist) {
    var timeBehindSeconds = cyclist.Seconds - fastestTime;
    var mins = Math.floor(timeBehindSeconds / 60);
    var seconds = timeBehindSeconds - mins * 60;
    let theTime = new Date(99, 5, 24, 00, mins, seconds, 0);
    cyclist.dateTime = theTime;
    cyclist.secondsBehindFastest = cyclist.Seconds - fastestTime;
    return cyclist;
  });
  // console.log(cyclists);
  dete = cyclists[0];
  dat = cyclists;
  svgElements(cyclists);
  // console.log(d);
}
var dete;

var xScale;
var yScale;

var margin = { top: 60, right: 60, bottom: 80, left: 70 };

var chartWidth = 1100 - margin.left - margin.right;
var chartHeight = 700 - margin.top - margin.bottom;

function svgElements(cyclists) {
  var dataset = cyclists;

  var svg = d3
    .select("#chart")
    .append("svg")
    .attr("height", chartHeight + margin.left + margin.right)
    .attr("width", chartWidth + margin.bottom + margin.top)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // svg
  //   .append("h1")
  //   .text("Doping in Professional Bicycle Racing")
  //   .attr("class", "title")
  //   .attr("x", 340);

  //create scales

  var positions = dataset.map(function(e) {
    return e.Place;
  });

  yScale = d3
    .scaleLinear()
    .domain([d3.min(positions), d3.max(positions) + 1])
    .range([0, chartHeight]);

  // xScale = d3
  //   .scaleTime()
  //   .domain([
  //     d3.max(dataset, function(d) {
  //       // var time = d.Time.replace(/\:/g, ".");
  //       return d.secondsBehindFastest + 20;
  //     }),
  //     d3.min(dataset, function(d) {
  //       // var time = d.Time.replace(/\:/g, ".");
  //       // console.log(d.secondsBehindFastest);
  //       return d.secondsBehindFastest;
  //     })
  //   ])
  //   .range([0, chartWidth]);
  // let one = cyclists[0].dateTime;
  // console.log(new Date(one.setSeconds(one.getSeconds() + 30));

  // dataset.map(e => {
  //   let date = e.dateTime;
  //   return new Date(date.setSeconds(date.getSeconds()));
  // });
  //
  // var fastest = d3.max(dataset, function(d) {
  //   return d.dateTime;
  // });
  // var slowest = d3.min(dataset, function(d) {
  //   return d.dateTime;
  // });
  // console.log(slowest);
  // console.log(fastest);

  // var timeObj = dataset.map(function(e) {
  //   return e.dateTime;
  // });
  //
  // var slowest = timeObj[34];
  //
  // var slow = new Date(slowest.setSeconds(slowest.getSeconds() + 30));
  // console.log(slow);
  // console.log(dataset);

  xScale = d3
    .scaleTime()
    .domain([
      d3.max(dataset, function(d) {
        return d.dateTime;
      }),
      d3.min(dataset, function(d) {
        return d.dateTime;
      })
    ])
    .range([0, chartWidth]);

  //
  // console.log(cyclists);

  var allTimes = dataset.map(e => {
    return e.timeBehindSeconds;
  });
  // console.log(allTimes);
  var xAxis = d3
    .axisBottom(xScale)
    .ticks(5)
    .tickFormat(d3.timeFormat("%M:%S"), 5);

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

  // console.log(Math.ceil(yScale(dataset[32].Place)));

  //convert d.Time into times

  //create svgElements

  var circles = svg
    .selectAll("circle")
    .data(dataset)
    .enter()
    .append("circle")
    .attr("cx", function(d) {
      // console.log(d.dateTime);
      return xScale(d.dateTime);
    })
    .attr("cy", function(d) {
      return yScale(d.Place);
    })
    .attr("r", 5)
    .attr("fill", "#D1AB0E");

  // create axis
}
