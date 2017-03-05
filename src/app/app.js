import angular from 'angular';
import uiBootstrap from 'angular-ui-bootstrap';
import firebase from 'firebase';

import '../style/app.css';

// Set the firebase configuration for your app
const config = {
  apiKey: "AIzaSyAOnQKBQ1O8MredgNX5rBO9tqyzkGcL8ik",
  authDomain: "wordgameangularjs.firebaseapp.com",
  databaseURL: "https://wordgameangularjs.firebaseio.com/",
  storageBucket: "gs://wordgameangularjs.appspot.com"
};

firebase.initializeApp(config);
// Get a reference to the database service
const database = firebase.database();

let app = () => {
  return {
    template: require('./app.html'),
    controller: 'AppCtrl',
    controllerAs: 'appCtrl'
  }
};

class AppCtrl {
  constructor($scope, $interval, $q) {
    this.$scope = $scope;
    this.$interval = $interval;
    this.$q = $q;
    this.wordIncrement = 0;
    this.mistakes = 0;
    $scope.score = 0;
    $scope.verifyWord = this.onVerifyWord.bind(this);
    $scope.verifyIfDelete = this.onVerifyIfDelete.bind(this);
    $scope.time = 40;
    $scope.startGame = this.onStartGame.bind(this);
    $scope.showLoadingScreen = true;

    this.getData();
  }

  getData() {
    const wordsPromise = database.ref('/words/').once('value').then((snapshot) => snapshot.val());
    const usersPromise = database.ref('/players/').once('value').then((snapshot) => snapshot.val());

    this.$q.all([wordsPromise, usersPromise]).then(values => {
      this.$scope.showLoadingScreen = false;
      this.wordList = this.shuffle(values[0]);
      this.$scope.players = values[1];
      this.randomScrambledWord = this.getRandomScrambledWord();
      this.randomSolvedWord = this.getRandomSolvedWord();
    });
  }

  onStartGame() {
    if (!this.interval) {
      this.interval = this.$interval(() => {
        if (this.$scope.time > 0) {
          this.$scope.time--;
        } else {
          clearInterval(this.interval);
          console.log('game over');
        }
      }, 1000);
    }
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
    if (this.$scope.word.toLowerCase() === this.randomSolvedWord) {
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