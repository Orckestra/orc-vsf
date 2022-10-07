## Create a new version of the template(Manual)
- Run `yarn` & `yarn build` for the main project
- Open the Linux terminal in your folder with projects (For windows, you can open WSL terminal, the current version of the toll has an issue with the Windows file path) and type the command
```console
npx @vue-storefront/cli generate template
```
- Type path to `theme` project
```console
? What's the path to the integration theme? (./) ./orc-vsf/packages/theme/
```

- Type output folder to the template, for example, 'orc-vsf-template'
```console
? How would you like to name the output folder?  orc-vsf-template 
```

- (Optional) copy `node_modules` & `yarn.lock` to the template
- Run `yarn` in the template folder
- Run `yarn build` and `yarn start` to validate the template
