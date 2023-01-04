let f;
$(document).ready(function () {


	let data  = {
		Greetings: {
			dataSet: [
				{filterId: 0, filterName: 'Hello there'},
				{filterId: 1, filterName: 'Howdie'},
				{filterId: 2, filterName: 'Hiya!'}
			],
			colorHSL: [340, 100, 52]
		},
		Farewells: {
			dataSet: [
				{filterId: 'one', filterName: 'Goodbye!'},
				{filterId: 'two', filterName: 'Later.'},
				{filterId: 'three', filterName: 'Have a good one.'}
			],
			colorHSL: [174, 100, 36]
		},
	}

	f  =  new  jFilter({
		domEl: $('.jFilter'),
		data: data,
	})

});