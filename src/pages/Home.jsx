import * as React from "react";

export default function Home() {
  return (
    <h1>
      Home
      <br />
      <img src={new URL("../logo.png", import.meta.url)} />
    </h1>
  );
}
