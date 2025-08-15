"use strict";
exports.__esModule = true;
exports.Footer = void 0;
var react_1 = require("react");
var react_2 = require("@remix-run/react");
var react_3 = require("@remix-run/react");
var react_fontawesome_1 = require("@fortawesome/react-fontawesome");
var free_brands_svg_icons_1 = require("@fortawesome/free-brands-svg-icons");
function Footer(_a) {
    var footerPromise = _a.footer, header = _a.header, header_img = _a.header_img, publicStoreDomain = _a.publicStoreDomain;
    var footer_logo = '';
    if (header_img.data.attributes.footer_logo.data == null) {
        footer_logo = header_img.data.attributes.store_logo.data.attributes.url;
    }
    else {
        footer_logo = header_img.data.attributes.footer_logo.data.attributes.url;
    }
    return (React.createElement(react_1.Suspense, null,
        React.createElement(react_2.Await, { resolve: footerPromise }, function (footer) {
            var _a;
            return (React.createElement("footer", { className: "footer" },
                (footer === null || footer === void 0 ? void 0 : footer.menu) && ((_a = header.shop.primaryDomain) === null || _a === void 0 ? void 0 : _a.url) && (React.createElement(FooterMenu, { menu: footer.menu, primaryDomainUrl: header.shop.primaryDomain.url, publicStoreDomain: publicStoreDomain })),
                React.createElement("div", { className: 'footer-right' },
                    React.createElement("div", { className: 'footer-logo' },
                        React.createElement(react_3.Link, { prefetch: "intent", to: "/" },
                            React.createElement("img", { srcx: "https://hydrogencms.drew-k.com:81" + footer_logo, src: "https://hydrogencms.drew-k.com:81" + footer_logo }))),
                    React.createElement("div", { className: 'footer-socials' },
                        React.createElement("a", { href: "#" },
                            React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: free_brands_svg_icons_1.faTwitter, className: "inside-button" })),
                        React.createElement("a", { href: "#" },
                            React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: free_brands_svg_icons_1.faInstagram, className: "inside-button" })),
                        React.createElement("a", { href: "#" },
                            React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: free_brands_svg_icons_1.faFacebook, className: "inside-button" }))))));
        })));
}
exports.Footer = Footer;
function FooterMenu(_a) {
    var menu = _a.menu, primaryDomainUrl = _a.primaryDomainUrl, publicStoreDomain = _a.publicStoreDomain;
    return (React.createElement("nav", { className: "footer-menu", role: "navigation" }, (menu || FALLBACK_FOOTER_MENU).items.map(function (item) {
        if (!item.url)
            return null;
        // if the url is internal, we strip the domain
        var url = item.url.includes('myshopify.com') ||
            item.url.includes(publicStoreDomain) ||
            item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;
        var isExternal = !url.startsWith('/');
        return isExternal ? (React.createElement("a", { href: url, key: item.id, rel: "noopener noreferrer", target: "_blank" }, item.title)) : (React.createElement(react_2.NavLink, { end: true, key: item.id, prefetch: "intent", style: activeLinkStyle, to: url }, item.title));
    })));
}
var FALLBACK_FOOTER_MENU = {
    id: 'gid://shopify/Menu/199655620664',
    items: [
        {
            id: 'gid://shopify/MenuItem/461633060920',
            resourceId: 'gid://shopify/ShopPolicy/23358046264',
            tags: [],
            title: 'Privacy Policy',
            type: 'SHOP_POLICY',
            url: '/policies/privacy-policy',
            items: []
        },
        {
            id: 'gid://shopify/MenuItem/461633093688',
            resourceId: 'gid://shopify/ShopPolicy/23358013496',
            tags: [],
            title: 'Refund Policy',
            type: 'SHOP_POLICY',
            url: '/policies/refund-policy',
            items: []
        },
        {
            id: 'gid://shopify/MenuItem/461633126456',
            resourceId: 'gid://shopify/ShopPolicy/23358111800',
            tags: [],
            title: 'Shipping Policy',
            type: 'SHOP_POLICY',
            url: '/policies/shipping-policy',
            items: []
        },
        {
            id: 'gid://shopify/MenuItem/461633159224',
            resourceId: 'gid://shopify/ShopPolicy/23358079032',
            tags: [],
            title: 'Terms of Service',
            type: 'SHOP_POLICY',
            url: '/policies/terms-of-service',
            items: []
        },
    ]
};
function activeLinkStyle(_a) {
    var isActive = _a.isActive, isPending = _a.isPending;
    return {
        fontWeight: isActive ? 'bold' : undefined,
        color: isPending ? 'grey' : 'white'
    };
}
