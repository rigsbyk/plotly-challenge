// Found a gauge chart that was very similar to the one in this
// homework and built off it
// URL: https://jsfiddle.net/b98tj88j/3/ 


function buildGauge(wfreq) {
    
        var level = parseFloat(wfreq) * 20;
        
         
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
             var GaugeElement = document.getElementById("gauge")
             Plotly.newPlot(GaugeElement,gdata,glayout);
                    
                 }