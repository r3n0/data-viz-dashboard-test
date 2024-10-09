function createStreamGraph(data) {
	// Set the dimensions and margins of the graph

	// Parse the date (now expecting "YYYY-MM" format)
	const parseDate = d3.timeParse('%Y-%m');

	// Prepare the data: ensure 'date' is parsed and 'count' is numeric
	data.forEach((d) => {
		d.date = parseDate(d['date']); // Convert the 'date' column to a date object
		d.count = +d['count']; // Ensure 'count' is a numeric value
	});

	// Group the data by date and aggregate counts
	const nestedData = d3.rollups(
		data,
		(v) => d3.sum(v, (d) => d['count']), // Aggregate the counts for each date
		(d) => d.date
	);

	// Sort by date
	nestedData.sort((a, b) => d3.ascending(a[0], b[0]));

	// Define X and Y scales
	const x = d3
		.scaleTime()
		.domain(d3.extent(nestedData, (d) => d[0])) // Use the extent of dates as the domain
		.range([0, width]);

	const y = d3
		.scaleLinear()
		.domain([0, d3.max(nestedData, (d) => d[1])]) // Max count per date
		.range([height, 0]);

	// Define the area generator for the stream graph
	const area = d3
		.area()
		.x((d) => x(d[0])) // X position is the date
		.y0(height) // Bottom of the area
		.y1((d) => y(d[1])) // Top of the area
		.curve(d3.curveBasis); // Apply smooth curves

	// Append the SVG object to the page
	const svg = d3
		.select('#chart6')
		.append('svg')
		.attr('width', width + margin.left + margin.right)
		.attr('height', height + margin.top + margin.bottom)
		.append('g')
		.attr('transform', `translate(${margin.left},${margin.top})`);

	// Add the area (stream) to the graph
	svg.append('path')
		.datum(nestedData) // Bind the aggregated data
		.attr('fill', color_2)
		.attr('d', area); // Use the area generator to create the stream

	// Add the X-axis (dates)
	svg.append('g')
		.attr('transform', `translate(0, ${height})`)
		.call(d3.axisBottom(x).tickFormat(d3.timeFormat('%Y-%m'))); // Format the tick labels as "YYYY-MM"

	// Add the Y-axis (counts)
	svg.append('g').call(d3.axisLeft(y));

	// Add a title to the graph
	svg.append('text')
		.attr('x', width / 2)
		.attr('y', -30)
		.attr('text-anchor', 'middle')
		.attr('class', 'chart_title')
		.text('Número de estudiantes por mes');
}
