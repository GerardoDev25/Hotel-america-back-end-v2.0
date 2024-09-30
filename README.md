# Hotel-america-back-end-v2.0
this is a project about a hotel manager system that i was try to do before but i couldn't so let do it now


## Before to start

make sure you have installed this tools on your machine

* Node v20.13 or greater
* yarn v1.22 or greater
* Docker v27.2.0


## Run in development mode

1. clone the repo
2. rename the file __.env.template__ to __.env__ and fill the fields
3. run database execute ```yarn docker:up``` command
4. migrate database execute ```yarn prisma:migrate``` command
4. migrate database execute ```yarn prisma:generate``` command
5. populate database execute ```yarn seed``` command
6. run application ```yarn dev```

## Run in test mode

1. clone the repo
2. rename the file __.env.template__ to __.env.test__ and fill the fields
3. run database execute ```yarn docker:test-up``` command
4. migrate database execute ```yarn prisma:migrate-test``` command
4. migrate database execute ```yarn prisma:generate-test``` command
5. run tests ```yarn test:watch``` or ```yarn test:coverage```
