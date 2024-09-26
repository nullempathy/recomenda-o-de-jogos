import { AppExpress } from "@expressots/adapter-express";
import {
    Env,
    IMiddleware,
    Middleware,
    provide,
    ProviderManager,
} from "@expressots/core";
import { appContainer, container } from "../../app.container";
import { EnsureAuthenticatedMiddleware } from "@providers/middlewares/authentication/ensure-authenticated.middleware";

@provide(App)
export class App extends AppExpress {
    private middleware: IMiddleware; 
    private provider: ProviderManager;

    constructor() {
        super();
        this.middleware = container.get<IMiddleware>(Middleware);
        this.provider = container.get(ProviderManager);
    }

    protected configureServices(): void {
        this.provider.register(Env);

        this.middleware.addBodyParser();
        this.middleware.addCors({ origin: "localhost:3333" });
        this.middleware.setErrorHandler({ showStackTrace: true });
        this.middleware.addMiddleware(new EnsureAuthenticatedMiddleware());
        appContainer.viewContainerBindings(); 
    }

    protected postServerInitialization(): void {
        if (this.isDevelopment()) {
            this.provider.get(Env).checkAll();
            this.middleware.viewMiddlewarePipeline();
        }
    }

    protected serverShutdown(): void {}
}
