
> ⚠️ NOTE: This app is not production ready at the moment. I'm currently working on the first release since developing v0.1.0 a few months ago. You can track the progress of this effort [👉 here 👈](https://github.com/petpal-project/web/milestone/1).

# pet-planner-frontend 🐸
Web application for petPal, a cross-platform application for managing your pets feeding and medication schedules. Originally part of devCodeCamp Capstone Project.
Written in React, interfaces with [backend REST API](http://github.com/99xtal/pet-planner-api). 


## Features

***Users & Authentication***: 
- Users can create an account, or log into their existing account
- Authentication managed via JWT

***Pet Profiles***:
- Create a profile for each of your pets to start tracking their health
- Track events and record memories by logging events

***Customizable Dashboard***:
- Create your own custom dashboard with informational widgets
- Choose widgets from each of your pet profiles to add to your dashboard

## Development
```
git clone https://github.com/99xtal/pet-planner-frontend.git
cd pet-planner-frontend
yarn install
```
This project uses [Vite](https://vitejs.dev/) as a dev server and build tool.

To run the development server:
```
yarn dev
```

To generate a production build:
```
yarn build
```

## Deployment
Deployment for this project is managed by [Vercel](http://vercel.com)

