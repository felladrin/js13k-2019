import { QuestionType } from "../enum/QuestionType";
import { similarWords } from "../const/similarWords";
import { Random } from "./Random";
import { GameHtmlElement } from "./GameHtmlElement";

export class GamePlayScene {
  public static setSentence(text: string): void {
    GameHtmlElement.sentenceElement.innerText = text;
  }

  public static setQuestion(text: string): void {
    GameHtmlElement.questionElement.innerText = text;
  }

  public static setAnswers<T>(answers: Array<T>): void {
    Random.shuffle(answers);
    for (let i = 0; i < 4; i++) {
      GameHtmlElement.getAnswerButton(i).innerText = answers[i].toString();
    }
  }

  public static preparePhase(): void {
    switch (Random.pickElementFromEnum(QuestionType)) {
      case QuestionType.WhatIsTheWord:
        const randomSet = [...Random.pickElementFromArray(similarWords)];
        const answers = [];
        for (let i = 0; i < 4; i++) {
          const randomWordIndex = Random.pickIndexFromLength(randomSet.length);
          answers.push(randomSet.splice(randomWordIndex, 1));
        }
        this.setSentence(Random.pickElementFromArray(answers));
        this.setQuestion("Which word is that?");
        this.setAnswers(answers);
        break;
      case QuestionType.FindTheMissingLetter:
        const randomWordSet = Random.pickElementFromArray(similarWords);
        const randomWord = Random.pickElementFromArray(randomWordSet);
        const randomCharIndex = Random.pickIndexFromLength(randomWord.length);
        this.setQuestion("Which letter is missing?");
        break;
      case QuestionType.WhatIsTheResult:
        this.setQuestion("What is the result of this equation?");
        break;
    }
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
