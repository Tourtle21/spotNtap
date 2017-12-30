import React from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import ActionButton from "./app/components/ActionButton.js";
import Game from "./app/components/Game.js";
import Scoreboard from "./app/components/Scoreboard.js";
import Constants from "./app/Constants.js";
import { AsyncStorage, StyleSheet, View, Image, Text, TouchableOpacity } from "react-native";

var Sound = require("react-native-sound");
var _ = require("lodash");
var timer;

const allSymbols = [
  "ios-pizza",
  "ios-bug",
  "ios-disc",
  "ios-planet",
  "ios-football",
  "ios-paw",
  "ios-alarm",
  "ios-heart",
  "ios-home",
  "ios-star"
];

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.onPuzzleClick = this.onPuzzleClick.bind(this);
    this.onRestart = this.onRestart.bind(this);
    this.onReturnToMenu = this.onReturnToMenu.bind(this);
    this.resetDefaults = this.resetDefaults.bind(this);
    this.restartTimer = this.restartTimer.bind(this);
    this.startNextRound = this.startNextRound.bind(this);
    this.switchBack = setInterval(function() {});
    this.state = {
      differentPuzzle: null,
      difficulty: Constants.EASY,
      gameOver: false,
      highScore: 0,
      mode: "easy",
      page: "menu",
      puzzles: [],
      score: 0,
      time: 30,
      incorrect: "transparent"
    };
  }

  componentDidMount() {
    Sound.setCategory("Playback", true);
  }

  restartTimer() {
    clearInterval(timer);
    timer = setInterval(() => {
      const { highScore, mode, score, time } = _.clone(this.state);
      if (time - 1 <= 0) {
        this.playSound('end_of_game.wav');
        clearInterval(timer);
        let newHighScore = score > highScore ? score : highScore;
        switch (mode) {
          case "easy":
            AsyncStorage.setItem("easyHighScore", newHighScore.toString());
            break;
          case "normal":
            AsyncStorage.setItem("normalHighScore", newHighScore.toString());
            break;
          case "hard":
            AsyncStorage.setItem("hardHighScore", newHighScore.toString());
            break;
          default:
            AsyncStorage.setItem("endlessHighScore", newHighScore.toString());
            break;
        }
        this.setState({ gameOver: true, highScore: newHighScore });
      }
      if (time - 1 != -1) {
        this.setState({ time: time - 1 });
      }
    }, 1000);
  }

  resetDefaults(page, callback) {
    let time = this.state.mode == "endless" ? 10 : 30;
    let difficulty = this.state.mode == "endless" ? Constants.EASY : _.clone(this.state.difficulty);
    this.setState(
      {
        difficulty,
        gameOver: false,
        page: page,
        score: 0,
        time
      },
      function() {
        if (page == "game") {
          this.startNextRound();
        }
      }
    );
  }

  onRestart() {
    this.playSound('click_button.wav');
    this.resetDefaults("game");
    this.restartTimer();
  }

  onReturnToMenu() {
    this.playSound('click_button.wav');
    this.resetDefaults("menu");
  }

  onPuzzleClick(puzzle) {
    const { differentPuzzle, difficulty, gameOver, mode, score, time } = _.clone(this.state);
    if (gameOver) return;
    if (puzzle == differentPuzzle) {
      this.playSound('correct2.wav');
      this.setState({ score: score + 1 });
      if (mode == "endless") {
        this.setState({ time: time + Math.sqrt(difficulty) + 1 });
        if ((score + 1) % 10 == 0 && difficulty < Constants.INSANE) {
          this.setState(
            {
              difficulty: Math.pow(Math.sqrt(difficulty) + 1, 2)
            },
            function() {
              this.startNextRound();
            }
          );
          return;
        }
      }
      this.startNextRound();
    } else {
      this.playSound('wrong1.wav');
      let newTime = time - Math.sqrt(difficulty);
      let alpha = 1;
      let that = this;
      clearInterval(this.switchBack);
      this.switchBack = setInterval(function() {
        alpha -= 0.1;
        if (alpha <= 0.3) {
          alpha = 0;
        }
        that.setState({
          incorrect: "rgba(197, 32, 46, " + alpha + ")"
        });
        if (alpha <= 0.3) {
          clearInterval(that.switchBack);
        }
      }, 10);
      this.setState({
        time: newTime <= 0 ? 0 : newTime,
        incorrect: "red"
      });
    }
  }

  generatePuzzle() {
    let puzzle = [];
    for (var i = 0; i < this.state.difficulty; i++) {
      randInd = Math.floor(Math.random() * allSymbols.length);
      puzzle.push(allSymbols[randInd]);
    }
    return puzzle;
  }

  generateDifferentPuzzle(repeatedPuzzle) {
    var differentPuzzle = _.clone(repeatedPuzzle);
    if (this.state.difficulty == 1) {
      let remainingSymbols = _.without(allSymbols, repeatedPuzzle[0]);
      differentPuzzle = [remainingSymbols[Math.floor(Math.random() * remainingSymbols.length)]];
    } else {
      var randomIndex1 = Math.floor(Math.random() * this.state.difficulty);
      var randomIndex2 = Math.floor(Math.random() * this.state.difficulty);
      var oldPiece = differentPuzzle[randomIndex1];
      differentPuzzle[randomIndex1] = differentPuzzle[randomIndex2];
      differentPuzzle[randomIndex2] = oldPiece;
      if (differentPuzzle[randomIndex1] == differentPuzzle[randomIndex2]) {
        differentPuzzle = this.generateDifferentPuzzle(repeatedPuzzle);
      }
    }
    return differentPuzzle;
  }

  startNextRound() {
    let repeatedPuzzle = this.generatePuzzle();
    let differentPuzzle = this.generateDifferentPuzzle(repeatedPuzzle);
    let differentIndex = Math.floor(Math.random() * 4);
    let puzzles = [];
    for (var i = 0; i < 4; i++) {
      if (i == differentIndex) {
        puzzles.push(differentPuzzle);
      } else {
        puzzles.push(repeatedPuzzle);
      }
    }
    this.setState({ differentPuzzle, puzzles });
  }

  playSound(filename) {
    var sound = new Sound(filename, Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('failed to load the sound', error);
      } else {
        sound.play();
      }
    });
  }

  changeDifficulty(difficulty, mode) {
    this.playSound('click_button.wav');
    this.setState({ difficulty, mode });
    switch (mode) {
      case "easy":
        AsyncStorage.getItem("easyHighScore")
          .then(value => {
            this.setState({ highScore: Number(value) || 0 });
          })
          .done();
        break;
      case "normal":
        AsyncStorage.getItem("normalHighScore")
          .then(value => {
            this.setState({ highScore: Number(value) || 0 });
          })
          .done();
        break;
      case "hard":
        AsyncStorage.getItem("hardHighScore")
          .then(value => {
            this.setState({ highScore: Number(value) || 0 });
          })
          .done();
        break;
      default:
        AsyncStorage.getItem("endlessHighScore")
          .then(value => {
            this.setState({ highScore: Number(value) || 0 });
          })
          .done();
        break;
    }
  }

  renderGameSection() {
    if (this.state.gameOver) {
      return (
        <View>
          <Text style={styles.highScore}>High Score: {this.state.highScore}</Text>
          <ActionButton onPressFunction={this.onRestart} buttonText="Play Again" />
        </View>
      );
    }

    return (
      <Game
        differentPuzzle={this.state.differentPuzzle}
        difficulty={this.state.difficulty}
        gameOver={this.state.gameOver}
        onPuzzleClick={this.onPuzzleClick}
        puzzles={this.state.puzzles}
      />
    );
  }

  renderPage() {
    const { difficulty, mode, page } = this.state;
    if (page == "menu") {
      return (
        <View style={styles.menu}>
          <Image source={require("./app/images/Logo.png")} style={styles.logo} />
          <View style={styles.options}>
            <TouchableOpacity
              onPress={() => {
                this.changeDifficulty(Constants.EASY, "easy");
              }}
              title="Easy"
            >
              <Text style={mode == "easy" ? styles.selectedDifficulty : styles.difficulty}>Easy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.changeDifficulty(Constants.NORMAL, "normal");
              }}
              title="Normal"
            >
              <Text style={mode == "normal" ? styles.selectedDifficulty : styles.difficulty}>Normal</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.changeDifficulty(Constants.HARD, "hard");
              }}
              title="Hard"
            >
              <Text style={mode == "hard" ? styles.selectedDifficulty : styles.difficulty}>Hard</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.changeDifficulty(Constants.ENDLESS, "endless");
              }}
              title="Endless"
            >
              <Text style={mode == "endless" ? styles.selectedDifficulty : styles.difficulty}>Endless</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={this.onRestart} title="Start Game" style={styles.startButton}>
            <Ionicons name={"ios-play"} style={styles.playIcon} />
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <View>
        <Scoreboard
          onGameOver={this.onGameOver}
          onTick={this.onTick}
          score={this.state.score}
          time={this.state.time}
          incorrect={this.state.incorrect}
        />
        {this.renderGameSection()}
        <ActionButton onPressFunction={this.onReturnToMenu} buttonText="Main Menu" />
      </View>
    );
  }

  render() {
    return (
      <Image source={require("./app/images/bkgnd.png")} style={styles.backgroundImage}>
        {this.renderPage()}
      </Image>
    );
  }
}

const styles = StyleSheet.create({
  backgroundImage: {
    width: "100%",
    height: "100%",
    flex: 1,
    resizeMode: "cover",
    paddingVertical: 80
  },
  menu: {
    display: "flex",
    height: "100%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "transparent"
  },
  options: {
    display: "flex",
    alignItems: "center",
    marginBottom: 30
  },
  logo: {
    width: 250,
    height: 106,
    resizeMode: "contain"
  },
  difficulty: {
    color: "#EFEFEF",
    opacity: 0.75,
    fontSize: 30,
    paddingTop: 20
  },
  selectedDifficulty: {
    color: "#EFEFEF",
    opacity: 1,
    fontSize: 30,
    paddingTop: 20
  },
  startButton: {
    marginTop: 20,
    width: 180,
    height: 50,
    borderRadius: 2,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#efa121"
  },
  playIcon: {
    fontSize: 30,
    color: "#FFFFFF"
  },
  highScore: {
    backgroundColor: "transparent",
    fontSize: 36,
    fontWeight: "600",
    color: "#EFEFEF",
    textAlign: "center",
    paddingTop: 20
  },
  playAgainBtn: {
    backgroundColor: "#efa121"
  }
});
