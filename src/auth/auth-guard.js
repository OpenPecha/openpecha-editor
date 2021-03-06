import { Store } from "src/store";
import { getInstance } from "./auth0-plugin";

export const authenticationGuard = (to, from, next) => {
    if (process.env.DEV) {
        console.log("no bdrc auth on dev")
        return next()
    }

    const authService = getInstance();

    const gaurdAction = () => {
        if (authService.isAuthenticated) {
            return next();
        }

        authService.login({ appState: { targetUrl: to.fullPath }})
    }

    if(!authService.isLoading) {
        return gaurdAction()
    }

    authService.$watch("isLoading", (isLoading) => {
        if (isLoading === false) {
            return gaurdAction()
        }
    });
};

export const GHAuthenticationGuard = (to, from, next) => {
    if (Store.getters['app/userAccessToken']) {
        next()
    } else {
        next("/login?nextUrl=" + to.fullPath)
    }

}
