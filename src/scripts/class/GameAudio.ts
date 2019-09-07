import { SoundBoxPlayer } from "./SoundBoxPlayer";
import { GameEmitter } from "./GameEmitter";
import { GameEvent } from "../enum/GameEvent";

export class GameAudio {
  public static create(
    song,
    volume = 1.0,
    autoplay = false,
    loop = false
  ): HTMLAudioElement {
    const audio = document.createElement("audio");
    audio.volume = volume;
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

    GameEmitter.on(GameEvent.AudioMuteChanged, (muted: boolean) => {
      audio.muted = muted;
    });

    return audio;
  }
}
