"use strict";
exports.__esModule = true;
exports.AddToCartButton = void 0;
var hydrogen_1 = require("@shopify/hydrogen");
function AddToCartButton(_a) {
    var analytics = _a.analytics, children = _a.children, className = _a.className, disabled = _a.disabled, lines = _a.lines, onClick = _a.onClick;
    return (React.createElement(hydrogen_1.CartForm, { route: "/cart", inputs: { lines: lines }, action: hydrogen_1.CartForm.ACTIONS.LinesAdd }, function (fetcher) { return (React.createElement(React.Fragment, null,
        React.createElement("input", { name: "analytics", type: "hidden", value: JSON.stringify(analytics) }),
        React.createElement("button", { className: className, type: "submit", onClick: onClick, disabled: disabled !== null && disabled !== void 0 ? disabled : fetcher.state !== 'idle' }, children))); }));
}
exports.AddToCartButton = AddToCartButton;
