import { QuestionType } from "../enum/QuestionType";
import { similarWords } from "../const/similarWords";
import { Random } from "./Random";
import { GameHtmlElement } from "./GameHtmlElement";
import { ArithmeticOperation } from "../enum/ArithmeticOperation";
import { answersPerQuestion } from "../const/answersPerQuestion";
import { GameStreakManager } from "./GameStreakManager";
import Tweezer from "tweezer.js";
import { Scene } from "../enum/Scene";
import { Signal } from "./Signal";
import { vowels } from "../const/vowels";
import { consonants } from "../const/consonants";

export class GamePlayScene {
  public static onAnsweredCorrectly: Signal<void> = new Signal();
  public static onAnsweredWrongly: Signal<void> = new Signal();

  private static expectedAnswer: string;
  private static buttonsBlocked = false;

  public static initialize(): void {
    this.listenToAnswersSelected();
  }

  private static listenToAnswersSelected(): void {
    Array.from(GameHtmlElement.answerButtons).forEach(answerButton => {
      answerButton.addEventListener("click", () => {
        if (this.buttonsBlocked) return;
        this.blockButtons();
        this.processAnswer(answerButton.innerText);
      });
    });
  }

  private static processAnswer(answer: string): void {
    if (answer == this.expectedAnswer) {
      this.onAnsweredCorrectly.emit();
    } else {
      this.onAnsweredWrongly.emit();
    }

    this.startFadeOutTween();
  }

  private static updateOpacityOnFadeTweenTick(value: number): void {
    GameHtmlElement.getScene(Scene.GamePlay).style.opacity = (
      value / 100
    ).toString();
  }

  private static startFadeOutTween(): void {
    new Tweezer({
      start: 100,
      end: 0,
      duration: 500
    })
      .on("tick", this.updateOpacityOnFadeTweenTick)
      .on("done", () => {
        this.preparePhase();
        this.startFadeInTween();
      })
      .begin();
  }

  private static startFadeInTween(): void {
    new Tweezer({
      start: 0,
      end: 100,
      duration: 500
    })
      .on("tick", this.updateOpacityOnFadeTweenTick)
      .on("done", () => this.unblockButtons())
      .begin();
  }

  private static blockButtons(): void {
    this.buttonsBlocked = true;
  }

  private static unblockButtons(): void {
    this.buttonsBlocked = false;
  }

  public static setSentence(text: string): void {
    GameHtmlElement.sentenceElement.innerText = text;
  }

  public static setQuestion(text: string): void {
    GameHtmlElement.questionElement.innerText = text;
  }

  public static setAnswers<T>(answers: Array<T>): void {
    Random.shuffle(answers);
    for (let i = 0; i < answersPerQuestion; i++) {
      GameHtmlElement.getAnswerButton(i).innerText = answers[i].toString();
    }
  }

  public static preparePhase(): void {
    if (GameStreakManager.currentStreak < 10) {
      this.prepareWhatIsTheWord();
      return;
    }

    if (GameStreakManager.currentStreak < 20) {
      if (Random.pickIntInclusive(0, 1)) {
        this.prepareWhatIsTheWord();
      } else {
        this.prepareFindTheMissingLetter();
      }
      return;
    }

    switch (Random.pickElementFromEnum(QuestionType)) {
      case QuestionType.WhatIsTheWord:
        this.prepareWhatIsTheWord();
        break;
      case QuestionType.FindTheMissingLetter:
        this.prepareFindTheMissingLetter();
        break;
      case QuestionType.WhatIsTheResult:
        this.prepareWhatIsTheResult();
        break;
    }
  }

  private static prepareWhatIsTheWord(): void {
    const randomSet = [...Random.pickElementFromArray(similarWords)];
    const answers = [];
    for (let i = 0; i < answersPerQuestion; i++) {
      const randomWordIndex = Random.pickIndexFromLength(randomSet.length);
      answers.push(randomSet.splice(randomWordIndex, 1));
    }
    this.expectedAnswer = Random.pickElementFromArray(answers);
    this.setSentence(this.expectedAnswer);
    this.setQuestion("Which word is that?");
    this.setAnswers(answers);
  }

