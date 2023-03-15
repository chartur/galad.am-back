import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { TranslationLanguage } from "../../../models/enums/translation-language";
import { firstValueFrom } from "rxjs";

@Injectable()
export class GTranslatorService {
  constructor(private readonly httpService: HttpService) {}

  public async translate(
    payload: string,
    from: TranslationLanguage,
    to: TranslationLanguage,
  ): Promise<string> {
    const url = this.makeUrl(payload, from, to);

    const response = await firstValueFrom(this.httpService.get(url.toString()));

    return response.data[0][0][0];
  }

  private makeUrl(
    payload: string,
    from: TranslationLanguage,
    to: TranslationLanguage,
  ): URL {
    const url = new URL("https://translate.googleapis.com/translate_a/single");

    url.searchParams.append("client", "gtx");
    url.searchParams.append("dt", "t");
    url.searchParams.append("sl", from);
    url.searchParams.append("tl", to);
    url.searchParams.append("q", payload);

    return url;
  }
}
