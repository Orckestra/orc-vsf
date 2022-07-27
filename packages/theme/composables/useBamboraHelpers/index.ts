
const useBamboraHelpers = () => ({
  isCardNumberComplete: false,
  isCVVComplete: false,
  isExpiryComplete: false,
  customCheckout: null,
  isComplete: false,

  init: function(customCheckout: any) {
    this.customCheckout = customCheckout;
    console.log('checkout.init()');
    this.createInputs();
    this.addListeners();
  },
  createInputs: function() {
    console.log('checkout.createInputs()');

    // Create and mount the inputs
    this.customCheckout.create('card-number',
      { placeholder: 'Card number', brands: ['visa', 'mastercard'] }
    ).mount('#card-number');

    this.customCheckout.create('cvv', { placeholder: 'CVV' }).mount('#card-cvv');

    this.customCheckout.create('expiry', { placeholder: 'MM / YY' }).mount('#card-expiry');
  },
  addListeners: function() {
    // listen for submit button
    if (document.getElementById('checkout-form') !== null) {
      document
        .getElementById('checkout-form')
        .addEventListener('submit', () => this.onSubmit);
    }

    this.customCheckout.on('brand', (event) => {
      console.log('brand: ' + JSON.stringify(event));

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

    this.customCheckout.on('blur', function(event) {
      console.log('blur: ' + JSON.stringify(event));
    });

    this.customCheckout.on('focus', function(event) {
      console.log('focus: ' + JSON.stringify(event));
    });

    this.customCheckout.on('empty', (event) => {
      console.log('empty: ' + JSON.stringify(event));

      if (event.empty) {
        if (event.field === 'card-number') {
          this.isCardNumberComplete = false;
        } else if (event.field === 'cvv') {
          this.isCVVComplete = false;
        } else if (event.field === 'expiry') {
          this.isExpiryComplete = false;
        }
        this.setPayButton(false);
      }
    });

    this.customCheckout.on('complete', (event) => {
      console.log('complete: ' + JSON.stringify(event));

      if (event.field === 'card-number') {
        this.isCardNumberComplete = true;
        this.hideErrorForId('card-number');
      } else if (event.field === 'cvv') {
        this.isCVVComplete = true;
        this.hideErrorForId('card-cvv');
      } else if (event.field === 'expiry') {
        this.isExpiryComplete = true;
        this.hideErrorForId('card-expiry');
      }

      this.setPayButton(
        this.isCardNumberComplete && this.isCVVComplete && this.isExpiryComplete
      );

      if (this.isComplete) {
        this.createToken();
      }
    });

    this.customCheckout.on('error', (event) => {
      console.log('error: ' + JSON.stringify(event));

      if (event.field === 'card-number') {
        this.isCardNumberComplete = false;
        this.showErrorForId('card-number', event.message);
      } else if (event.field === 'cvv') {
        this.isCVVComplete = false;
        this.showErrorForId('card-cvv', event.message);
      } else if (event.field === 'expiry') {
        this.isExpiryComplete = false;
        this.showErrorForId('card-expiry', event.message);
      }
      this.setPayButton(false);
    });
  },
  onSubmit: function(event) {
    console.log('checkout.onSubmit()');

    event.preventDefault();
    this.setPayButton(false);
    this.toggleProcessingScreen();

    this.createToken();
  },
  createToken: function() {
    console.log('checkout.createToken()');
    this.customCheckout.createToken((result) => {
      console.log('token result : ' + JSON.stringify(result));

      if (result.error) {
        this.processTokenError(result.error);
      } else {
        this.processTokenSuccess(result.token);
      }
    });
  },
  hideErrorForId: function(id) {
    console.log('hideErrorForId: ' + id);

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
    } else {
      console.log('showErrorForId: Could not find ' + id);
    }
  },
  showErrorForId: function(id, message) {
    console.log('showErrorForId: ' + id + ' ' + message);

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
    } else {
      console.log('showErrorForId: Could not find ' + id);
    }
  },
  setPayButton: function (enabled) {
    this.isComplete = enabled;
  },
  toggleProcessingScreen: function() {
    const processingScreen = document.getElementById('processing-screen');
    if (processingScreen) {
      processingScreen.classList.toggle('visible');
    }
  },
  showErrorFeedback: function(message) {
    const xMark = '\u2718';
    this.feedback = document.getElementById('feedback');
    this.feedback.innerHTML = xMark + ' ' + message;
    this.feedback.classList.add('error');
  },
  showSuccessFeedback: function(message) {
    const checkMark = '\u2714';
    this.feedback = document.getElementById('feedback');
    this.feedback.innerHTML = checkMark + ' ' + message;
    this.feedback.classList.add('success');
  },
  processTokenError: function(error) {
    error = JSON.stringify(error, undefined, 2);
    console.log('processTokenError: ' + error);

    this.showErrorFeedback(
      'Error creating token: </br>' + JSON.stringify(error, null, 4)
    );
    this.setPayButton(true);
    this.toggleProcessingScreen();
  },
  processTokenSuccess: function(token) {
    console.log('processTokenSuccess: ' + token);

    this.showSuccessFeedback('Success! Created token: ' + token);
    this.setPayButton(true);
    this.toggleProcessingScreen();

    // Use token to call payments api
    // this.makeTokenPayment(token);
  }
});

export default useBamboraHelpers;
