import {
    Injectable,
    ExecutionContext,
    UnauthorizedException,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { UserService } from "src/user/user.service";

@Injectable()
export class LocalAuthGuard extends AuthGuard("local") {
    constructor(private userService: UserService) {
        super();
    }

    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        const { email, password } = request.body;

        const user = await this.userService.validateUser(email, password);

        if (!user) {
            throw new UnauthorizedException();
        }

        request.user = user;
        return true;
    }
}
