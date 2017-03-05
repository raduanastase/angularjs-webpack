import angular from 'angular';
import uiBootstrap from 'angular-ui-bootstrap';

import '../style/app.css';

let app = () => {
  return {
    template: require('./app.html'),
    controller: 'AppCtrl',
    controllerAs: 'appCtrl'
  }
};

class AppCtrl {
  constructor($scope) {
    this.$scope = $scope;
    this.url = 'test';
    this.wordList = this.shuffle(['PIZZA', 'TOMORROW', 'MONITOR', 'COMPUTER']);
    this.wordIncrement = 0;
    this.randomScrambledWord = this.getRandomScrambledWord();
    this.randomSolvedWord = this.getRandomSolvedWord();
    this.mistakes = 0;
    this.submitted = false;
    this.maxScore = this.calculateScore(this.randomScrambledWord, 0);
    this.TIME_LIMIT = 40000;
    $scope.score = 0;
    $scope.verifyWord = this.onVerifyWord.bind(this);
    $scope.verifyIfDelete = this.onVerifyIfDelete.bind(this);
    $scope.time = 40;
  }

  onVerifyIfDelete($event) {
    if (
      ($event.keyCode === 8 || $event.keyCode === 46) &&
      this.$scope.score > 0 &&
      this.$scope.word !== ''
    ) {
      this.$scope.score--;
    }
  }

  onVerifyWord() {
    if (this.$scope.word.toUpperCase() === this.randomSolvedWord) {
      this.$scope.correct = true;
      this.$scope.wrong = false;
      this.$scope.score += this.calculateScore(this.randomSolvedWord, this.mistakes);
      this.mistakes = 0;
      this.wordIncrement++;
      this.randomScrambledWord = this.getRandomScrambledWord();
      this.randomSolvedWord = this.getRandomSolvedWord();
      this.$scope.word = '';
    } else {
      this.$scope.correct = false;
      this.$scope.wrong = true;
    }
  }

  shuffle(array) {
    for (let i = array.length; i; i--) {
      let j = Math.floor(Math.random() * i);
      [array[i - 1], array[j]] = [array[j], array[i - 1]];
    }

    return array;
  }

  getRandomSolvedWord() {
    return this.wordList[this.wordIncrement];
  }

  getRandomScrambledWord() {
    return this.shuffle(this.getRandomSolvedWord().split('')).join('')
  }

  calculateScore(word, mistakesCount) {
    const maxScore = Math.floor(Math.pow(1.95, parseInt(word.length / 3)));
    const finalScore = maxScore - mistakesCount;

    return finalScore < 0 ? 0 : finalScore;
  }
}

const MODULE_NAME = 'app';

angular.module(MODULE_NAME, [uiBootstrap])
  .directive('app', app)
  .controller('AppCtrl', AppCtrl);

export default MODULE_NAME;