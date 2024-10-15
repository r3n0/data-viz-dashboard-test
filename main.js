const width = 500;
const height = 400;
const margin = { top: 100, right: 100, bottom: 100, left: 100 };

const color_1 = '#FC6391';
const color_2 = '#A363FC';
const color_3 = '#FF9D8C';
const color_4 = '#FA8CFF';
const color_5 = '#FCC557';
const color_6 = '#1D1A20';

const customColors = [color_1, color_2, color_3, color_4, color_5];
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
	]
		.filter((year) => year >= 2018) // Filter years from 2018 onwards
		.sort((a, b) => a - b);

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
		createChart1(filteredData); // Distribución por sexo
		createChart2(filteredData); // Identificación étnica por sexo
		createChart3(filteredData); // Relación entre edad y Sexo
		createChart4(filteredData); // Distribución por nivel
		createChart5(filteredData); // Sexo, idioma, nacionalidad, provincia
		// createChart7(filteredData); // Árbol
		createChart8(filteredData); // Sexo e Idioma Materno
		createChart9(filteredData); // Nacionalidad Indígena y provincia Laboral
		createChart10(filteredData); // Chord
	}
});

d3.csv('filtered_data_by_month.csv').then(function (data) {
	// Filter the data to only include rows where the 'Fecha registro' is 2018 or later
	const filteredData = data
		.filter((d) => d['date'] && d['date'].substring(0, 4) >= 2018) // Filter based on the 'YYYY' part
		.map((d) => {
			// Make sure 'count' is numeric and 'date' remains in 'YYYY-MM' format
			return {
				date: d['date'], // No need to parse the date, it's already in the correct format
				count: +d['count'], // Ensure 'count' is numeric
				...d, // Keep other columns intact if needed
			};
		});

	// Call the function to create the stream graph with the filtered data
	createStreamGraph(filteredData); // Número de estudiantes por mes
});
