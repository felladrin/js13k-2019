import { QuestionType } from "../enum/QuestionType";
import { similarWords } from "../const/similarWords";
import { Random } from "./Random";
import { GameHtmlElement } from "./GameHtmlElement";
import { ArithmeticOperation } from "../enum/ArithmeticOperation";
import { answersPerQuestion } from "../const/answersPerQuestion";
import { GameStreakManager } from "./GameStreakManager";
import Tweezer from "tweezer.js";
import { Scene } from "../enum/Scene";
import { vowels } from "../const/vowels";
import { consonants } from "../const/consonants";
import { tokens } from "typed-inject";
import { TypedEvent, TypedEventDispatcher } from "typed-event-dispatcher";

export class GamePlayScene {
  public get onAnsweredWrongly(): TypedEvent {
    return this.onAnsweredWronglyDispatcher.getter;
  }
  public get onAnsweredCorrectly(): TypedEvent {
    return this.onAnsweredCorrectlyDispatcher.getter;
  }
  public static inject = tokens("gameHtmlElement", "gameStreakManager");
  private onAnsweredCorrectlyDispatcher = new TypedEventDispatcher();
  private onAnsweredWronglyDispatcher = new TypedEventDispatcher();
  private expectedAnswer: string;
  private buttonsBlocked = false;

  constructor(
    private gameHtmlElement: GameHtmlElement,
    private gameStreakManager: GameStreakManager
  ) {}

  public initialize(): void {
    this.listenToAnswersSelected();
  }

  public setSentence(text: string): void {
    this.gameHtmlElement.sentenceElement.innerText = text;
  }

  public setQuestion(text: string): void {
    this.gameHtmlElement.questionElement.innerText = text;
  }

  public setAnswers<T>(answers: Array<T>): void {
    Random.shuffle(answers);
    for (let i = 0; i < answers.length; i++) {
      this.gameHtmlElement.getAnswerButton(i).innerText = answers[i].toString();
    }
  }

  public preparePhase(): void {
    if (this.gameStreakManager.currentStreak < 10) {
      this.prepareWhatIsTheWord();
      return;
    }

    if (this.gameStreakManager.currentStreak < 20) {
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

  private listenToAnswersSelected(): void {
    Array.from(this.gameHtmlElement.answerButtons).forEach(answerButton => {
      answerButton.addEventListener("click", () => {
        if (this.buttonsBlocked) return;
        this.blockButtons();
        this.processAnswer(answerButton.innerText);
      });
    });
  }

  private processAnswer(answer: string): void {
    if (answer == this.expectedAnswer) {
      this.onAnsweredCorrectlyDispatcher.dispatch();
    } else {
      this.onAnsweredWronglyDispatcher.dispatch();
    }

    this.startFadeOutTween();
  }

  private updateOpacityOnFadeTweenTick(value: number): void {
    this.gameHtmlElement.getScene(Scene.GamePlay).style.opacity = (
      value / 100
    ).toString();
  }

  private startFadeOutTween(): void {
    new Tweezer({
      start: 100,
      end: 0,
      duration: 500
    })
      .on("tick", value => this.updateOpacityOnFadeTweenTick(value))
      .on("done", () => {
        this.preparePhase();
        this.startFadeInTween();
      })
      .begin();
  }

  private startFadeInTween(): void {
    new Tweezer({
      start: 0,
      end: 100,
      duration: 500
    })
      .on("tick", value => this.updateOpacityOnFadeTweenTick(value))
      .on("done", () => this.unblockButtons())
      .begin();
  }

  private blockButtons(): void {
    this.buttonsBlocked = true;
  }

  private unblockButtons(): void {
    this.buttonsBlocked = false;
  }

  private prepareWhatIsTheWord(): void {
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

  private prepareFindTheMissingLetter(): void {
    const randomSet = Random.pickElementFromArray(similarWords);
    const selectedWord = Random.pickElementFromArray(randomSet);
    const selectedCharIndex = Random.pickIndexFromLength(selectedWord.length);
    const selectedChar = selectedWord[selectedCharIndex];
    const answers = [];
    const selectedCharIsAVowel =
      vowels.indexOf(selectedChar.toUpperCase()) >= 0;
    const characters = selectedCharIsAVowel
      ? Array.from(vowels)
      : Array.from(consonants);

    do {
      const randomCharIndex = Random.pickIndexFromLength(characters.length);
      const selectedChar = characters.splice(randomCharIndex, 1)[0];
      const mutatedWord =
        selectedWord.substr(0, selectedCharIndex) +
        selectedChar +
        selectedWord.substr(selectedCharIndex + 1);

      if (!this.wordExists(mutatedWord)) answers.push(selectedChar);
    } while (answers.length < answersPerQuestion);

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

  private prepareWhatIsTheResult(): void {
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

  private wordExists(word: string): boolean {
    return similarWords.some(similarWordSet =>
      similarWordSet.some(
        similarWord => word.toLowerCase() == similarWord.toLowerCase()
      )
    );
  }
}
