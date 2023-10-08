import Subtitle from "../models/subtitle";
import TimeExt from "./timeExt";

export class SubtitleGenerator {
  static generateAssSubtitles(
    subtitles: Subtitle[],
    secondLang: string = "",
    font: string = "me_quran",
    arabicFontSize: number = 32,
    translationFontSize: number = 10,
    shadow: boolean = true
  ) {
    let subtitleFileText =
      `
[Script Info]
ScriptType: v4.00+
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,` +
      font +
      `,` +
      arabicFontSize +
      `,&Hffffff,&Hffffff,&H00000000,&H0,` +
      (font === "me_quran" ? "0" : "1") +
      `,0,0,0,100,100,0,0,1,1,` +
      (shadow ? "1" : "0") +
      `,2,10,10,10,0

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text\n`;

    subtitles.forEach((subtitle, index) => {
      subtitleFileText +=
        "Dialogue: 0," +
        TimeExt.secondsToHHMMSSms(subtitle.startTime) +
        "," +
        TimeExt.secondsToHHMMSSms(subtitle.endTime) +
        ",Default,,40,40,0,,{\\fade(200,200)\\blur5}" +
        subtitle.arabicText +
        (secondLang === "none" || subtitle.versePos === undefined // si on veut la traduction avec et que ce n'est pas une basmala ou autre
          ? ""
          : "\\N{\\fs" +
            translationFontSize +
            "}{\\fnArial}" +
            subtitle.translations.find((x) => x.lang === secondLang)?.text) +
        "\n";
    });
    return subtitleFileText;
  }

  static generateSrtSubtitles(subtitles: Subtitle[], lang: string | undefined) {
    let subtitleFileText = "";
    let silenceCounter: number = 0; // Permet de compenser les pauses pour pas que le numéro de sous titre soit erroné
    subtitles.forEach((subtitle, index) => {
      if (subtitle.arabicText !== "") {
        subtitleFileText += String(index + 1 - silenceCounter) + "\n";
        subtitleFileText +=
          TimeExt.secondsToHHMMSSms(subtitle.startTime) +
          " --> " +
          TimeExt.secondsToHHMMSSms(subtitle.endTime) +
          "\n";
        subtitleFileText +=
          (lang === undefined || lang === "none"
            ? subtitle.arabicText
            : subtitle.arabicText +
              "\n" +
              subtitle.translations.find((x) => x.lang === lang)?.text) +
          "\n\n";
      } else {
        silenceCounter++;
      }
    });

    return subtitleFileText;
  }
}