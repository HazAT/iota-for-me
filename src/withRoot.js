import React from 'react';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import indigo from 'material-ui/colors/indigo';
import pink from 'material-ui/colors/pink';
import Reboot from 'material-ui/Reboot';

// A theme with custom primary and secondary color.
// It's optional.
const theme = createMuiTheme({
  palette: {
    primary: indigo,
    secondary: pink
  }
});

function withRoot(Component) {
  function WithRoot(props) {
    // MuiThemeProvider makes the theme available down the React tree
    // thanks to React context.
    return (
      <MuiThemeProvider theme={theme}>
        {/* Reboot kickstart an elegant, consistent, and simple baseline to build upon. */}
        <Reboot />
        <Component {...props} />
      </MuiThemeProvider>
    );
  }

  return WithRoot;
}

export default withRoot;
