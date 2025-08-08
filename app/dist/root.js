"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.ErrorBoundary = exports.Layout = exports.loader = exports.links = exports.shouldRevalidate = void 0;
var hydrogen_1 = require("@shopify/hydrogen");
var remix_runtime_1 = require("@netlify/remix-runtime");
var react_1 = require("@remix-run/react");
var favicon_svg_1 = require("~/assets/favicon.svg");
var reset_css_url_1 = require("~/styles/reset.css?url");
var app_css_url_1 = require("~/styles/app.css?url");
var PageLayout_1 = require("~/components/PageLayout");
var custom_css_url_1 = require("~/styles/custom.css?url");
var fragments_1 = require("~/lib/fragments");
var react_2 = require("react");
/**
 * This is important to avoid re-fetching root queries on sub-navigations
 */
exports.shouldRevalidate = function (_a) {
    var formMethod = _a.formMethod, currentUrl = _a.currentUrl, nextUrl = _a.nextUrl, defaultShouldRevalidate = _a.defaultShouldRevalidate;
    // revalidate when a mutation is performed e.g add to cart, login...
    if (formMethod && formMethod !== 'GET')
        return true;
    // revalidate when manually revalidating via useRevalidator
    if (currentUrl.toString() === nextUrl.toString())
        return true;
    return defaultShouldRevalidate;
};
function links() {
    return [
        { rel: 'stylesheet', href: reset_css_url_1["default"] },
        { rel: 'stylesheet', href: app_css_url_1["default"] },
        { rel: 'stylesheet', href: custom_css_url_1["default"] },
        {
            rel: 'preconnect',
            href: 'https://cdn.shopify.com'
        },
        {
            rel: 'preconnect',
            href: 'https://shop.app'
        },
        { rel: 'icon', type: 'image/svg+xml', href: favicon_svg_1["default"] },
    ];
}
exports.links = links;
function loader(args) {
    return __awaiter(this, void 0, void 0, function () {
        var deferredData, criticalData, _a, storefront, env, header_img, cms_styles;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    deferredData = loadDeferredData(args);
                    return [4 /*yield*/, loadCriticalData(args)];
                case 1:
                    criticalData = _b.sent();
                    _a = args.context, storefront = _a.storefront, env = _a.env;
                    return [4 /*yield*/, fetch(args.context.env.BACKEND_URL + "/get-store1-settings").then(function (r) { return r.json(); })];
                case 2:
                    header_img = _b.sent();
                    return [4 /*yield*/, fetch(args.context.env.BACKEND_URL + "/get-css").then(function (r) { return r.json(); })];
                case 3:
                    cms_styles = _b.sent();
                    return [2 /*return*/, remix_runtime_1.defer(__assign(__assign(__assign({}, deferredData), criticalData), { publicStoreDomain: env.PUBLIC_STORE_DOMAIN, shop: hydrogen_1.getShopAnalytics({
                                storefront: storefront,
                                publicStorefrontId: env.PUBLIC_STOREFRONT_ID
                            }), consent: {
                                checkoutDomain: env.PUBLIC_CHECKOUT_DOMAIN,
                                storefrontAccessToken: env.PUBLIC_STOREFRONT_API_TOKEN
                            }, header_img: header_img, cms_styles: cms_styles, store_name: args.context.env.STORE_NAME }))];
            }
        });
    });
}
exports.loader = loader;
/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
function loadCriticalData(_a) {
    var context = _a.context;
    return __awaiter(this, void 0, void 0, function () {
        var storefront, header;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    storefront = context.storefront;
                    return [4 /*yield*/, Promise.all([
                            storefront.query(fragments_1.HEADER_QUERY, {
                                cache: storefront.CacheLong(),
                                variables: {
                                    headerMenuHandle: 'main-menu'
                                }
                            }),
                        ])];
                case 1:
                    header = (_b.sent())[0];
                    return [2 /*return*/, {
                            header: header
                        }];
            }
        });
    });
}
/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData(_a) {
    var context = _a.context;
    var storefront = context.storefront, customerAccount = context.customerAccount, cart = context.cart;
    // defer the footer query (below the fold)
    var footer = storefront
        .query(fragments_1.FOOTER_QUERY, {
        cache: storefront.CacheLong(),
        variables: {
            footerMenuHandle: 'footer'
        }
    })["catch"](function (error) {
        // Log query errors, but don't throw them so the page can still render
        console.error(error);
        return null;
    });
    return {
        cart: cart.get(),
        isLoggedIn: customerAccount.isLoggedIn(),
        footer: footer
    };
}
function Layout(_a) {
    var _b;
    var children = _a.children;
    var nonce = hydrogen_1.useNonce();
    var data = react_1.useRouteLoaderData('root');
    var _c = react_2.useState('body-light'), bodyClass = _c[0], setBodyClass = _c[1];
    function switchStyle(event) {
        var newStyle = '';
        if (bodyClass == 'body-dark') {
            newStyle = 'body-light';
        }
        else {
            newStyle = 'body-dark';
        }
        setBodyClass(newStyle);
        window.localStorage.setItem("bodyStyle", newStyle);
    }
    var fonts_data = data.header_img.data.attributes.font_link;
    fonts_data = fonts_data.split("\n");
    console.log("fonts_data == ");
    return (React.createElement("html", { lang: "en" },
        React.createElement("head", null,
            React.createElement("meta", { charSet: "utf-8" }),
            React.createElement("meta", { name: "viewport", content: "width=device-width,initial-scale=1" }),
            React.createElement(react_1.Meta, null),
            React.createElement(react_1.Links, null),
            fonts_data.map(function (e) {
                var el = e;
                var f_type = 'preconnect';
                if (el.search("stylesheet") != -1) {
                    f_type = 'stylesheet';
                }
                el = el.replace('<link ', "");
                el = el.replace('rel="preconnect"', "");
                el = el.replace('rel="stylesheet"', "");
                el = el.replace('crossorigin', "");
                el = el.replace('href="', "");
                el = el.replace('" >', "");
                el = el.replace('>', "");
                el = el.replace('"', "");
                return React.createElement("link", { rel: f_type, href: el.trim() });
            }), (_b = data.cms_styles.snippets) === null || _b === void 0 ? void 0 :
            _b.map(function (s) {
                if (s.store_name == data.store_name || s.store_name == '') {
                    return React.createElement("style", { dangerouslySetInnerHTML: { __html: s.code } });
                }
                else {
                    return '';
                }
            })),
        React.createElement("body", { className: bodyClass },
            data ? (React.createElement(hydrogen_1.Analytics.Provider, { cart: data.cart, shop: data.shop, consent: data.consent },
                React.createElement(PageLayout_1.PageLayout, __assign({}, data), children))) : (children),
            React.createElement(react_1.ScrollRestoration, { nonce: nonce }),
            React.createElement(react_1.Scripts, { nonce: nonce }))));
}
exports.Layout = Layout;
function App() {
    return React.createElement(react_1.Outlet, null);
}
exports["default"] = App;
function ErrorBoundary() {
    var _a, _b;
    var error = react_1.useRouteError();
    var errorMessage = 'Unknown error';
    var errorStatus = 500;
    if (react_1.isRouteErrorResponse(error)) {
        errorMessage = (_b = (_a = error === null || error === void 0 ? void 0 : error.data) === null || _a === void 0 ? void 0 : _a.message) !== null && _b !== void 0 ? _b : error.data;
        errorStatus = error.status;
    }
    else if (error instanceof Error) {
        errorMessage = error.message;
    }
    return (React.createElement("div", { className: "route-error" },
        React.createElement("h1", null, "Oops"),
        React.createElement("h2", null, errorStatus),
        errorMessage && (React.createElement("fieldset", null,
            React.createElement("pre", null, errorMessage)))));
}
exports.ErrorBoundary = ErrorBoundary;
