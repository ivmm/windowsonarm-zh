import { WebhookClient } from "discord.js";

export class DiscordWebhookClient {
  private client: WebhookClient;

  constructor(webhookUrl: string) {
    this.client = new WebhookClient({ url: webhookUrl });
  }

  async send(content: string) {
    return this.client.send(content);
  }
}