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

    //var ScrubGauge = {
    //  title: "Belly Button Washing Frequency"
    //}

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
    buildMetadata(ChartsInformation);
  });
}

  function optionChanged(newSample) {
    buildCharts(newSample);
    buildMetadata(newSample);
}

init();