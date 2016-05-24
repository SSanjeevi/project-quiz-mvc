﻿(function (angular) {
    'use strict';

    if (!angular) {
        throw new Error('Module base-controller.js is missing angular dependency');
    }

    function ManageQuizController($scope, $http, $localStorage, $uibModal) {
        var self = this;

        $http.get('/api/categories/getCategories')
            .then(function (res) {
                console.log(res.data);
                $scope.categories = res.data;
            });

        console.log('Hello from BaseController');

        self.setQuiz = function setQuiz(quiz) {
            console.log('setting quiz --> ', quiz);
            $scope.quiz = quiz;
        }

        self.resetForm = function resetForm(form) {
            var check = confirm('Are you sure you want to reset, all fields and questions will be reset.');

            if (!check) {
                return false;
            }

            form.$setPristine();
            form.$setUntouched();

            return true;
        };

        self.removeQuestion = function removeQuestion(index) {
            $scope.quiz.questions.splice(index, 1);
        };

        $scope.modalIsOpen = false;

        self.openQuesitonMenu = function openQuesitonMenu(question) {
            $scope.modalIsOpen = true;

            var modalInstance = $uibModal.open({
                animation: true,
                appendTo: $('#manage-quiz'),
                templateUrl: '/Content/templates/add-question-template.html',
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

            modalInstance.closed.then(function () {
                console.log('close');
                $scope.modalIsOpen = false;
            });
        };

        self.saveIsAvailable = function saveIsAvailable(quiz, form) {
            var result = form.$valid &&
                quiz.questions.length >= 3;

            return result;
        }
    }

    angular.module('manageQuiz', [
        'ngStorage', 'paging', 'toggle-switch', 'errorHandler', 'ui.bootstrap'])
        .controller('ManageQuizController', [
            '$scope',
            '$http',
            '$localStorage',
            '$uibModal',
            ManageQuizController
        ]);
})(window.angular)