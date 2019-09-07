export class GamePlayScene {
  private static sentenceElement: HTMLDivElement = document.querySelector(
    ".sentence"
  );
  private static questionElement: HTMLDivElement = document.querySelector(
    ".question"
  );
  // noinspection JSUnusedLocalSymbols
  private static answer1Element: HTMLDivElement = document.querySelector(
    '.answer[data-id="1"]'
  );
  // noinspection JSUnusedLocalSymbols
  private static answer2Element: HTMLDivElement = document.querySelector(
    '.answer[data-id="2"]'
  );
  // noinspection JSUnusedLocalSymbols
  private static answer3Element: HTMLDivElement = document.querySelector(
    '.answer[data-id="3"]'
  );
  // noinspection JSUnusedLocalSymbols
  private static answer4Element: HTMLDivElement = document.querySelector(
    '.answer[data-id="4"]'
  );

  public static setSentence(text: string): void {
    GamePlayScene.sentenceElement.innerText = text;
  }

  public static setQuestion(text: string): void {
    GamePlayScene.questionElement.innerText = text;
  }

  public static setAnswer(answerId: 1 | 2 | 3 | 4, text: string): void {
    const element: HTMLDivElement = GamePlayScene[`answer${answerId}Element`];
    element.innerText = text;
  }
}
