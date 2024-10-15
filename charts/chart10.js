function createChart10(filteredData) {
	// Set the dimensions and margins for the diagram

	const innerRadius = Math.min(width, height) * 0.5 - 100;
	const outerRadius = innerRadius + 10;

	// Clear previous chart (if any)
	d3.select('#chart10').html('');

	// Create the SVG container
	const svg = d3
		.select('#chart10') // Make sure you have a div with id 'chart10' in your HTML
		.append('svg')
		.attr('width', width + margin + margin)
		.attr('height', height + margin + margin)
		.append('g')
		.attr(
			'transform',
			`translate(${(width + margin + margin) / 2},${
				(height + margin + margin) / 2
			})`
		);

	// Prepare data by filtering necessary columns
	const nacionalidades = Array.from(
		new Set(filteredData.map((d) => d['nacionalidad_indigena']))
	);
	const provincias = Array.from(
		new Set(filteredData.map((d) => d['provincia_labora']))
	);

	// Create an index map for nationalities and provinces
	const indexMap = {};
	nacionalidades.concat(provincias).forEach((d, i) => {
		indexMap[d] = i;
	});

	// Prepare matrix for the chord diagram
	const matrix = Array.from(
		{ length: nacionalidades.length + provincias.length },
		() => Array(nacionalidades.length + provincias.length).fill(0)
	);

	// Fill the matrix with data
	filteredData.forEach((d) => {
		const nacionalidadIndex = indexMap[d['nacionalidad_indigena']];
		const provinciaIndex = indexMap[d['provincia_labora']];
		matrix[nacionalidadIndex][provinciaIndex] += 1;
		matrix[provinciaIndex][nacionalidadIndex] += 1; // Ensure symmetry
	});

	// Create the chord layout
	const chord = d3.chord().padAngle(0.05).sortSubgroups(d3.descending)(
		matrix
	);

	// Create the color scale
	const color = d3.scaleOrdinal(d3.schemeCategory10);

	// Draw the outer arcs
	const group = svg
		.datum(chord)
		.append('g')
		.selectAll('g')
		.data(chord.groups)
		.enter()
		.append('g');

	group
		.append('path')
		.style('fill', (d) => color(d.index))
		.style('stroke', (d) => d3.rgb(color(d.index)).darker())
		.attr('d', d3.arc().innerRadius(innerRadius).outerRadius(outerRadius));

	// Add labels to the outer arcs
	group
		.append('text')
		.each(function (d) {
			d.angle = (d.startAngle + d.endAngle) / 2;
			d.name = nacionalidades.concat(provincias)[d.index]; // Assign proper name to each label
		})
		.attr('dy', '.35em')
		.attr('transform', function (d) {
			return `
                rotate(${(d.angle * 180) / Math.PI - 90})
                translate(${outerRadius + 10})
                ${d.angle > Math.PI ? 'rotate(180)' : ''}
            `;
		})
		.style('text-anchor', function (d) {
			return d.angle > Math.PI ? 'end' : null;
		})
		.text((d) => d.name);
	svg.selectAll(' text').classed('axis-text', true);

	// Draw the links (chords)
	svg.datum(chord)
		.append('g')
		.selectAll('path')
		.data(chord)
		.enter()
		.append('path')
		.attr('d', d3.ribbon().radius(innerRadius))
		.style('fill', (d) => paletaDeColor(d.target.index))
		.style('stroke', (d) => d3.rgb(paletaDeColor(d.target.index)).darker())
		.style('opacity', 0.7);

	// Add title to the chart
	svg.append('text')
		.attr('x', 0)
		.attr('y', -height / 2)
		.attr('text-anchor', 'middle')
		.attr('class', 'chart_title')
		.text('10. Nacionalidad Indígena y Provincia Laboral');
}
