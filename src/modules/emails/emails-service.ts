import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Auth } from 'googleapis';
import { TransportOptions, createTransport } from 'nodemailer';

@Injectable()
export class EmailsService {
  private oAuth2Client: Auth.OAuth2Client;
  constructor(private readonly prisma: PrismaService) {
    this.oAuth2Client = new Auth.OAuth2Client({
      clientId: process.env.OAUTH_CLIENT_ID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      redirectUri: 'https://developers.google.com/oauthplayground',
    });
  }

  private getAccessToken() {
    this.oAuth2Client.setCredentials({
      refresh_token: process.env.OAUTH_CLIENT_REFRESH_TOKEN,
    });
    return this.oAuth2Client.getAccessToken();
  }
  public async sendMail(to: string, subject: string, content: string) {
    const smtpTransport = createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.EMAIL,
        clientId: process.env.OAUTH_CLIENT_ID,
        clientSecret: process.env.OAUTH_CLIENT_SECRET,
        refreshToken: process.env.OAUTH_CLIENT_REFRESH_TOKEN,
        accessToken: this.getAccessToken(),
      },
      tls: {
        rejectUnauthorized: false,
      },
    } as TransportOptions);

    const mailOptions = {
      from: process.env.EMAIL,
      to,
      subject,
      html: content,
      generateTextFromHTML: true,
    };
    let values: { error: Error | null; response: unknown } = {
      error: null,
      response: undefined,
    };
    smtpTransport.sendMail(mailOptions, (error, response) => {
      values = { error, response };
      smtpTransport.close();
    });
    smtpTransport;
    return values;
  }
}