  private static prepareFindTheMissingLetter(): void {
    const randomSet = Random.pickElementFromArray(similarWords);
    const selectedWord = Random.pickElementFromArray(randomSet);
    const selectedCharIndex = Random.pickIndexFromLength(selectedWord.length);
    const selectedChar = selectedWord[selectedCharIndex];
    const answers = [];
    const selectedCharIsAVowel =
      vowels.indexOf(selectedChar.toUpperCase()) >= 0;

    for (let i = 0; i < answersPerQuestion; i++) {
      const characters = selectedCharIsAVowel ? vowels : consonants;
      const randomCharIndex = Random.pickIndexFromLength(characters.length);
      const selectedChar = characters.splice(randomCharIndex, 1)[0];
      const mutatedWord =
        selectedWord.substr(0, selectedCharIndex) +
        selectedChar +
        selectedWord.substr(selectedCharIndex + 1);

      if (this.wordExists(mutatedWord)) {
        i--;
      } else {
        answers.push(selectedChar);
      }
    }

    const selectedCharIsNotInTheAnswers =
      answers.indexOf(selectedChar.toUpperCase()) == -1;

    if (selectedCharIsNotInTheAnswers) {
      answers[
        Random.pickIndexFromLength(answers.length)
      ] = selectedChar.toUpperCase();
    }

    const sentence =
      selectedWord.substr(0, selectedCharIndex) +
      "_" +
      selectedWord.substr(selectedCharIndex + 1);

    this.expectedAnswer = selectedChar.toUpperCase();
    this.setSentence(sentence);
    this.setQuestion("Which letter is missing?");
    this.setAnswers(answers);
  }

  private static prepareWhatIsTheResult(): void {
    let result = 0;
    let numberOne = 0;
    let numberTwo = 0;
    let symbol = "";

    switch (Random.pickElementFromEnum(ArithmeticOperation)) {
      case ArithmeticOperation.Addition:
        symbol = "+";
        numberOne = Random.pickIntInclusive(1, 50);
        numberTwo = Random.pickIntInclusive(1, 50);
        result = numberOne + numberTwo;
        break;
      case ArithmeticOperation.Multiplication:
        symbol = "×";
        numberOne = Random.pickIntInclusive(1, 9);
        numberTwo = Random.pickIntInclusive(1, 9);
        result = numberOne * numberTwo;
        break;
      case ArithmeticOperation.Subtraction:
        symbol = "-";
        numberOne = Random.pickIntInclusive(50, 99);
        numberTwo = Random.pickIntInclusive(1, 49);
        result = numberOne - numberTwo;
        break;
      case ArithmeticOperation.Division:
        symbol = "÷";
        numberTwo = Random.pickIntInclusive(1, 9);
        numberOne = Random.pickIntInclusive(1, 9) * numberTwo;
        result = numberOne / numberTwo;
        break;
    }

    const answers = [];

    for (let i = 0; i < answersPerQuestion; i++) {
      answers.push(Random.pickIntInclusive(result - 20, result + 20));
    }

    const resultIsNotInTheAnswers = answers.indexOf(result) == -1;

    if (resultIsNotInTheAnswers) {
      answers[Random.pickIndexFromLength(answers.length)] = result;
    }

    this.expectedAnswer = result.toString();
    this.setSentence(`${numberOne} ${symbol} ${numberTwo}`);
    this.setQuestion("What is the result?");
    this.setAnswers(answers);
  }

  public static wordExists(word: string): boolean {
    for (let i = 0; i < similarWords.length; i++) {
      const similarWordsSet = similarWords[i];
      for (let j = 0; j < similarWordsSet.length; j++) {
        const similarWord = similarWordsSet[j];
        if (word.toLowerCase() == similarWord.toLowerCase()) return true;
      }
    }

    return false;
  }
}
