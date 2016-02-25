﻿(function () {
	'use strict';

	var DEFAULT_STORAGE = {
		title: '',
		description: '',
		category: '',
		questions: []
	};

	function CreateQuizController($scope, $http,$location, $localStorage, $uibModal, errorHandler) {
		var self = this;

		console.log('Hello from CreateQuizController');

		$localStorage.quiz = $localStorage.quiz || {};
		$scope.quiz = $localStorage.quiz;

		self.addQuiz = function addQuiz(quiz, form) {
			console.log('adding quiz...');
			console.log(quiz);

		    $http.post('/api/Quizzes/Create', quiz)
		    .then(function(response) {
		    		// $scope.resetForm(form);
		            window.location = '/'; // Todo: $location.path('/') is not working for some reason, try to fix.
		        }, errorHandler.handleCreateQuizError);
		};

		$scope.resetForm = function resetForm(form) {
			var check = confirm("Are you sure you want to reset, all fields and questions will be reset.");

			if (!check) {
				return;
			}

			form.$setPristine();
			form.$setUntouched();

			$localStorage.quiz = angular.copy(DEFAULT_STORAGE);
			$scope.quiz = $localStorage.quiz;
		};

		self.removeQuestion = function removeQuestion(index) {
			$scope.quiz.questions.splice(index, 1);
		};

		self.getCategories = function getCategories(pattern) {
			return $http.get('/api/categories/getByPattern?pattern=' + pattern)
				.then(function (res) {
					return res.data;
				});
		};

		self.openQuesitonMenu = function openQuesitonMenu(question) {
			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'addQuestionTemplate',
				controller: 'AddQuestionController',
				controllerAs: 'ctrl',
				resolve: {
					items: question
				}
			});

			modalInstance.result.then(function (question) {
				if (question !== null) {
					$scope.quiz.questions.push(question);
				}
			}, function () {
				console.log('Modal dismissed at: ' + new Date());
			});
		};
	}

	function AddQuestionController($uibModalInstance, resource) {
		var self = this,
			backup = '';

		self.letters = 'abcdefghijk';

		if (resource) {
			self.question = resource;
			backup = JSON.stringify(resource);
		} else {
			self.question = {
				title: '',
				answers: []
			};
		}

		self.ok = function () {
			if (backup) {
				// if backup exists then this is an edit, no need to return the question
				// it is already passed by reference
				$uibModalInstance.close(null);
			} else {
				// return the question to be added to the quiz
				$uibModalInstance.close(self.question);
			}
		};

		self.cancel = function () {
			if (backup) {
				restoreBackup(resource, backup);

				console.log(resource);
			}

			$uibModalInstance.dismiss('cancel');
		};

		self.addAnswer = function addAnswer() {
			var answer = {
				text: ''
			};

			if (!self.question.answers.length) {
				answer.isCorrect = true;
			}

			self.question.answers.push(answer);
		};

		self.removeAnswer = function removeAnswer(index) {
			self.question.answers.splice(index, 1);
			if (self.question.answers.length === 1) {
				self.question.answers[0].isCorrect = true;
			}
		};

		self.markCorrect = function markCorrect(index) {
			self.question.answers.forEach(function (answer, i) {
				answer.isCorrect = i === index;
			});
		};

		self.hasCorrect = function hasCorrect() {
			return self.question.answers.some(function (answer) {
				return answer.isCorrect;
			});
		};
	}

	function restoreBackup(obj, backup) {
		var backupAsObject = JSON.parse(backup),
			prop;

		for (prop in backupAsObject) {
			obj[prop] = backupAsObject[prop];
		}
	}

	function extractModelStateErrors(modelState) {
		var message = "";

		for (var prop in modelState) {
			if (modelState.hasOwnProperty(prop)) {
				message += modelState[prop] + '\n';
			}
		}

		return message.trim();
	}

	angular.module('createQuiz', ['ui.bootstrap', 'ngStorage', 'paging', 'toggle-switch', 'errorHandler'])
		.controller('CreateQuizController', [
			'$scope',
			'$http',
			'$location',
			'$localStorage',
			'$uibModal',
			'errorHandler',
			CreateQuizController
		])
		.controller('AddQuestionController', [
			'$uibModalInstance',
			'items',
			AddQuestionController
		]);
})()