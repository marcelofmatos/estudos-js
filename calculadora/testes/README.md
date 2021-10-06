# Puppeteer Tester

This application is intended as an automated test routine

The tests use Puppeteer to interact with the interface. When finished,
it should be able test applications in different environments, such as
Virtual Machine, Cloud and local server.

## Installation and Usage

1) Clone the repo
2) Install dependencies

```
npm install --save
```

3) Run the application
```
APP_SERVER_URL=http://localhost:8008 APP_LOGIN_USER=root@localhost APP_LOGIN_PASSWORD=password node app.js
```

### Optional parameters

| PARAMETER | POSSIBLE VALUES | DESCRIPTION |
|-----------|---------|-------------|
| APP_RESULTS_BASE_PATH |\.\. or . or /somepath | directory base path to save screenshots and other log information |
| BROWSER_HEADLESS | true | If false, disables headless mode |
| TEST_ID |xxxxxxxxxxxxxxxxx | Useful if you want to reapeat a test with same user id |
| SCENARIOS | 10,20,21 | comma separated list of scenarios ids to be executed |


## Intended Features

The tests are meant to be modular in the sense that it should be
possible to test all views, a group of views or specific components.
