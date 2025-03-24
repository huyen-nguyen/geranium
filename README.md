<h1 align="center">
  <img src="./assets/logo-mag.svg" alt="geranium logo" width="120">
  <br>geranium
</h1>

<p align="center">
  <i>genomic data visualization retrieval for authoring with multimodality</i>
</p>

### Server

```
    cd server

    # create virtual environment (if haven't already)
    python3 -m venv .venv

    # activate virtual environment and install package requirements
    source .venv/bin/activate
    python3 -m pip install -r requirements.txt
```

Alternatively, if you use `uv`:

```
uv pip install -r requirements.txt
```

Run the server:

```
flask --app app.py run
```
