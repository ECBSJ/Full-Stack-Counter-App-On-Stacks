# How to build a full-stack app on Stacks

This is a full-stack counter app built with Next.js on the front-end and with Clarity smart contracts deployed on Stacks mainnet.

This repo is only pertaining to the front-end client app. For the Clarinet project repo, which includes the smart contracts, go here.

This repo is part of a full end-to-end [tutorial](https://youtu.be/Z9JQU_sOQLQ) published on Hiro's Youtube channel.

## Steps

- Build Counter contract using Clarinet
- Implement SIP010 fungible COUNT token
- Debug and test contract code
- Iterate on contract in Clarinet's devnet
- Build front-end app
- Connect FE app to Leather wallet and devnet instance
- Register chainhook predicates on Hiro Platform
- Setup db to handle predicate payload events
- Handle db and state changes on the UI
- Setup mainnet deployment plan
- Deploy to mainnet
- Deploy FE app with Vercel
- Setup contract monitoring alerts

## Cloning this repo

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
