<h1 align="center" style="text-align:center;">
    <img src="./assets/crown.ico" alt="kings-vault-logo" />
    <br />
    King's Vault
</h1>

<p align="center">
  <b>The Only Password Manager and Password Generator that You Need</b>
  <br>
  <sub>Made with ❤️ by <a href="https://github.com/Luka-stack">Lukasz Rafa (Luka-stack)</a></sub>
</p>

<br />

# ❯ Table of contents

- [Introduction](#-introduction)
- [Installation](#-installation)
- [Get the app](#-get-the-app)
- [Extending](#-extending)
- [Electron React Boilerplate](#-electron-react-boilerplate)
- [Bugs](#-bugs)
- [License](#-license)

# ❯ Introduction

The <b>King's Vault</b> is a password manager app. <b>Kings's Vault</b> allows its users to create an account and store their passwords. It is equipped with a system to generate passwords and rank them based on the time needed to crack them (it takes the rainbow table under consideration). Additionally, it can track password age and inform the user which ones should be updated. <b>King's Vault</b> is intended to use for multiple users. Every account has its own private passwords but users can create public passwords that are visible to everyone but can be edited only by the creator. Public passwords are visible on the landing page and on one of the pages in the user's view.

# ❯ Installation

## GitHub project

You can download project directly from this github page. After downloading (and unziping) the only thing you need to do are:

1. install required modules

```bash
npm install
```

2. package project

```bash
npm run package
```

After some time, finished product will be in <i>realse\build</i> folder.

# ❯ Get the app

The app is available: [`kingsvault-win64-v.2.0.0.zip`](https://github.com/Luka-stack/kings-vault/releases/download/Latest/kingsvault-win64-v.2.0.0.zip)
<br/>
<sub>SHA-256: `29f14ccd54868f7933b2c26b8af9a7da4282d6d33505828e9f240bd52e71c714`</sub>

# ❯ Extending

I'm strongly encouraged you to download, add new features and customize this project however you want.

## Running

To run project simple type:

```bash
npm start
```

It starts electron and its servs react frontend.

## Backend

All of backend code sits in <i>src/main</i> folder.

## Frontend

Frontend is fully created with react. All of the frontend code is available under <i>src/rendered</i> folder.

## Adding Dependencies

All of the dependencies are divided so called native modules (related to backend) and the rest (mainly frontend modules or types):

1. Native Modules are described as node dependencies that are written in C++, C or Rust ([Read more in ERB Docs](https://electron-react-boilerplate.js.org/docs/native-modules)) are added to package.json in <i>release\app</i> folder.
2. All of the other dependencies (react deps, types etc.) are added to package.json in main project folder as dev dependencies ([Read more in ERB Docs](https://electron-react-boilerplate.js.org/docs/adding-dependencies))

# ❯ Electron React Boilerplate

This project is based on Fundation prepared and maintain by [Electron React Boilerplate](https://electron-react-boilerplate.js.org/) group.

The whole project can be found here [ERB GitHub](https://github.com/electron-react-boilerplate/electron-react-boilerplate)

# ❯ Bugs

## [Issues](https://github.com/Luka-stack/kings-vault/issues)

# ❯ License

## [MIT](LICENSE)
