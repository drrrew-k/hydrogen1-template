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
exports.loader = exports.meta = void 0;
var react_1 = require("react");
var remix_runtime_1 = require("@netlify/remix-runtime");
var react_2 = require("@remix-run/react");
var hydrogen_1 = require("@shopify/hydrogen");
var variants_1 = require("~/lib/variants");
var ProductPrice_1 = require("~/components/ProductPrice");
var ProductImage_1 = require("~/components/ProductImage");
var ProductForm_1 = require("~/components/ProductForm");
exports.meta = function (_a) {
    var _b;
    var data = _a.data;
    return [{ title: "Hydrogen | " + ((_b = data === null || data === void 0 ? void 0 : data.product.title) !== null && _b !== void 0 ? _b : '') }];
};
function loader(args) {
    return __awaiter(this, void 0, void 0, function () {
        var deferredData, criticalData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    deferredData = loadDeferredData(args);
                    return [4 /*yield*/, loadCriticalData(args)];
                case 1:
                    criticalData = _a.sent();
                    return [2 /*return*/, remix_runtime_1.defer(__assign(__assign({}, deferredData), criticalData))];
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
    var context = _a.context, params = _a.params, request = _a.request;
    return __awaiter(this, void 0, void 0, function () {
        var handle, storefront, product, firstVariant, firstVariantIsDefault, relatedProducts, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    handle = params.handle;
                    storefront = context.storefront;
                    if (!handle) {
                        throw new Error('Expected product handle to be defined');
                    }
                    return [4 /*yield*/, Promise.all([
                            storefront.query(PRODUCT_QUERY, {
                                variables: { handle: handle, selectedOptions: hydrogen_1.getSelectedProductOptions(request) }
                            }),
                        ])];
                case 1:
                    product = (_c.sent())[0].product;
                    if (!(product === null || product === void 0 ? void 0 : product.id)) {
                        throw new Response(null, { status: 404 });
                    }
                    firstVariant = product.variants.nodes[0];
                    firstVariantIsDefault = Boolean(firstVariant.selectedOptions.find(function (option) {
                        return option.name === 'Title' && option.value === 'Default Title';
                    }));
                    if (firstVariantIsDefault) {
                        product.selectedVariant = firstVariant;
                    }
                    else {
                        // if no selected variant was returned from the selected options,
                        // we redirect to the first variant's url with it's selected options applied
                        if (!product.selectedVariant) {
                            throw redirectToFirstVariant({ product: product, request: request });
                        }
                    }
                    return [4 /*yield*/, fetch("https://rebuyengine.com/api/v1/products/similar_products?shopify_product_ids=" + product.id + "&key=" + context.env.REBUY_KEY + "&format=pretty")];
                case 2:
                    relatedProducts = _c.sent();
                    _b = {
                        product: product
                    };
                    return [4 /*yield*/, relatedProducts.json()];
                case 3: return [2 /*return*/, (_b.relatedProducts = _c.sent(),
                        _b)];
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
    var context = _a.context, params = _a.params;
    // In order to show which variants are available in the UI, we need to query
    // all of them. But there might be a *lot*, so instead separate the variants
    // into it's own separate query that is deferred. So there's a brief moment
    // where variant options might show as available when they're not, but after
    // this deffered query resolves, the UI will update.
    var variants = context.storefront
        .query(VARIANTS_QUERY, {
        variables: { handle: params.handle }
    })["catch"](function (error) {
        // Log query errors, but don't throw them so the page can still render
        console.error(error);
        return null;
    });
    return {
        variants: variants
    };
}
function redirectToFirstVariant(_a) {
    var product = _a.product, request = _a.request;
    var url = new URL(request.url);
    var firstVariant = product.variants.nodes[0];
    return remix_runtime_1.redirect(variants_1.getVariantUrl({
        pathname: url.pathname,
        handle: product.handle,
        selectedOptions: firstVariant.selectedOptions,
        searchParams: new URLSearchParams(url.search)
    }), {
        status: 302
    });
}
function Product() {
    var _a = react_2.useLoaderData(), product = _a.product, variants = _a.variants, relatedProducts = _a.relatedProducts;
    var selectedVariant = hydrogen_1.useOptimisticVariant(product.selectedVariant, variants);
    var title = product.title, descriptionHtml = product.descriptionHtml;
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { className: "product" },
            React.createElement(ProductImage_1.ProductImage, { image: selectedVariant === null || selectedVariant === void 0 ? void 0 : selectedVariant.image }),
            React.createElement("div", { className: "product-main" },
                React.createElement("h1", null, title),
                React.createElement(ProductPrice_1.ProductPrice, { price: selectedVariant === null || selectedVariant === void 0 ? void 0 : selectedVariant.price, compareAtPrice: selectedVariant === null || selectedVariant === void 0 ? void 0 : selectedVariant.compareAtPrice }),
                React.createElement("br", null),
                React.createElement(react_1.Suspense, { fallback: React.createElement(ProductForm_1.ProductForm, { product: product, selectedVariant: selectedVariant, variants: [] }) },
                    React.createElement(react_2.Await, { errorElement: "There was a problem loading product variants", resolve: variants }, function (data) {
                        var _a;
                        return (React.createElement(ProductForm_1.ProductForm, { product: product, selectedVariant: selectedVariant, variants: ((_a = data === null || data === void 0 ? void 0 : data.product) === null || _a === void 0 ? void 0 : _a.variants.nodes) || [] }));
                    })),
                React.createElement("br", null),
                React.createElement("br", null),
                React.createElement("p", null,
                    React.createElement("strong", null, "Description")),
                React.createElement("br", null),
                React.createElement("div", { dangerouslySetInnerHTML: { __html: descriptionHtml } }),
                React.createElement("br", null)),
            React.createElement(hydrogen_1.Analytics.ProductView, { data: {
                    products: [
                        {
                            id: product.id,
                            title: product.title,
                            price: (selectedVariant === null || selectedVariant === void 0 ? void 0 : selectedVariant.price.amount) || '0',
                            vendor: product.vendor,
                            variantId: (selectedVariant === null || selectedVariant === void 0 ? void 0 : selectedVariant.id) || '',
                            variantTitle: (selectedVariant === null || selectedVariant === void 0 ? void 0 : selectedVariant.title) || '',
                            quantity: 1
                        },
                    ]
                } })),
        React.createElement(RelatedProducts, { related_products: relatedProducts, current_product: product })));
}
exports["default"] = Product;
function RelatedProducts(_a) {
    var related_products = _a.related_products, current_product = _a.current_product;
    return (React.createElement("div", { className: "related-products-wrapper" },
        React.createElement("h2", null, "You may also like"),
        React.createElement("section", { className: "related-products" },
            React.createElement("div", { className: "collection-products" }, related_products.data.map(function (item) {
                return (current_product.handle == item.handle ? React.createElement(React.Fragment, null) : React.createElement(SingleItem, { item: item }));
            })))));
}
function getImage(item) {
    var _a, _b, _c, _d;
    var image_exists = item.images && Object.keys(item.images).length > 0;
    if (!image_exists) {
        return "";
    }
    var img = item.images[Object.keys(item.images)[0]];
    // item.images[0].src
    // (item.images && Object.keys(item.images).length > 0 ? ] : "")
    return {
        alt: (_a = img.alt) !== null && _a !== void 0 ? _a : "",
        src: item.images[0].src,
        key: (_b = img.key) !== null && _b !== void 0 ? _b : "",
        id: (_c = img.id) !== null && _c !== void 0 ? _c : "",
        url: img.src,
        height: (_d = img.height) !== null && _d !== void 0 ? _d : 800,
        width: "auto"
    };
    // return item.images[Object.keys(item.images)[0]].src;
}
function SingleItem(product) {
    var item = product.item;
    return (React.createElement("div", { className: "product-link" },
        React.createElement("div", null,
            React.createElement("div", { className: 'slider-item single-item', key: item.id },
                React.createElement(react_2.Link, { className: "product-link", key: item.id, prefetch: "intent", to: "/products/" + item.handle },
                    React.createElement(ProductImage_1.ProductImage, { image: getImage(item) }),
                    React.createElement("div", { className: 'slider-lower-block' },
                        React.createElement("h4", null, item.title),
                        React.createElement("span", { className: 'price' },
                            "$",
                            item.variants[Object.keys(item.variants)[0]].price)))))));
}
var PRODUCT_VARIANT_FRAGMENT = "#graphql\n  fragment ProductVariant on ProductVariant {\n    availableForSale\n    compareAtPrice {\n      amount\n      currencyCode\n    }\n    id\n    image {\n      __typename\n      id\n      url\n      altText\n      width\n      height\n    }\n    price {\n      amount\n      currencyCode\n    }\n    product {\n      title\n      handle\n    }\n    selectedOptions {\n      name\n      value\n    }\n    sku\n    title\n    unitPrice {\n      amount\n      currencyCode\n    }\n  }\n";
var PRODUCT_FRAGMENT = "#graphql\n  fragment Product on Product {\n    id\n    title\n    vendor\n    handle\n    descriptionHtml\n    description\n    options {\n      name\n      values\n    }\n    selectedVariant: variantBySelectedOptions(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {\n      ...ProductVariant\n    }\n    variants(first: 1) {\n      nodes {\n        ...ProductVariant\n      }\n    }\n    seo {\n      description\n      title\n    }\n  }\n  " + PRODUCT_VARIANT_FRAGMENT + "\n";
var PRODUCT_QUERY = "#graphql\n  query Product(\n    $country: CountryCode\n    $handle: String!\n    $language: LanguageCode\n    $selectedOptions: [SelectedOptionInput!]!\n  ) @inContext(country: $country, language: $language) {\n    product(handle: $handle) {\n      ...Product\n    }\n  }\n  " + PRODUCT_FRAGMENT + "\n";
var PRODUCT_VARIANTS_FRAGMENT = "#graphql\n  fragment ProductVariants on Product {\n    variants(first: 250) {\n      nodes {\n        ...ProductVariant\n      }\n    }\n  }\n  " + PRODUCT_VARIANT_FRAGMENT + "\n";
var VARIANTS_QUERY = "#graphql\n  " + PRODUCT_VARIANTS_FRAGMENT + "\n  query ProductVariants(\n    $country: CountryCode\n    $language: LanguageCode\n    $handle: String!\n  ) @inContext(country: $country, language: $language) {\n    product(handle: $handle) {\n      ...ProductVariants\n    }\n  }\n";
