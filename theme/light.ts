import { createTheme } from '@mui/material';

const lightTheme = createTheme({
    palette: {
      primary: {
        main: '#323232'
      },
      success: {
        main: '#4caf50'
      }
    },
    typography: {
      fontSize: 16,
      h3: {
        fontWeight: 700,
        fontSize: '2.2rem'
      },
      h4: {
        fontWeight: 700,
        fontSize: '1.75rem'
      },
      h5: {
        fontWeight: 500
      },
      h6: {
        fontWeight: 500
      },
      body1: {
        fontSize: '1.1rem'
      }
    }
  })

  export default lightTheme;