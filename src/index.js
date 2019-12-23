import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Dashboard from "./Dashboard";
import * as serviceWorker from "./serviceWorker";
import {ThemeProvider} from "styled-components";
import localforage from "localforage";
import {VisitedWrapper} from "./CodesContext";
import "rsuite/dist/styles/rsuite-default.css";

const theme = {
    breakpoints: {
        xs: "0px",
        sm: "576px",
        md: "768px",
        lg: "992px",
        xl: "1200px",
    },
};

localforage.setDriver(localforage.LOCALSTORAGE);

const App = () => (
    <ThemeProvider theme={theme}>
        <VisitedWrapper>
            <Dashboard />
        </VisitedWrapper>
    </ThemeProvider>
);

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
