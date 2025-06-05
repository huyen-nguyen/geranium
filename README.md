# Geranium

<h1 align="center">
  <img src="./assets/logo-mag.svg" alt="geranium logo" width="120">
  <br>geranium
</h1>

<p align="center">
  <i>Genomic data visualization retrieval for authoring with multimodality</i>
</p>

## Overview

Geranium is a multimodal retrieval system that helps researchers efficiently find genomics visualization examples using image, text, or specification-based queries. Search results function as adaptable templates/scaffolds that researchers can modify with their own data and design preferences.

<img width="1795" alt="image" src="https://github.com/user-attachments/assets/1d7be5b0-9a9a-40e4-9d56-ba67279895c0" />


## Features

- **Flexible query approaches**: Choose your preferred search method - example images, natural language queries, or partial Gosling specification queries for precise visualization retrieval

- **Adaptable visualization scaffolds**: Search results function as modifiable templates, not just static examples

- **Integrated live editor**: Edit and customize retrieved visualizations directly within the application

- **Triplet output**: Each resulting visualization is returned as a triplet of image, text, and its corresponding Gosling specification

- **Diverse Collection**: The collection spans single-view to multi-view visualizations for specialized genomic applications like epigenomics and structural variation analysis

<img width="2371" alt="image" src="https://github.com/user-attachments/assets/74ad67ab-59b7-447e-9a5b-8e1fdef67584" />


<img width="2371" alt="image" src="https://github.com/user-attachments/assets/a02469e8-9878-494d-b751-e87171f945bf" />


## Installation

The application consists of two components: a server and a client that need to be run separately.

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

Alternatively, if using uv package manager:
    ```
    uv pip install -r requirements.txt
    ```

4. Start the server:

    ```
    flask --app app.py run
    ```
   
Alternatively, to allow auto-refresh upon changes in server code:

    flask --app app.py --debug run

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

Once started, the client will be available at http://localhost:5173/

### Usage ⚠️

After both the server and client are running, open your browser and navigate to http://localhost:5173/ to start using Geranium.

- Make sure to enable virtual environment first at the `server` folder: `source .venv/bin/activate`

- Make sure the server is running before accessing the client.

- The client will attempt to interact with the backend hosted by Flask on its default port.


## Contributing

Contributions are welcome! If you'd like to contribute, please open an issue or submit a pull request.

