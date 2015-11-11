/**
 * Yes/No Element
 *
 * @copyright: Copyright (C) 2005-2013, fabrikar.com - All rights reserved.
 * @license:   GNU/GPL http://www.gnu.org/copyleft/gpl.html
 */

var FbYesno = my.Class(FbRadio, {
	constructor: function (element, options) {
		this.plugin = 'fabrikyesno';
		FbYesno.Super.call(this, element, options);
	},

	getChangeEvent: function () {
		return this.options.changeEvent;
	}

});
