# express-mongoose-boilerplate

express-mongoose-boilerplate is a boilerplate for a startup backend server with node express and mongo and OAuth for client authentication.

## Installation

Use the package manager [npm](https://www.npmjs.com/) to install express-mongoose-boilerplate.

```bash
git clone git@github.com:raashed/express-mongoose-boilerplate.git
cd express-mongoose-boilerplate
npm install
```

## Usage

First copy `.env.example` file as `.env`

```bash
cp .env.example .env
```

Make some changes on `.env` file 
Example: 

```dotenv
HOST_NAME   :   your-current-host-name
HOST_PORT   :   runnable-port-(3000)
CORS_ORIGIN :   "http://example1.com, http://example2.com"
```
Do some changes on your necessary config on this file. 

## Run

Run this project for development

```bash
npm run dev
```

Run this project for production

```bash
npm run start
```
NB: Please remember production run will use [`pm2`](https://pm2.keymetrics.io/). For smooth run, make sure you have installed `pm2` globally.



## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)
