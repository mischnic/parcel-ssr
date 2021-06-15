// @flow
const fs = require("fs");
const path = require("path");
const express = require("express");
const static = require("serve-static");
const requireFresh = require("import-fresh");

async function createServer(
  root = process.cwd(),
  isProd = process.env.NODE_ENV === "production"
) {
  let app = express();

  if (process.env.NODE_ENV !== "production") {
    let bundler = new (require("@parcel/core").default)({
      entries: __dirname,
      defaultConfig: require.resolve("@parcel/config-default"),
      // mode: 'production',
      mode: "development",
      additionalReporters: [
        { packageName: "@parcel/reporter-cli", resolveFrom: __filename },
      ],
      hmrOptions: { port: 3001 },
    });

    await bundler.watch();
  }

  app.use(
    static(path.join(__dirname, "dist-client"), {
      index: false,
    })
  );

  app.use("*", async (req, res) => {
    try {
      const url = req.originalUrl;

      // $FlowFixMe
      // TODO this doesn't do hot reaload
      let server;
      if (process.env.NODE_ENV !== "production") {
        server = requireFresh("./dist-server/index.js");
      } else {
        server = require("./dist-server/index.js");
      }
      let context = {};
      let appHtml = server.render(url, context);

      if (context.url) {
        // Somewhere a `<Redirect>` was rendered
        return res.redirect(301, context.url);
      }

      let template = fs.readFileSync("./dist-client/index.html", "utf8");

      let html = template.replace(`<!--SSR-->`, appHtml);

      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (e) {
      console.log(e);
      res.status(500).end(e.stack);
    }
  });

  return app;
}

createServer().then((app) =>
  app.listen(3000, () => {
    console.log("http://localhost:3000");
  })
);
