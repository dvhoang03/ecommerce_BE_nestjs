import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger,  } from "@nestjs/common";
import { Request, Response } from "express";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter{

    private readonly logger = new Logger(HttpExceptionFilter.name);

    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx =host.switchToHttp()
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();
        const message = exception.message;

        this.logger.error(`Error occurred: ${message}, Status: ${status}, Path: ${request.url}`);

        response.status(status)
            .json({
                statusCode: status,
                timestamp: new Date().toISOString(),
                path: request.url,
                method: request.method,
                message: exception.message,
                error: exception.name
            });
    }
}

// co the ap dung gloal vaf tren 1 controller nhat dinhj = @UseFilter(Httpexceptionfilter)
