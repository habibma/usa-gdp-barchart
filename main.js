document.addEventListener('DOMContentLoaded', function () {
    // document.getElementById('button').onclick = () => {
    fetch('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json')
        .then(res => res.json())
        .then(data => {

            const source = data["source_name"];
            document.getElementById('source').innerHTML = `<b>Source</b>: ${source}`;

            const description = data.description;
            document.getElementById('description').setAttribute('title', description);

            const dataset = data.data;

            // bar chart version
            const yearsDate = dataset.map(d => new Date(d[0]));

            const xScale = d3.scaleTime()
                .domain([d3.min(yearsDate), d3.max(yearsDate)])
                .range([padding, w - padding])

            const yScale = d3.scaleLinear()
                .domain([0, d3.max(dataset, (d) => d[1])])
                .range([h - padding, padding]);

            const bar = svg.selectAll('rect')
                .data(dataset)
                .enter()
                .append('rect')
                .attr('x', (d, i) => xScale(new Date(d[0])))
                .attr('y', (d, i) => yScale(d[1]))
                .attr("width", 3)
                .attr('height', (d) => h - padding - yScale(d[1]))
                .attr('fill', "blue")
                .attr('class', 'bar')
                .attr('data-date', d => new Date(d[0]).getFullYear() + '-' + new Date(d[0]).getDate() + '-' + new Date(d[0]).getMonth() + 1)
                .attr('data-gdp', d => d[1])

            bar.append('title')
                .attr("id", "tooltip")
                .html(d => {
                    return `<span id="tooltip">Date: ${d[0]}</span>\n<span>Amount: ${d[1].toFixed(1).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') + ' Billion'}</span>`
                })

            const xAxis = d3.axisBottom(xScale).ticks(10).scale(xScale).tickFormat(d3.utcFormat("%Y"));
            const yAxis = d3.axisLeft(yScale);

            svg.append("g")
                .attr('id', "x-axis")
                .attr("transform", "translate(0," + (h - padding) + ")")
                .call(xAxis);
            svg.append("g")
                .attr('id', "y-axis")
                .attr("transform", "translate(" + padding + ",0)")
                .call(yAxis);


            // table version
            const table = (
                    `<table>
                            <thead>
                                <th>${data.column_names[0]}</th>
                                <th>${data.column_names[1]}</th>
                            </thead>
                            <tbody>
                                ${dataset.map(element => {
                                    return (
                                        `<tr>
                                            <th>${element[0]}</th>
                                            <th>${element[1]}</th>
                                        </tr>`
                                    )
                            })}
                            </tbody>
                    </table>`
                );
            document.getElementById('table-container').innerHTML = table;
        
        })
    // }
});


const w = 1200;
const h = 500;
padding = 50;

const svg = d3.select('#chart-container')
    .append('svg')
    .attr('width', w)
    .attr('height', '75vh')
    .style('background-color', '#EEE');


const setType = (obj) => {
    if (obj.value === 'barChart') {
        document.getElementById('table-container').style.display = "none";
        document.getElementById('chart-container').style.display = "block"
    }
    if (obj.value === 'table') {
        document.getElementById('table-container').style.display = "block";
        document.getElementById('chart-container').style.display = "none"
    }
}