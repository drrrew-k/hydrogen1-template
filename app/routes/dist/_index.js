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
exports.CategoryRow = exports.TextTilesRow = exports.loader = exports.meta = void 0;
var remix_runtime_1 = require("@netlify/remix-runtime");
var react_1 = require("@remix-run/react");
var react_2 = require("react");
var hydrogen_1 = require("@shopify/hydrogen");
exports.meta = function () {
    return [{ title: 'Hydrogen | Home' }];
};
function loader(args) {
    return __awaiter(this, void 0, void 0, function () {
        var deferredData, criticalData, params, store_settings, recommendedProducts, _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    deferredData = loadDeferredData(args);
                    return [4 /*yield*/, loadCriticalData(args)];
                case 1:
                    criticalData = _d.sent();
                    params = new URLSearchParams({
                        store_id: '4'
                    });
                    return [4 /*yield*/, fetch(args.context.env.BACKEND_URL + "/get-store1-settings?" + params.toString())];
                case 2:
                    store_settings = _d.sent();
                    return [4 /*yield*/, fetch("https://rebuyengine.com/api/v1/products/recommended?key=" + args.context.env.REBUY_KEY + "&format=pretty")];
                case 3:
                    recommendedProducts = _d.sent();
                    console.log("store settings: ");
                    console.log(store_settings);
                    _a = remix_runtime_1.defer;
                    _b = [__assign(__assign({}, deferredData), criticalData)];
                    _c = {};
                    return [4 /*yield*/, store_settings.json()];
                case 4:
                    _c.store_settings = _d.sent(), _c.backend_url = args.context.env.CMS_API_URL;
                    return [4 /*yield*/, recommendedProducts.json()];
                case 5: return [2 /*return*/, _a.apply(void 0, [__assign.apply(void 0, _b.concat([(_c.recommendedProducts = _d.sent(), _c)]))])];
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
        var collections;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, Promise.all([
                        context.storefront.query(FEATURED_COLLECTION_QUERY),
                    ])];
                case 1:
                    collections = (_b.sent())[0].collections;
                    return [2 /*return*/, {
                            featuredCollection: collections.nodes[0]
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
    var recommendedProducts = context.storefront
        .query(RECOMMENDED_PRODUCTS_QUERY)["catch"](function (error) {
        // Log query errors, but don't throw them so the page can still render
        console.error(error);
        return null;
    });
    return {
        recommendedProducts: recommendedProducts
    };
}
function Homepage() {
    var data = react_1.useLoaderData();
    var backend_url = data.backend_url.endsWith("/") ? data.backend_url.replace(/\/$/, "") : data.backend_url;
    console.log("gfhgf data: ", data.store_settings.data.attributes.hero_image_top);
    return (React.createElement("div", { className: "home" },
        React.createElement(HeroImage, { imgsrc: (backend_url + data.store_settings.data.attributes.hero_image_top.data.attributes.url), key: "hero1", title: "Outfitting teams in quality scrubs and uniforms since 1983", buttons: ['shop men', 'shop women'] }),
        React.createElement(FeaturedCollection, { collection: data.featuredCollection }),
        React.createElement(CategoryRow, { products: data.recommendedProducts, store_settings: data.store_settings, url: data.backend_url }),
        React.createElement(RecommendedProducts, { products: data.recommendedProducts }),
        React.createElement(HeroImage, { imgsrc: (backend_url + data.store_settings.data.attributes.hero_image_middle.data.attributes.url), key: "hero2", title: "Looking to outfit your team?", buttons: ['Get a quote'] }),
        React.createElement(TextTilesRow, null),
        React.createElement(HeroImage, { imgsrc: (backend_url + data.store_settings.data.attributes.hero_image_bottom.data.attributes.url), key: "hero3", title: "Let our team help your team" })));
}
exports["default"] = Homepage;
function TextTilesRow() {
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { className: 'text-tiles-wrapper' },
            React.createElement("div", { className: 'text-tiles' },
                React.createElement("div", { className: 'text-tile' },
                    React.createElement("div", { className: 'tile-header' },
                        React.createElement("span", null, "Simple or complex customization")),
                    React.createElement("p", { className: 'tile-description' }, "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quasi inventore ut tempore nam totam repudiandae sint")),
                React.createElement("div", { className: 'text-tile' },
                    React.createElement("div", { className: 'tile-header' },
                        React.createElement("span", null, "Favourable bulk pricing")),
                    React.createElement("p", { className: 'tile-description' }, "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quasi inventore ut tempore nam totam repudiandae sint")),
                React.createElement("div", { className: 'text-tile' },
                    React.createElement("div", { className: 'tile-header' },
                        React.createElement("span", null, "We are fast")),
                    React.createElement("p", { className: 'tile-description' }, "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quasi inventore ut tempore nam totam repudiandae sint")),
                React.createElement("div", { className: 'text-tile' },
                    React.createElement("div", { className: 'tile-header' },
                        React.createElement("span", null, "White glove service")),
                    React.createElement("p", { className: 'tile-description' }, "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quasi inventore ut tempore nam totam repudiandae sint"))))));
}
exports.TextTilesRow = TextTilesRow;
function FeaturedCollection(_a) {
    var collection = _a.collection;
    if (!collection)
        return null;
    var image = collection === null || collection === void 0 ? void 0 : collection.image;
    return (React.createElement("div", null,
        React.createElement(react_1.Link, { className: "featured-collection", to: "/collections/" + collection.handle },
            React.createElement("h2", null, collection.title),
            image && (React.createElement("div", { className: "featured-collection-image", style: { aspectRatio: "unset" } },
                React.createElement(hydrogen_1.Image, { data: image, sizes: "100vw" })))),
        React.createElement("div", { className: "recommended-products-grid" }, collection.products.nodes.map(function (product) {
            return React.createElement(react_1.Link, { key: product.id, className: "recommended-product", to: "/products/" + product.handle },
                React.createElement(hydrogen_1.Image, { data: { url: "" + product.images.nodes[0].url }, aspectRatio: "1/1", sizes: "(min-width: 45em) 20vw, 50vw" }),
                React.createElement("h4", null, product.title),
                React.createElement("small", null,
                    React.createElement(hydrogen_1.Money, { data: {
                            amount: "" + product.priceRange.minVariantPrice.amount,
                            currencyCode: "CAD"
                        } })));
        }))));
}
function CategoryRow(_a) {
    var products = _a.products, store_settings = _a.store_settings, url = _a.url;
    return (React.createElement("div", { className: 'site-section' },
        React.createElement("div", { className: "collection-heading" },
            React.createElement("h2", null, "Shop by Industry")),
        React.createElement(react_1.Await, { resolve: products }, function (_a) {
            var products = _a.products;
            return (React.createElement("div", { className: 'tiles' },
                React.createElement("div", { className: 'category-tile' },
                    React.createElement("div", { className: 'tile-contents' },
                        React.createElement("img", { className: 'tile-image', src: url.replace(/\/$/, "") + store_settings.data.attributes.block1_logo.data.attributes.url, "data-item": "50", aspectRatio: "1/1", sizes: "(min-width: 45em) 20vw, 50vw" }),
                        React.createElement("p", { className: 'tile-title' }, "Healthcare"))),
                React.createElement("div", { className: 'category-tile' },
                    React.createElement("div", { className: 'tile-contents' },
                        React.createElement("img", { className: 'tile-image', src: url.replace(/\/$/, "") + store_settings.data.attributes.block2_logo.data.attributes.url, "data-item": "50", aspectRatio: "1/1", sizes: "(min-width: 45em) 20vw, 50vw" }),
                        React.createElement("p", { className: 'tile-title' }, "Dentistry"))),
                React.createElement("div", { className: 'category-tile' },
                    React.createElement("div", { className: 'tile-contents' },
                        React.createElement("img", { className: 'tile-image', src: url.replace(/\/$/, "") + store_settings.data.attributes.block3_logo.data.attributes.url, "data-item": "50", aspectRatio: "1/1", sizes: "(min-width: 45em) 20vw, 50vw" }),
                        React.createElement("p", { className: 'tile-title' }, "Veterinary"))),
                React.createElement("div", { className: 'category-tile' },
                    React.createElement("div", { className: 'tile-contents' },
                        React.createElement("img", { className: 'tile-image', src: url.replace(/\/$/, "") + store_settings.data.attributes.block4_logo.data.attributes.url, "data-item": "50", aspectRatio: "1/1", sizes: "(min-width: 45em) 20vw, 50vw" }),
                        React.createElement("p", { className: 'tile-title' }, "Culinary")))));
        })));
}
exports.CategoryRow = CategoryRow;
function HeroImage(_a) {
    var _b = _a.title, title = _b === void 0 ? 'Hero title' : _b, _c = _a.buttons, buttons = _c === void 0 ? [] : _c, _d = _a.imgsrc, imgsrc = _d === void 0 ? "https://cdn.shopify.com/s/files/1/1721/8901/files/pexels-alexandra-haddad-9317179.jpg?v=1717795912" : _d;
    return (React.createElement(React.Fragment, null,
        React.createElement("section", { className: "hero-image-section", key: "key" + Math.random() * 10 },
            React.createElement("img", { className: 'hero-image', src: imgsrc }),
            React.createElement("section", { className: "img-texts" },
                React.createElement("section", { className: 'text-block' },
                    React.createElement("p", { className: 'hero-title', key: "key" + Math.random() * 10 }, title)),
                React.createElement("section", { className: 'button-block' }, buttons.map(function (b) {
                    return React.createElement("div", { className: "hero-button" },
                        React.createElement("a", { href: "#", onClick: function () { return false; } }, b));
                }))))));
}
function RecommendedProducts(_a) {
    var products = _a.products;
    console.log('Prods:', products);
    return (React.createElement("div", { className: "recommended-products" },
        React.createElement("h2", null, "For you"),
        React.createElement(react_2.Suspense, { fallback: React.createElement("div", null, "Loading...") },
            React.createElement(react_1.Await, { resolve: products }, function (response) { return (React.createElement("div", { className: "recommended-products-grid" }, response
                ? response.data.map(function (product) { return (React.createElement(react_1.Link, { key: product.id, className: "recommended-product", to: "/products/" + product.handle },
                    React.createElement(hydrogen_1.Image, { data: { url: "" + product.image.src }, aspectRatio: "1/1", sizes: "(min-width: 45em) 20vw, 50vw" }),
                    React.createElement("h4", null, product.title),
                    React.createElement("small", null,
                        React.createElement(hydrogen_1.Money, { data: {
                                amount: "" + product.variants[0].price,
                                currencyCode: "CAD"
                            } })))); })
                : null)); })),
        React.createElement("br", null)));
}
var FEATURED_COLLECTION_QUERY = "#graphql\n  fragment FeaturedCollection on Collection {\n    id\n    title\n    image {\n      id\n      url\n      altText\n      width\n      height\n    }\n    handle\n    products(first: 5) {\n      nodes {\n        id\n        title\n        handle\n        priceRange {\n          minVariantPrice {\n            amount\n            currencyCode\n          }\n        }\n        images(first: 1) {\n          nodes {\n            id\n            url\n            altText\n            width\n            height\n          }\n        }\n      }\n    }\n  }\n  query FeaturedCollection($country: CountryCode, $language: LanguageCode)\n    @inContext(country: $country, language: $language) {\n    collections(first: 1) {\n      nodes {\n        ...FeaturedCollection\n      }\n    }\n  }\n";
var RECOMMENDED_PRODUCTS_QUERY = "#graphql\n  fragment RecommendedProduct on Product {\n    id\n    title\n    handle\n    priceRange {\n      minVariantPrice {\n        amount\n        currencyCode\n      }\n    }\n    images(first: 1) {\n      nodes {\n        id\n        url\n        altText\n        width\n        height\n      }\n    }\n  }\n  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)\n    @inContext(country: $country, language: $language) {\n    products(first: 4, sortKey: UPDATED_AT, reverse: true) {\n      nodes {\n        ...RecommendedProduct\n      }\n    }\n  }\n";
