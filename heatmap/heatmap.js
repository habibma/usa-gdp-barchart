const w = 1200;
const h = 500;
padding = 70;

const svg = d3.select('#map-container')
    .append('svg')
    .attr('width', w)
    .attr('height', h)
    .style('background-color', '#EEE');


const setType = (obj) => {
    if (obj.value === 'heatmap') {
        document.getElementById('table-container').style.display = "none";
        document.getElementById('map-container').style.display = "block"
    }
    if (obj.value === 'table') {
        document.getElementById('table-container').style.display = "block";
        document.getElementById('map-container').style.display = "none"
    }
}

month_dict = {
    1: "January",
    2: "February",
    3: "March",
    4: "April",
    5: "May",
    6: "June",
    7: "July",
    8: "August",
    9: "September",
    10: "October",
    11: "November",
    12: "December"
}

function getColorForNumber(number) {
    const normalizedNumber = Math.abs(number) / 5;
    const colorAmount = Math.round(normalizedNumber * 255);
    const color = number > 0
        ? `rgb(255, ${240 - colorAmount}, ${240 - colorAmount})`  // More red for positive
        : `rgb( ${235 -colorAmount}, ${235 -colorAmount}, 255)`; // More blue for negative
    return color;
}

document.addEventListener('DOMContentLoaded', function () {
    fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json')
        .then(res => res.json())
        .then(data => {

            const dataset = data.monthlyVariance;
            // Heat Map version
            const xScale = d3.scaleLinear()
                .domain([d3.min(dataset, d => d.year), d3.max(dataset, d => d.year) + 1])
                .range([padding, w - padding])

            const yScale = d3.scaleLinear()
                .domain([0, 12])
                .range([h - padding, padding]);


            const heatmap = svg.selectAll('rect')
                .data(dataset)
                .enter()
                .append('rect')
                .attr('class', 'rect')
                .attr('x', (d, i) => xScale(d.year))
                .attr('y', d => yScale(d.month))
                .attr('fill', d => getColorForNumber(d.variance))
                .attr('width', 4)
                .attr('height', 30);


            // heatmap.append('title')
            //     .attr("id", "tooltip")
            //     .text(d => d.variance + "\n" + d.year)

            // tooltips
            var div = d3
                .select('body')
                .append('div')
                .attr('class', 'tooltip')
                .attr('id', 'tooltip')
                .style('display', 'none');

            heatmap
                .attr('data-xvalue', d => d.Year)
                .attr('data-yvalue', d => d.month)
                .on('mouseover', (event, d) => {
                    div.style('display', 'block')
                    div.style('opacity', 0.9);
                    div.attr('data-year', d.year);
                    div
                        .html(
                            'temperature: ' +
                            (8.66 + d.variance) + '℃' +
                            '<br> Year: ' +
                            d.year +
                            '<br> Month: ' +
                            month_dict[d.month] +
                            '<br> Variance: ' +
                            d.variance
                        )
                        .style('left', event.pageX + 20 + 'px')
                        .style('top', event.pageY - 38 + 'px');
                })
                .on('mouseout', function () {
                    div.style('display', 'none');
                });

            // // Axes
            const xAxis = d3.axisBottom(xScale).ticks(10).scale(xScale).tickFormat(d3.format("d"));
            const yAxis = d3.axisLeft(yScale).scale(yScale).tickFormat( month => {
                const date = new Date(0);
                date.setUTCMonth(month);
                var format = d3.utcFormat('%B');
                return format(date);
              });

            svg.append("g")
                .attr('id', "x-axis")
                .attr("transform", "translate(0," + (h - padding) + ")")
                .call(xAxis)
            

            svg.append("g")
                .attr('id', "y-axis")
                .attr("transform", "translate(" + padding + ",0)")
                .call(yAxis)

            svg.append('text')
                .attr('transform', 'rotate(-90)')
                .attr('x', -300)
                .attr('y', 20)
                .style('font-size', 18)
                .text('Months');


            // table version

            const table = (
                `<table>
                    <thead>
                        <tr>
                            <th scope="col">Year</th>
                            <th scope="col">Month</th>
                            <th scope="col">variance</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.monthlyVariance.map(element => {
                    return (
                        `<tr>
                                    <td>${element.year}</td>
                                    <td>${month_dict[element.month]}</td>
                                    <td>${element.variance}</td>
                                </tr>`
                    )
                }).join('')}
                    </tbody>
                </table>`
            );
            document.getElementById('table-container').innerHTML = table;
        })
});