//Definir paleta de colores y rangos de temperatura
var ColorPalet = [
  "#db1c1c",
  "#db601c",
  "#e99b39",
  "#dac87c",
  "#e4ddbf",
  "#bfd6e4",
  "#77bae3",
  "#2f9cdf",
  "#047ec9",
];
var MonthsAux = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
ColorPalet = ColorPalet.reverse();
var tempvariance = [2.8, 3.9, 5.0, 6.1, 7.2, 8.3, 9.5, 10.6, 11.7, 12.8];
var legendspace = [35, 70, 105, 140, 175, 210, 245, 280, 315, 350];

//creacion de la leyenda
var legendContainer = d3
  .select("#legend")
  .append("svg")
  .attr("width", 500)
  .attr("height", 140);

legendXscale = d3.scaleOrdinal().domain(tempvariance).range(legendspace);
var legend_x_axis = d3.axisBottom().scale(legendXscale);

legendContainer
  .append("g")
  .attr("id", "legend-x-axis")
  .attr("transform", "translate(0, 120)")
  .call(legend_x_axis);

legendContainer
  .selectAll("rect")
  .data(ColorPalet)
  .enter()
  .append("rect")
  .style("fill", function (d, i) {
    return ColorPalet[i];
  })
  .attr("x", function (d, i) {
    return (i + 1) * 35;
  })
  .attr("y", function (d, i) {
    return 95;
  })
  .attr("width", 34)
  .attr("height", (d, i) => {
    return 25;
  });
//extracion de data por medio del json
var data_url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";

async function fetchData(id) {
  try {
    const response = await fetch(id, {
      method: "GET",
      credentials: "same-origin",
    });
    const test = await response.json();
    return test;
  } catch (error) {
    console.error(error);
  }
}
//definiciones para el grafico
var Months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
var space = [480, 440, 400, 360, 320, 280, 240, 200, 160, 120, 80, 40];
var barSpaceY = 480 / 12;
var chartWidth = 1350;
var chartHeight = 600;

var svgContainer = d3
  .select("#chart")
  .append("svg")
  .attr("width", chartWidth)
  .attr("height", chartHeight);

//div usado para mostrar data al hover(cuando el click esta encima del elemento)
var tooltip = d3
  .select(".visHolder")
  .append("div")
  .attr("id", "tooltip")
  .style("opacity", 0);

async function renderHeatmap(id) {
  const response = await fetchData(id);
  var yearsArray = response.monthlyVariance.map(function (item) {
    return item.year;
  });
  xMax = d3.max(yearsArray);
  xMin = d3.min(yearsArray);

  var yScale = d3.scaleOrdinal().domain(Months.reverse()).range(space);
  var xScale = d3
    .scaleLinear()
    .domain([xMin, xMax])
    .range([70, chartWidth - 40]);

  var y_axis = d3.axisLeft().scale(yScale);
  var x_axis = d3
    .axisBottom()
    .scale(xScale)
    .tickSize(8, 1)
    .tickValues(
      yearsArray.filter(function (year) {
        // set ticks to years divisible by 10
        return year % 10 === 0;
      })
    )
    .tickFormat(d3.format("d"));

  svgContainer
    .append("g")
    .attr("id", "y-axis")
    .attr("transform", "translate(69,70)")
    .call(y_axis);

  svgContainer
    .append("g")
    .attr("id", "x-axis")
    .attr("transform", "translate(0, 570)")
    .call(x_axis);

  svgContainer
    .selectAll("rect")
    .data(response.monthlyVariance)
    .enter()
    .append("rect")
    .attr("class", "cell")
    .attr("data-month", function (d) {
      return d.month - 1;
    })
    .attr("data-year", function (d) {
      return d.year;
    })
    .attr("data-temp", function (d) {
      return d.variance;
    })
    .style("fill", function (d) {
      var current = d.variance + 8.66;
      var x = 0;
      for (x = 0; x < tempvariance.length; x++) {
        if (current > tempvariance[x] && current < tempvariance[x + 1]) {
          return ColorPalet[x];
        }
        if (x == 0 && current < tempvariance[x]) {
          return ColorPalet[x];
        }
      }

      return ColorPalet[ColorPalet.length - 1];
    })
    .attr("x", function (d) {
      return xScale(d.year);
    })
    .attr("y", function (d) {
      return chartHeight - 30 - yScale(d.month);
    })
    .attr("width", 4)
    .attr("height", barSpaceY)
    .on("mouseover", (d, i) => {
      tooltip
        .transition()
        .duration(200)
        .attr("data-year", i.year)
        .style("opacity", 0.9)
        .style("left", d.screenX - 60 + "px")
        .style("top", d.screenY - 190 + "px");
      console.log(i);
      tooltip.html(
        i.year +
          " - " +
          MonthsAux[i.month - 1] +
          "<br><br>" +
          (i.variance + 8.66).toFixed(3) +
          "<br>" +
          i.variance
      );
    })
    .on("mouseout", (d, i) => {
      tooltip.transition().duration(200).style("opacity", 0);
    });
}
renderHeatmap(data_url);
