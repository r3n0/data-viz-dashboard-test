function createChart2(data) {
	// Borrar el gráfico anterior
	d3.select('#chart2').html('');

	// Agrupar datos por 'identificacion_etnic' y 'sexo'
	const groupedData = d3.rollups(
		data,
		(v) => v.length,
		(d) => d['identificacion_etnic'],
		(d) => d['sexo']
	);

	// Aplanar los datos
	const flatData = [];
	groupedData.forEach((ethnicGroup) => {
		ethnicGroup[1].forEach((genderGroup) => {
			flatData.push({
				identificacion_etnic: ethnicGroup[0],
				sexo: genderGroup[0],
				count: genderGroup[1],
			});
		});
	});

	// Escala X para 'identificacion_etnic'
	const x0 = d3
		.scaleBand()
		.domain(groupedData.map((d) => d[0]))
		.range([0, width])
		.padding(0.2);

	// Escala X1 para 'sexo'
	const x1 = d3
		.scaleBand()
		.domain(['HOMBRE', 'MUJER'])
		.range([0, x0.bandwidth()])
		.padding(0.05);

	// Escala Y para contar
	const y = d3
		.scaleLinear()
		.domain([0, d3.max(flatData, (d) => d.count)])
		.range([height, 0]);

	// Crear contenedor SVG
	const svg = d3
		.select('#chart2')
		.append('svg')
		.attr('width', width + margin.left + margin.right)
		.attr('height', height + margin.top + margin.bottom)
		.append('g')
		.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

	// eje x
	svg.append('g')
		.attr('class', ' bottom')
		.attr('transform', 'translate(0,' + height + ')')
		.call(d3.axisBottom(x0))
		.selectAll('path')
		.classed('axis-line', true);

	// eje y
	svg.append('g')
		.call(d3.axisLeft(y))
		.selectAll('path')
		.classed('axis-line', true);

	svg.selectAll(' text').classed('axis-text', true);

	svg.selectAll('.bottom text')
		.attr('transform', 'rotate(-45)')
		.style('text-anchor', 'end');

	// Escala de colores para 'sexo'
	const color = d3
		.scaleOrdinal()
		.domain(['HOMBRE', 'MUJER'])
		.range([color_1, color_2]);

	// barras agrupadas
	svg.selectAll('g.layer')
		.data(groupedData)
		.enter()
		.append('g')
		.attr('transform', (d) => `translate(${x0(d[0])},0)`)
		.selectAll('rect')
		.data((d) => d[1])
		.enter()
		.append('rect')
		.attr('x', (d) => x1(d[0]))
		.attr('y', (d) => y(d[1]))
		.attr('width', x1.bandwidth())
		.attr('height', (d) => height - y(d[1]))
		.attr('fill', (d) => color(d[0]));

	// Agregar título
	svg.append('text')
		.attr('x', width / 2)
		.attr('y', -30)
		.attr('text-anchor', 'middle')
		.attr('class', 'chart_title')
		.text('2. Identificación étnica por sexo');
}
