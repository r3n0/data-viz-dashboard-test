function createChart7(data) {
	// Clear any previous chart if present
	d3.select('#chart7').html('');

	const width = 600;
	const height = 400;

	// Define the color scale
	const color = d3.scaleOrdinal(d3.schemeCategory10);

	// Manually build the hierarchical structure
	const hierarchyData = buildHierarchy(data);

	// Create a hierarchy from the manually constructed data
	const root = d3
		.hierarchy(hierarchyData)
		.sum((d) => d.value) // Use value to size each node
		.sort((a, b) => b.height - a.height || b.value - a.value); // Sort by height and value

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
		.attr('fill', (d) => color(d.parent.data.name)) // Color based on parent category
		.attr('stroke', '#fff');

	// Add text labels inside the treemap cells
	leaf.append('text')
		.attr('x', 3)
		.attr('y', 13)
		.text((d) => d.data.name)
		.style('font-size', '10px')
		.style('fill', '#fff');

	// Add a title tooltip for each cell
	leaf.append('title').text((d) => `${d.data.name}\n${d.value} records`);

	// Function to build a hierarchical structure manually
	function buildHierarchy(data) {
		const root = { name: 'root', children: [] };

		data.forEach((d) => {
			const sexo = d['sexo'] || 'Unknown Sexo';
			const carrera = d['Carrera'] || 'Unknown Carrera';
			const provincia = d['provincia_labora'] || 'Unknown Provincia';
			const canton = d['canton_labora'] || 'Unknown Canton';

			// Find or create the 'sexo' node
			let sexoNode = root.children.find((node) => node.name === sexo);
			if (!sexoNode) {
				sexoNode = { name: sexo, children: [] };
				root.children.push(sexoNode);
			}

			// Find or create the 'Carrera' node under 'sexo'
			let carreraNode = sexoNode.children.find(
				(node) => node.name === carrera
			);
			if (!carreraNode) {
				carreraNode = { name: carrera, children: [] };
				sexoNode.children.push(carreraNode);
			}

			// Find or create the 'Provincia' node under 'Carrera'
			let provinciaNode = carreraNode.children.find(
				(node) => node.name === provincia
			);
			if (!provinciaNode) {
				provinciaNode = { name: provincia, children: [] };
				carreraNode.children.push(provinciaNode);
			}

			// Add the 'Canton' node under 'Provincia' (this is the leaf node)
			let cantonNode = provinciaNode.children.find(
				(node) => node.name === canton
			);
			if (!cantonNode) {
				cantonNode = { name: canton, value: 1 };
				provinciaNode.children.push(cantonNode);
			} else {
				cantonNode.value += 1; // Increment value if the node already exists
			}
		});

		return root;
	}
}
