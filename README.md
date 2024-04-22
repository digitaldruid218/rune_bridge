# Nuxt 3 Minimal Starter

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

Containing
``` textmate
CSS, Buttons    :   Vuetify, Tailwind CSS
Global Store    :   Vuex, Pinia
Backend         :   MongoDB Connect
Web3            :   Xverse Wallet
```

## Setup

Make sure to install the dependencies:

```bash
# pnpm
pnpm install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# pnpm
pnpm run dev
```

## Production

Build the application for production:

```bash
# pnpm
pnpm run build
```

Locally preview production build:

```bash
# pnpm
pnpm run preview
```

BUILD & DEPLOY PROCESS
```bash
#Anydesk-325549823 [NGINX]
cd /home/datarepublic2/zusd-front-01
git pull

#패키지 변경 있으면
pnpm i

pnpm run build

# pm2 돌아가고 있는 id 체크후
pm2 restart 0

#안해도됨
sudo service nginx restart 

```


Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
