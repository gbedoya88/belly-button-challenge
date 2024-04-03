// Load JSON data and create charts
d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json")
  .then(function(data) {
    console.log(data);

    // Function to create a horizontal bar chart
    function createBarChart(sampleData) {
      // Extract the top 10 OTUs and sample values
      var otuIds = sampleData.otu_ids.slice(0, 10).map(String).reverse();
      var sampleValues = sampleData.sample_values.slice(0, 10).reverse();
      var otuLabels = sampleData.otu_labels.slice(0, 10).reverse();
    
      // Create trace for the bar chart
      var trace = {
        x: sampleValues,
        y: otuIds.map(otuId => `OTU ${otuId}`),
        text: otuLabels,
        type: 'bar',
        orientation: 'h'
      };
    
      // Create data array
      var data = [trace];
    
      // Define layout
      var layout = {
        title: 'Top 10 OTUs',
        xaxis: { title: 'Sample Values' },
        yaxis: { title: 'OTU ID' }
      };
    
      // Plot the chart
      Plotly.newPlot('bar', data, layout);
    }
    
    // Function to create a bubble chart
    function createBubbleChart(sampleData) {
      var trace = {
        x: sampleData.otu_ids,
        y: sampleData.sample_values,
        text: sampleData.otu_labels,
        mode: 'markers',
        marker: {
          size: sampleData.sample_values,
          color: sampleData.otu_ids,
          colorscale: 'Earth' // You can choose any color scale you prefer
        }
      };
    
      var data = [trace];
    
      var layout = {
        title: 'OTU Bubble Chart',
        xaxis: { title: 'OTU ID' },
        yaxis: { title: 'Sample Values' },
        showlegend: false
      };
    
      Plotly.newPlot('bubble', data, layout);
    }

    // Function to display sample metadata
    function displaySampleMetadata(metadata) {
      // Select the sample-metadata div
      var metadataPanel = d3.select("#sample-metadata");

      // Clear existing metadata
      metadataPanel.html("");

      // Iterate through each key-value pair in the metadata
      Object.entries(metadata).forEach(([key, value]) => {
        // Append a new paragraph element for each key-value pair
        metadataPanel.append("p").text(`${key}: ${value}`);
      });
    }

    // Function to update all plots when dropdown selection changes
    function optionChanged(selectedSampleId) {
      // Find the selected sample data
      var selectedSampleData = data.samples.find(sample => sample.id === selectedSampleId);
    
      // Update the bar chart
      createBarChart(selectedSampleData);

      // Update the bubble chart
      createBubbleChart(selectedSampleData);

      // Find the selected sample metadata
      var selectedSampleMetadata = data.metadata.find(metadata => metadata.id === parseInt(selectedSampleId));

      // Display the sample metadata
      displaySampleMetadata(selectedSampleMetadata);
    }

    // Populate dropdown menu with sample IDs
    function init() {
      var dropdownMenu = d3.select("#selDataset");
      data.samples.forEach(sample => {
        dropdownMenu.append("option")
          .attr("value", sample.id)
          .text(sample.id);
      });
    
      // Initialize the chart with the first sample data
      var firstSampleId = data.samples[0].id;
      optionChanged(firstSampleId);

      dropdownMenu.on("change", function() {
        var selectedSampleId = d3.select(this).property("value");
        optionChanged(selectedSampleId);
      });
    }
    
    // Initialize the dashboard
    init();

  })
  .catch(function(error) {
    console.error("Error loading the JSON file:", error);
  });



    // console.log(data);//You can use the data here })