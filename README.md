# Server for To-Do List

This is a server for to-do list application with authorization and synchronization.

## Installation

1. Clone the repository with submodules.

    ```bash
    git clone --recurse-submodules https://github.com/eugengul/todolist-server.git
    ```

2. Change directory.

    ```bash
    cd todolist-server
    ```

2. Install dependencies.

    ```bash
    npm install
    ```

3. Create a `.env` file and set the `SECRET_AUTH_KEY` variable. 

    ```
    SECRET_AUTH_KEY = "<your-secret-key>"
    ```

4. Run the application.

    ```bash
    node .\server.js
    ```

5. Open the following URL http://localhost in your browser.