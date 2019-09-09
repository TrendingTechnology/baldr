# Database layout

Database: sqlite3

## Table `files`

| Name      | Type        | Description                |
|-----------|-------------|----------------------------|
| path      | TEXT UNIQUE | Absolute Path              |
| filename  | TEXT        | The file name.             |
| extension | TEXT        | The extension of the file. |
| id        | TEXT UNIQUE | An unique identifer.       |
| data      | TEXT        | Stringified JSON object.   |
