import angular from 'angular';

import '../style/app.css';

let app = () => {
  return {
    template: require('./app.html'),
    controller: 'AppCtrl',
    controllerAs: 'appCtrl'
  }
};

class AppCtrl {
  constructor() {
    this.url = 'test';
    this.wordList = this.shuffle(['PIZZA', 'TOMORROW', 'MONITOR', 'COMPUTER']);
    this.wordIncrement = 0;
    this.randomScrambledWord = this.getRandomScrambledWord();
    this.randomSolvedWord = this.getRandomSolvedWord();
    this.maxScore = this.calculateScore(this.randomScrambledWord, 0);
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

angular.module(MODULE_NAME, [])
  .directive('app', app)
  .controller('AppCtrl', AppCtrl);

export default MODULE_NAME;