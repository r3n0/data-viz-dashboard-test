function createChart2(data) {
	// Clear the previous chart
	d3.select('#chart2').html('');

	// Group data by 'identificacion_etnic' and 'sexo'
	const groupedData = d3.rollups(
		data,
		(v) => v.length,
		(d) => d['identificacion_etnic'],
		(d) => d['sexo']
	);

	// Flatten the data
	const flatData = [];
	groupedData.forEach((ethnicGroup) => {
		ethnicGroup[1].forEach((genderGroup) => {
			flatData.push({
				identificacion_etnic: ethnicGroup[0],
				sexo: genderGroup[0],
				count: genderGroup[1],
			});
		});
	});

	// X scale for 'identificacion_etnic'
	const x0 = d3
		.scaleBand()
		.domain(groupedData.map((d) => d[0]))
		.range([0, width])
		.padding(0.2);

	// X1 scale for 'sexo'
	const x1 = d3
		.scaleBand()
		.domain(['HOMBRE', 'MUJER'])
		.range([0, x0.bandwidth()])
		.padding(0.05);

	// Y scale for count
	const y = d3
		.scaleLinear()
		.domain([0, d3.max(flatData, (d) => d.count)])
		.range([height, 0]);

	// Create SVG container
	const svg = d3
		.select('#chart2')
		.append('svg')
		.attr('width', width + margin.left + margin.right)
		.attr('height', height + margin.top + margin.bottom)
		.append('g')
		.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

	// X axis
	svg.append('g')
		.attr('class', ' bottom')
		.attr('transform', 'translate(0,' + height + ')')
		.call(d3.axisBottom(x0))
		.selectAll('path')
		.classed('axis-line', true);

	// Y axis
	svg.append('g')
		.call(d3.axisLeft(y))
		.selectAll('path')
		.classed('axis-line', true);

	svg.selectAll(' text').classed('axis-text', true);

	svg.selectAll('.bottom text')
		.attr('transform', 'rotate(-45)')
		.style('text-anchor', 'end');

	// Color scale for 'sexo'
	const color = d3
		.scaleOrdinal()
		.domain(['HOMBRE', 'MUJER'])
		.range([color_1, color_2]);

	// Grouped bars
	svg.selectAll('g.layer')
		.data(groupedData)
		.enter()
		.append('g')
		.attr('transform', (d) => `translate(${x0(d[0])},0)`)
		.selectAll('rect')
		.data((d) => d[1])
		.enter()
		.append('rect')
		.attr('x', (d) => x1(d[0]))
		.attr('y', (d) => y(d[1]))
		.attr('width', x1.bandwidth())
		.attr('height', (d) => height - y(d[1]))
		.attr('fill', (d) => color(d[0]));

	// Add title
	svg.append('text')
		.attr('x', width / 2)
		.attr('y', -30)
		.attr('text-anchor', 'middle')
		.attr('class', 'chart_title')
		.text('Identificación étnica por sexo');
}
