function createChart7(data) {
	// Clear any previous chart if present
	d3.select('#chart7').html('');

	const width = 600;
	const height = 400;

	// Define the color scale
	const color = d3.scaleOrdinal(d3.schemeCategory10);

	// Replace missing values with default placeholders (e.g., 'Unknown')
	const sanitizedData = data.map((d) => ({
		sexo: d['sexo'] || 'Unknown Sex',
		Carrera: d['Carrera'] || 'Unknown Carrera',
		provincia_labora: d['provincia_labora'] || 'Unknown Province',
		canton_labora: d['canton_labora'] || 'Unknown Canton',
	}));

	// Create a hierarchy from the sanitized data
	const root = d3
		.stratify()
		.id(
			(d) =>
				`${d['sexo']}-${d['Carrera']}-${d['provincia_labora']}-${d['canton_labora']}`
		)
		.parentId((d) => {
			if (d['canton_labora'])
				return `${d['sexo']}-${d['Carrera']}-${d['provincia_labora']}`;
			if (d['provincia_labora']) return `${d['sexo']}-${d['Carrera']}`;
			if (d['Carrera']) return d['sexo'];
			return null;
		})(sanitizedData)
		.sum((d) => 1) // Each leaf node will have a value of 1 (counting occurrences)
		.sort((a, b) => b.height - a.height || b.value - a.value);

	// Create a treemap layout
	const treemap = d3.treemap().size([width, height]).padding(1).round(true);

	treemap(root);

	// Append SVG container for the treemap
	const svg = d3
		.select('#chart7')
		.append('svg')
		.attr('width', width)
		.attr('height', height)
		.style('font', '10px sans-serif');

	// Create groups for each node in the treemap
	const leaf = svg
		.selectAll('g')
		.data(root.leaves())
		.enter()
		.append('g')
		.attr('transform', (d) => `translate(${d.x0},${d.y0})`);

	// Append the rectangles (treemap cells)
	leaf.append('rect')
		.attr('id', (d) => d.id)
		.attr('width', (d) => d.x1 - d.x0)
		.attr('height', (d) => d.y1 - d.y0)
		.attr('fill', (d) =>
			color(
				d
					.ancestors()
					.map((d) => d.id)
					.reverse()[1]
			)
		) // Color based on parent category
		.attr('stroke', '#fff');

	// Add text labels inside the treemap cells
	leaf.append('text')
		.selectAll('tspan')
		.data((d) => d.id.split('-')) // Splitting the hierarchy id to show individual levels
		.enter()
		.append('tspan')
		.attr('x', 3)
		.attr('y', (d, i) => 13 + i * 10)
		.text((d) => d);

	// Add a title tooltip for each cell
	leaf.append('title').text((d) => `${d.id}\n${d.value} records`);
}
