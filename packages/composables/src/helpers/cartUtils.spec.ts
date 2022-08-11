import { validateLineItem } from './cartUtils';
import { describe, expect } from '@jest/globals';

let cart = { messages : null,
    customerId: null,
    name: "",
    shipments: null,
    subTotal: null,
    taxTotal: null,
    merchandiseTotal: null,
    total: null,
    fulfillmentCost: null,
    fulfillmentCostWithoutDiscount: null,
    fulfillmentLevelDiscountTotal: null,
    scopeId: null,
    status: null,
    lineItemsTotalWithoutDiscount: null,
    lineItemLevelDiscount: null,
    lineItemsTotal: null,
    itemCount: null,
    discountTotal: null,
    subTotalDiscount: null,
    customer: null,
    payments: null};

let lineItem = {
        id: "239c3529-9751-4d5b-90cd-c6b0af2cbf78",
        productSummary: null,
        quantity: null,
        listPrice: null,
        currentPrice: null,
        defaultListPrice: null,
        regularPrice: null,
        defaultPrice: null,
        placedPrice: null,
        discountAmount: null,
        total: null,
        status: null,
        sku: null,
        kvaValues: null,
        totalWithoutDiscount: null,
        productDefinitionName: null,
        productId: null,
        variantId: null,
        recurringOrderProgramName: null,
        recurringOrderFrequencyName: null,
        isGiftItem: null,
        rewards: null
    }
let lineItems =  [
{
    id: "d548b705-904c-49be-9a8c-6e84cacb1771",
    productSummary: null,
    quantity: null,
    listPrice: null,
    currentPrice: null,
    defaultListPrice: null,
    regularPrice: null,
    defaultPrice: null,
    placedPrice: null,
    discountAmount: null,
    total: null,
    status: null,
    sku: null,
    kvaValues: null,
    totalWithoutDiscount: null,
    productDefinitionName: null,
    productId: null,
    variantId: null,
    recurringOrderProgramName: null,
    recurringOrderFrequencyName: null,
    isGiftItem: null,
    rewards: null
},
lineItem
];

describe('validateLineItem', () => {
    test('WHEN_no_message_in_cart_SHOULD_return_all_valid_line_item', () => {
        // Arrange
        // Act
        const filteredLineItems = lineItems.filter(item => !validateLineItem(cart, item));
        // Assert
        expect(filteredLineItems.length).toBe(lineItems.length);
    }),
    test('WHEN_lineItem_invalid_in_message_SHOULD_return_false', () => {
        const lineItemId = "239c3529-9751-4d5b-90cd-c6b0af2cbf71";
        cart.messages = [{
            messageId: "239c3529-9751-4d5b-90cd-c6b0af2cbf74",
            severity: "Error",
            propertyBag:
                {
                    EntityType: "LineItem",
                    LineItemId: lineItemId
                }
        }];
        lineItem.id = lineItemId;
        const isValid = validateLineItem(cart, lineItem);
        expect(isValid).toBe(false);
    }),
    test('WHEN_message_is_not_error_SHOULD_ignore_message', () => {
        const lineItemId = "239c3529-9751-4d5b-90cd-c6b0af2cbf71";
        cart.messages = [{
            messageId: "239c3529-9751-4d5b-90cd-c6b0af2cbf74",
            severity: "Unspecified",
            propertyBag:
                {
                    EntityType: "LineItem",
                    LineItemId: lineItemId
                }
        }];
        lineItem.id = lineItemId;
        const isValid = validateLineItem(cart, lineItem);
        expect(isValid).toBe(true);
    }),
    test('WHEN_message_has_no_entityType_SHOULD_ignore_message', () => {
        const lineItemId = "239c3529-9751-4d5b-90cd-c6b0af2cbf71";
        cart.messages = [{
            messageId: "239c3529-9751-4d5b-90cd-c6b0af2cbf74",
            severity: "Unspecified",
            propertyBag:
                {
                    LineItemId: lineItemId
                }
        }];
        lineItem.id = lineItemId;
        const isValid = validateLineItem(cart, lineItem);
        expect(isValid).toBe(true);
    }),
    test('WHEN_message_has_other_entityType_than_lineitem_SHOULD_ignore_message', () => {
        const lineItemId = "239c3529-9751-4d5b-90cd-c6b0af2cbf71";
        cart.messages = [{
            messageId: "239c3529-9751-4d5b-90cd-c6b0af2cbf74",
            severity: "Unspecified",
            propertyBag:
                {
                    EntityType: 12,
                    LineItemId: lineItemId
                }
        }];
        lineItem.id = lineItemId;
        const isValid = validateLineItem(cart, lineItem);
        expect(isValid).toBe(true);
    }),
    test('WHEN_message_has_no_lineItemId_SHOULD_ignore_message', () => {
        const lineItemId = "239c3529-9751-4d5b-90cd-c6b0af2cbf71";
        cart.messages = [{
            messageId: "239c3529-9751-4d5b-90cd-c6b0af2cbf74",
            severity: "Unspecified",
            propertyBag:
                {
                    EntityType: "LineItem"
                }
        }];
        lineItem.id = lineItemId;
        const isValid = validateLineItem(cart, lineItem);
        expect(isValid).toBe(true);
    }),
    test('WHEN_lineItem_is_not_marked_as_invalid_SHOULD_return_true', () => {
        const lineItemId = "239c3529-9751-4d5b-90cd-c6b0af2cbf71";
        cart.messages = [{
            messageId: "239c3529-9751-4d5b-90cd-c6b0af2cbf74",
            severity: "Unspecified",
            propertyBag:
                {
                    EntityType: "LineItem",
                    LineItemId: "339c3529-9751-4d5b-90cd-c6b0af2cbf71"
                }
        }];
        lineItem.id = lineItemId;
        const isValid = validateLineItem(cart, lineItem);
        expect(isValid).toBe(true);
    }),
    test('WHEN_lineItem_is_not_in_stock_SHOULD_return_false', () => {
        const lineItemId = "239c3529-9751-4d5b-90cd-c6b0af2cbf71";
        cart.messages = [{
            messageId: "239c3529-9751-4d5b-90cd-c6b0af2cbf74",
            severity: "Unspecified",
            propertyBag:
                {
                    EntityType: "LineItem",
                    LineItemId: lineItemId
                }
        }];
        lineItem.id = lineItemId;
        lineItem.status = "Invalid status";
        const isValid = validateLineItem(cart, lineItem);
        expect(isValid).toBe(false);
    }),
    test('WHEN_lineItem_is_in_stock_and_not_marked_invalid_SHOULD_return_true', () => {
        const lineItemId = "239c3529-9751-4d5b-90cd-c6b0af2cbf71";
        cart.messages = [{
            messageId: "239c3529-9751-4d5b-90cd-c6b0af2cbf74",
            severity: "Unspecified",
            propertyBag:
                {
                    EntityType: "LineItem",
                    LineItemId: "239c3529-9751-4d5b-90cd-c6b0af2cbf74"
                }
        }];
        lineItem.id = lineItemId;
        lineItem.status = "InStock";
        const isValid = validateLineItem(cart, lineItem);
        expect(isValid).toBe(true);
    })
});