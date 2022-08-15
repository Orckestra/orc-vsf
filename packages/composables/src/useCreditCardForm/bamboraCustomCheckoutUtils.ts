
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
  static addListeners(controller: any, updateControllerCallback) {
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
        this.showErrorForId('card-number', event.message);
      } else if (event.field === 'cvv') {
        updateControllerCallback('isCVVComplete', false);
        this.showErrorForId('card-cvv', event.message);
      } else if (event.field === 'expiry') {
        updateControllerCallback('isExpiryComplete', false);
        this.showErrorForId('card-expiry', event.message);
      }
    });

    controller.on('complete', (event) => {
      if (event.field === 'card-number') {
        updateControllerCallback('isCardNumberComplete', true);
        this.hideErrorForId('card-number');
      } else if (event.field === 'cvv') {
        updateControllerCallback('isCVVComplete', true);
        this.hideErrorForId('card-cvv');
      } else if (event.field === 'expiry') {
        updateControllerCallback('isExpiryComplete', true);
        this.hideErrorForId('card-expiry');
      }
    });
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static showErrorForId(id, message) {
    const element = document.getElementById(id);
    if (element !== null) {
      const errorElement = document.getElementById(id + '-error');
      if (errorElement !== null) {
        errorElement.innerHTML = message;
      }

      const bootStrapParent = document.getElementById(id + '-bootstrap');
      if (bootStrapParent !== null) {
        bootStrapParent.classList.add('has-error');
        bootStrapParent.classList.remove('has-success');
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static hideErrorForId(id) {
    const element = document.getElementById(id);

    if (element !== null) {
      const errorElement = document.getElementById(id + '-error');
      if (errorElement !== null) {
        errorElement.innerHTML = '';
      }

      const bootStrapParent = document.getElementById(id + '-bootstrap');
      if (bootStrapParent !== null) {
        bootStrapParent.classList.remove('has-error');
        bootStrapParent.classList.add('has-success');
      }
    }
  }
}
