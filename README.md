# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

## Local Setup

The back-end can be ran in a separate terminal. This is done in Catbank/node-postgres through running:

### `node index.js`

The local database used for this project has been Postgres.

Two tables should be created in a Database called 'catbank' with the following schemas:

### Creating accounts table

-- Table: public.accounts

-- DROP TABLE IF EXISTS public.accounts;

CREATE TABLE IF NOT EXISTS public.accounts
(
"accountNumber" integer NOT NULL,
password text COLLATE pg_catalog."default" NOT NULL,
silveuros text COLLATE pg_catalog."default",
CONSTRAINT accounts_pkey PRIMARY KEY ("accountNumber")
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.accounts
OWNER to postgres;

### Creating transaction history table

-- Table: public.transactions

-- DROP TABLE IF EXISTS public.transactions;

CREATE TABLE IF NOT EXISTS public.transactions
(
"accountNumberSentFrom" integer NOT NULL,
"accountNumberSentTo" integer NOT NULL,
"amountSent" text COLLATE pg_catalog."default" NOT NULL,
created_dtm time without time zone DEFAULT now(),
CONSTRAINT "fk_accountNumber" FOREIGN KEY ("accountNumberSentFrom")
REFERENCES public.accounts ("accountNumber") MATCH SIMPLE
ON UPDATE CASCADE
ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.transactions
OWNER to postgres;

## Updating Constants

The host URL should be reflected in `src\constants.js`

.sample.env in Catbank/node-postgres should be renamed to .env

An example of all the values filled in are:
HOST_PORT=3001
POOL_PORT=5432
DB_HOST=localhost
DB_USER=myuser
DB_NAME=catbank
DB_PASSWORD=catbank
SILVEURO_PROMOTION=100
SECRET_KEY=7a6127d73b01ec155f417fe9d4e79b6a7caa059ccf1d16049990152a8f26c44f
