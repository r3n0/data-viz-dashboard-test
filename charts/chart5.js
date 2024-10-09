function createChart5(data) {
	// Clear the previous chart
	d3.select('#chart5').html('');

	// Filter out rows where any of the required columns is missing or undefined
	const filteredData = data.filter(
		(d) =>
			d['sexo'] &&
			d['lengua_materna'] &&
			d['nacionalidad_indigena'] &&
			d['provincia_labora']
	);

	// Prepare the nodes and links for Sankey layout
	const nodes = [];
	const links = [];

	// Function to add unique nodes to the nodes array
	function addNode(name) {
		if (!nodes.some((n) => n.name === name)) {
			nodes.push({ name });
		}
	}

	// Create nodes and links based on the dimensions
	filteredData.forEach((d) => {
		const sexo = d['sexo'];
		const lengua_materna = d['lengua_materna'];
		const nacionalidad_indigena = d['nacionalidad_indigena'];
		const provincia_labora = d['provincia_labora'];

		addNode(sexo);
		addNode(lengua_materna);
		addNode(nacionalidad_indigena);
		addNode(provincia_labora);

		// Ensure no circular link (i.e., no source == target in the link chain)
		if (sexo !== lengua_materna) {
			links.push({
				source: sexo,
				target: lengua_materna,
				value: 1,
			});
		}
		if (lengua_materna !== nacionalidad_indigena) {
			links.push({
				source: lengua_materna,
				target: nacionalidad_indigena,
				value: 1,
			});
		}
		if (nacionalidad_indigena !== provincia_labora) {
			links.push({
				source: nacionalidad_indigena,
				target: provincia_labora,
				value: 1,
			});
		}
	});

	// Create the Sankey layout
	const sankey = d3
		.sankey()
		.nodeWidth(15) // Width of the nodes
		.nodePadding(10) // Padding between nodes
		.size([width, height]) // Size of the layout
		.nodeId((d) => d.name); // Node identifier

	// Apply the Sankey layout to the nodes and links
	const { nodes: sankeyNodes, links: sankeyLinks } = sankey({
		nodes: nodes.map((d) => Object.assign({}, d)), // Copy of the nodes
		links: links.map((d) => Object.assign({}, d)), // Copy of the links
	});

	// Create the SVG container
	const svg = d3
		.select('#chart5')
		.append('svg')
		.attr('width', width + margin.left + margin.right)
		.attr('height', height + margin.top + margin.bottom)
		.append('g')
		.attr('transform', `translate(${margin.left},${margin.top})`);

	// Define color scale for nodes based on 'sexo'
	const colorScale = d3
		.scaleOrdinal()
		.domain(['HOMBRE', 'MUJER'])
		.range([color_1, color_2]);

	// Draw links (ribbons) between nodes
	svg.append('g')
		.selectAll('path')
		.data(sankeyLinks)
		.enter()
		.append('path')
		.attr('d', d3.sankeyLinkHorizontal()) // Use d3's built-in sankey link path generator
		.attr('stroke', (d) => colorScale(d.source.name)) // Color based on the source node (sexo)
		.attr('stroke-width', (d) => Math.max(1, d.width)) // Set width based on the link value (flow size)
		.attr('fill', 'none')
		.attr('opacity', 0.7);

	// Draw nodes (rectangles)
	svg.append('g')
		.selectAll('rect')
		.data(sankeyNodes)
		.enter()
		.append('rect')
		.attr('x', (d) => d.x0)
		.attr('y', (d) => d.y0)
		.attr('height', (d) => d.y1 - d.y0)
		.attr('width', sankey.nodeWidth())
		.attr('fill', (d) => colorScale(d.name) || '#999');

	// Add text labels to the nodes
	svg.append('g')
		.selectAll('text')
		.data(sankeyNodes)
		.enter()
		.append('text')
		.attr('x', (d) => d.x0 - 10) // Position to the left of the node
		.attr('y', (d) => (d.y1 + d.y0) / 2)
		.attr('dy', '0.35em')
		.attr('text-anchor', 'end')
		.attr('fill', 'black')
		.text((d) => d.name);

	// Add title to the chart
	svg.append('text')
		.attr('x', width / 2)
		.attr('y', -30)
		.attr('text-anchor', 'middle')
		.attr('class', 'chart_title')
		.text('Sexo, Idioma, Nacionalidad y Provincia');
}
