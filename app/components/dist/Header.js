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
    return (React.createElement("nav", { className: "header-ctas", role: "navigation" },
        React.createElement(HeaderMenuMobileToggle, null),
        React.createElement(react_2.NavLink, { prefetch: "intent", to: "/account", style: activeLinkStyle },
            React.createElement(react_1.Suspense, { fallback: "Sign in" },
                React.createElement(react_2.Await, { resolve: isLoggedIn, errorElement: "Sign in" }, function (isLoggedIn) { return (isLoggedIn ? 'Account' : 'Sign in'); }))),
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
    return (React.createElement("button", { className: "reset", onClick: function () { return open('search'); } }, "Search"));
}
function CartBadge(_a) {
    var count = _a.count;
    var open = Aside_1.useAside().open;
    var _b = hydrogen_1.useAnalytics(), publish = _b.publish, shop = _b.shop, cart = _b.cart, prevCart = _b.prevCart;
    return (React.createElement("a", { href: "/cart", onClick: function (e) {
            e.preventDefault();
            open('cart');
            publish('cart_viewed', {
                cart: cart,
                prevCart: prevCart,
                shop: shop,
                url: window.location.href || ''
            });
        } },
        "Cart ",
        count === null ? React.createElement("span", null, "\u00A0") : count));
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
