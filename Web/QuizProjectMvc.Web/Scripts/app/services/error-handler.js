﻿(function () {
	'use strict';

	var DEFFAULT_ERRORS = {

		CREATE_QUIZ: 'Something went wrong creating your qiuz... ' +
		'Please check that everithing is filled out and try againg',

		SOLVE_QUIZ: 'Something is wrong with the received data, please try again'
	}

	function errorHandler() {
		var self = this;        
	}

	errorHandler.prototype.handleCreateQuizError = function(resonse) {
		var message = extractModelStateErrors(resonse.data.modelState) || DEFFAULT_ERRORS.CREATE_QUIZ;

		// Todo: beautify this notification
		alert(message);
	};

	errorHandler.prototype.handleSoveQuizError = function (response) {
	    var message = extractModelStateErrors(response.data.modelState) || response.data.message || DEFFAULT_ERRORS.SOLVE_QUIZ;

	    // Todo: beautify this notification
	    alert(message);
	};

	function extractModelStateErrors(modelState) {
	    if (!modelState) return null;

		var message = "";

		for (var prop in modelState) {
			if (modelState.hasOwnProperty(prop)) {
				message += modelState[prop] + '\n';
			}
		}

		return message.trim();
	}

	angular.module('errorHandler', [])
		.service('errorHandler', [errorHandler]);
}());