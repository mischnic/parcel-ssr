import * as React from "react";
import { Link, Route, Switch } from "react-router-dom";
import * as pages from "./pages/*.jsx";

const routes = Object.keys(pages).map((name) => {
  return {
    name,
    path: name === "Home" ? "/" : `/${name.toLowerCase()}`,
    component: pages[name].default,
  };
});

export function App() {
  return (
    <>
      <nav>
        <ul>
          {routes.map(({ name, path }) => {
            return (
              <li key={path}>
                <Link to={path}>{name}</Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <Switch>
        {routes.map(({ path, component: RouteComp }) => {
          return (
            <Route key={path} path={path}>
              <RouteComp />
            </Route>
          );
        })}
      </Switch>
    </>
  );
}
