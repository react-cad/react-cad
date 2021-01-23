# %PACKAGE_NAME% - a @react-cad component

Add a description of your CAD component here.

## Getting started

Install the dependencies:

```
yarn install
```

And start the development server:

```
yarn start
```

A @react-cad preview window should open up in your default browser.

Open `src/Example.tsx` in your favourite editor (if you don't have a favourite, VSCode had good Typescript integration). Here you can see how the CAD model is composed of primitive shapes like spheres and boxes, transformations like translations and rotations, and boolean operations like unions and differences. Make some changes and they should automatically be reflected in the preview.

Also take a look at `src/Example.stories.tsx`. This isn't part of the CAD model, but it defines whether and how this component is presented in the preview window. You don't need to create a story file for every component you build, but it can make development easier. It will also enable others to customise your model directly in the browser, and download a version with their customisations.
