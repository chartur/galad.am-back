import { Injectable, Logger } from "@nestjs/common";
import { NotificationSettingsDto } from "../../core/dto/auth/notification-settings.dto";
import * as webPush from "web-push";
import * as process from "process";
import { PushNotification } from "../../models/push-notification";
import * as fs from "fs";
import * as path from "path";

@Injectable()
export class PusherService {
  private readonly logger = new Logger(PusherService.name);
  private _subscriptions: Record<string, NotificationSettingsDto> = {};

  constructor() {
    const pusherString = fs.readFileSync(
      `${process.cwd()}/pusher.json`,
      "utf-8",
    );
    this._subscriptions = JSON.parse(pusherString);
    webPush.setVapidDetails(
      "mailto:1995.chilingaryan@gmali.com",
      process.env.pusherPublicKey,
      process.env.pusherPrivateKey,
    );
  }

  public subscribe(subscription: NotificationSettingsDto): void {
    this.logger.log("[Pusher] add subscription", {
      new: subscription,
      subscriptionsCount: Object.keys(this._subscriptions).length,
    });
    if (!this._subscriptions[subscription.keys.auth]) {
      this._subscriptions[subscription.keys.auth] = subscription;
      fs.writeFile(
        `${process.cwd()}/pusher.json`,
        JSON.stringify(this._subscriptions, null, 4),
        (err) => {
          if (err) {
            this.logger.error(
              "[Pusher] unable to store in the pusher.json file",
            );
          }
        },
      );
    }
  }

  public emit(payload: PushNotification): void {
    this.logger.log("[Pusher] emit data", {
      payload: payload,
    });
    Object.values(this._subscriptions).forEach((subscription) => {
      webPush.sendNotification(subscription, JSON.stringify(payload));
    });
  }
}
