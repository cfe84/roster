# Features

## Use cases

- Login
- Lock with PIN-code.
- Add **person**
- Add **note** to a **person**
- Manage **deadlines** (promotions, raises, trainings, etc.)
- Manage **actions** from both sides.
- Add **committment** to a **person**
- Logout

# Design

- Front end
    - Typescript
    - [Beauter](https://beauter.io/docs/start/)
    - Once compiled, served statically

- Back end
    - Rest API
        - Limited to POST /events and GET /events?from=id
    - Techs:
        - Probably just node/ts to re-use front-end code
        - Probably something like blob storage or table storage for event log. Most likely table, to do range queries. Unless we can do it with blob.

- Hosting
    - K8s
    - One pod
    - One container - dotnet core runtime 
    - One container - nginx
