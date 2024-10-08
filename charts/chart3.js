function createChart3(data) {
	// Clear the previous chart
	d3.select('#chart3').html('');

	// Filter out rows where 'edad' or 'sexo' is missing
	const filteredData = data.filter((d) => d['edad'] && d['sexo']);

	// Create SVG container
	const svg = d3
		.select('#chart3')
		.append('svg')
		.attr('width', width + margin.left + margin.right)
		.attr('height', height + margin.top + margin.bottom)
		.append('g')
		.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

	// X scale for 'edad' (age)
	const x = d3
		.scaleLinear()
		.domain([
			d3.min(filteredData, (d) => +d['edad']) - 5,
			d3.max(filteredData, (d) => +d['edad']) + 5,
		]) // Add some padding
		.range([0, width]);

	// Y scale for 'sexo' (gender)
	const y = d3
		.scaleBand()
		.domain(['HOMBRE', 'MUJER'])
		.range([0, height])
		.padding(0.5);

	// X axis
	svg.append('g')
		.attr('transform', 'translate(0,' + height + ')')
		.call(d3.axisBottom(x).ticks(10))
		.append('text')
		.attr('x', width / 2)
		.attr('y', 40)
		.attr('text-anchor', 'middle')
		.attr('fill', 'black')
		.style('font-size', '16px')
		.text('Edad');

	// Y axis
	svg.append('g')
		.call(d3.axisLeft(y))
		.append('text')
		.attr('transform', 'rotate(-90)')
		.attr('x', -height / 2)
		.attr('y', -40)
		.attr('text-anchor', 'middle')
		.attr('fill', 'black')
		.style('font-size', '16px')
		.text('Sexo');

	// Create the scatter points
	svg.selectAll('circle')
		.data(filteredData)
		.enter()
		.append('circle')
		.attr('cx', (d) => x(+d['edad']))
		.attr('cy', (d) => y(d['sexo']) + y.bandwidth() / 2) // Place it in the middle of the band
		.attr('r', 5)
		.attr('fill', 'steelblue')
		.attr('opacity', 0.7)
		.attr('stroke', 'black');

	// Add title to the chart
	svg.append('text')
		.attr('x', width / 2)
		.attr('y', -30)
		.attr('text-anchor', 'middle')
		.attr('class', 'chart_title')
		.text('Relationship between Age and Gender');
}
