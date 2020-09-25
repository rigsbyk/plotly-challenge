// Found a gauge chart that was very similar to the one in this
// homework and built off it
// URL: https://jsfiddle.net/b98tj88j/3/ 

// Create 4 functions
    // * Function 1: Bring the metadata data over
    // * Function 2: Build the charts
    // * Function 3: Start the dashboard
    // * Function 4: When a new id is selected from dropdown, refresh all graphs to new selection

   // * Function 1: Bring the metadata data over
   function bringMetaData(sample) {
    d3.json("samples.json").then((data) =>{
        var mainData = data.metadata;
        console.log(mainData);

        // Select each data point from the the object mainData aka sample id
        var SampleList = mainData.filter(sampleObj => sampleObj.id == sample);

        // As a default sample, let's use the first from the list
        var first_result = SampleList[0];

        // Select the location where we will put the info for each sample ID
        var location = d3.select("#sample-metadata");

        // Clear the html after each selection
        location.html("");

        // Tell javascript what info to place in the box. Use object.entries
        Object.entries(first_result).forEach(([key, value]) => {
            location.append("h5").text(`${key.toUpperCase()}: ${value}`);
        });

        //** Input Bonus Gauge Chart Function */
      
                buildGauge(first_result.wfreq) 

                        });
                    }

// * Function 2: Build the charts
function makeCharts(sample){
    d3.json("samples.json").then((data) =>{
        var sampleData = data.samples;
        console.log(sampleData)

        // Select each data point from the the object mainData aka sample id
        var SampleList = sampleData.filter(sampleObj => sampleObj.id == sample);

        // As a default sample, let's use the first from the list
        var first_result = SampleList[0];
        
        // Create variables for otu_ids, otu_labels, sample_values
        var otu_ids = first_result.otu_ids;
        var otu_labels = first_result.otu_labels;
        var sample_values = first_result.sample_values;

        // Bubble Chart

        var bb_layout ={
            title: "Bacteria per Sample",
            margin: {t:0},
            hovermode: "closest",
            xaxis: {title: "OTU ID"},
            margin: {t:30}
        };

        var bb_data =[
            {
                x: otu_ids,
                y: sample_values,
                text: otu_labels,
                mode: "markers",
                marker: {
                    size: sample_values,
                    color: otu_ids,
                    colorscale: "Jet"
                }
            }
        ];

        Plotly.newPlot("bubble", bb_data, bb_layout);

        // Bar Chart
        var barData= [
            {
                y: otu_ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse(),
                x:sample_values.slice(0,10).reverse(),
                text: otu_labels.slice(0,10).reverse(),
                type: "bar",
                orientation: "h",
            }
        ];

        var barLayout = {
            title: "Top 10 Bacterias"
        };

        Plotly.newPlot("bar", barData, barLayout);

    });

}

// * Function 3: Initialize the dashboard
function init() {

    // Get the reference ID from name list in sample.json
    var selection = d3.select("#selDataset");
    d3.json("samples.json").then((data) => {
        var sampleNames = data.names;

        sampleNames.forEach((sample)=>{
            selection
                .append("option")
                .text(sample)
                .property("value", sample);
        });

        // Use the first sample to build the dashboard
        var firsValue = sampleNames[0];
        makeCharts(firsValue);
        bringMetaData(firsValue);
    });



}

 // * Function 4: When a new id is selected from dropdown, refresh all graphs to new selection
function optionChanged(nextSample){
    //rebuild everything
    makeCharts(nextSample);
    bringMetaData(nextSample);
}







 init();