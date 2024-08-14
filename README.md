# Bot Desktop App

This is a desktop application built with Electron, Node.js, Next.js, Tailwind CSS, and TypeScript. The bot automates various tasks, including logging in, filling forms, handling CAPTCHAs, and more.

## Features

1. **Auto-Login**: Automatically logs in to the website.
2. **Auto Form Fill**: Automatically fills out forms on the website.
3. **Auto ReLogin**: Automatically re-logins if the session expires.
4. **Auto Page Refresh**: Continuously refreshes the page to check for available appointments.
5. **Auto Card Details Entry**: Automatically enters card details during the payment process.
6. **Unlimited CAPTCHA Handling**: Handles an unlimited number of CAPTCHA challenges.
7. **Siren on Payment Page**: Triggers a siren when the bot reaches the payment page.
8. **Error Handling**: Includes robust error handling mechanisms.

## Summary

Simply double-click the executable file to run the bot. The bot will manage everything, from logging in to entering payment details. The only manual action required is entering the OTP, which will be prompted by a siren sound.

## Instructions

1. **Clone the repository**:

```bash

git clone https://github.com/wahabsharif/zap-bot.git

```

2. **Installation**:

```bash

npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. **Start the development**:

```bash

npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. **Run the Electron app**:

```bash
npm run electron
# or
yarn run electron
# or
pnpm run electron
# or
bun run electron

```

## Building the Electron App

1. **Build the Next.js app:**

```bash

npm run build
# or
yarn run build
# or
pnpm run build
# or
bun run build

```

2. **Package the Electron app:**

```bash

npm run electron-pack
# or
yarn run electron-pack
# or
pnpm run electron-pack
# or
bun run electron-pack

```
