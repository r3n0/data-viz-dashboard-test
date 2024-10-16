function createChart8(data) {
	// Clear the previous chart
	d3.select('#chart8').html('');

	// Filter out rows where any of the required columns is missing or undefined
	const filteredData = data.filter(
		(d) => d['sexo'] && d['lengua_materna'] // Only filter for 'sexo' and 'lengua_materna'
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

	// Create nodes and links based on the two dimensions: 'sexo' and 'lengua_materna'
	filteredData.forEach((d) => {
		const sexo = d['sexo'];
		const lengua_materna = d['lengua_materna'];

		addNode(sexo);
		addNode(lengua_materna);

		// Ensure no circular link (i.e., no source == target in the link chain)
		if (sexo !== lengua_materna) {
			links.push({
				source: sexo,
				target: lengua_materna,
				value: 1, // You can adjust this value as needed
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
		.select('#chart8')
		.append('svg')
		.attr('width', width + margin + margin)
		.attr('height', height + margin + margin)
		.append('g')
		.attr('transform', `translate(${margin},${margin})`);

	// Define color scale for nodes based on 'sexo'
	const colorScale = d3
		.scaleOrdinal()
		.domain(['HOMBRE', 'MUJER']) // Adjust this based on your actual 'sexo' data values
		.range(customColors);

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

	// Modify the link drawing to add mouseover and mouseout for tooltip
	svg.append('g')
		.selectAll('path')
		.data(sankeyLinks)
		.enter()
		.append('path')
		.attr('d', d3.sankeyLinkHorizontal())
		.attr('stroke', (d) => colorScale(d.source.name))
		.attr('stroke-width', (d) => Math.max(1, d.width))
		.attr('fill', 'none')
		.attr('opacity', 0.7)
		.on('mouseover', function (event, d) {
			tooltip
				.style('visibility', 'visible')
				.text(`${d.source.name} -> ${d.target.name}`);
			d3.select(this).attr('stroke-opacity', 1);
		})
		.on('mousemove', function (event) {
			tooltip
				.style('top', `${event.pageY - 10}px`)
				.style('left', `${event.pageX + 10}px`);
		})
		.on('mouseout', function () {
			tooltip.style('visibility', 'hidden');
		});

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

	// Append a div element for tooltips
	const tooltip = d3
		.select('body')
		.append('div')
		.attr('class', 'tooltip axis-text')
		.style('position', 'absolute')
		.style('visibility', 'hidden')
		.style('background', color_6)
		.style('padding', '5px')
		.style('border-radius', '5px');

	svg.selectAll('text').classed('axis-text', true);

	// Add title to the chart
	svg.append('text')
		.attr('x', width / 2)
		.attr('y', -30)
		.attr('text-anchor', 'middle')
		.attr('class', 'chart_title')
		.text('8.Sexo e Idioma Materno');
}
