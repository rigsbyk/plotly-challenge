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
       function buildGauge(sample) {
           d3.json("samples.json").then((data) => {
               var level = parseFloat(data.metadata.wfreq) * (180/9);
                
               // Trig to calc meter point
                var degrees = 180 - level;
                var radius = 0.5;
                var radians = (degrees * Math.PI) / 180;
                var x = radius * Math.cos(radians);
                var y = radius * Math.sin(radians);

                // Path: may have to change to create a better triangle
                var mainPath = "M -.0 -0.05 L .0 0.05 L ";
                pathX = String(x);
                space = " ";
                pathY = String(y);
                pathEnd = " Z";
                var path = mainPath.concat(pathX,space,pathY,pathEnd);

                var gdata = [
                    {
                        type: "scatter",
                        x:[0],
                        y:[0],
                        marker:{size:10, color:"850000"},
                        showlegend:false,
                        name:"Freq",
                        text:level,
                        hoverinfo: "text+name"
                    },
                    {
                        values: [50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50],
                        rotation:90,
                        text:["8-9","7-8","6-7","5-6","4-5","3-4","2-3","1-2","0-1",""],
                        textinfo:"text",
                        textposition:"inside",
                        marker: {
                            colors: [
                                "rgba(0,105,11,.5)",
                                "rgba(10,120,22,.5)",
                                "rgba(14,127,0,.5)",
                                "rgba(110,154,22,.5)",
                                "rgba(170,202,42,.5)",
                                "rgba(202,209,95,.5)",
                                "rgba(210,206,145,.5)",
                                "rgba(232,226,202,.5)",
                                "rgba(240,230,215,.5)",
                                "rgba(255,255,255,0)"
                            ]
                        },
                        labels: ["8-9","7-8","6-7","5-6","4-5","3-4","2-3","1-2","0-1",""],
                        hoverinfo:"label",
                        hole:0.5,
                        type:"pie",
                        showlegend:false
                    }
                    
                ];

                var glayout = {
                    shapes:[
                        {
                            type: "path",
                            path: path,
                            fillcolor:"850000",
                            line:{
                                color:"850000"
                            }
                        }
                    ],
                    title: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week",
                    height:500,
                    width:500,
                    xaxis:{
                        zeroline:false,
                        showticklabels:false,
                        showgrid:false,
                        range:[-1,1]
                    },
                    yaxis:{
                        zeroline:false,
                        showticklabels:false,
                        showgrid:false,
                        range:[-1,1]
                    }
                    };
                    Plotly.newPlot("gauge",gdata,glayout);
                            });
                        }
                           buildGauge(); 

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
