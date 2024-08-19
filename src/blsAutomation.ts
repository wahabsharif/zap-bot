const puppeteer = require("puppeteer");
const Tesseract = require("tesseract.js");
const Jimp = require("jimp");
const fs = require("fs");
const axios = require("axios"); // Add axios to handle HTTP requests

const MAX_RETRIES = 5; // Maximum number of retries
const emailSelector = 'input[placeholder="Enter Email"]';
const passwordSelector = 'input[name="login_password"]';
const captchaSelector = "#captcha_code_reg";
const loginButtonSelector = 'button[name="submitLogin"]';

async function preprocessImage(imageBuffer: Buffer, mimeType: string) {
  try {
    const image = await Jimp.read(imageBuffer);
    image
      .resize(300, Jimp.AUTO) // Resize to a larger size for better OCR accuracy
      .greyscale() // Convert to grayscale
      .contrast(0.7) // Increase contrast for better distinction
      .brightness(0.1) // Adjust brightness to make text stand out
      .normalize() // Normalize image
      .dither565() // Apply dithering to reduce color depth
      .invert() // Invert colors if text is light on dark background
      .blur(1) // Apply slight blur to reduce noise
      .contrast(1); // Apply additional contrast for text clarity

    // Save preprocessed image for debugging
    const preprocessedImagePath = `preprocessed_image.${mimeType.split("/")[1]}`;
    await image.writeAsync(preprocessedImagePath);
    console.log(`Preprocessed image saved as '${preprocessedImagePath}'`);

    return image.getBufferAsync(mimeType); // Return as the original MIME type
  } catch (error) {
    console.error("Error preprocessing image:", error);
    throw error;
  }
}

async function solveCaptcha(captchaImageBuffer: Buffer, mimeType: string) {
  try {
    const preprocessedImageBuffer = await preprocessImage(
      captchaImageBuffer,
      mimeType
    );
    console.log("Preprocessed image for CAPTCHA OCR.");

    const result = await Tesseract.recognize(preprocessedImageBuffer, "eng", {
      logger: (info: any) => console.log(info),
      tessedit_char_whitelist: "0123456789",
      oem: 1,
      psm: 6,
    });

    console.log(`CAPTCHA Solution: '${result.data.text.trim()}'`);
    return result.data.text.trim();
  } catch (error) {
    console.error("Error solving CAPTCHA with OCR:", error);
    throw error;
  }
}

async function loginWithRetries(page: any, retries: number) {
  try {
    console.log("Waiting for email input...");
    await page.waitForSelector(emailSelector, {
      visible: true,
      timeout: 60000,
    });
    console.log("Email input found. Typing email...");
    await page.type(emailSelector, "shahzaibalam127@gmail.com");

    console.log("Waiting for password input...");
    await page.waitForSelector(passwordSelector, {
      visible: true,
      timeout: 60000,
    });
    console.log("Password input found. Typing password...");
    await page.type(passwordSelector, "shahzaib000");

    console.log("Waiting for CAPTCHA image...");
    await page.waitForSelector("#Imageid", { visible: true, timeout: 60000 });
    console.log("CAPTCHA image found. Fetching CAPTCHA image URL...");
    const captchaImageUrl = await page.$eval(
      "#Imageid",
      (img: { src: any }) => img.src
    );
    console.log(`CAPTCHA Image URL: ${captchaImageUrl}`);

    console.log("Fetching CAPTCHA image...");
    const response = await axios({
      url: captchaImageUrl,
      responseType: "arraybuffer",
    });
    const captchaImageBuffer = Buffer.from(response.data);
    const mimeType = response.headers["content-type"];
    const captchaImagePath = `captcha_image.${mimeType.split("/")[1]}`;
    fs.writeFileSync(captchaImagePath, captchaImageBuffer);
    console.log(`CAPTCHA image saved as '${captchaImagePath}'`);

    console.log("Solving CAPTCHA...");
    const code = await solveCaptcha(captchaImageBuffer, mimeType);
    console.log(`CAPTCHA Code to Enter: '${code}'`);

    console.log("Waiting for CAPTCHA input...");
    await page.waitForSelector(captchaSelector, {
      visible: true,
      timeout: 60000,
    });
    console.log("CAPTCHA input found. Typing CAPTCHA code...");
    await page.focus(captchaSelector);
    await page.type(captchaSelector, code);

    console.log("Waiting for login button...");
    await page.waitForSelector(loginButtonSelector, {
      visible: true,
      timeout: 60000,
    });
    console.log("Login button found. Clicking login...");
    await page.click(loginButtonSelector);

    console.log("Waiting for navigation...");
    await page.waitForNavigation({ waitUntil: "networkidle0" });

    console.log("Login successful.");
  } catch (error) {
    console.error("Error during CAPTCHA handling or login:", error);
    if (retries > 0) {
      console.log(`Retrying... (${MAX_RETRIES - retries + 1}/${MAX_RETRIES})`);
      await page.reload({ waitUntil: "networkidle0" });
      await loginWithRetries(page, retries - 1);
    } else {
      console.error("Maximum retries reached. Login failed.");
      throw error;
    }
  }
}

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // Go to login page
  await page.goto("https://blsitalypakistan.com/account/login");

  // Attempt login with retries
  await loginWithRetries(page, MAX_RETRIES);

  // Do not close the browser automatically
  console.log(
    "Automation completed. The browser will remain open for inspection."
  );
})();
