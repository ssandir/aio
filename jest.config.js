// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleFileExtensions: [
    'js',
    'ts',
    'json',
    'vue'
  ],
  transform: {
    '^.+\\.vue$': 'vue-jest',
    '^.+\\.ts$': 'ts-jest'
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$'
  // setupFiles: ['<rootDir>/tests/unit/setup.ts']
}

/* TBD
// tests/unit/setup.ts
import Vue from 'vue';
import Vuetify from 'vuetify'; // or your UI library
import 'vuetify/dist/vuetify.css'; // or your UI library styles

Vue.use(Vuetify);

// Optionally, add any global setup or configuration here */
