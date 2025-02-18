import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Navigation } from "./screens";

const App = () => {
    return (
        <GestureHandlerRootView>
            <Navigation />
        </GestureHandlerRootView>
    );
};

export default App;
