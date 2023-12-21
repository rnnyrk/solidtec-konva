import { Validate, ValidationRule } from 'react-hook-form';

export type ValidationMap = {
  [name: string]:
    | { validate: Validate<string, any> }
    | ValidationRule
    | Record<string, ValidationRule>;
};

// Use a function here, so the values of the object van be typed, but the keys can be inferred
const createValidationMap = <T extends ValidationMap>(validation: T) => validation;

export const validation = createValidationMap({
  required: {
    required: 'Dit veld is verplicht',
  },
  phone: {
    pattern: {
      value: /^0[1-9]\d{8}$/i,
      message: 'Vul een geldig telefoonnummer in',
    },
    maxLength: {
      value: 10,
      message: 'U mag maximaal 10 cijfers invoeren',
    },
    minLength: {
      value: 10,
      message: 'U moet minimaal 10 cijfers invoeren',
    },
  },
  email: {
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: 'Vul een geldig email adres in',
    },
  },
  noDigits: {
    pattern: {
      value: /^([^0-9]*)$/,
      message: 'Naam mag geen nummers bevatten',
    },
  },
  url: {
    pattern: {
      value:
        /^(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})$/i,
      message: 'Vul een geldige URL in',
    },
  },
  hex: {
    pattern: {
      value: /^#[0-9a-f]{3,6}$/i,
      message: 'Vul een hex kleurcode in (bijv. #FFFFFF)',
    },
  },
  number: {
    pattern: {
      value: /^\d+$/,
      message: 'Dit veld mag alleen nummers bevatten',
    },
  },
  date: {
    pattern: {
      value: /^(0?[1-9]|[12][0-9]|3[01])[-](0?[1-9]|1[012])[-]\d{4}$/,
      message: 'Vul een geldige datum in',
    },
  },
  address: {
    pattern: {
      value: /^(?=.*[A-Za-z])(?=.*[0-9])[A-Za-z0-9]+$/,
      message: 'Vul een adres in',
    },
  },
  password: {
    pattern: {
      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\^$*.[\]{}()?\-"!@#%&/,><':;|_~`])\S{8,99}$/,
      message:
        'Wachtwoord moet tenminste 8 karakters, 1 hoofdletter, 1 kleine letter, 1 cijfer en 1 speciaal karakter bevatten',
    },
    minLength: {
      value: 8,
      message:
        'Wachtwoord moet tenminste 8 karakters, 1 hoofdletter, 1 kleine letter, 1 cijfer en 1 speciaal karakter bevatten',
    },
  },
  postalCode: {
    pattern: {
      value: /^[1-9][0-9]{3} ?(?!sa|sd|ss)[a-z]{2}$/i,
      message: 'Vul een geldige postcode in',
    },
    validate: (value: string) => {
      const postalCode = value.replace(/\s/g, '').replace(/_/g, '').toUpperCase();

      if (postalCode.length !== 6) {
        return 'U heeft een foutieve postcode ingevuld.';
      }

      return true;
    },
  },
});
