export default class CardValidator {
  constructor() {
    this.input = document.querySelector('[data-cw-widget="input"]');
    this.hint = document.querySelector('.cw-widget_hitn');
    this.iconList = Array.from(document.getElementsByClassName('cw-widget__header__payment-system'));
    this.cardNumber = [];

    this.start();
  }

  start() {
    document.getElementById('validate').addEventListener('click', () => {
      this.cardNumber = this.input.value.split('');
      if (this.inputFilter()) this.validateCard();
    });

    this.input.addEventListener('input', () => {
      this.defineIcon(this.input.value);
    });
  }

  inputFilter() {
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < this.cardNumber.length; i++) {
      // eslint-disable-next-line no-restricted-globals
      if (isNaN(this.cardNumber[i]) || this.cardNumber[i] === ' ') {
        this.showHint('Please, enter only numbers', 'red');
        return false;
      }
    }

    if (this.input.value.length === 0) {
      this.showHint('Empty value', 'orange');
      return false;
    } if (this.cardNumber.length < 16) {
      this.showHint('The number is too short', 'orange');
      return false;
    }

    return true;
  }

  showHint(text, color) {
    this.hint.textContent = text;
    this.hint.style.color = color;
    setTimeout(() => {
      this.hint.textContent = '';
      this.hint.style.color = 'black';
    }, 3000);
  }

  defineIcon(n) {
    if (
      n.length === 0
            || (n.length === 1 && n !== '2')
            || (n.length === 1 && n !== '4')
    ) {
      // eslint-disable-next-line array-callback-return
      this.iconList.map((item) => {
        item.classList.remove('icon-hidden');
      });
    }

    let num = n;

    if (num.length > 1 && num[0] !== '4' && num.length > 1 && num[0] !== '2') {
      num = num.slice(0, 2);
    } else {
      num = num.slice(0, 1);
    }

    if (num === '2') { this.iconHidde('mir'); } else
    if (num === '30' || num === '36' || num === '38') { this.iconHidde('diners'); } else
    if (num === '31' || num === '35') { this.iconHidde('jcb'); } else
    if (num === '34' || num === '37') { this.iconHidde('american-express'); } else
    if (num === '4') { this.iconHidde('visa'); } else
    if (num === '50' || num === '56' || num === '57' || num === '58') { this.iconHidde('maestro'); } else
    if (num === '51' || num === '52' || num === '53' || num === '54' || num === '55') { this.iconHidde('master-card'); }
  }

  iconHidde(paymnetSystem) {
    // eslint-disable-next-line array-callback-return
    this.iconList.map((item) => {
      if (item.classList.contains(paymnetSystem)) {
        item.classList.remove('icon-hidden');
      } else {
        item.classList.add('icon-hidden');
      }
    });
  }

  validateCard() {
    let lever;

    if (this.cardNumber.length % 2 === 0) {
      lever = 0;
    } else {
      lever = 1;
    }

    let count = 0;
    this.cardNumber.forEach((item, i) => {
      if (i % 2 === lever) {
        let res = +item * 2;
        if (res > 9) {
          const str = `${res}`;
          res = +str[0] + +str[1];
          count += res;
        } else {
          count += res;
        }
      } else {
        count += +item;
      }
    });

    if (count % 10 === 0) {
      this.showHint('This card is valid', 'green');
    } else {
      this.showHint('This card is not valid', 'red');
    }
  }
}
