"use strict";
exports.__esModule = true;
exports.ProductForm = void 0;
var react_1 = require("react");
var react_2 = require("@remix-run/react");
var hydrogen_1 = require("@shopify/hydrogen");
var AddToCartButton_1 = require("~/components/AddToCartButton");
var Aside_1 = require("~/components/Aside");
function ProductForm(_a) {
    var product = _a.product, selectedVariant = _a.selectedVariant, variants = _a.variants;
    var open = Aside_1.useAside().open;
    var navigate = react_2.useNavigate();
    var _b = react_1.useState(1), countItems = _b[0], setCountItems = _b[1];
    //VariantSelector: https://shopify.dev/docs/storefronts/headless/hydrogen/cart/variant-selector
    var removeItem = function () {
        setCountItems(countItems - 1);
    };
    var addItem = function () {
        setCountItems(countItems + 1);
    };
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { className: "product-form" },
            React.createElement(hydrogen_1.VariantSelector, { handle: product.handle, options: product.options.filter(function (option) { return option.values.length > 1; }), variants: variants }, function (_a) {
                var option = _a.option;
                return (React.createElement(React.Fragment, null,
                    React.createElement("div", { className: "product-options", key: option.name },
                        React.createElement("p", { className: 'bold' }, option.name),
                        React.createElement("div", { className: "product-options-grid" },
                            React.createElement("div", { className: "dropdown-wrapper" },
                                React.createElement("select", { className: "dropdown custom", onChange: (function (e) {
                                        navigate(e.target[e.target.selectedIndex].getAttribute('data-link'));
                                        // return redirect(e.target[e.target.selectedIndex].getAttribute('data-link'));
                                    }) }, option.values.map(function (_a) {
                                    var value = _a.value, isAvailable = _a.isAvailable, isActive = _a.isActive, to = _a.to;
                                    return (React.createElement("option", { "data-link": to, key: option.name + value, value: value }, value));
                                })))))));
            }),
            React.createElement("div", { className: "product-options" },
                React.createElement("p", null,
                    React.createElement("strong", null, "Quantity")),
                React.createElement("div", { className: "product-options-grid" },
                    React.createElement("div", { className: "count-input-wrapper" },
                        React.createElement("div", { className: 'btn-count q-remove', onClick: function (e) { removeItem(); } },
                            React.createElement("p", null, "-")),
                        React.createElement("input", { type: "text", className: "custom count-input", value: countItems, onChange: (function (e) { setCountItems(parseInt(e.target.value)); }) }),
                        React.createElement("div", { className: 'btn-count q-add', onClick: function (e) { addItem(); } },
                            React.createElement("p", null, "+"))))),
            React.createElement(AddToCartButton_1.AddToCartButton, { className: "btn_addtocart", disabled: !selectedVariant || !selectedVariant.availableForSale, onClick: function () {
                    open('cart');
                }, lines: selectedVariant
                    ? [
                        {
                            merchandiseId: selectedVariant.id,
                            quantity: countItems,
                            selectedVariant: selectedVariant
                        },
                    ]
                    : [] }, (selectedVariant === null || selectedVariant === void 0 ? void 0 : selectedVariant.availableForSale) ? 'Add to cart' : 'Sold out'))));
}
exports.ProductForm = ProductForm;
function ProductOptions(_a) {
    var option = _a.option;
    return (React.createElement("div", { className: "product-options", key: option.name },
        React.createElement("h5", null, option.name),
        React.createElement("div", { className: "product-options-grid" }, option.values.map(function (_a) {
            var value = _a.value, isAvailable = _a.isAvailable, isActive = _a.isActive, to = _a.to;
            return (React.createElement(react_2.Link, { className: "product-options-item", key: option.name + value, prefetch: "intent", preventScrollReset: true, replace: true, to: to, style: {
                    border: isActive ? '1px solid black' : '1px solid transparent',
                    opacity: isAvailable ? 1 : 0.3
                } }, value));
        })),
        React.createElement("br", null)));
}
