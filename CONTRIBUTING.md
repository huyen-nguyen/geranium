# Contributing

We greatly appreciate your contribution to this project! If you'd like to contribute, please open a [new issue](https://github.com/gosling-lang/geranium/issues/new) or submit a [pull request](https://github.com/gosling-lang/geranium/pulls). Please see guidelines below.

## Commit Messages
Please use [commitlint](https://github.com/conventional-changelog/commitlint#what-is-commitlint) to maintain commit messages in a consistent manner.

The allowed pattern of commit messages is:

```sh
type(scope?): subject  # scope is optional; multiple scopes are supported (current delimiter options: "/", "\" and ",")
```

where `type` can be either `feat`, `fix`, `ci`, `chore`, `docs`, `perf`, `refactor`, or `test`.

## Installation

```sh
git clone https://github.com/gosling-lang/geranium.git # Clone the repository to your current directory
cd geranium                                            # Navigate to geranium repository
```

The application consists of two components: a server and a client that need to be run separately. 

Please make sure the server is running before accessing the client, default at http://localhost:5173/. The client will attempt to interact with the backend hosted by Flask on its default port at http://localhost:5000.

### Server Installation

1. Navigate to the server directory:

    ```
    cd server
    ```
2. Create and activate a Python virtual environment:

    ```
    python3 -m venv .venv
    source .venv/bin/activate
    ```

3. Install the required dependencies:
    ```
    python3 -m pip install -r requirements.txt
    ```

4. Start the server:

    ```
    flask --app app.py run
    ```

The server will start on http://localhost:5000 by default.

### Client Installation

1. Open a new terminal and navigate to the client directory:

    ```
    cd client
    ```

2. Install the necessary dependencies:

    ```
    npm install
    ```

3. Start the client application:

    ```
    npm run dev
    ```

Once started, you can open http://localhost:5173/ in a web browser to run the search engine.
