function createChart11(filteredData) {
	// Clear the previous chart
	d3.select('#chart11').html('');

	// Filter out rows where RMU is missing, invalid, or zero
	const validData = filteredData.filter((d) => d.RMU && +d.RMU > 0);

	// Define the number of bins (ranges) for RMU (salary)
	const numberOfBins = 6;

	// Create the bin generator for RMU values
	const rmuExtent = d3.extent(validData, (d) => +d.RMU);
	const binGenerator = d3
		.histogram()
		.domain(rmuExtent) // Set the domain (min/max) of salary
		.thresholds(numberOfBins); // Set the number of bins (ranges)

	// Create bins (ranges) for the RMU values
	const rmuBins = binGenerator(validData.map((d) => +d.RMU));

	// Sort bins by their minimum salary value (x0) to ensure ascending order
	rmuBins.sort((a, b) => a.x0 - b.x0);

	// Create a mapping from RMU values to bin ranges
	const rmuBinMap = {};
	rmuBins.forEach((bin, i) => {
		bin.forEach((d) => {
			rmuBinMap[d] = `${Math.round(bin.x0)} - ${Math.round(bin.x1)}`;
		});
	});

	// Now create an updated dataset where RMU is replaced with the corresponding bin range
	const binnedData = validData.map((d) => ({
		...d,
		RMU: rmuBinMap[d.RMU],
	}));

	// Create SVG
	const svg = d3
		.select('#chart11')
		.append('svg')
		.attr('width', width + margin + margin)
		.attr('height', height + margin + margin)
		.append('g')
		.attr('transform', `translate(${margin},${margin})`);

	// X scale for Título
	const x = d3
		.scaleBand()
		.domain([...new Set(binnedData.map((d) => d.Título))])
		.range([0, width])
		.padding(0.01);

	// Y scale for RMU (salary range) - Now sorted from lower to higher bins
	const y = d3
		.scaleBand()
		.domain(
			rmuBins.map(
				(bin) => `${Math.round(bin.x0)} - ${Math.round(bin.x1)}`
			)
		)
		.range([height, 0]) // Higher salary at the top
		.padding(0.01);

	// Set a fixed color and an opacity scale based on count
	const color = '#69b3a2'; // Fixed color for all cells
	const opacity = d3
		.scaleLinear()
		.domain([0, d3.max(binnedData, (d) => d.count)]) // Opacity based on recurrence
		.range([0.1, 1]); // Minimum and maximum opacity values

	// X axis
	svg.append('g')
		.attr('class', 'bottom')
		.attr('transform', `translate(0, ${height})`)
		.call(d3.axisBottom(x))
		.selectAll('path')
		.classed('axis-line', true);

	// Y axis (now uses sorted salary bins)
	svg.append('g')
		.call(d3.axisLeft(y))
		.selectAll('path')
		.classed('axis-line', true);

	// Group data by Título and RMU
	const groupedData = d3.rollups(
		binnedData,
		(v) => v.length, // Count occurrences
		(d) => d.Título,
		(d) => d.RMU
	);

	// Flatten the grouped data for easier heatmap construction
	const flatData = [];
	groupedData.forEach(([title, salaryGroup]) => {
		salaryGroup.forEach(([salary, count]) => {
			flatData.push({
				Título: title,
				RMU: salary, // Now it's a salary range
				count: count,
			});
		});
	});

	// Draw rectangles for the heatmap
	svg.selectAll()
		.data(flatData, (d) => `${d.Título}:${d.RMU}`)
		.enter()
		.append('rect')
		.attr('x', (d) => x(d.Título))
		.attr('y', (d) => y(d.RMU))
		.attr('width', x.bandwidth())
		.attr('height', y.bandwidth())
		.style('fill', paletaDeColorHeat)
		.style('opacity', (d) => opacity(d.count)); // Set opacity based on recurrence

	svg.selectAll(' text').classed('axis-text', true);
	svg.selectAll('.bottom text')
		.attr('x', -3)
		.attr('y', 10)
		.call(wrapText, 150)
		.attr('transform', 'rotate(-45)')
		.style('text-anchor', 'end');

	// Add title to the heatmap
	svg.append('text')
		.attr('x', width / 2)
		.attr('y', -30)
		.attr('text-anchor', 'middle')
		.attr('class', 'chart_title')
		.text('11. Mapa de calor de salario (agrupado y ordenado) y título');
}
