const width = 600;
const height = 400;
const margin = { top: 100, right: 100, bottom: 100, left: 100 };

const color_1 = '#FC6391';
const color_2 = '#A363FC';

const customColors = ['#FC6391', '#A363FC', '#3357ff', '#ff33a1', '#a1ff33'];
const paletaDeColor = d3.scaleOrdinal(customColors);

// Load the dataset once in the main file
d3.csv('filtered_data.csv').then(function (data) {
	// Parse the date format in the 'Fecha registro' column
	const parseDate = d3.timeParse('%m/%d/%Y');
	data.forEach((d) => {
		if (d['Fecha registro']) {
			d['Fecha registro'] = parseDate(d['Fecha registro']);
		}
	});

	// Filter out invalid dates
	const validData = data.filter((d) => d['Fecha registro'] !== null);

	// Extract unique years and create year buttons
	const uniqueYears = [
		...new Set(validData.map((d) => d['Fecha registro'].getFullYear())),
	].sort((a, b) => a - b);

	const yearButtons = d3.select('#year-buttons');

	uniqueYears.forEach((year) => {
		yearButtons
			.append('button')
			.text(year)
			.on('click', function () {
				// Remove '--active' class from all buttons
				yearButtons.selectAll('button').classed('--active', false);

				// Add '--active' class to the clicked button
				d3.select(this).classed('--active', true);

				// Filter data by the clicked year
				const filteredData = validData.filter(
					(d) => d['Fecha registro'].getFullYear() === year
				);
				updateCharts(filteredData);
			});
	});

	// Initialize charts with the first year's data and highlight the first button
	const initialData = validData.filter(
		(d) => d['Fecha registro'].getFullYear() === uniqueYears[0]
	);
	updateCharts(initialData);

	// Highlight the first button as '--active'
	yearButtons.select('button').classed('--active', true);

	// Function to update the charts for the --active year
	function updateCharts(filteredData) {
		// Call external chart files
		createChart1(filteredData);
		createChart2(filteredData);
		createChart3(filteredData);
		createChart4(filteredData);
		createChart5(filteredData);
		createChart7(filteredData);
	}
});

d3.csv('filtered_data_by_month.csv').then(function (data) {
	createStreamGraph(data);
});
