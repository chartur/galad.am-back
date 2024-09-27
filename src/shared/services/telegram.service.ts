import { Injectable } from "@nestjs/common";
import { Markup, Telegraf } from "telegraf";
import { SeoService } from "../../routes/seo/seo.service";
import { SeoPages } from "../../models/enums/seo-pages";

enum TelegramActions {
  JOIN_CHANNEL = "join_channel",
}

@Injectable()
export class TelegramService {
  private appUrl = "https://galad.am";
  private tChannelLink = "t.me/galad_am";

  private markup = Markup.inlineKeyboard(
    [
      Markup.button.webApp("🛒 Տեսնել ավելին", this.appUrl),
      Markup.button.callback(
        "ℹ️ Ստացիր նոր տեսականին արաջինը",
        TelegramActions.JOIN_CHANNEL,
      ),
    ],
    {
      wrap: () => true,
    },
  );

  private bot: Telegraf;

  constructor(private seoService: SeoService) {
    this.init();
  }

  private async init(): Promise<void> {
    const seo = await this.seoService.getPage(SeoPages.HomePage);
    this.bot = new Telegraf(process.env.telegramKey);

    this.bot.command("start", async (ctx) => {
      ctx.sendPhoto(
        { url: `${this.appUrl}/assets/logo.png` },
        {
          ...this.markup,
          caption: seo.am_description,
        },
      );
    });

    this.bot.on("callback_query", (ctx) => {
      const action: string = (ctx.callbackQuery as any).data;
      switch (action) {
        case TelegramActions.JOIN_CHANNEL:
          return this.joinCommunityChannelHandler(ctx);
      }
    });

    this.bot.launch();
  }

  private joinCommunityChannelHandler(ctx): void {
    const markup = Markup.inlineKeyboard([
      Markup.button.url("👋 Միանալ ալիքին", this.tChannelLink),
    ]);
    ctx.sendMessage(
      "Միացիր galad.am ալիքին և ստացիր վերջին նորթյունները մեր տեսականու և զեղչերի վերաբերյալ։",
      {
        ...markup,
      },
    );
  }
}
