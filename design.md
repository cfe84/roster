# Features

## Commands

- Add **person** --> _person added_
- Add **relationships** between **persons** --> _relationship added_
- Add **note** to a **person** --> _note added_
- Add **committment** to a **person** --> _committment added_

# Design

- Front end
    - Typescript
    - [Beauter](https://beauter.io/docs/start/)
    - Once compiled, served statically

- Back end
    - Rest API
        - Launch commands
        - Commands trigger events
    - Techs:
        - Dotnet core 2.2
        - Entity framework
        - Azure SQL PayGo

- Hosting
    - K8s
    - One pod
    - One container - dotnet core runtime 
    - One container - nginx
