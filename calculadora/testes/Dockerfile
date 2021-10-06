FROM node

ENV APP_SERVER_URL=http://localhost:8008
ENV APP_LOGIN_USER=root@localhost
ENV APP_LOGIN_PASSWORD=ligero
# build number from CI 
ENV BUILD_NUMBER=${BUILD_NUMBER:-0}
ENV BROWSER_HEADLESS=true
ENV SHOW_BROWSER_CONSOLE_LOG=true
ENV APP_RESULTS_BASE_PATH=/app/screenshots


# Install latest chrome dev package, which installs the necessary libs to # make the bundled version of Chromium that Puppeteer installs work. 
RUN apt update \ 
    && apt install -y wget --no-install-recommends \
    && apt install -y libxtst6 libxss1 \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt update \
    && apt install -y --no-install-recommends google-chrome-unstable libx11-xcb-dev libxcb-dri3-0 \
    && rm -rf /var/lib/apt/lists/* \
    && wget --quiet https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh -O /usr/sbin/wait-for-it.sh \
    && chmod +x /usr/sbin/wait-for-it.sh 

COPY . /app

WORKDIR /app

RUN mkdir /app/screenshots

RUN npm install --save

# change default timeout (system cache is toooo slow)
RUN sed -i 's/DEFAULT_TIMEOUT = 30000/DEFAULT_TIMEOUT = 300000/g' node_modules/puppeteer/lib/*/puppeteer/common/TimeoutSettings.js

CMD /app/run.sh