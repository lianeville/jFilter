class jFilter {
	constructor(options) {
		this.options = options;
		this.data = options.data;
		this.domEl = $(options.domEl);
		this.insertAdditional = options.insertAdditional || false;
		this.onChange = options.onChange;
		this.onReset = options.onReset;
		this.bulkClick = false;
		this.enableTokenField = options.enableTokenField  == false ? false : true;
		this.enableReset = options.enableReset  == false ? false : true;
		this.resetText = options.resetText || 'Reset';
		this.resetClass = options.resetClass || '';
		this.addedButtons = options.addedButtons;
		this.buttonBgColor = options.buttonBgColor;
		this.buttonTextColor = options.buttonTextColor;
		this.interval;

		// optional variable that names its localstorage variable
		this.instanceName = options.instanceName || window.location.pathname;
		this.filter = options.filter || JSON.parse(localStorage.getItem(this.instanceName)) || {};

		this.escapeData();
		this.addInsert(this.insertAdditional);
		this.generateDom();
		this.clickFilteredItems();
	}

	escapeData() {
		$.each(this.data, (i, dataArr) => {
			$.each(dataArr.dataSet, (i, v) => {
				v.filterHash = this.hashCode(v.filterId)
			})
		})
	}

	addInsert(insert) {
		if (!insert) { return }
		if (Array.isArray(insert)) {
			$.each(insert, (i, v) => { this.addInsert(v) })
		} else {
			this.data[insert.dataKey].dataSet.unshift({ filterHash: this.hashCode(insert.id), filterId: insert.id, filterName: insert.name, inserted: true })
		}
	}

	generateDom() {
		const originaldomElId = this.domEl.attr('id');
		const originaldomElClasses = this.domEl.attr('class');
		const filterDom = $('<div class="jfilter-container" />')
			.attr('id', originaldomElId)
			.addClass(originaldomElClasses)

		const filterTypeContainer = $('<ul class="jfilter-type-container" />')
			.addClass('nav nav-pills nav-pills-bordered')
			.appendTo(filterDom)

		this.domEl.replaceWith(filterDom);
		this.domEl = filterDom;

		$.each(this.data, (optionLabel, options) => {
			filterTypeContainer.append(this.generateCategoryDom(optionLabel, options));
		})
		if (this.enableReset) {
			filterTypeContainer.append(this.generateResetButtonDom())
		}
		if (this.enableTokenField) {
			filterDom.append(this.generateTokenField())
		}
		if (this.addedButtons) {
			this.generateAddedButtons(this.addedButtons);
		}
	}

	generateTokenField() {
		const tokenFieldDom = $('<div class="tokenfield" />');
		$.each(this.data, (e) => {
			tokenFieldDom.append(`<div class="tokenfield-${e.toLowerCase()} d-flex">`);
		})

		return tokenFieldDom;
	}

	generateCategoryDom(optionLabel, options) {
		if (!this.filter[optionLabel.toLowerCase()]) {
			this.filter[optionLabel.toLowerCase()] = [];
		}
		const categoryDom = $('<li class="jfilter-type nav-item dropdown" />')
			.append(this.generateDropdownDom(options, optionLabel))
		$('<a href="#" class="jfilter-type-a" />').text(optionLabel)
			.attr('data-bs-toggle', 'dropdown')
			.addClass('nav-link rounded-pill dropdown-toggle btn')
			.addClass(optionLabel.toLowerCase())
			.css('border-color', this.formatHSL(options.colorHSL))
			.css('background-color', this.formatHSL(options.colorHSL, true))
			.attr('aria-expanded', false)
			.attr('data-toggle', 'dropdown')
			.prependTo(categoryDom)
		return categoryDom;
	}

	generateDropdownDom(options, optionLabel) {
		const dropdownDom = $('<div class="dropdown-menu dropdown-menu-right" />')
			.addClass('dropdown--' + optionLabel)
			.on('click', function(e) { e.stopPropagation() })
		$('<div class="dropdown-item clear-filter-container" />')
			.append(this.generateClearFilterDom(options.colorHSL))
			.appendTo(dropdownDom)

		const dropdownDomItems = $('<div class="dropdown-dom-items" />')
			.appendTo(dropdownDom)
		$.each(options.dataSet, (i, v) => {
			dropdownDomItems.append(this.generateOptionDom(v, optionLabel, options.colorHSL));
		})

		return dropdownDom;
	}

	generateClearFilterDom(colorHSL) {
		const buttonDom = $('<button type="button">Clear Filter</button>')
			.addClass('btn btn-outline-primary')
			.css('border-color', this.formatHSL(colorHSL))
			.css('color', this.formatHSL(colorHSL))
			.css('background-color', this.formatHSL(colorHSL, true))
			.on('click', (e) => {
				this.bulkClick = true;
				$.each($(e.currentTarget).parent().next().children(), function() {
					if (this.children[0].checked) {
						$(this).children('input').click();
					}
				})
				this.bulkClick = false;
				if (this.onChange) {(this.onChange(this.filter))}
			})
		return buttonDom;
	}

	generateOptionDom(option, optionLabel, colorHSL) {
		const optionDom = $('<label class="dropdown-item custom-control custom-checkbox" />')
			.css('background-color', this.formatHSL(colorHSL, true))

		$(`<input class="custom-control-input" type="checkbox">`)
			.addClass(optionLabel.toLowerCase() + '--' + option.filterHash)
			.on('click', (e) => {
				const typeDom = $(e.currentTarget).closest('.dropdown-menu').prev()
				if ($(e.currentTarget)[0].checked) {
					// remove item if it's already in filter arr
					this.filter[optionLabel.toLowerCase()] =
						this.filter[optionLabel.toLowerCase()].filter(item => item !== option.filterId)

					this.filter[optionLabel.toLowerCase()].push(option.filterId)

					typeDom.addClass('filterActive')
					if (this.enableTokenField) {
						this.domEl.find(`.tokenfield-${optionLabel.toLowerCase()}`)
							.append(this.generateTokenTag(optionLabel, option, colorHSL))
					}

				} else {
					this.filter[optionLabel.toLowerCase()] =
						this.filter[optionLabel.toLowerCase()].filter(x => x != option.filterId)
					if (!this.filter[optionLabel.toLowerCase()].length) {
						typeDom.removeClass('filterActive')
					}
					if (this.enableTokenField) {
						$(this.domEl.find('.tokenfield .' + optionLabel.toLowerCase() + '--' + option.filterHash))
							.remove()
					}
				}
				if (!this.bulkClick) {
					if (this.onChange) { this.onChange(this.filter) }
				}
				localStorage.setItem(this.instanceName, JSON.stringify(this.filter));
			})
			.appendTo(optionDom)

		$(`<span data-value="${option.filterId}">&ZeroWidthSpace;</span>`)
			.addClass('custom-control-label')
			.css('border-color', this.formatHSL(colorHSL))
			.css('background-color', this.formatHSL(colorHSL))
			.addClass(option.inserted ? 'font-italic' : '')
			.appendTo(optionDom)

		$(`<span class="ml-0">${option.filterName.replaceAll('__', " ")}</span>`)
			.appendTo(optionDom)

		return optionDom;
	}

	generateTokenTag(optionLabel, option, colorHSL) {
		const tagDom = $(`<div class="token ${optionLabel.toLowerCase()}" />`)
			.css('border-color', this.formatHSL(colorHSL))
			.css('background-color', this.formatHSL(colorHSL, true))
			.addClass(optionLabel.toLowerCase() + "--" + option.filterHash)
			.append(`<span class="token-label">${option.filterName.replaceAll('__', " ")}</span>`)
			.append('<a class="close">×</a>')
			.on('click', (e) => {
				$(this.domEl.find(".dropdown-item > ." + optionLabel.toLowerCase() + "--" + option.filterHash)).click()
			})

		return tagDom;
	}

	generateResetButtonDom() {
		const resetContainer = $('<li class="jfilter-reset ml-auto"/>');
		$('<div href="#" class="nav-link rounded-pill jfilter-button" />')
			.text(this.resetText)
			.css('background-color', this.buttonBgColor || '#2196f3')
			.css('color', this.buttonTextColor || '#fff')
			.append(`<i class="${this.resetClass}"></i>`)
			.appendTo(resetContainer)
			.on('click', () => {
				this.bulkClick = true;
				$.each(this.domEl.find('.dropdown-item input'), (i, v) => {
					if (v.checked) {
						$(v).click()
					}
				})
				$.each(this.filter, (i, arr) => {
					this.filter[i] = [];
				})
				this.bulkClick = false;
				$('.jfilter-type a.filterActive').removeClass('filterActive');
				localStorage.removeItem(this.instanceName);
				if (this.onChange) {(this.onChange(this.filter))}
				if (this.onReset) { this.onReset() }
			})
			.on('mousedown', () => {
				this.interval = setInterval(() => {
					localStorage.clear();
					new Noty({
						text: 'Local data cleared.',
						type: 'success',
						timeout: 2000
					}).show()
				}, 5000)
			})
			.on('mouseup', () => {
				clearInterval(this.interval)
			})
			.on('mouseout', () => {
				clearInterval(this.interval)
			})

		return resetContainer;
	}

	generateAddedButtons(button) {
		if (Array.isArray(button)) {
			$.each(button, (i, v) => { this.generateAddedButtons(v) })
		} else {
			const addedButton = $('<li></li>')
				.append(`
					<div class="jfilter-button nav-link rounded-pill bg-primary ml-1" style="background-color: ${this.buttonBgColor}!important; color: ${this.buttonTextColor}">
						<i class="${button.icon}"></i>
					</div>`)
				.on('click', button.callback)
			$('.jfilter-type-container').append(addedButton)
		}
	}

	clickFilteredItems() {
		this.bulkClick = true;
		$.each(this.filter, (filterIndex, filterArr) => {
			$.each(filterArr, (i, filterItem) => {
				filterArr[i] = typeof filterItem == 'string'
					? filterItem.toLowerCase() : filterItem
				$(this.domEl).find("." + filterIndex + "--" + this.hashCode(filterItem)).click()
			})
		})
		this.bulkClick = false;
		if (this.onChange) {(this.onChange(this.filter))}
	}

	formatHSL(hslArr, lighten) {
		let [h, s, l] = hslArr;

		if (lighten) {
			s *= 0.6;
			l += (100 - l) * 0.75;
		}

		return `hsl(${h},${s}%,${l}%)`
	}

	/**
	 * Returns a hash code from a string or number
	 * @param  {String} str The string or number to hash.
	 * @return {String}    A 7 Char Base 32 String
	 * @see http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
	 */
	hashCode(str) {

		if (typeof str == 'number') {
			str = str.toString();
		}
		if (typeof str != 'string') {
			throw new Error('Hashcode argument must be string or number.');
		}

		let hash = 0;
		for (let i = 0, len = str.length; i < len; i++) {
			let chr = str.charCodeAt(i);
			hash = (hash << 5) - hash + chr;
			hash |= 0; // Convert to 32bit integer
		}

		//We're not rlly worried about colisions so we cn half the hashspace to get rid of -
		hash = Math.abs(hash)
		const strHash = hash.toString(32);
		const paddedHash = strHash.padStart(7, "0")
		return paddedHash
	}

}
