"use strict";
exports.__esModule = true;
exports.HeaderMenu = exports.Header = void 0;
var react_1 = require("react");
var react_2 = require("@remix-run/react");
var hydrogen_1 = require("@shopify/hydrogen");
var Aside_1 = require("~/components/Aside");
function Header(_a) {
    var header = _a.header, isLoggedIn = _a.isLoggedIn, cart = _a.cart, publicStoreDomain = _a.publicStoreDomain;
    var shop = header.shop, menu = header.menu;
    return (React.createElement("header", { className: "header" },
        React.createElement(react_2.NavLink, { prefetch: "intent", to: "/", style: activeLinkStyle, end: true },
            React.createElement("strong", null, shop.name)),
        React.createElement(HeaderMenu, { menu: menu, viewport: "desktop", primaryDomainUrl: header.shop.primaryDomain.url, publicStoreDomain: publicStoreDomain }),
        React.createElement(HeaderCtas, { isLoggedIn: isLoggedIn, cart: cart })));
}
exports.Header = Header;
function HeaderMenu(_a) {
    var menu = _a.menu, primaryDomainUrl = _a.primaryDomainUrl, viewport = _a.viewport, publicStoreDomain = _a.publicStoreDomain;
    var className = "header-menu-" + viewport;
    var close = Aside_1.useAside().close;
    return (React.createElement("nav", { className: className, role: "navigation" },
        viewport === 'mobile' && (React.createElement(react_2.NavLink, { end: true, onClick: close, prefetch: "intent", style: activeLinkStyle, to: "/" }, "Home")),
        (menu || FALLBACK_HEADER_MENU).items.map(function (item) {
            if (!item.url)
                return null;
            // if the url is internal, we strip the domain
            var url = item.url.includes('myshopify.com') ||
                item.url.includes('myshopify.dev') ||
                item.url.includes(publicStoreDomain) ||
                item.url.includes(primaryDomainUrl)
                ? new URL(item.url).pathname
                : item.url;
            return (React.createElement(react_2.NavLink, { className: "header-menu-item", end: true, key: item.id, onClick: close, prefetch: "intent", style: activeLinkStyle, to: url }, item.title));
        })));
}
exports.HeaderMenu = HeaderMenu;
function HeaderCtas(_a) {
    var isLoggedIn = _a.isLoggedIn, cart = _a.cart;
    var account_icon_logged = React.createElement("svg", { className: "svg-icon", style: { width: '30px', height: '30px', verticalAlign: 'middle', fill: 'currentColor', overflow: 'hidden' }, viewBox: "0 0 1024 1024", version: "1.1", xmlns: "http://www.w3.org/2000/svg" },
        React.createElement("path", { d: "M723.43 508.6c-54.123 47.75-125.977 77.056-205.163 77.056-80.364 0-153.4-30.259-207.765-79.421C184.05 539.325 105.81 652.308 105.81 787.277v68.782c0 160.968 812.39 160.968 812.39 0v-68.782c-0.005-131.415-74.22-242.509-194.77-278.677z m-205.163 28.13c140.165 0 254.095-109.44 254.095-244.64S658.668 47.218 518.267 47.218c-139.93 0-253.855 109.675-253.855 244.874 0 135.204 113.925 244.639 253.855 244.639z m0 0" }));
    var account_icon_login = account_icon_logged;
    return (React.createElement("nav", { className: "header-ctas", role: "navigation" },
        React.createElement(HeaderMenuMobileToggle, null),
        React.createElement(react_2.NavLink, { prefetch: "intent", to: "/account", style: activeLinkStyle },
            React.createElement(react_1.Suspense, { fallback: "Sign in" },
                React.createElement(react_2.Await, { resolve: isLoggedIn, errorElement: "Sign in" }, function (isLoggedIn) { return (isLoggedIn ? account_icon_logged : account_icon_login); }))),
        React.createElement(SearchToggle, null),
        React.createElement(CartToggle, { cart: cart })));
}
function HeaderMenuMobileToggle() {
    var open = Aside_1.useAside().open;
    return (React.createElement("button", { className: "header-menu-mobile-toggle reset", onClick: function () { return open('mobile'); } },
        React.createElement("h3", null, "\u2630")));
}
function SearchToggle() {
    var open = Aside_1.useAside().open;
    return (React.createElement("button", { className: "reset search-toggle", onClick: function () { return open('search'); } },
        React.createElement("svg", { style: { height: '30px', width: '30px' }, xmlns: true }),
        "dc=\"http://purl.org/dc/elements/1.1/\" xmlns:cc=\"http://creativecommons.org/ns#\" xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" xmlns:svg=\"http://www.w3.org/2000/svg\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\" width=\"500\" height=\"500\" viewBox=\"0 0 500.00001 500.00001\" id=\"svg4162\" version=\"1.1\" inkscape:version=\"0.92.3 (2405546, 2018-03-11)\" sodipodi:docname=\"Search_Icon.svg\">",
        React.createElement("defs", { id: "defs4164" }),
        React.createElement("g", { inkscape: true }),
        "label=\"Layer 1\" inkscape:groupmode=\"layer\" id=\"layer1\" transform=\"translate(0,-552.36216)\">",
        React.createElement("g", { id: "g1400", transform: "translate(-4.3609793,-7.6704785)" },
            React.createElement("path", { inkscape: true }),
            "connector-curvature=\"0\" id=\"path4714\" d=\"M 232.83952,614.96702 A 154.04816,154.04794 0 0 0 78.79153,769.01382 154.04816,154.04794 0 0 0 232.83952,923.06184 154.04816,154.04794 0 0 0 386.88751,769.01382 154.04816,154.04794 0 0 0 232.83952,614.96702 Z m 0,26.77613 A 129.95832,127.2707 0 0 1 362.79832,769.01382 129.95832,127.2707 0 0 1 232.83952,896.28449 129.95832,127.2707 0 0 1 102.88194,769.01382 129.95832,127.2707 0 0 1 232.83952,641.74315 Z\" style=",
            { opacity: 1, fill: '#2b0000', fillOpacity: 1, stroke: 'none', strokeOpacity: 1 },
            " />",
            React.createElement("rect", { ry: "18.08342", rx: "33.249443", transform: "matrix(0.65316768,0.7572133,-0.60689051,0.79478545,0,0)", y: "319.55432", x: "794.8775", height: "36.16684", width: "173.02675", id: "rect4721", style: { opacity: 1, fill: '#2b0000', fillOpacity: 1, stroke: 'none', strokeOpacity: 1 } }))));
    svg >
    ;
    button >
    ;
    ;
}
function CartBadge(_a) {
    var count = _a.count;
    var open = Aside_1.useAside().open;
    var _b = hydrogen_1.useAnalytics(), publish = _b.publish, shop = _b.shop, cart = _b.cart, prevCart = _b.prevCart;
    return (React.createElement("a", { className: "cart-icon", href: "/cart", onClick: function (e) {
            e.preventDefault();
            open('cart');
            publish('cart_viewed', {
                cart: cart,
                prevCart: prevCart,
                shop: shop,
                url: window.location.href || ''
            });
        } },
        React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "30", height: "30", viewBox: "0 0 48 48" },
            React.createElement("path", { d: "M14 36c-2.21 0-3.98 1.79-3.98 4s1.77 4 3.98 4 4-1.79 4-4-1.79-4-4-4zm-12-32v4h4l7.19 15.17-2.7 4.9c-.31.58-.49 1.23-.49 1.93 0 2.21 1.79 4 4 4h24v-4h-23.15c-.28 0-.5-.22-.5-.5 0-.09.02-.17.06-.24l1.79-3.26h14.9c1.5 0 2.81-.83 3.5-2.06l7.15-12.98c.16-.28.25-.61.25-.96 0-1.11-.9-2-2-2h-29.57l-1.9-4h-6.53zm32 32c-2.21 0-3.98 1.79-3.98 4s1.77 4 3.98 4 4-1.79 4-4-1.79-4-4-4z" }),
            React.createElement("path", { d: "M0 0h48v48h-48z", fill: "none" })),
        React.createElement("span", null,
            " ",
            count === null ? React.createElement("span", null, "\u00A0") : count,
            " ")));
}
function CartToggle(_a) {
    var cart = _a.cart;
    return (React.createElement(react_1.Suspense, { fallback: React.createElement(CartBadge, { count: null }) },
        React.createElement(react_2.Await, { resolve: cart }, function (cart) {
            if (!cart)
                return React.createElement(CartBadge, { count: 0 });
            return React.createElement(CartBadge, { count: cart.totalQuantity || 0 });
        })));
}
var FALLBACK_HEADER_MENU = {
    id: 'gid://shopify/Menu/199655587896',
    items: [
        {
            id: 'gid://shopify/MenuItem/461609500728',
            resourceId: null,
            tags: [],
            title: 'Collections',
            type: 'HTTP',
            url: '/collections',
            items: []
        },
        {
            id: 'gid://shopify/MenuItem/461609533496',
            resourceId: null,
            tags: [],
            title: 'Blog',
            type: 'HTTP',
            url: '/blogs/journal',
            items: []
        },
        {
            id: 'gid://shopify/MenuItem/461609566264',
            resourceId: null,
            tags: [],
            title: 'Policies',
            type: 'HTTP',
            url: '/policies',
            items: []
        },
        {
            id: 'gid://shopify/MenuItem/461609599032',
            resourceId: 'gid://shopify/Page/92591030328',
            tags: [],
            title: 'About',
            type: 'PAGE',
            url: '/pages/about',
            items: []
        },
    ]
};
function activeLinkStyle(_a) {
    var isActive = _a.isActive, isPending = _a.isPending;
    return {
        fontWeight: isActive ? 'bold' : undefined,
        color: isPending ? 'grey' : 'black'
    };
}
