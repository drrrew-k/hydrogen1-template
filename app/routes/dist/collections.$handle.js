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
exports.SingleItem = exports.FilterList = exports.loader = exports.meta = void 0;
var remix_runtime_1 = require("@netlify/remix-runtime");
var react_1 = require("@remix-run/react");
var hydrogen_1 = require("@shopify/hydrogen");
var variants_1 = require("~/lib/variants");
var react_2 = require("@remix-run/react");
var axios_1 = require("axios");
exports.meta = function (_a) {
    var _b;
    var data = _a.data;
    return [{ title: "Hydrogen | " + ((_b = data === null || data === void 0 ? void 0 : data.collection.title) !== null && _b !== void 0 ? _b : '') + " Collection" }];
};
function loader(args) {
    return __awaiter(this, void 0, void 0, function () {
        var deferredData, criticalData, handle, options, controller, filterOptions, products, filteredVals, filters;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    deferredData = loadDeferredData(args);
                    return [4 /*yield*/, loadCriticalData(args)];
                case 1:
                    criticalData = _a.sent();
                    handle = args.params.handle;
                    options = { timeout: 8000 };
                    controller = new AbortController();
                    return [4 /*yield*/, axios_1["default"].get('https://services.mybcapps.com/bc-sf-filter/filter?shop=avida-healthwear-inc.myshopify.com&build_filter_tree=true', { timeout: 10000 })
                            .then(function (r) {
                            console.log("Rsposnsse:", r);
                            var products = r.data.products;
                            var filters = r.data.filter.options.filter(function (element) {
                                if (['Price', 'Gender', 'Product Type', 'Vendor'].includes(element.label)) {
                                    return true;
                                }
                                else {
                                    return false;
                                }
                                // return Object.keys(element).includes('label') && element.label != '';
                                // return Object.keys(element).includes('label') && element.label != '';
                            });
                            return { products: products, filters: filters };
                        }).then(function (e) {
                            e.filters.map(function (el) {
                                if (Object.keys(el).includes('manuvalues') && el.manualValues) {
                                    return el.manualValues;
                                }
                                return el.values;
                            });
                            return e;
                        })];
                case 2:
                    filterOptions = _a.sent();
                    products = filterOptions.products;
                    filteredVals = [];
                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                            setTimeout(function () {
                                resolve(filterOptions);
                            }, 1000);
                        }).then(function (r) {
                            var fil = [];
                            var innerItems = {};
                            filterOptions.filters.forEach(function (el) {
                                innerItems = {};
                                innerItems.label = el.label;
                                innerItems.values = [];
                                if (Object.keys(el).includes('manualValues') && el.manualValues) {
                                    el.manualValues.map(function (item) {
                                        innerItems.values.push(item);
                                    });
                                    fil.push(innerItems);
                                }
                                else {
                                    if (el.values.length) {
                                        el.values.map(function (item) {
                                            innerItems.values.push(item['key']);
                                        });
                                        fil.push(innerItems);
                                    }
                                }
                            });
                            return fil;
                        })];
                case 3:
                    filters = _a.sent();
                    return [2 /*return*/, remix_runtime_1.defer(__assign(__assign(__assign({}, deferredData), criticalData), { products: products, filters: filters, handle: handle }))];
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
        var handle, storefront, paginationVariables, collection;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    handle = params.handle;
                    storefront = context.storefront;
                    paginationVariables = hydrogen_1.getPaginationVariables(request, {
                        pageBy: 8
                    });
                    if (!handle) {
                        throw remix_runtime_1.redirect('/collections');
                    }
                    return [4 /*yield*/, Promise.all([
                            storefront.query(COLLECTION_QUERY, {
                                variables: __assign({ handle: handle }, paginationVariables)
                            }),
                        ])];
                case 1:
                    collection = (_b.sent())[0].collection;
                    if (!collection) {
                        throw new Response("Collection " + handle + " not found", {
                            status: 404
                        });
                    }
                    return [2 /*return*/, {
                            collection: collection
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
    return {};
}
// export default function Collection() {
//   const {collection} = useLoaderData<typeof loader>();
//   return (
//     <div className="collection">
//       <h1>{collection.title}</h1>
//       <p className="collection-description">{collection.description}</p>
//       <PaginatedResourceSection
//         connection={collection.products}
//         resourcesClassName="products-grid"
//       >
//         {({node: product, index}) => (
//           <ProductItem
//             key={product.id}
//             product={product}
//             loading={index < 8 ? 'eager' : undefined}
//           />
//         )}
//       </PaginatedResourceSection>
//       <Analytics.CollectionView
//         data={{
//           collection: {
//             id: collection.id,
//             handle: collection.handle,
//           },
//         }}
//       />
//     </div>
//   );
// }
function FilterList(el, onchange, filters, handle, query) {
    function dd(document, tag) {
        // document.querySelector('#filters-form').submit();
    }
    return (React.createElement("div", null,
        React.createElement("div", { className: 'form-group' },
            React.createElement("p", null,
                React.createElement("label", { className: "cb-container link" },
                    React.createElement("span", null, el.el),
                    React.createElement("input", { type: "checkbox", name: "tags", value: el.el, onChange: el.onchange, defaultChecked: el.query.includes(el.el) }),
                    React.createElement("span", { className: "checkmark" }))))));
}
exports.FilterList = FilterList;
function Collection() {
    var query = react_1.useSearchParams()[0];
    var enabledFilters = query.getAll('tags');
    var priceFilter = query.get('max-price');
    var _a = react_1.useLoaderData(), collection = _a.collection, menu = _a.menu, allItems = _a.allItems, products = _a.products, filters = _a.filters, handle = _a.handle;
    // console.log("pdorudcts:");
    // console.log(products);
    // const checkedStates = new Array(filters.length).fill({tag: "TheTest", checked: false});
    var checkedStates = [];
    for (var i = 0; i < filters.length; i++) {
        checkedStates.push({ tag: filters[i], checked: false });
    }
    //https://services.mybcapps.com/bc-sf-filter/filter?shop=cheatersfirststore.myshopify.com&build_filter_tree=true
    //r['filter']['options'][3]
    //https://services.mybcapps.com/bc-sf-filter/search?shop=cheatersfirststore.myshopify.com&tag=Culinary
    var submit = react_2.useSubmit();
    /* range input */
    // const rangeInput = document.querySelectorAll(".range-input input"),
    // priceInput = document.querySelectorAll(".price-input input"),
    // range = document.querySelector(".slider .progress");
    // let priceGap = 1000;
    // priceInput.forEach((input) => {
    //   input.addEventListener("input", (e) => {
    //     let minPrice = parseInt(priceInput[0].value),
    //       maxPrice = parseInt(priceInput[1].value);
    //     if (maxPrice - minPrice >= priceGap && maxPrice <= rangeInput[1].max) {
    //       if (e.target.className === "input-min") {
    //         rangeInput[0].value = minPrice;
    //         range.style.left = (minPrice / rangeInput[0].max) * 100 + "%";
    //       } else {
    //         rangeInput[1].value = maxPrice;
    //         range.style.right = 100 - (maxPrice / rangeInput[1].max) * 100 + "%";
    //       }
    //     }
    //   });
    // });
    /* end range input */
    var priceInputChange = function (e) {
        var priceInput = document.querySelectorAll(".price-input input");
        var rangeInput = document.querySelectorAll(".range-input input");
        var range = document.querySelector(".slider .progress");
        var priceGap = 100;
        var minPrice = parseInt(priceInput[0].value);
        //let maxPrice = parseInt(priceInput[1].value);
        // if (maxPrice - minPrice >= priceGap && maxPrice <= rangeInput[1].max) {
        if (maxPrice <= rangeInput[1].max) {
            if (e.target.className === "input-min") {
                // rangeInput[0].value = minPrice;
                // range.style.left = (minPrice / rangeInput[0].max) * 100 + "%";
                range.style.left = (0 / rangeInput[0].max) * 100 + "%";
            }
            else {
                // rangeInput[1].value = maxPrice;
                rangeInput[0].value = maxPrice;
                range.style.right = 100 - (maxPrice / rangeInput[1].max) * 100 + "%";
            }
        }
    };
    var rangeChange = function (e) {
        var priceInput = document.querySelectorAll(".price-input input");
        var rangeInput = document.querySelectorAll(".range-input input");
        var range = document.querySelector(".slider .progress");
        var priceGap = 100;
        // let minPrice = parseInt(priceInput[0].value);
        var maxPrice = parseInt(priceInput[0].value);
        // let minVal = parseInt(rangeInput[0].value);
        var maxVal = parseInt(rangeInput[0].value);
        if (maxVal - 0 < 0) {
            if (e.target.className === "range-min") {
                rangeInput[0].value = maxVal - priceGap;
            }
            else {
                rangeInput[1].value = minVal + priceGap;
            }
        }
        else {
            // priceInput[0].value = minVal;
            priceInput[0].value = maxVal;
            // range.style.left = (minVal / rangeInput[0].max) * 100 + "%";
            range.style.right = 100 - (maxVal / rangeInput[0].max) * 100 + "%";
        }
    };
    var ShowElement = function (el, enabledFilters) {
        var included = true;
        if (enabledFilters.length) {
            included = el.tags.some(function (val) { return enabledFilters.includes(val) && el.collections.some(function (c) {
                return c.handle == collection.handle;
            }); });
        }
        else {
            included = el.collections.some(function (c) { return c.handle == collection.handle; });
        }
        if (included) {
            if (priceFilter) {
                included = el.variants.some(function (val) { return parseFloat(val.price) <= parseFloat(priceFilter); });
            }
        }
        return included;
        // return enabledFilters.length ?
        //           el.tags.some(val => enabledFilters.includes(val) && el.collections.some(c =>
        //               c.handle == collection.handle)
        //             )
        //           :
        //           el.collections.some(c => c.handle == collection.handle);
        //           ;
    };
    return (React.createElement("div", { className: "collection" },
        React.createElement("div", { className: 'left-side collection-filters' },
            React.createElement("form", { method: 'get', action: "/collections/" + handle + "?search", id: "filters-form", onChange: function (e) { return submit(e.currentTarget); } },
                filters.map(function (el) {
                    return React.createElement(React.Fragment, null,
                        " ",
                        React.createElement("h2", null, el.label),
                        el.values.map(function (item) {
                            return React.createElement(FilterList, { el: item, onchange: submit, filters: checkedStates, handle: handle, query: enabledFilters });
                        }));
                }),
                React.createElement("h2", null, "Price"),
                React.createElement("section", null,
                    React.createElement("div", { className: "price-input" },
                        React.createElement("div", { className: "field" },
                            React.createElement("span", null, "Max"),
                            React.createElement("input", { type: "number", className: "input-max", defaultValue: "500", onInput: priceInputChange }))),
                    React.createElement("div", { className: "slider" },
                        React.createElement("div", { className: "progress" })),
                    React.createElement("div", { className: "range-input" },
                        React.createElement("input", { type: "range", name: "max-price", className: "range-max", min: "0", max: "1500", defaultValue: "500", step: "10", onChange: rangeChange }))))),
        React.createElement("div", { className: "collection-data" },
            React.createElement("section", { className: "collection-intro" },
                React.createElement("div", { className: 'right-side' },
                    collection.image &&
                        React.createElement("div", { className: "collection-img", style: { backgroundImage: 'url(' + collection.image.url + ')' } },
                            React.createElement("img", { src: collection.image.url, alt: collection.title + " collection" })),
                    React.createElement("div", { className: 'collection-details' },
                        React.createElement("p", { className: 'collection-header' },
                            "Shop ",
                            collection.title.toLowerCase()),
                        React.createElement("p", { className: "collection-description" }, collection.description)))),
            React.createElement("div", { className: "collection-products" }, products.map(function (el) {
                return ShowElement(el, enabledFilters) && React.createElement(SingleItem, { item: el });
            })))));
}
exports["default"] = Collection;
function SingleItem(_a) {
    var item = _a.item;
    return (React.createElement("div", { className: "product-link" },
        React.createElement("div", null,
            React.createElement("div", { className: 'slider-item single-item', key: item.id },
                React.createElement(react_1.Link, { className: "product-link", key: item.id, prefetch: "intent", to: "/products/" + item.handle },
                    React.createElement("div", { className: 'slider-upper-block', style: { backgroundImage: 'url(' + ((item.images && Object.keys(item.images).length > 0) ? item.images[Object.keys(item.images)[0]] : "") + ')', backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' } },
                        React.createElement(hydrogen_1.Image, { data: (item.images && Object.keys(item.images).length > 0 ? item.images[Object.keys(item.images)[0]] : ""), aspectRatio: "1/1", style: { visibility: 'hidden' }, sizes: "(min-width: 45em) 20vw, 50vw" })),
                    React.createElement("div", { className: 'slider-lower-block' },
                        React.createElement("h4", null, item.title),
                        React.createElement("span", { className: 'price' },
                            "$",
                            item.variants[Object.keys(item.variants)[0]].price)))))));
}
exports.SingleItem = SingleItem;
function ProductItem(_a) {
    var product = _a.product, loading = _a.loading;
    var variant = product.variants.nodes[0];
    var variantUrl = variants_1.useVariantUrl(product.handle, variant.selectedOptions);
    return (React.createElement(react_1.Link, { className: "product-item", key: product.id, prefetch: "intent", to: variantUrl },
        product.featuredImage && (React.createElement(hydrogen_1.Image, { alt: product.featuredImage.altText || product.title, aspectRatio: "1/1", data: product.featuredImage, loading: loading, sizes: "(min-width: 45em) 400px, 100vw" })),
        React.createElement("h4", null, product.title),
        React.createElement("small", null,
            React.createElement(hydrogen_1.Money, { data: product.priceRange.minVariantPrice }))));
}
var PRODUCT_ITEM_FRAGMENT = "#graphql\n  fragment MoneyProductItem on MoneyV2 {\n    amount\n    currencyCode\n  }\n  fragment ProductItem on Product {\n    id\n    handle\n    title\n    featuredImage {\n      id\n      altText\n      url\n      width\n      height\n    }\n    priceRange {\n      minVariantPrice {\n        ...MoneyProductItem\n      }\n      maxVariantPrice {\n        ...MoneyProductItem\n      }\n    }\n    variants(first: 1) {\n      nodes {\n        selectedOptions {\n          name\n          value\n        }\n      }\n    }\n  }\n";
// NOTE: https://shopify.dev/docs/api/storefront/2022-04/objects/collection
var COLLECTION_QUERY = "#graphql\n  " + PRODUCT_ITEM_FRAGMENT + "\n  query Collection(\n    $handle: String!\n    $country: CountryCode\n    $language: LanguageCode\n    $first: Int\n    $last: Int\n    $startCursor: String\n    $endCursor: String\n  ) @inContext(country: $country, language: $language) {\n    collection(handle: $handle) {\n      id\n      handle\n      title\n      description\n      image {\n        url\n      }\n      products(\n        first: $first,\n        last: $last,\n        before: $startCursor,\n        after: $endCursor\n      ) {\n        nodes {\n          ...ProductItem\n        }\n        pageInfo {\n          hasPreviousPage\n          hasNextPage\n          endCursor\n          startCursor\n        }\n      }\n    }\n  }\n";
