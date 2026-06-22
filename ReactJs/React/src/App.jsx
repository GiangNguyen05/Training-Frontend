// import Main from "./Day1/components/Main.jsx";
// import UseEffectApp from "./Day3/components/UseEffectApp.jsx";
// import ListKey from "./Day4/components/ListKey.jsx";
// import EvenHandle from "./Day5/components/EventHandle.jsx";
// import CondiRender from "./Day6/components/CondiRender.jsx";
// import LRef from "./Day7/components/LRef.jsx";
// import UseContext from "./Day8/components/UseContext.jsx";
// import UseReducer from "./Day9/components/UseReducer.jsx";
import { BrowserRouter } from "react-router-dom";
import Router from "./Day10/Router.jsx";
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
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </>
  );
}
