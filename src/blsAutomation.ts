const puppeteer = require("puppeteer");
const Tesseract = require("tesseract.js");
const Jimp = require("jimp");
const fs = require("fs");

async function preprocessImage(imageBuffer: Buffer) {
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
    await image.writeAsync("preprocessed_image.png");
    console.log("Preprocessed image saved as 'preprocessed_image.png'");

    return image.getBufferAsync(Jimp.MIME_PNG); // Return as PNG
  } catch (error) {
    console.error("Error preprocessing image:", error);
    throw error;
  }
}

async function solveCaptcha(captchaImageBuffer: Buffer) {
  try {
    // Preprocess the CAPTCHA image
    const preprocessedImageBuffer = await preprocessImage(captchaImageBuffer);

    // Convert buffer to base64 string
    const base64Image = preprocessedImageBuffer.toString("base64");
    const captchaImageUrl = `data:image/png;base64,${base64Image}`;

    return new Promise((resolve, reject) => {
      Tesseract.recognize(captchaImageUrl, "eng", {
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

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // Go to login page
  await page.goto("https://blsitalypakistan.com/account/login");

  // Selectors based on the HTML structure provided
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
  try {
    await page.waitForSelector("#Imageid"); // Wait for CAPTCHA image to load
    const captchaImageSrc = await page.evaluate(() => {
      const captchaElement = document.querySelector("#Imageid");
      return captchaElement instanceof HTMLImageElement
        ? captchaElement.src
        : "";
    });

    if (!captchaImageSrc) {
      throw new Error("CAPTCHA image source not found.");
    }
    console.log(`CAPTCHA Image URL: ${captchaImageSrc}`);

    // Download CAPTCHA image
    const response = await page.goto(captchaImageSrc, {
      waitUntil: "networkidle0",
    });
    const captchaImageBuffer = await response.buffer();

    // Debug: Save CAPTCHA image for inspection
    fs.writeFileSync("captcha_image.png", captchaImageBuffer);
    console.log("CAPTCHA image saved as 'captcha_image.png'");

    // Solve CAPTCHA
    const code = await solveCaptcha(captchaImageBuffer);

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
    await page.waitForSelector(captchaSelector, {
      visible: true,
      timeout: 60000,
    }); // Increase timeout to 60 seconds
    await page.click(loginButtonSelector);
    await page.waitForNavigation();

    // Rest of your automation logic goes here
    // ...
  } catch (error) {
    console.error("Error during CAPTCHA handling:", error);
  }

  // Close the browser
  await browser.close();
})();
