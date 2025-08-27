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
exports.loader = void 0;
var remix_runtime_1 = require("@netlify/remix-runtime");
/**
 * Automatically creates a new cart based on the URL and redirects straight to checkout.
 * Expected URL structure:
 * ```js
 * /cart/<variant_id>:<quantity>
 *
 * ```
 *
 * More than one `<variant_id>:<quantity>` separated by a comma, can be supplied in the URL, for
 * carts with more than one product variant.
 *
 * @example
 * Example path creating a cart with two product variants, different quantities, and a discount code in the querystring:
 * ```js
 * /cart/41007289663544:1,41007289696312:2?discount=HYDROBOARD
 *
 * ```
 */
function loader(_a) {
    var _b;
    var request = _a.request, context = _a.context, params = _a.params;
    return __awaiter(this, void 0, void 0, function () {
        var cart, lines, linesMap, url, searchParams, discount, discountArray, result, cartResult, headers;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    cart = context.cart;
                    lines = params.lines;
                    if (!lines)
                        return [2 /*return*/, remix_runtime_1.redirect('/cart')];
                    linesMap = lines.split(',').map(function (line) {
                        var lineDetails = line.split(':');
                        var variantId = lineDetails[0];
                        var quantity = parseInt(lineDetails[1], 10);
                        return {
                            merchandiseId: "gid://shopify/ProductVariant/" + variantId,
                            quantity: quantity
                        };
                    });
                    url = new URL(request.url);
                    searchParams = new URLSearchParams(url.search);
                    discount = searchParams.get('discount');
                    discountArray = discount ? [discount] : [];
                    return [4 /*yield*/, cart.create({
                            lines: linesMap,
                            discountCodes: discountArray
                        })];
                case 1:
                    result = _c.sent();
                    cartResult = result.cart;
                    if (((_b = result.errors) === null || _b === void 0 ? void 0 : _b.length) || !cartResult) {
                        throw new Response('Link may be expired. Try checking the URL.', {
                            status: 410
                        });
                    }
                    headers = cart.setCartId(cartResult.id);
                    // redirect to checkout
                    if (cartResult.checkoutUrl) {
                        return [2 /*return*/, remix_runtime_1.redirect(cartResult.checkoutUrl, { headers: headers })];
                    }
                    else {
                        throw new Error('No checkout URL found');
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.loader = loader;
function Component() {
    return null;
}
exports["default"] = Component;
