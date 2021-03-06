module.exports = {
  purge: ['./src/**/*.tsx'],
  important: false,
  theme: {
    fontFamily: {
      body: ['Open Sans', 'sans-serif'],
    },
    screens: {
      xxs: '280px',
      xs: '380px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
    },

    colors: {
      primary: '#19626A',
      secondary: '#3B3B3B',
      transparent: 'transparent',
      black: '#000',
      white: '#fff',
      gray: {
        '100': '#f5f5f5',
        '200': '#eeeeee',
        '300': '#e0e0e0',
        '400': '#bdbdbd',
        '500': '#9e9e9e',
        '600': '#757575',
        '700': '#616161',
        '800': '#424242',
        '900': '#212121',
      },
      blue: {
        '100': '#ebf8ff',
        '200': '#bee3f8',
        '300': '#90cdf4',
        '400': '#63b3ed',
        '500': '#4299e1',
        '600': '#3182ce',
        '700': '#2b6cb0',
        '800': '#2c5282',
        '900': '#2a4365',
      },
      error: '#c01f34',
    },
    spacing: {
      px: '1px',
      '0': '0',
      '1': '5px',
      '2': '10px',
      '3': '15px',
      '4': '20px',
      '5': '25px',
      '6': '30px',
      '7': '35px',
      '8': '40px',
      '9': '45px',
      '10': '50px',
      '12': '60px',
      '16': '80px',
      '20': '100px',
      '24': '120px',
    },
    extend: {
      backgroundImage: theme => ({
        'search-icon': "url('/src/assets/svgs/search.svg')",
      }),
      screens: {
        print: { raw: 'print' },
      },
      maxWidth: {
        '1/4': '25%',
        '1/2': '50%',
        '3/4': '75%',
        '1110': '1110px',
      },
      maxHeight: {
        '0': '0',
        '1/4': '25%',
        '1/2': '50%',
        '3/4': '75%',
      },
      height: {
        '10%': '10%',
        '20%': '20%',
        '30%': '30%',
        '40%': '40%',
        '50%': '50%',
        '60%': '60%',
        '70%': '70%',
        '80%': '80%',
        '90%': '90%',
        full: '100%',
        '100px': '100px',
        '80px': '80px',
        '60px': '60px',
      },
      fontSize: {
        '1xl': '1.3rem',
      },
    },
    backgroundColor: theme => theme('colors'),
    textColor: theme => theme('colors'),
  },
  variants: {
    backgroundColor: ['responsive', 'hover', 'focus', 'group-hover'],
    fontWeight: ['last'],
    textDecoration: ['last', 'group-hover'],
    outline: ['focus', 'hover'],
    borderRadius: ['responsive', 'hover', 'focus'],
  },
};
