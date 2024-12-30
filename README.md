[![portfolio](.github/images/project-thumbnail.png)](https://chicane.erickfrederick.com)

# chicane-doc

### tl;dr

```
git clone https://github.com/pepeien/chicane-doc.git
cd chicane-doc/
npm install
npm run dev
```

Then open [http://localhost:3000/](http://localhost:3000/) to see your app. The initial structure of your app is setup. You may need to add a few `.env` variables read **Adding environment variables** for more.

### Adding environment variables

|  Variable  | Description                       |  Type   | Required |
| :--------: | :-------------------------------  | :-----: | :------: |
| FETCH_REVALIDATION_INTERVAL  | Revalidation interval in seconds | String |    ✅    |
| TWITTER_HANDLE               | Twitter handle                   | String |    ✅    |
| BLOB                         | App data BLOB                    | String |    ✅    |

### Localization

Locales supported by the application:

- `en-us`;
- `ja-jp`;
- `pt-br`.

### Blob

This is the Blob structure

#### References

- A file at `{BLOB}/references/metadata.json` will need to follow this template:

```json
[
    {
        "title":    {REFRENCE_TITLE}    [string],
        "path":     {REFRENCE_PATH}     [string],
        "file": {
            "source":    {REFRENCE_FILE_SOURCE}    [string],
            "namespace": {REFRENCE_FILE_NAMESPACE} [string] - OPTIONAL
        },
        "children": {REFRENCE_CHILDREN} [Reference[]] - OPTIONAL
    }
]
```

Now you are ready to use the project, just issue a `npm run dev` and you're good to go

## About the Project

This project is related to the [Chicane](https://github.com/pepeien/chicane) game engine, documentation.

## Development

Install dependencies:

```sh
npm install
```

```sh
npm run dev
```
