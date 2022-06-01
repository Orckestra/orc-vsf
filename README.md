<div align="center">
  <img src="https://user-images.githubusercontent.com/1626923/137092657-fb398d20-b592-4661-a1f9-4135db0b61d5.png" alt="Vue Storefront" height="80px" />
</div>

# Vue Storefront 2 integration for Orckestra Commerce Platform

------


## Requirements

- Node 16+
- Yarn

## Getting Started

1. Clone this repository
```sh
git clone https://github.com/Orckestra/orc-vsf
```

2. Install all required dependencies

```sh
yarn install
```

3. Create `.env `file and set up variables (find `.env.example` and specify your values)
```sh
OVERTURE_URL=
OVERTURE_AUTH_TOKEN=
OVERTURE_SCOPE_NAME=
OVERTURE_INVENTORY_LOCATION_IDS=
SECRET_PASSPHRASE=
```

For security purpose, it is important to configure `SECRET_PASSPHRASE` which  it used to encrypt user tokens.

4. Build:

```sh
yarn build
```

5. If everything built properly, you can start working on your new frontend with:

```sh
yarn dev
```

Changing some parts of the code (notably the `api-client`) will trigger a re-build but the change will not be hot-reloaded. To ensure that the app sees you changes, re-run either `yarn build` or `yarn dev`.


## Feature support

| Feature | Status | Notes |
| --- | --- | --- |
| Sign in | TODO | |
| Sign up | TODO | |
| Account | TODO | |
| Product catalog with facets | Available | 
| Product details page with variants | Available | |
| Product details page - Related Products | Available | |
| Cart | Available | |
| Checkout | TODO | |
| Checkout - Shipping methods | TODO | |
| Checkout - Payment methods | TODO | |
| Wishlists | TODO | Available only for logged in users.|

------

## Resources

- [Vue Storefront Documentation](https://docs.vuestorefront.io/v2/)
- [orc-vsf integration Documentation](https://docs.vuestorefront.io/orc-vsf)
- [Community Chat](https://discord.vuestorefront.io)

## Support

If you have any questions about this integration we will be happy to answer them on `orc-vsf` channel.

## Contributors ✨

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
