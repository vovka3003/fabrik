/**
 * Field Element
 *
 * @copyright: Copyright (C) 2005-2013, fabrikar.com - All rights reserved.
 * @license:   GNU/GPL http://www.gnu.org/copyleft/gpl.html
 */

function geolocateLoad () {
	if (document.body) {
		$(window).trigger('google.geolocate.loaded');
	} else {
		console.log('no body');
	}
}

var FbField = my.Class(FbElement, {

	constructor: function (element, options) {
		this.plugin = 'fabrikfield';
		FbField.Super.call(this, element, options);
		/*
		 * $$$ hugh - testing new masking feature, uses this jQuery widget:
		 * http://digitalbush.com/projects/masked-input-plugin/
		 */
		if (this.options.use_input_mask) {
			jQuery('#' + element).mask(this.options.input_mask);
		}
		if (this.options.geocomplete) {
			this.gcMade = false;
			this.loadFn = function () {
				if (this.gcMade === false) {
					jQuery('#' + this.element.id).geocomplete();
					this.gcMade = true;
				}
			}.bind(this);
			$(window).on('google.geolocate.loaded', this.loadFn);
			Fabrik.loadGoogleMap(false, 'geolocateLoad');
		}
	},

	select: function () {
		var element = this.getElement();
		if (element) {
			this.getElement().select();
		}
	},

	focus: function () {
		var element = this.getElement();
		if (element) {
			this.getElement().focus();
		}
	},

	cloned: function (c) {
		if (this.options.use_input_mask) {
			var element = this.getElement();
			if (element) {
				jQuery('#' + element.id).mask(this.options.input_mask);
			}
		}
		if (this.options.geocomplete) {
			var element = this.getElement();
			if (element) {
				jQuery('#' + element.id).geocomplete();
			}
		}
		FbField.Super.prototype.cloned(this, c);
	}

});