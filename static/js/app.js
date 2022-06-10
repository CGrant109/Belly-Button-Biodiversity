function demographic(id) {
    let data = d3.json("data/samples.json").then(data => {
        const metadata = data.metadata;
        let demoPanel = d3.select('#sample-metadata')
        demoPanel.html('');
        let filteredData = metadata.filter(sampleName => sampleName.id == id)[0]
        Object.entries(filteredData).forEach(([key, value]) => {
            demoPanel.append("h6").text(`${key.toUpperCase()}: ${value}`);
        });
    });
}

function optionChanged(userChoice) {
    demographic(userChoice)
    BuildCharts(userChoice)
}




function BuildCharts(sampleId) {
    let data = d3.json("data/samples.json").then(data => {
        const samples = data.samples;
        const metadata = data.metadata;

        //samples_values
        let filteredSample = samples.filter(sampleName => sampleName.id == sampleId)[0] // Arrow function to extract the data
        let filteredMetaSample = metadata.filter(sampleName => sampleName.id == sampleId)[0]
        let otu_ids = filteredSample.otu_ids
        let otu_labels = filteredSample.otu_labels
        let samples_values = filteredSample.sample_values
        let wfreq = parseInt(filteredMetaSample.wfreq)

        console.log(otu_ids)
        console.log(otu_labels)
        console.log(samples_values)
        console.log(wfreq)

        function unpack(rows, index) {
            return rows.map(function (row) {
                return row[index];
            });
        }

        function updatePlotly(newdata) {
            Plotly.restyle("pie", "values", [newdata]);
        }
        // Horizontal Chart
        function horizontalChart(dataID) {
            let yticksBar = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse()
            let data = [
                {   
                    y: yticksBar,//otu_ids top10
                    x: samples_values.slice(0,10).reverse(),
                    text: otu_labels.slice(0,10).reverse(), //out_labels  top10
                    type: 'bar',
                    orientation: 'h',
                    width: 0.6,
                    marker: { color: '(55, 83, 109)' }
                },
            ];
            let layout = {
                title: 'Top 10 OTU',

                showlegend: false,
                xaxis: {
                    tickangle: 0,
                    zeroline: true,
                    title: "Sample Value",
                },
                yaxis: {
                    zeroline: true,
                    gridwidth: 1,
                    title: "OTU ID"
                },
                //bargap: 0.01,
                height: 370,
                width: 750,
                margin: { t:40 , l: 90, b: 35, r: 20 },
                barmode: 'stack',
                paper_bgcolor: "lavender",

            };
            Plotly.newPlot('bar', data, layout);
        }

        // Function Bubble chart
        // https://plotly.com/javascript/bubble-charts/
        function bubbleChart(dataID) {
            let xticksBubble = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse()
            var trace1 = {
                x: xticksBubble, //otu_id
                y: samples_values.slice(0,10).reverse(), // sample_values
                text: otu_labels.slice(0,10).reverse(), // otu_labels
                mode: 'markers',
                marker: {
                    // color: ['rgb(93, 164, 214)', 'rgb(255, 144, 14)', 'rgb(44, 160, 101)', 'rgb(255, 65, 54)'],
                    size: samples_values.slice(0,10).reverse() //size = sample value
                }
            };

            let dataBubble = [trace1];

            var layout = {
                title: 'Top 10 OTU',
                showlegend: false,
                height: 600,
                width: 1150,
                margin: { t:40 , l: 70, b: 35, r: 20 },
                showlegend: false,
                xaxis: {
                    tickangle: 0,
                    zeroline: false,
                    title: "OTU ID"
                },
                yaxis: {
                    zeroline: false,
                    gridwidth: 1,
                    title: "Sample Value",
                },
                paper_bgcolor: "lavender",
            };
            console.log(data)
            Plotly.newPlot('bubble', dataBubble, layout, {scrollZoom: true});
        }
        // Gauge Chart https://plotly.com/javascript/gauge-charts/
        function gauge(dataID) {
            var data = [
                {
                    domain: { x: [0, 1], y: [0, 1] },
                    value: wfreq, //Washing frequency
                    title: { text: "Washing frequency" },
                    type: "indicator",

                    mode: "gauge+number+delta",
                    delta: { reference: 4, increasing: { color: 'green' } },
                    gauge: {
                        axis: { range: [0, 9], tickwidth: 1, tickcolor: "darkblue" },
                        bar:{color: 'blue'},
                        steps: [
                            { range: [0, 4], color: "red" },
                            { range: [4, 9], color: "green" }
                        ],
                        threshold: {
                            line: { color: "grey", width: 4 },
                            thickness: 1,
                            value: 9
                        }
                    },
                    bgcolor: "lavender",
                }
            ];
            var layout = {
                width: 200,
                height: 370,
                margin: { t: 25, r: 25, l: 25, b: 25 },
                paper_bgcolor: "lavender",
                font: { color: "darkblue", family: "Arial" }
            };

            
            Plotly.newPlot('gauge', data, layout);
        }
        horizontalChart(sampleId)
        bubbleChart(sampleId)
        gauge(sampleId)
    })
}

let data = d3.json("data/samples.json").then(data => {
    console.log(data)
    const samples = data.samples;
    const metadata = data.metadata;
    const names = data.names;
    console.log(samples)
    console.log(metadata)

    // dropDown button
    let dropDown = d3.select('#selDataset')
    // dropDown.on('change', handleChange)
    names.forEach(name => {
        dropDown.append('option').text(name).property('value', name);
    });
    demographic('940');
    BuildCharts('940')
})
