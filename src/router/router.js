class Router {
    constructor(routes) {
        this.routes = routes;
        this._loadInitialRoute();

        const routerLinkElement = document.querySelectorAll('[data-router-link]');
        routerLinkElement.forEach((element) => {
            element.addEventListener('click', (event) => {
                // Prevent the default action of the link.
                // Instead, we want to router redirect to the new URL.
                event.preventDefault();
                this.loadRoute(element.getAttribute('href').replace('/', ''));
            });
        });
    }

    async loadRoute(...urlSegments) {
        // Attempt to match the URL to a route.
        const matchedRoute = this._matchUrlToRoute(urlSegments);

        // Push a history entry with the new URL.
        // We pass an empty object and an empty string as the historyState
        // and title arguments, but their values do not really matter here.
        const url = `/${urlSegments.join('/')}`;
        history.pushState({}, '', url);

        // Append the template of the matched route to the DOM,
        // inside the element with attribute data-router-outlet.
        const routerOutletElement = document.querySelector('[data-router-outlet]');
        const htmlContent = await fetch(matchedRoute.template).then((response) => response.text());
        routerOutletElement.innerHTML = (routerOutletElement, matchedRoute ? htmlContent : `<div>404</div>`);

        // Append the scripts of the matched route to the DOM,
        if (matchedRoute && matchedRoute.scripts) {
            for(let script of matchedRoute.scripts) {
				const scriptElement = document.createElement('script');
                const content = await fetch(script).then((response) => response.text());
                if (!content) return;
                scriptElement.innerHTML = content;
                routerOutletElement.appendChild(scriptElement);
			}
        }
    }

    _matchUrlToRoute(urlSegments) {
        // Try and match the URL to a route.
        const matchedRoute = this.routes.find((route) => {
            // We assume that the route path always starts with a slash, and so
            // the first item in the segments array  will always be an empty
            // string. Slice the array at index 1 to ignore this empty string.
            const routePathSegments = route.path.split('/').slice(1);

            // If there are different numbers of segments, then the route
            // does not match the URL.
            if (routePathSegments.length !== urlSegments.length) {
                return false;
            }

            // If each segment in the url matches the corresponding route path,
            // then the route is matched.
            return routePathSegments.every((routePathSegment, i) => routePathSegment === urlSegments[i]);
        });

        return matchedRoute;
    }

    _loadInitialRoute() {
        // Figure out the path segments for the route which should load initially.
        const pathnameSplit = window.location.pathname.split('/');
        const pathSegments = pathnameSplit.length > 1 ? pathnameSplit.slice(1) : '';
        // Load the initial route.
        switch (pathSegments) {
            case 'index.html':
                this.loadRoute(['']);
            default:
                this.loadRoute(...pathSegments);
        }
    }
}
