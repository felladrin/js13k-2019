import { SoundBoxPlayer } from "./SoundBoxPlayer";

export class GameAudio {
  public static create(song, autoplay = false, loop = false): HTMLAudioElement {
    const audio = document.createElement("audio");
    audio.autoplay = autoplay;
    audio.loop = loop;
    const player = new SoundBoxPlayer(song);

    const progressChecker = setInterval(() => {
      if (player.generate() >= 1) {
        clearInterval(progressChecker);
        const wave = player.createWave();
        audio.src = URL.createObjectURL(
          new Blob([wave], { type: "audio/wav" })
        );
      }
    }, 300);

    return audio;
  }
}
