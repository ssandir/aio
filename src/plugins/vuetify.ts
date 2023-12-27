/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import colors from 'vuetify/util/colors'

// Composables
import { createVuetify } from 'vuetify'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    themes: {
      main: {
        colors: {
          primary: colors.deepPurple.darken4,
          secondary: colors.blue.lighten5,
          error: colors.red.base,
          'builder-0': colors.blue.darken4,
          'builder-1': colors.teal.darken4,
          'builder-2': colors.cyan.darken4,
          'builder-3': colors.lightBlue.darken4,
          'builder-4': colors.green.darken4,
          'builder-5': colors.lightGreen.darken4,
          'builder-6': colors.lime.darken4
        }
      }
    }
  }
})
