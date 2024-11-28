"use strict";
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
exports.loader = exports.meta = void 0;
var remix_oxygen_1 = require("@shopify/remix-oxygen");
var react_1 = require("@remix-run/react");
var react_2 = require("react");
var hydrogen_1 = require("@shopify/hydrogen");
exports.meta = function () {
    return [{ title: 'Hydrogen | Home' }];
};
var COLLECTIONS_QUERY = "#graphql\n  query FeaturedCollections {\n    collections(first: 3, query: \"title:Apparel\") {\n      nodes {\n        id\n        title\n        handle\n      }\n    }\n  }\n";
var PRODS = "#graphql\n  query RecommendedProducts {\n    products(first: 3) {\n      nodes {\n        id\n        title\n        handle\n      }\n    }\n  }\n";
function loader(_a) {
    var context = _a.context;
    return __awaiter(this, void 0, void 0, function () {
        var storefront, collections, featuredCollection, recommendedProducts;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    storefront = context.storefront;
                    return [4 /*yield*/, storefront.query(COLLECTIONS_QUERY)];
                case 1:
                    collections = (_b.sent()).collections;
                    featuredCollection = collections.nodes[0];
                    recommendedProducts = storefront.query(PRODS);
                    return [2 /*return*/, remix_oxygen_1.defer({ featuredCollection: featuredCollection, recommendedProducts: recommendedProducts })];
            }
        });
    });
}
exports.loader = loader;
function Homepage() {
    var data = react_1.useLoaderData();
    return (React.createElement("div", { className: "home" },
        React.createElement(FeaturedCollection, { collection: data.featuredCollection }),
        React.createElement(RecommendedProducts, { products: data.recommendedProducts })));
}
exports["default"] = Homepage;
function FeaturedCollection(_a) {
    var collection = _a.collection;
    var image = collection.image;
    return (React.createElement(react_1.Link, { className: "featured-collection", to: "/collections/" + collection.handle },
        image && (React.createElement("div", { className: "featured-collection-image" },
            React.createElement(hydrogen_1.Image, { data: image, sizes: "100vw" }))),
        React.createElement("h1", null, collection.title)));
}
function RecommendedProducts(_a) {
    var products = _a.products;
    return (React.createElement("div", { className: "recommended-products" },
        React.createElement("h2", null, "Recommended Products"),
        React.createElement(react_2.Suspense, { fallback: React.createElement("div", null, "Loading...") },
            React.createElement(react_1.Await, { resolve: products }, function (_a) {
                var products = _a.products;
                return (React.createElement("div", { className: "recommended-products-grid" }, products.nodes.map(function (product) { return (React.createElement(react_1.Link, { key: product.id, className: "recommended-product", to: "/products/" + product.handle },
                    React.createElement(hydrogen_1.Image, { data: product.images.nodes[0], aspectRatio: "1/1", sizes: "(min-width: 45em) 20vw, 50vw" }),
                    React.createElement("h4", null, product.title),
                    React.createElement("small", null,
                        React.createElement(hydrogen_1.Money, { data: product.priceRange.minVariantPrice })))); })));
            })),
        React.createElement("br", null)));
}
var FEATURED_COLLECTION_QUERY = "#graphql\n  fragment FeaturedCollection on Collection {\n    id\n    title\n    image {\n      id\n      url\n      altText\n      width\n      height\n    }\n    handle\n  }\n  query FeaturedCollection($country: CountryCode, $language: LanguageCode)\n    @inContext(country: $country, language: $language) {\n    collections(first: 1, sortKey: UPDATED_AT, reverse: true) {\n      nodes {\n        ...FeaturedCollection\n      }\n    }\n  }\n";
var RECOMMENDED_PRODUCTS_QUERY = "#graphql\n  fragment RecommendedProduct on Product {\n    id\n    title\n    handle\n    priceRange {\n      minVariantPrice {\n        amount\n        currencyCode\n      }\n    }\n    images(first: 1) {\n      nodes {\n        id\n        url\n        altText\n        width\n        height\n      }\n    }\n  }\n  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)\n    @inContext(country: $country, language: $language) {\n    products(first: 4, sortKey: UPDATED_AT, reverse: true) {\n      nodes {\n        ...RecommendedProduct\n      }\n    }\n  }\n";
