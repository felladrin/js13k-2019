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

  public static setAnswer(answerId: 1 | 2 | 3 | 4, text: string): void {
    GameHtmlElement.getAnswerButton(answerId).innerText = text;
  }

  public static preparePhase(): void {
    switch (Random.pickElementFromEnum(QuestionType)) {
      case QuestionType.CompleteTheSentence: // FIXME
      case QuestionType.FindTheMissingLetter: // FIXME
      case QuestionType.WhatIsTheResult: // FIXME
      case QuestionType.WhatIsTheWord:
        const randomSet = Random.pickElementFromArray(similarWords);
        this.setSentence(randomSet[2]);
        this.setQuestion("What is the word?");
        this.setAnswer(1, randomSet[0]);
        this.setAnswer(2, randomSet[1]);
        this.setAnswer(3, randomSet[2]);
        this.setAnswer(4, randomSet[3]);
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
