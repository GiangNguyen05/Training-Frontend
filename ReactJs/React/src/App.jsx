// import Main from "./Day1/components/Main.jsx";
// import UseEffectApp from "./Day3/components/UseEffectApp.jsx";
// import ListKey from "./Day4/components/ListKey.jsx";
// import EvenHandle from "./Day5/components/EventHandle.jsx";
// import CondiRender from "./Day6/components/CondiRender.jsx";
// import LRef from "./Day7/components/LRef.jsx";
// import UseContext from "./Day8/components/UseContext.jsx";
// import UseReducer from "./Day9/components/UseReducer.jsx";
// import { BrowserRouter } from "react-router-dom";
// import Router from "./Day10/Router.jsx";
// import CustomHook from "./Day11/components/CusTomHook.jsx";
// import CustomHook from "./Day12/components/CustomHook.jsx";
// import UseMain from "./Day13/components/UseMain.jsx";
// import UseApi from "./Day14/components/UseApi.jsx";
// import Form from "./Day15/components/Form.jsx";
// import LoginForm from "./Day16/components/LoginForm.jsx";
// import MainNote from "./NoteApp/components/MainNote.jsx";

// import MainCart from "./ReduxToolkit/Demo/components/MainCart.jsx";
// import { Provider } from "react-redux";
// import { store } from "./ReduxToolkit/Demo/app/store.js";

// import UserList from "./ReduxToolkit/Day18/components/UserList.jsx";
// import { Provider } from "react-redux";
// import { store } from "./ReduxToolkit/Day18/app/store.js";

// import PlayList from "./ReduxToolkit/Day19/components/PlayList.jsx";
// import { Provider } from "react-redux";
// import { store } from "./ReduxToolkit/Day19/app/store.js";

// import MainSong from "./ReduxToolkit/Day20/components/MainSong.jsx";
// import { Provider } from "react-redux";
// import { store } from "./ReduxToolkit/Day20/app/store.js";

import MainApp from "./ReduxToolkit/WeatherApp/components/MainApp.jsx";
import { Provider } from "react-redux";
import { store } from "./ReduxToolkit/WeatherApp/app/store.js";

export default function App() {
  return (
    <>
      {/* <Main /> */}
      {/* <UseEffectApp /> */}
      {/* <ListKey /> */}
      {/* <EvenHandle /> */}
      {/* <CondiRender /> */}
      {/* <LRef /> */}
      {/* <UseContext /> */}
      {/* <UseReducer /> */}
      {/* <BrowserRouter>
        <Router />
      </BrowserRouter> */}
      {/* <CustomHook /> */}
      {/* <CustomHook /> */}
      {/* <UseMain /> */}
      {/* <UseApi /> */}
      {/* <Form /> */}
      {/* <LoginForm /> */}
      {/* <MainNote /> */}
      {/* <Provider store={store}>
        <MainCart />
      </Provider> */}
      {/* <Provider store={store}>
        <UserList />
      </Provider> */}
      {/* <Provider store={store}>
        <PlayList />
      </Provider> */}
      {/* <Provider store={store}>
        <MainSong />
      </Provider> */}
      <Provider store={store}>
        <MainApp />
      </Provider>
    </>
  );
}
