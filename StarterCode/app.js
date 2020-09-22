// Create 4 functions
    // * Function 1: Bring the metadata data
    // * Function 2: Build the charts
    // * Function 3: Start the dashboard
    // * Function 4: When a new id is selected from dropdown, refresh all graphs to new selection

    function bringMetaData(sample) {
        d3.json("samples.json").then((data) =>{
            var mainData = data.metadata;
            console.log(mainData);

            // Select each data point from the the object mainData aka sample id
            var SampleList = mainData.filter(sampleObj => sampleObj.id == sample);
            // as a defaul sample, let's use the first from the list
            var first_result = SampleList[0];
    
            // selec the location where we will put the info for each sample ID
    
            var location = d3.select("#sample-metadata");
    
            // Clear the html after each selection
            location.html("");
    
            // now let's tell jva what info to place in the box. Use object.entries
            Object.entries(first_result).forEach(([key, value]) => {
                location.append("h5").text(`${key.toUpperCase()}: ${value}`);
            });
            //** bring new function for bonus */
    
        });
    }
    
    function makeCharts(sample){
        d3.json("samples.json").then((data) =>{
            var sampleData = data.samples;
            console.log(sampleData)
            // Select each data point from the the object mainData aka sample id
            var SampleList = sampleData.filter(sampleObj => sampleObj.id == sample);
            // as a defaul sample, let's use the first from the list
            var first_result = SampleList[0];
    
            var otu_ids = first_result.otu_ids;
            var otu_labels = first_result.otu_labels;
            var sample_values = first_result.sample_values;
    
    
            // let make a bubble chart, first do the layout and thend bring the data
    
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
    
    function init() {
        // get the reference ID from name list in sample.json
        var selection = d3.select("#selDataset");
        d3.json("samples.json").then((data) => {
            var sampleNames = data.names;
    
            sampleNames.forEach((sample)=>{
                selection
                    .append("option")
                    .text(sample)
                    .property("value", sample);
            });
    
            // use the first sample to build the dashboard
    
            var firsValue = sampleNames[0];
            makeCharts(firsValue);
            bringMetaData(firsValue);
        });
    
    
    
    }
    
    function optionChanged(nextSample){
        //rebuild everything
        makeCharts(nextSample);
        bringMetaData(nextSample);
    }
    
    
    
    
    
    
    
    init();