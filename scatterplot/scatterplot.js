const w = 1200;
const h = 500;
padding = 70;

const svg = d3.select('#plot-container')
    .append('svg')
    .attr('width', w)
    .attr('height', h)
    .style('background-color', '#EEE');


const setType = (obj) => {
    if (obj.value === 'scatterPlot') {
        document.getElementById('table-container').style.display = "none";
        document.getElementById('plot-container').style.display = "block"
    }
    if (obj.value === 'table') {
        document.getElementById('table-container').style.display = "block";
        document.getElementById('plot-container').style.display = "none"
    }
}

document.addEventListener('DOMContentLoaded', function () {
    fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
        .then(res => res.json())
        .then(data => {


            // scatter plot version
            const xScale = d3.scaleTime()
                .domain([d3.min(data, d => d.Year) - 1, d3.max(data, d => d.Year) + 1])
                .range([padding, w - padding])

            const times = data.map(d => {
                const parsedTime = d.Time.split(':');
                return new Date(1970, 0, 1, 0, parsedTime[0], parsedTime[1])
            })
            const yScale = d3.scaleTime()
                .domain([d3.min(times) - 10000, d3.max(times)])
                .range([h - padding, padding]);

            const scatter = svg.selectAll('circle')
                .data(data)
                .enter()
                .append('circle')
                .attr('class', 'dot')
                .attr('cx', d => xScale(d['Year']))
                .attr('cy', d => {
                    const parsedTime = d.Time.split(':');
                    const resule = new Date(1970, 0, 1, 0, parsedTime[0], parsedTime[1])
                    return yScale(resule)
                })
                .attr('r', d => 6)
                .attr('fill', d => d.Doping !== '' ? 'red' : 'green');

            // tooltips
            var div = d3
                .select('body')
                .append('div')
                .attr('class', 'tooltip')
                .attr('id', 'tooltip')
                .style('display', 'none');
                
            scatter
                .attr('data-xvalue', d => d.Year)
                .attr('data-yvalue', d => d.Time.toString())
                .on('mouseover', (event, d) => {
                    div.style('display', 'block')
                    div.style('opacity', 0.9);
                    div.attr('data-year', d.Year);
                    div
                        .html(
                            d.Name +
                            ': ' +
                            d.Nationality +
                            '<br/>' +
                            'Year: ' +
                            d.Year +
                            ', Time: ' +
                            d.Time +
                            (d.Doping ? '<br/><br/>' + d.Doping : '')
                        )
                        .style('left', event.pageX + 20 + 'px')
                        .style('top', event.pageY - 38 + 'px');
                })
                .on('mouseout', function () {
                    div.style('display', 'none');
                });

            // Axes
            const xAxis = d3.axisBottom(xScale).ticks(10).scale(xScale).tickFormat(d3.format('d'));
            const yAxis = d3.axisLeft(yScale).ticks(15).tickFormat(d3.timeFormat('%M:%S'));

            svg.append("g")
                .attr('id', "x-axis")
                .attr("transform", "translate(0," + (h - padding) + ")")
                .call(xAxis)
                .append('text')

                .style('text-anchor', 'end')
                .text('Year');

            svg.append("g")
                .attr('id', "y-axis")
                .attr("transform", "translate(" + padding + ",0)")
                .call(yAxis)

            svg.append('text')
                .attr('transform', 'rotate(-90)')
                .attr('x', -300)
                .attr('y', 20)
                .style('font-size', 18)
                .text('Time in Minutes');


            // table version
            const table = (
                `<table>
                            <thead>
                            <tr>
                                <th scope="col">Place</th>
                                <th scope="col">Name</th>
                                <th scope="col">Nationality</th>
                                <th scope="col">Doping</th>
                                <th scope="col">Time</th>
                                <th scope="col">Seconds</th>
                                <th scope="col">URL</th>
                            </tr>
                            </thead>
                            <tbody>
                                ${data.map(element => {
                    return (
                        `<tr>
                                            <td>${element.Place}</td>
                                            <td>${element.Name}</td>
                                            <td>${element.Nationality}</td>
                                            <td>${element.Doping}</td>
                                            <td>${element.Time}</td>
                                            <td>${element.Seconds}</td>
                                            <td>${element.URL}</td>
                        </tr>`
                    )
                })}
                            </tbody>
                    </table>`
            );
            document.getElementById('table-container').innerHTML = table;
        })
});