# Backend for the MFSA service

## Installation and local launch

1. Clone this repo: `git clone https://github.com/mahhis/fe1p-back`
2. Create `.env` with the environment variables listed below
3. Run `yarn` in the root folder
4. Run `yarn start`

## Environment variables

| Name                 | Description                              |
| -------------------- | ---------------------------------------- |
| `PORT`               | Port to run server                       |
| `JWT_ACCESS_SECRET`  | Key for generating an access token       |
| `JWT_REFRESH_SECRET` | Key for generating an refresh token      |
| `SMTP_HOST`          | SMTP server host for email               |
| `SMPT_PORT`          | SMTP server port for email               |
| `SMPT_USER`          | SMTP server username for email           |
| `SMPT_PASSWORD`      | SMTP server password for email           |
| `MONGO`              | MongoDB connection string                |

