const margin = 150;
const container = document.getElementById('chart1');
const width = container.clientWidth - margin * 2;
const height = container.clientHeight - margin * 2;

const color_1 = '#FC6391';
const color_2 = '#A363FC';
const color_3 = '#FF9D8C';
const color_4 = '#FA8CFF';
const color_5 = '#FCC557';
const color_6 = '#1D1A20';

const customColors = [color_1, color_2, color_3, color_4, color_5];
const paletaDeColor = d3.scaleOrdinal(customColors);

const customColors2 = [
	'#FC639122',
	'#FC639144',
	'#FC639166',
	'#FC639188',
	'#FC6391aa',
	'#FC6391cc',
	'#FC6391ee',
	'#FC6391',
];
const paletaDeColorHeat = d3.scaleOrdinal(customColors2);

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
		createChart11(filteredData); // Chord
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

// Función para hacer linebraks

function wrapText(text, width) {
	text.each(function () {
		const textElement = d3.select(this); // Select the text element
		const words = textElement
			.text()
			.split(/\s+/) // Split the text into words
			.reverse(); // Reverse the order of words for easier processing
		let word,
			line = [],
			lineNumber = 0,
			lineHeight = 1.1, // Line height in ems
			x = textElement.attr('x'), // Get the x position of the text
			y = textElement.attr('y'), // Get the y position of the text
			dy = parseFloat(textElement.attr('dy')) || 0, // Initial dy value or 0
			tspan = textElement
				.text(null) // Clear the text content
				.append('tspan') // Create the first tspan element
				.attr('x', x)
				.attr('y', y)
				.attr('dy', `${dy}em`); // dy is the vertical shift from the current line

		// Go through each word and append them to the current line until it exceeds the width
		while ((word = words.pop())) {
			line.push(word);
			tspan.text(line.join(' '));
			// If the line exceeds the specified width, remove the last word, add a new tspan for the next line
			if (tspan.node().getComputedTextLength() > width) {
				line.pop(); // Remove the last word
				tspan.text(line.join(' ')); // Update current line without the last word
				line = [word]; // Start a new line with the last word
				tspan = textElement
					.append('tspan') // Create a new tspan for the next line
					.attr('x', x)
					.attr('y', y)
					.attr('dy', `${++lineNumber * lineHeight + dy}em`)
					.text(word);
			}
		}
	});
}
