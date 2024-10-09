const width = 600;
const height = 400;
const margin = { top: 80, right: 50, bottom: 50, left: 50 };

const color_1 = '#FC6391';
const color_2 = '#A363FC';

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
				const filteredData = validData.filter(
					(d) => d['Fecha registro'].getFullYear() === year
				);
				updateCharts(filteredData);
			});
	});

	// Initialize charts with the first year's data
	const initialData = validData.filter(
		(d) => d['Fecha registro'].getFullYear() === uniqueYears[0]
	);
	updateCharts(initialData);

	// Function to update the charts for the selected year
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
