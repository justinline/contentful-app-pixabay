# Contentful - Pixabay Image Search app

App sharing link: https://app.contentful.com/deeplink?link=apps&id=64T0XzVrPFmXQl6jnP3QZn

- Uses a "Short text, list" field in the content model to store the images
- Requires `VITE_PIXABAY_API_KEY` in .env to be set to use the pixabay image search functionality

The user flow for this app is - right now - quite prescriptive, but it could be built upon depending on the needs of the intended demo audience.
- Users can select multiple images from a single search term only
- Users can remove images individually once chosen
- Users can re-choose the images (however this overwrites all previous images)

I could imagine a more flexible flow where users can select multiple images from multiple search terms, and edit this after initial selection without overwriting previous images, but I kept it simple for now.

## Decisions

- I added `zod` for runtime type validation of the content coming from contentful
- I added biome for formatting/linting since it's a quick setup
- I switched to `function Component()` over `const Component = () => {}` for the locations folder so that I could hoist sub-components that were defined lower down in the modules, to keep the coupled things together.
- I used mock service worker to mock api responses forthe pixabay api in test environments. This library could also be set up to run in the browser if building demo's ahead of endpoints/functionalities being available


## Other thoughts/feedback

- The most confusing thing was working out how to create a content model on a new account, requiring the developer mode switched on wasn't obvious since i'm used to just having it available. Might be worth adding a note in the pdf instructions, unless it's meant to be part of the challenge!
- The build currently exposes the pixabay api key, which is not ideal - not sure if contentful has ways to better handle environment variables in apps
- I wanted to use the f36 `<Image/>` component, but the skeleton only loads without a `src` which we always have in this flow, so instead I went with `<img>` + custom loading styling
- With regards to styling, I went with inline `style` props, this is what I saw most in the examples I could find across the web. It was a little limiting in terms of UI design however.

## How to use

Execute create-contentful-app with npm, npx or yarn to bootstrap the example:

```bash
# npx
npx create-contentful-app --example vite-react

# npm
npm init contentful-app --example vite-react

# Yarn
yarn create contentful-app --example vite-react
```

## Available Scripts

In the project directory, you can run:

#### `npm start`

Creates or updates your app definition in Contentful, and runs the app in development mode.
Open your app to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.

#### `npm run build`

Builds the app for production to the `dist` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.
Your app is ready to be deployed!

#### `npm run upload`

Uploads the `dist` folder to Contentful and creates a bundle that is automatically activated.
The command guides you through the deployment process and asks for all required arguments.
Read [here](https://www.contentful.com/developers/docs/extensibility/app-framework/create-contentful-app/#deploy-with-contentful) for more information about the deployment process.

#### `npm run upload-ci`

Similar to `npm run upload` it will upload your app to contentful and activate it. The only difference is  
that with this command all required arguments are read from the environment variables, for example when you add
the upload command to your CI pipeline.

For this command to work, the following environment variables must be set:

- `CONTENTFUL_ORG_ID` - The ID of your organization
- `CONTENTFUL_APP_DEF_ID` - The ID of the app to which to add the bundle
- `CONTENTFUL_ACCESS_TOKEN` - A personal [access token](https://www.contentful.com/developers/docs/references/content-management-api/#/reference/personal-access-tokens)

## Libraries to use

To make your app look and feel like Contentful use the following libraries:

- [Forma 36](https://f36.contentful.com/) – Contentful's design system
- [Contentful Field Editors](https://www.contentful.com/developers/docs/extensibility/field-editors/) – Contentful's field editor React components

## Using the `contentful-management` SDK

In the default create contentful app output, a contentful management client is
passed into each location. This can be used to interact with Contentful's
management API. For example

```js
// Use the client
cma.locale.getMany({}).then((locales) => console.log(locales));
```

Visit the [`contentful-management` documentation](https://www.contentful.com/developers/docs/extensibility/app-framework/sdk/#using-the-contentful-management-library)
to find out more.

## Learn More

[Read more](https://www.contentful.com/developers/docs/extensibility/app-framework/create-contentful-app/) and check out the video on how to use the CLI.
