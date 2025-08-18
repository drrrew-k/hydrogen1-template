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
            return (React.createElement(react_2.NavLink, { className: "header-menu-item", end: true, key: item.id, onClick: close, prefetch: "intent", 
                // style={activeLinkStyle}
                to: url }, item.title));
        })));
}
exports.HeaderMenu = HeaderMenu;
function HeaderCtas(_a) {
    var isLoggedIn = _a.isLoggedIn, cart = _a.cart;
    var account_icon_logged = React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", style: { height: "30px" }, fill: "none", viewBox: "0 0 24 24", "stroke-width": "1.5", stroke: "currentColor", "class": "size-6" },
        React.createElement("path", { "stroke-linecap": "round", "stroke-linejoin": "round", d: "M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" }));
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
        React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", style: { height: '30px', width: '30px' }, fill: "none", viewBox: "0 0 24 24", "stroke-width": "1.5", stroke: "currentColor", "class": "size-6" },
            React.createElement("path", { "stroke-linecap": "round", "stroke-linejoin": "round", d: "m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" }))));
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
        React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "30", height: "30", fill: "none", viewBox: "0 0 24 24", "stroke-width": "1.5", stroke: "currentColor", "class": "size-6" },
            React.createElement("path", { "stroke-linecap": "round", "stroke-linejoin": "round", d: "M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" })),
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
