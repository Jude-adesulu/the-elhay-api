import { Injectable, Logger } from "@nestjs/common";
import { TokenType } from "src/common/enums/token-type.enum";
import { Token } from "../token/model/token.model";
import { Resend } from "resend";
import { ConfigService } from "@nestjs/config";
import { User } from "src/user/model/user.model";

@Injectable()
export class EmailService {
    private static instance: EmailService;
    private readonly logger = new Logger(EmailService.name);

    private constructor(private readonly configService: ConfigService) {
        this.logger.log("EmailService instance created");
    }

    static getInstance(configService: ConfigService): EmailService {
        if (!EmailService.instance) {
            EmailService.instance = new EmailService(configService);
        }
        return EmailService.instance;
    }

    async sendTokenEmail(
        user: User,
        token: Token,
        type: TokenType,
    ): Promise<void> {
        this.logger.log("Got to sendTokenEmail");

        const resendApiKey = this.configService.get("RESEND_API_KEY");
        const resend = new Resend(resendApiKey);

        const appUrl = this.configService.get("APP_URL");
        if (!appUrl) {
            throw new Error("APP_URL is not configured");
        }

        const verificationLink = `${appUrl}/${type}/${token.token}`;

        const emailContent = this.getVerificationEmailContent(
            type,
            verificationLink,
        );
        if (!emailContent) {
            throw new Error(`Unsupported token type: ${type}`);
        }

        const { data, error } = await resend.emails.send({
            from: `Hello <${this.configService.get("EMAIL_SENDER") || "no-reply@elhay.com"}>`,
            to: [user.email],
            subject: emailContent.subject,
            html: emailContent.html,
        });

        if (error) {
            this.logger.error("An error occurred when sending error", error);
        } else {
            this.logger.log("Email sent successfully");
        }
    }

    private getVerificationEmailContent(
        type: TokenType,
        verificationLink: string,
    ): { subject: string; html: string } | null {
        return {
            subject: type,
            html: `
                      <h1>${type}</h1>
                      <p>To continue, click the link below:</p>
                      <a href="${verificationLink}">${type}</a>
                      <p>This link will expire in 1 hour.</p>
                    `,
        };
    }
}
