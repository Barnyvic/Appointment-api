import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'node:fs/promises';
import ejs from 'ejs';
import { join } from 'path';
import { BrevoService } from '../brevo/brevo.service';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService, private brevoService: BrevoService) {}

  async welcomeEmail(data: { name: string; email: string }) {
    const { email, name } = data;

    const subject = `Welcome to RouteLift: ${name}`;

    await this.mailerService.sendMail({
      to: email,
      subject,
      template: './welcome',
      context: {
        name,
      },
    });
  }

  async forgotPasswordEmail(data: { name: string; email: string; code: string }) {
    const { name, email, code } = data;

    const subject = `RouteLift: Reset Password`;

    await this.mailerService.sendMail({
      to: email,
      subject,
      template: './forgot-password',
      context: {
        code,
        name,
      },
    });
  }

  async renderTemplateToString(templatePath: string, data?: any): Promise<string> {
    // Read the EJS template file
    const template = await fs.readFile(templatePath, 'utf-8');

    // Render the template with the provided data
    const renderedTemplate = ejs.render(template, data);

    return renderedTemplate;
  }

  async sendOTPEmail(metadata: {
    name?: string;
    userIdentifier: string;
    code: string;
    tags?: string[];
  }) {
    const data = metadata;
    if (!data.name) {
      data.name = 'Esteemed Customer';
    }

    const relativePath = join(__dirname, 'templates/otp-email.ejs');

    const content = await this.renderTemplateToString(relativePath, metadata);

    const mailData = {
      sender: {
        name: 'Akinyemi from ApptWise',
        email: 'no-reply@apptwise.com',
      },
      to: [
        {
          email: data.userIdentifier,
          name: data.name || 'Esteemed Customer',
        },
      ],
      htmlContent: content,
      subject: 'ApptWise: Email Verification',
      tags: data.tags || ['VerificationEmail'],
    };

    await this.brevoService.sendTransactionalMail(mailData);

    Logger.log('Email sent successfully');
  }

  async sendSignUpEmail(metadata: { userIdentifier: string; password: string; email: string }) {
    await this.mailerService.sendMail({
      to: metadata.userIdentifier,
      subject: 'Hello from to Route Lift! Find your login details',
      template: './open-order-email', // `.ejs` extension is appended automatically
      context: {
        userIdentifier: metadata.userIdentifier,
        password: metadata.password,
        email: metadata.email,
      },
    });

    Logger.log('Email sent successfully');
  }
}
