# Database layout

Database: sqlite3

## Table `files`

| Name      | Type        | Description                |
|-----------|-------------|----------------------------|
| path      | TEXT UNIQUE | Absolute Path              |
| filename  | TEXT        | The file name.             |
| id        | TEXT UNIQUE | An unique identifer.       |
