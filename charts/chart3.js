function createChart3(data) {
	// Clear the previous chart
	d3.select('#chart3').html('');

	// Filter out rows where 'edad' or 'sexo' is missing
	const filteredData = data.filter((d) => d['edad'] && d['sexo']);

	// Group the data by 'sexo' and 'edad', and count occurrences
	const groupedData = d3.rollups(
		filteredData,
		(v) => v.length,
		(d) => d['sexo'],
		(d) => +d['edad']
	);

	// Flatten the grouped data for easier manipulation
	const flatData = [];
	groupedData.forEach((sexGroup) => {
		sexGroup[1].forEach((ageGroup) => {
			flatData.push({
				sexo: sexGroup[0],
				edad: ageGroup[0],
				count: ageGroup[1],
			});
		});
	});

	// Create SVG container
	const svg = d3
		.select('#chart3')
		.append('svg')
		.attr('width', width + margin.left + margin.right)
		.attr('height', height + margin.top + margin.bottom)
		.append('g')
		.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

	// X scale for 'sexo'
	const x = d3
		.scaleBand()
		.domain(['HOMBRE', 'MUJER'])
		.range([0, width])
		.padding(0.5);

	// Y scale for 'edad'
	const y = d3
		.scaleLinear()
		.domain([
			d3.min(flatData, (d) => d.edad) - 5,
			d3.max(flatData, (d) => d.edad) + 5,
		]) // Add some padding
		.range([height, 0]);

	// Size scale for the count of individuals
	const size = d3
		.scaleLinear()
		.domain([0, d3.max(flatData, (d) => d.count)])
		.range([5, 30]); // Circle size range

	// X axis
	svg.append('g')
		.attr('transform', 'translate(0,' + height + ')')
		.call(d3.axisBottom(x))
		.selectAll('path')
		.classed('axis-line', true);

	// Y axis
	svg.append('g')
		.call(d3.axisLeft(y))
		.selectAll('path')
		.classed('axis-line', true);

	svg.selectAll(' text').classed('axis-text', true);

	// Create the bubbles (scatter points)
	svg.selectAll('circle')
		.data(flatData)
		.enter()
		.append('circle')
		.attr('cx', (d) => x(d['sexo']) + x.bandwidth() / 2) // Center the bubbles in their respective 'sexo' categories
		.attr('cy', (d) => y(d['edad'])) // Position based on 'edad'
		.attr('r', (d) => size(d['count'])) // Size based on the count of individuals
		.attr('fill', (d) => (d['sexo'] === 'HOMBRE' ? color_1 : color_2)) // Color based on gender
		.attr('opacity', 0.5);

	// Add title to the chart
	svg.append('text')
		.attr('x', width / 2)
		.attr('y', -30)
		.attr('text-anchor', 'middle')
		.attr('class', 'chart_title')
		.text('Relación entre edad y sexo');
}
