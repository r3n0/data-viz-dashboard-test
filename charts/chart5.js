function createChart5(data) {
	// Clear the previous chart
	d3.select('#chart5').html('');

	// Filter out rows where any of the required columns is missing
	const filteredData = data.filter(
		(d) =>
			d['sexo'] &&
			d['lengua_materna'] &&
			d['nacionalidad_indigena'] &&
			d['provincia_labora']
	);

	// Set the keys for each axis (dimensions)
	const dimensions = [
		'sexo',
		'lengua_materna',
		'nacionalidad_indigena',
		'provincia_labora',
	];

	// Scales for each dimension
	const yScales = {};
	dimensions.forEach((dim) => {
		const categories = Array.from(new Set(filteredData.map((d) => d[dim])));
		yScales[dim] = d3
			.scalePoint()
			.domain(categories)
			.range([height, 0])
			.padding(0.5);
	});

	// Create SVG container
	const svg = d3
		.select('#chart5')
		.append('svg')
		.attr('width', width + margin.left + margin.right)
		.attr('height', height + margin.top + margin.bottom)
		.append('g')
		.attr('transform', `translate(${margin.left},${margin.top})`);

	// X scale for dimensions
	const x = d3.scalePoint().domain(dimensions).range([0, width]).padding(0.5);

	// Draw axis for each dimension
	dimensions.forEach((dim) => {
		const axis = svg
			.append('g')
			.attr('transform', `translate(${x(dim)},0)`)
			.call(d3.axisLeft(yScales[dim]));

		// Add axis labels
		axis.append('text')
			.attr('x', -10)
			.attr('y', -10)
			.attr('text-anchor', 'end')
			.attr('fill', 'black')
			.style('font-size', '12px')
			.text(dim.charAt(0).toUpperCase() + dim.slice(1).replace('_', ' '));
	});

	// Draw parallel lines connecting dimensions
	svg.selectAll('path')
		.data(filteredData)
		.enter()
		.append('path')
		.attr('d', function (d) {
			return d3.line()(dimensions.map((p) => [x(p), yScales[p](d[p])]));
		})
		.attr('fill', 'none')
		.attr('stroke', 'steelblue')
		.attr('stroke-width', 1)
		.attr('opacity', 0.5);

	// Add title to the chart
	svg.append('text')
		.attr('x', width / 2)
		.attr('y', -10)
		.attr('text-anchor', 'middle')
		.style('font-size', '18px')
		.text(
			'Parallel Sets: Gender, Language, Indigenous Nationality, Province'
		);
}
