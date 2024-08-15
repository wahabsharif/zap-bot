import type { NextApiRequest, NextApiResponse } from "next";
import puppeteer from "puppeteer";
import * as cheerio from "cheerio";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { username, password, captcha } = req.body;

      if (!username || !password || !captcha) {
        return res
          .status(400)
          .json({ error: "Username, password, and CAPTCHA are required" });
      }

      console.log("Starting Puppeteer script...");

      const browser = await puppeteer.launch({ headless: false });
      console.log("Browser launched");

      const page = await browser.newPage();
      console.log("New page created");

      await page.goto("https://blsitalypakistan.com/account/login");
      console.log("Navigated to login page");

      // Get page content
      const content = await page.content();
      const $ = cheerio.load(content);

      // Locate input fields by label or placeholder
      const usernameField = $('label:contains("Email ID:")')
        .next("div")
        .find("input");
      const passwordField = $('label:contains("Password:")')
        .next("div")
        .find("input");
      const captchaField = $('label:contains("Catpcha:")')
        .next("div")
        .find("input");
      const submitButton = $('button[name="submitLogin"]');

      if (
        usernameField.length === 0 ||
        passwordField.length === 0 ||
        captchaField.length === 0 ||
        submitButton.length === 0
      ) {
        return res
          .status(500)
          .json({ error: "Required form fields not found" });
      }

      const usernameFieldName = usernameField.attr("name");
      const passwordFieldName = passwordField.attr("name");
      const captchaFieldName = captchaField.attr("name");

      console.log("Filling in login credentials");
      await page.type(`input[name='${usernameFieldName}']`, username);
      await page.type(`input[name='${passwordFieldName}']`, password);

      // Handle CAPTCHA
      console.log("Entering CAPTCHA");
      await page.type(`input[name='${captchaFieldName}']`, captcha);

      // Click the login button
      console.log("Submitting the form");
      await page.click(`button[name='submitLogin']`);
      await page.waitForNavigation();

      console.log("Closing browser");
      await browser.close();

      res.status(200).json({ message: "Bot ran successfully" });
    } catch (error) {
      console.error("Error running bot:", error);
      let errorMessage = "An unknown error occurred";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      res
        .status(500)
        .json({ error: "Bot encountered an error", details: errorMessage });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
