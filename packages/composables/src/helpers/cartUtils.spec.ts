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
        const invalidLineItemId = "239c3529-9751-4d5b-90cd-c6b0af2cbf71";
        cart.messages = [{
            messageId: "239c3529-9751-4d5b-90cd-c6b0af2cbf74",
            severity: "Error",
            propertyBag:
                {
                    EntityType: "LineItem",
                    LineItemId: invalidLineItemId
                }
        }];
        lineItem.id = invalidLineItemId;
        const isValid = validateLineItem(cart, lineItem);
        expect(isValid).toBe(false);
    })
});