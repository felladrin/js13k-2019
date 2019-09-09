import { QuestionType } from "../enum/QuestionType";
import { similarWords } from "../const/similarWords";
import { Random } from "./Random";
import { GameHtmlElement } from "./GameHtmlElement";
import { ArithmeticOperation } from "../enum/ArithmeticOperation";

export class GamePlayScene {
  public static answersPerQuestion = 4;

  public static setSentence(text: string): void {
    GameHtmlElement.sentenceElement.innerText = text;
  }

  public static setQuestion(text: string): void {
    GameHtmlElement.questionElement.innerText = text;
  }

  public static setAnswers<T>(answers: Array<T>): void {
    Random.shuffle(answers);
    for (let i = 0; i < this.answersPerQuestion; i++) {
      GameHtmlElement.getAnswerButton(i).innerText = answers[i].toString();
    }
  }

  public static preparePhase(): void {
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
    for (let i = 0; i < this.answersPerQuestion; i++) {
      const randomWordIndex = Random.pickIndexFromLength(randomSet.length);
      answers.push(randomSet.splice(randomWordIndex, 1));
    }
    this.setSentence(Random.pickElementFromArray(answers));
    this.setQuestion("Which word is that?");
    this.setAnswers(answers);
  }

  private static prepareFindTheMissingLetter(): void {
    const randomSet = Random.pickElementFromArray(similarWords);
    const selectedWord = Random.pickElementFromArray(randomSet);
    const selectedCharIndex = Random.pickIndexFromLength(selectedWord.length);
    const selectedChar = selectedWord[selectedCharIndex];
    const vowels = ["A", "E", "I", "O", "U"];
    const consonants = [
      "B",
      "C",
      "D",
      "F",
      "G",
      "H",
      "J",
      "K",
      "L",
      "M",
      "N",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "V",
      "W",
      "X",
      "Y",
      "Z"
    ];

    const selectedCharIsAVowel =
      vowels.indexOf(selectedChar.toUpperCase()) >= 0;

    const answers = [];

    if (selectedCharIsAVowel) {
      for (let i = 0; i < this.answersPerQuestion; i++) {
        const randomVowelIndex = Random.pickIndexFromLength(vowels.length);
        answers.push(vowels.splice(randomVowelIndex, 1)[0]);
      }
    } else {
      for (let i = 0; i < this.answersPerQuestion; i++) {
        const randomConsonantIndex = Random.pickIndexFromLength(
          consonants.length
        );
        answers.push(consonants.splice(randomConsonantIndex, 1)[0]);
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

    for (let i = 0; i < this.answersPerQuestion; i++) {
      answers.push(Random.pickIntInclusive(result - 20, result + 20));
    }

    const resultIsNotInTheAnswers = answers.indexOf(result) == -1;

    if (resultIsNotInTheAnswers) {
      answers[Random.pickIndexFromLength(answers.length)] = result;
    }

    this.setSentence(`${numberOne} ${symbol} ${numberTwo}`);
    this.setQuestion("What is the result of this equation?");
    this.setAnswers(answers);
  }

  public static fadeInSentence(): void {
    // TODO
  }

  public static fadeInQuestion(): void {
    // TODO
  }

  public static fadeInAnswers(): void {
    // TODO
  }
}
