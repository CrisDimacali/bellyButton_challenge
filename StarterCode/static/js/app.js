// Use D3 fetch to read the metadat in the JSON file
  function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
      var metadata = data.metadata;
      // Filter the data for the object with the desired sample number
      var Array = metadata.filter(sampleObject => sampleObject.id == sample);
      var result = Array[0];
      // Use d3 to select the Panel with id of `#sample-metadata`
      var Panel = d3.select("#sample-metadata");
  
      // Use `.html("") to clear any existing metadata
      Panel.html("");
  
      // Add each key and value pair to the Panel using Object.entries
      // Inside the loop, use d3 to append new tags for each key-value in the metadata.
      Object.entries(result).forEach(([key, value]) => {
        Panel.append("h6").text(`${key.toUpperCase()}: ${value}`);
      });
  
    });
  }

  // BONUS: Build the Gauge Chart
  function buildGauge(sample) {
    console.log(sample);
    d3.json("samples.json").then(function(data) {
      var metadata = data.metadata;
      var metaArray = metadata.filter(sampleObject => sampleObject.id == sample);
      var metaResults = metaArray[0];
      var wfreq = metaResults.wfreq;
      // console.log(metaArray);
      // console.log(wfreq);
      
      // var panel = d3.select("#sample-metadata");
      // panel.html("");
      // Object.entries(panelData).forEach(([key, value]) => {
      //   panel.append("h5").text(`${key}: ${value}`);
      // });
    
      var gaugeData = [{
        domain: { x: [0, 1], y: [0, 1] },
        value: wfreq,
        title: { text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week" },
        type: "indicator",
        mode: "gauge+number"
        
        }];
  
      var gaugeLayout = { width: 600, height: 500, margin: { t: 0, b: 0 } };
  
      Plotly.newPlot('gauge', gaugeData, gaugeLayout);     
  });
}

  
  function buildCharts(sample) {
    d3.json("samples.json").then((data) => {
      var samples = data.samples;
      var Array = samples.filter(sampleObject => sampleObject.id == sample);
      var result = Array[0];
  
      var otu_ids = result.otu_ids;
      var otu_labels = result.otu_labels;
      var sample_values = result.sample_values;
     
  
      // Build a Bubble Chart
      var bubbleLayout = {
        title: "<b>OTU Samples</b>",
        margin: { t: 0 },
        hovermode: "closest",
        xaxis: { title: "OTU ID" },
        margin: { t: 30}
      };
      var bubbleData = [
        {
          x: otu_ids,
          y: sample_values,
          text: otu_labels,
          mode: "markers",
          marker: {
            size: sample_values,
            color: otu_ids,
            colorscale: "Earth"
          }
        }
      ];
  
      Plotly.newPlot("bubble", bubbleData, bubbleLayout);

      // Build a Bar Chart  
      var yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
      var barData = [
        {
          y: yticks,
          x: sample_values.slice(0, 10).reverse(),
          text: otu_labels.slice(0, 10).reverse(),
          type: "bar",
          orientation: "h",
        }
      ];
  
      var barLayout = {
        title: "<b>Top 10 OTU's Found</b>",
        margin: { t: 30, l: 150 }
      };
  
      Plotly.newPlot("bar", barData, barLayout);

    });
    buildGauge(sample);
  }
  
  
  function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");
  
    // Use the list of sample names to populate the select options
    d3.json("samples.json").then((data) => {
      var sampleNames = data.names;
  
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  
      // Use the first sample from the list to build the initial plots
      var firstSample = sampleNames[0];
      buildCharts(firstSample);
      buildMetadata(firstSample);
      // buildGauge(firstSample);
    });
  }
  
  function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildCharts(newSample);
    buildMetadata(newSample);
  }

  
  
  // Initialize the dashboard
  init();