function buildMetadata(selectedID) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the selected ID number:
    var resultArray = metadata.filter(sampleObj => sampleObj.id == selectedID);
    var result = resultArray[0];
    var PANEL = d3.select("#sample-metadata");
    // Use "" to clear out any existing data
    PANEL.html("");
    // Add the key & value pairs to the panel:
    PANEL.append("h6").text(`ID: ${result.id}`);
    PANEL.append("h6").text(`ETHNICITY: ${result.ethnicity}`);
    PANEL.append("h6").text(`GENDER: ${result.gender}`);
    PANEL.append("h6").text(`AGE: ${result.age}`);
    PANEL.append("h6").text(`LOCATION: ${result.location}`);
    PANEL.append("h6").text(`BBTYPE: ${result.bbtype}`);
    PANEL.append("h6").text(`WFREQ: ${result.wfreq}`);
  });

}

function buildCharts(selectedID) {
  d3.json("samples.json").then((data) => {
    
    var samples = data.samples;
    var resultArray = samples.filter(sampleObj => sampleObj.id == selectedID);
    var result = resultArray[0];

    var sample_values = result.sample_values;
    var otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels;

    var BarChartValues = sample_values.slice(0,10).reverse();
    var trace = [
      {
        x: BarChartValues,
        y: otu_ids.slice(0,10).map(otuids => `otu ${otuids}`).reverse(),
        type:"bar",
        orientation: "h",
        text: otu_labels,
        width: 0.9
      }
    ];
      
    var layout = {
      xaxis: { title: "Total Found"},
      yaxis: { title: "Top 10 Bacteria Identified"},
      margin: { t: 10, l: 90 }
    };

    Plotly.newPlot("bar", trace, layout);

    

    var BubbleChart = {
      title: "Total Number of Bacteria by Type:  Hover over to see names & type"
    };

    var BubbleChartValues = [
      {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: "Portland"
        }

      }
    ];
    Plotly.newPlot("bubble", BubbleChartValues, BubbleChart);
  });
}

function init() {
  var DropDown = d3.select("#selDataset");
    
  d3.json("samples.json").then((data) => {
    console.log(data);
    var TestSubjectIDNo = data.names;
    TestSubjectIDNo.forEach((selectedID) => {
      DropDown
        .append("option")
        .text(selectedID)
        .property("value", selectedID);
    });

    var ChartsInformation = TestSubjectIDNo[0];
    buildCharts(ChartsInformation);
    buildGauge(wfreq);
    buildMetadata(ChartsInformation);
  });
}

  function optionChanged(newSample) {
    buildCharts(newSample);
    buildGauge(wfreq);
    buildMetadata(newSample);
    
}

init();

function buildGauge(wfreq) {
  // Enter the washing frequency between 0 and 180
  var level = parseFloat(wfreq) * 20;

  // Trig to calc meter point
  var degrees = 180 - level;
  var radius = 0.5;
  var radians = (degrees * Math.PI) / 180;
  var x = radius * Math.cos(radians);
  var y = radius * Math.sin(radians);

  // Path: may have to change to create a better triangle
  var mainPath = "M -.0 -0.05 L .0 0.05 L ";
  var pathX = String(x);
  var space = " ";
  var pathY = String(y);
  var pathEnd = " Z";
  var path = mainPath.concat(pathX, space, pathY, pathEnd);

  var data = [
    {
      type: "scatter",
      x: [0],
      y: [0],
      marker: { size: 12, color: "850000" },
      showlegend: false,
      name: "Freq",
      text: level,
      hoverinfo: "text+name"
    },
    {
      values: [50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50],
      rotation: 90,
      text: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
      textinfo: "text",
      textposition: "inside",
      marker: {
        colors: [
          "rgba(0, 105, 11, .5)",
          "rgba(10, 120, 22, .5)",
          "rgba(14, 127, 0, .5)",
          "rgba(110, 154, 22, .5)",
          "rgba(170, 202, 42, .5)",
          "rgba(202, 209, 95, .5)",
          "rgba(210, 206, 145, .5)",
          "rgba(232, 226, 202, .5)",
          "rgba(240, 230, 215, .5)",
          "rgba(255, 255, 255, 0)"
        ]
      },
      labels: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
      hoverinfo: "label",
      hole: 0.5,
      type: "pie",
      showlegend: false
    }
  ];

  var layout = {
    shapes: [
      {
        type: "path",
        path: path,
        fillcolor: "850000",
        line: {
          color: "850000"
        }
      }
    ],
    title: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week",
    height: 500,
    width: 500,
    xaxis: {
      zeroline: false,
      showticklabels: false,
      showgrid: false,
      range: [-1, 1]
    },
    yaxis: {
      zeroline: false,
      showticklabels: false,
      showgrid: false,
      range: [-1, 1]
    }
  };

  var GAUGE = document.getElementById("gauge");
  Plotly.newPlot(GAUGE, data, layout);
}
