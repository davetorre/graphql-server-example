# graphql-server-example

Building on top of https://www.apollographql.com/docs/apollo-server/getting-started

## Run it
```
npm start
```

## Links
BE subscriptions: https://www.apollographql.com/docs/apollo-server/data/subscriptions/

FE subscriptions: https://the-guild.dev/graphql/apollo-angular/docs/data/subscriptions

BE PubSub tools: https://www.apollographql.com/docs/apollo-server/data/subscriptions/#production-pubsub-libraries


## Questions
Seems that we need to define types twice: once in the graphql schema and once in typescript.
What makes sure these types line up? There is a library called type-graphql