/**
 * List PHP
 *
 * @copyright: Copyright (C) 2005-2013, fabrikar.com - All rights reserved.
 * @license:   GNU/GPL http://www.gnu.org/copyleft/gpl.html
 */

var FbListPHP = my.Class(FbListPlugin, {
	constructor: function (options) {
		FbListPHP.Super.call(this, options);
	},

	buttonAction: function (event) {
		var additional_data = this.options.additional_data,
			hdata = {},
			rowIndexes = [],
			ok, elname, i, cell_data;
		this.list.getForm().getElements('input[name^=ids]').each(function (c) {
			if (c.checked) {
				ok = true;
				var row_index = c.name.match(/ids\[(\d+)\]/)[1];
				rowIndexes.push(row_index);

				// Funky custom stuff from Hugh - leave as it might be used somewhere in the galaxy
				if (additional_data) {
					if (!hdata.hasOwnProperty(row_index)) {
						hdata[row_index] = {};
					}
					hdata[row_index].rowid = c.value;
					var additional = additional_data.split(',');
					for (i = 0; i < additional.length; i ++) {
						elname = additional[i];
						cell_data = c.closest('.fabrik_row').getElements('td.fabrik_row___' + elname)[0].innerHTML;
						hdata[row_index][elname] = cell_data;
					}

				}
			}
		});

		// Get the selected row data
		var rows = [];
		for (var g = 0; g < this.list.options.data.length; g ++) {
			for (var r = 0; r < this.list.options.data[g].length; r ++) {
				var row = this.list.options.data[g][r].data;
				if (rowIndexes.indexOf(row.__pk_val) !== -1) {
					rows.push(row);
				}
			}
		}

		if (additional_data) {
			this.list.getForm().find('input[name=fabrik_listplugin_options]').val(Json.encode(hdata));
		}
		if (this.options.js_code !== '') {
			var result = eval('(function() {' + this.options.js_code + '}())');

			if (result === false) {
				return;
			}
		}

		this.list.submit('list.doPlugin');
	}
});
