import { parentPort, workerData } from "worker_threads";
import { Token } from "src/token/model/token.model";
import { ConfigService } from "@nestjs/config";
import { TokenService } from "src/token/token.service";
import { EmailService } from "src/email/email.service";
import { User } from "src/user/model/user.model";
import createTypeOrmDataSource from "typeorm.factory";

// Initialize TypeORM Instance in the worker thread
const dataSource = createTypeOrmDataSource();

// Worker logic
(async () => {
    try {
        const { email, type } = workerData;

        // Initialize the data source
        await dataSource.initialize();

        // Get the repositories
        const userRepository = dataSource.getRepository(User);
        const tokenRepository = dataSource.getRepository(Token);

        // Use the configuration data passed from the main thread
        const configService = new ConfigService();
        const tokenService = TokenService.getInstance(
            tokenRepository,
            configService,
        );
        const emailService = EmailService.getInstance(configService);

        // Use the repository to check if the user exists
        const user = await userRepository.findOne({ where: { email } });

        if (user) {
            const token = await tokenService.generateForUser(user, type);

            await emailService
                .sendTokenEmail(user, token, type)
                .catch((error) => {
                    console.log(
                        `Failed to send email for user ${email}: ${error.message}`,
                        error.stack,
                    );
                });
        }

        parentPort?.postMessage({
            success: "process completed successfully",
        });
    } catch (error) {
        parentPort?.postMessage({ error: error.message });
    } finally {
        // Close the connection when done
        await dataSource.destroy();
    }
})();
