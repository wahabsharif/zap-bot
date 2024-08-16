const puppeteer = require("puppeteer");
const Tesseract = require("tesseract.js");
const Jimp = require("jimp");
const fs = require("fs");
const axios = require("axios"); // Add axios to handle HTTP requests

const MAX_RETRIES = 5; // Maximum number of retries

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
    // Preprocess the CAPTCHA image
    const preprocessedImageBuffer = await preprocessImage(
      captchaImageBuffer,
      mimeType
    );

    return new Promise((resolve, reject) => {
      Tesseract.recognize(preprocessedImageBuffer, "eng", {
        logger: (info: any) => console.log(info), // Optional: Log progress
        tessedit_char_whitelist: "0123456789", // Limit Tesseract to recognize only numbers
        oem: 1, // Use LSTM OCR Engine
        psm: 6, // Assume a single uniform block of text
      })
        .then(({ data: { text } }: { data: { text: string } }) => {
          console.log(`CAPTCHA Solution: '${text}'`);
          resolve(text.trim());
        })
        .catch((error: any) => {
          console.error("Error solving CAPTCHA with OCR:", error);
          reject(error);
        });
    });
  } catch (error) {
    console.error("Error solving CAPTCHA:", error);
    throw error;
  }
}

async function loginWithRetries(page: any, retries: number) {
  try {
    const emailSelector = 'input[placeholder="Enter Email"]';
    const passwordSelector = 'input[name="login_password"]';
    const captchaSelector = "#captcha_code_reg"; // Updated selector for CAPTCHA input
    const loginButtonSelector = 'button[name="submitLogin"]';

    // Login
    await page.waitForSelector(captchaSelector, {
      visible: true,
      timeout: 60000,
    }); // Increase timeout to 60 seconds
    await page.type(emailSelector, "shahzaibalam127@gmail.com");

    await page.waitForSelector(captchaSelector, {
      visible: true,
      timeout: 60000,
    }); // Increase timeout to 60 seconds
    await page.type(passwordSelector, "shahzaib000");

    // Handle CAPTCHA
    await page.waitForSelector("#Imageid"); // Wait for CAPTCHA image to load

    // Get CAPTCHA image URL
    const captchaImageUrl = await page.$eval(
      "#Imageid",
      (img: { src: any }) => img.src
    );

    console.log(`CAPTCHA Image URL: ${captchaImageUrl}`); // Log URL for debugging

    // Fetch the CAPTCHA image from URL
    const response = await axios({
      url: captchaImageUrl,
      responseType: "arraybuffer", // Get the response as a buffer
    });
    const captchaImageBuffer = Buffer.from(response.data);

    // Debug: Save CAPTCHA image for inspection
    const mimeType = response.headers["content-type"];
    const captchaImagePath = `captcha_image.${mimeType.split("/")[1]}`;
    fs.writeFileSync(captchaImagePath, captchaImageBuffer);
    console.log(`CAPTCHA image saved as '${captchaImagePath}'`);

    // Solve CAPTCHA
    const code = await solveCaptcha(captchaImageBuffer, mimeType);

    // Debug: Ensure CAPTCHA code is correct
    console.log(`CAPTCHA Code to Enter: '${code}'`);

    // Ensure CAPTCHA input field is visible and focused
    await page.waitForSelector(captchaSelector, {
      visible: true,
      timeout: 60000,
    }); // Increase timeout to 60 seconds
    await page.focus(captchaSelector);
    await page.type(captchaSelector, code);
    console.log(`Entered CAPTCHA code: ${code}`);

    // Click the login button
    await page.waitForSelector(loginButtonSelector, {
      visible: true,
      timeout: 60000,
    }); // Increase timeout to 60 seconds
    await page.click(loginButtonSelector);
    await page.waitForNavigation();

    console.log("Login successful.");
  } catch (error) {
    console.error("Error during CAPTCHA handling or login:", error);
    if (retries > 0) {
      console.log(`Retrying... (${MAX_RETRIES - retries + 1}/${MAX_RETRIES})`);
      await page.reload(); // Reload the page and retry
      await loginWithRetries(page, retries - 1); // Recursive call with decremented retries
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
