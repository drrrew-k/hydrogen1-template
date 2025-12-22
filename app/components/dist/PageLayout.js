"use strict";
exports.__esModule = true;
exports.PageLayout = void 0;
var react_1 = require("@remix-run/react");
var react_2 = require("react");
var Aside_1 = require("~/components/Aside");
var Footer_1 = require("~/components/Footer");
var Header_1 = require("~/components/Header");
var CartMain_1 = require("~/components/CartMain");
var SearchFormPredictive_1 = require("~/components/SearchFormPredictive");
var SearchResultsPredictive_1 = require("~/components/SearchResultsPredictive");
function PageLayout(_a) {
    var cart = _a.cart, _b = _a.children, children = _b === void 0 ? null : _b, footer = _a.footer, header = _a.header, isLoggedIn = _a.isLoggedIn, publicStoreDomain = _a.publicStoreDomain, header_img = _a.header_img;
    return (React.createElement(Aside_1.Aside.Provider, null,
        React.createElement(CartAside, { cart: cart }),
        React.createElement(SearchAside, null),
        React.createElement(MobileMenuAside, { header: header, publicStoreDomain: publicStoreDomain }),
        header && (React.createElement(Header_1.Header, { header: header, cart: cart, isLoggedIn: isLoggedIn, publicStoreDomain: publicStoreDomain })),
        React.createElement("main", null, children),
        React.createElement(Footer_1.Footer, { footer: footer, header: header, header_img: header_img, publicStoreDomain: publicStoreDomain })));
}
exports.PageLayout = PageLayout;
function CartAside(_a) {
    var cart = _a.cart;
    return (React.createElement(Aside_1.Aside, { type: "cart", heading: "CART" },
        React.createElement(react_2.Suspense, { fallback: React.createElement("p", null, "Loading cart ...") },
            React.createElement(react_1.Await, { resolve: cart }, function (cart) {
                return React.createElement(CartMain_1.CartMain, { cart: cart, layout: "aside" });
            }))));
}
function SearchAside() {
    return (React.createElement(Aside_1.Aside, { type: "search", heading: "SEARCH" },
        React.createElement("div", { className: "predictive-search" },
            React.createElement("br", null),
            React.createElement(SearchFormPredictive_1.SearchFormPredictive, null, function (_a) {
                var fetchResults = _a.fetchResults, goToSearch = _a.goToSearch, inputRef = _a.inputRef;
                return (React.createElement(React.Fragment, null,
                    React.createElement("input", { name: "q", onChange: fetchResults, onFocus: fetchResults, placeholder: "Search", ref: inputRef, type: "search" }),
                    "\u00A0",
                    React.createElement("button", { onClick: goToSearch }, "Search")));
            }),
            React.createElement(SearchResultsPredictive_1.SearchResultsPredictive, null, function (_a) {
                var items = _a.items, total = _a.total, term = _a.term, state = _a.state, inputRef = _a.inputRef, closeSearch = _a.closeSearch;
                var articles = items.articles, collections = items.collections, pages = items.pages, products = items.products, queries = items.queries;
                if (state === 'loading' && term.current) {
                    return React.createElement("div", null, "Loading...");
                }
                if (!total) {
                    return React.createElement(SearchResultsPredictive_1.SearchResultsPredictive.Empty, { term: term });
                }
                return (React.createElement(React.Fragment, null,
                    React.createElement(SearchResultsPredictive_1.SearchResultsPredictive.Queries, { queries: queries, inputRef: inputRef }),
                    React.createElement(SearchResultsPredictive_1.SearchResultsPredictive.Products, { products: products, closeSearch: closeSearch, term: term }),
                    React.createElement(SearchResultsPredictive_1.SearchResultsPredictive.Collections, { collections: collections, closeSearch: closeSearch, term: term }),
                    React.createElement(SearchResultsPredictive_1.SearchResultsPredictive.Pages, { pages: pages, closeSearch: closeSearch, term: term }),
                    React.createElement(SearchResultsPredictive_1.SearchResultsPredictive.Articles, { articles: articles, closeSearch: closeSearch, term: term }),
                    term.current && total ? (React.createElement(react_1.Link, { onClick: closeSearch, to: SearchFormPredictive_1.SEARCH_ENDPOINT + "?q=" + term.current },
                        React.createElement("p", null,
                            "View all results for ",
                            React.createElement("q", null, term.current),
                            "\u00A0 \u2192"))) : null));
            }))));
}
function MobileMenuAside(_a) {
    var _b;
    var header = _a.header, publicStoreDomain = _a.publicStoreDomain;
    return (header.menu && ((_b = header.shop.primaryDomain) === null || _b === void 0 ? void 0 : _b.url) && (React.createElement(Aside_1.Aside, { type: "mobile", heading: "MENU" },
        React.createElement(Header_1.HeaderMenu, { menu: header.menu, viewport: "mobile", primaryDomainUrl: header.shop.primaryDomain.url, publicStoreDomain: publicStoreDomain }))));
}
