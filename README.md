# jFilter: a jQuery filtering plugin

![jFilter Example](demo/demo-gif.gif?raw=true "jFilter Example")

- The filter's dropdown button is colored when it has a filter active, letting you easily know which filters are active at a glance.
- The filter's tokenfield displays all active filters, and are also color coded and sorted based on its filter type.
- Each filter is stored as a separate object, and is saved to localStorage.

**Dependencies:**
- jQuery
- Bootstrap
- Popper.js

**To Initialize:**

```
<div  class="jFilter"></div>

<script>
	let f;

	$(document).ready( function () {
		let  data  = {
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
					{filterId: one, filterName: 'Goodbye!'},
					{filterId: two, filterName: 'Later.'},
					{filterId: three, filterName: 'Have a good one.'}
				],
				colorHSL: [50, 100, 52]
			},
		}

		f  =  new  jFilter({
			domEl: $('.jFilter'),
			data: data,
		})
	})

</script>
```

**Mandatory Arguments:**

 - data:
	 - An array of objects, each with an array `dataSet`, and an array `colorHSL`.
	 - `dataSet` is an array of objects with `filterId` (string or number used for selecting DOM elements), and `filterName` (string or number displayed as text)
	 - `colorHSL` is an array of the 3 HSL values. The color given is applied as the filter element's border-color, and desaturated and lightened for background colors.
- domEl:
	- CSS selector string or jQuery object that chooses a single element to turn into the jFilter element.

**Optional Arguments:**

- onChange:
	- A callback function that is executed any time an option is clicked. If an option is bulk clicked (through the "Clear Filter" button, reset button, or when loaded in from localStorage), it is executed a single time after they've all been clicked.
- onReset:
	- A callback function that is executed any time the reset button is clicked.
- instanceName:
	- The variable saved in localStorage.
	- Default: `window.location.pathname`
- enableTokenField:
	- A boolean that enables or disables the tokenfield.
	- Default: `true`
- enableReset:
	- Enables reset button.
	- Default: `true`
- resetText:
	- String the reset button displays.
	- Default: "Reset"
- resetIconClass:
	- Class given to the reset button's <i> element.
	- Default: ""
- insertAdditional:
	- Object or array of objects that are inserted into existing `data` arrays. Each object has the string `dataKey` (determines which array in `data` to be inserted), `name` (the `filterName` of the inserted object), and `id` (the `filterId`of the inserted object).
- filter:
	- Object with the same structure as the normal filter object that is used instead of being retrieved from localStorage.
- buttonBgColor:
	- String that sets the `background-color` of reset button and addedButtons.
- buttonTextColor:
	- String that sets the `text-color` of reset button and addedButtons.
- addedButtons:
	- Object or array of objects with a string `icon` (gives the button's icon the given class) and a function `callback` (executed when pressing the button).# jFilter
