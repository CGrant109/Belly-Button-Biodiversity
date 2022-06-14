const url = "./samples.json"
d3.json(url).then(function(data) {
    console.log(data);
});

// create init function to an build inital plot when refreshed
function init(){
    buildPlot()
}

//Using the create function that will apply once the option has changed
function optionChanged() {
  
    // Building the plot with the new option
    buildPlot();
  }

//Creating a function that builds the new plot. 
function buildPlot(){


    d3.json(url).then((data) =>{
        //Making a list including all of the id names
        var idValues = data.names;
  
        // Create the drop down menu by inserting each id name in the below function.
        idValues.forEach(id => d3.select('#selDataset').append('option').text(id).property("value", id));


        // Use D3 to select the current ID and storing within a variable
        var currentID = d3.selectAll("#selDataset").node().value;
     

        //filter the data for the current ID to get desired information
        filteredID = data.samples.filter(entry => entry.id == currentID);

        // making Trace for the horizontal bar chart
        var trace1 = {
            x: filteredID[0].sample_values.slice(0,10).reverse(),
            y: filteredID[0].otu_ids.slice(0, 10).reverse().map(int => "OTU " + int.toString()),
            text: filteredID[0].otu_labels.slice(0,10).reverse(),
            type:"bar",
            orientation: 'h'
        };
    
      
        // data
        var dataPlot = [trace1];

        // Layout
        var layout = {
            title : 'Top 10 OTU samples',
            margin: {
                l: 75,
                r: 100,
                t: 60,
                b: 60
            }

        };

        // Use plotly to create a new bar
        Plotly.newPlot("bar", dataPlot, layout);

        // Making the demographics panel
        filteredMeta = data.metadata.filter(entry => entry.id == currentID)
       
        // Making a demographics object to add to the panel body
        var demographics = {
            'id: ': filteredMeta[0].id,
            'ethnicity: ': filteredMeta[0].ethnicity,
            'gender: ': filteredMeta[0].gender,
            'age: ': filteredMeta[0].age,
            'location: ': filteredMeta[0].location,
            'bbtype: ': filteredMeta[0].bbtype,
            'wfreq: ': filteredMeta[0].wfreq
        }
        //select the id to append the key value pair under the demographics panel
        panelBody = d3.select("#sample-metadata")

        // remove the current demographic info to make way for the new currentID
        panelBody.html("")
        
        //append the key value pairs from demographics into the demographics panel
        Object.entries(demographics).forEach(([key, value]) => {
            panelBody.append('p').attr('style', 'font-weight: bold').text(key + value)
        });

        // Creating the trace for the bubble chart
        var trace2 ={
            x : filteredID[0].otu_ids,
            y : filteredID[0].sample_values,
            text : filteredID[0].otu_labels,
            mode : 'markers',
            marker: {
                color : filteredID[0].otu_ids,
                size : filteredID[0].sample_values
            }
        }

        var data2 = [trace2]

        //creating the layout for the bubble chart
        var layout2 = {
            title : 'Marker Size',
            showlegend : false, 
        }

        //plotting with plotly
        Plotly.newPlot('bubble', data2, layout2)
        console.log(filteredID)
        gauge()
    });
};

//run init to set the main page
init();