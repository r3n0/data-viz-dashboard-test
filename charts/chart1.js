function createChart1(data) {
	// Clear the previous chart
	d3.select('#chart1').html('');

	// Group data by 'sexo' (gender) and count occurrences
	const groupedData = d3.rollups(
		data,
		(v) => v.length,
		(d) => d['sexo']
	);

	// Create SVG container
	const svg = d3
		.select('#chart1')
		.append('svg')
		.attr('width', width + margin.left + margin.right)
		.attr('height', height + margin.top + margin.bottom)
		.append('g')
		.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

	// X scale
	const x = d3
		.scaleBand()
		.domain(groupedData.map((d) => d[0]))
		.range([0, width])
		.padding(0.1);

	// Y scale
	const y = d3
		.scaleLinear()
		.domain([0, d3.max(groupedData, (d) => d[1])])
		.range([height, 0]);

	// X axis
	svg.append('g')
		.attr('transform', 'translate(0,' + height + ')')
		.call(d3.axisBottom(x));

	// Y axis
	svg.append('g').call(d3.axisLeft(y));

	// Bars
	svg.selectAll('.bar')
		.data(groupedData)
		.enter()
		.append('rect')
		.attr('class', 'bar')
		.attr('x', (d) => x(d[0]))
		.attr('y', (d) => y(d[1]))
		.attr('width', x.bandwidth())
		.attr('height', (d) => height - y(d[1]))
		.attr('fill', 'steelblue');

	// Add title
	svg.append('text')
		.attr('x', width / 2)
		.attr('y', -30)
		.attr('text-anchor', 'middle')
		.attr('class', 'chart_title')
		.text('Distribución por sexo');
}
