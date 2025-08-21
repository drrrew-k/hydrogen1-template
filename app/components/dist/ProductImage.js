"use strict";
exports.__esModule = true;
exports.ProductImage = void 0;
var hydrogen_1 = require("@shopify/hydrogen");
var react_medium_image_zoom_1 = require("react-medium-image-zoom");
require("react-medium-image-zoom/dist/styles.css");
function ProductImage(_a) {
    var image = _a.image;
    if (!image) {
        return React.createElement("div", { className: "product-image" });
    }
    console.log("IMMMAG");
    console.log(image);
    return (React.createElement("div", { className: "product-image" },
        React.createElement(react_medium_image_zoom_1["default"], null,
            React.createElement(hydrogen_1.Image, { alt: image.altText || 'Product Image', aspectRatio: "1/1", data: image, key: image.id, sizes: "(min-width: 45em) 50vw, 100vw" }))));
}
exports.ProductImage = ProductImage;
