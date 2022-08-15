
export default class bamboraCustomCheckoutUtils {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static createInputs(controller: any) {
    // Create and mount the inputs
    controller.create('card-number',
      { placeholder: 'Card number', brands: ['visa', 'mastercard'] }
    ).mount('#card-number');

    controller.create('cvv', { placeholder: 'CVV' }).mount('#card-cvv');
    controller.create('expiry', { placeholder: 'MM / YY' }).mount('#card-expiry');
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static addListeners(controller: any, updateControllerCallback, updateErrorCallback) {
    controller.on('brand', (event) => {
      let cardLogo = 'none';
      if (event.brand && event.brand !== 'unknown') {
        const filePath =
          'https://cdn.na.bambora.com/downloads/images/cards/' +
          event.brand +
          '.svg';
        cardLogo = 'url(' + filePath + ')';
      }
      document.getElementById('card-number').style.backgroundImage = cardLogo;
    });

    controller.on('error', (event) => {
      console.log('error: ' + JSON.stringify(event));

      if (event.field === 'card-number') {
        updateControllerCallback('isCardNumberComplete', false);
        updateErrorCallback('cardNumber', event.message);
      } else if (event.field === 'cvv') {
        updateControllerCallback('isCVVComplete', false);
        updateErrorCallback('cvv', event.message);
      } else if (event.field === 'expiry') {
        updateErrorCallback('expiry', event.message);
        updateControllerCallback('isExpiryComplete', false);
      }
    });

    controller.on('complete', (event) => {
      if (event.field === 'card-number') {
        updateControllerCallback('isCardNumberComplete', true);
        updateErrorCallback('cardNumber', null);
      } else if (event.field === 'cvv') {
        updateControllerCallback('isCVVComplete', true);
        updateErrorCallback('cvv', null);
      } else if (event.field === 'expiry') {
        updateControllerCallback('isExpiryComplete', true);
        updateErrorCallback('expiry', null);
      }
    });
  }
}
