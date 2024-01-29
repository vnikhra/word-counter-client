# Word Counter Client

This Node.js project acts as the client for a service that allows you to count the frequency of each word in a file. You can run it via the command line interface (CLI) with various options.

## Installation

To use this project, you need to have Node.js installed on your machine. It's recommended to use NVM (Node Version Manager) to manage your Node.js installations. You can install NVM from [here](https://github.com/nvm-sh/nvm).

Once you have Node.js installed, you can clone this repository and install the dependencies using npm:

```bash
git clone https://github.com/vnikhra/word-counter-client.git
cd word-counter-client
npm install
```

## Building

After installing the dependencies, you need to build the project:

```bash
npm run build
```

## Usage

The default option for this application is to upload a file and submit it for processing. You can use this option without specifying any flags.

To upload a file and submit it for processing:

```bash
node build/index.js <path to your file>
```

This command returns a fileId that can be used later to check results for the uploaded file.

Alternatively, you can choose one of the following options:

- **--check-results \<fileId\>**: Check results for files uploaded earlier using the specified fileId. If the processing is completed, it downloads and prints the results. Otherwise, it informs the user that the file is not processed yet.

  To check results for a previously uploaded file:

  ```bash
  node build/index.js --check-results <fileId>
  ```
- **--local \<filepath\>**: Process the file locally. This option utilizes the same library used by the server to count the frequency of each word but uses the machine’s resources without uploading any data to the server.

  To process a file locally:

  ```bash
  node build/index.js --local <path to your file>
  ```

Please note that these options cannot be used together. You must choose either the default option (uploading a file) or one of the alternative options (--check-results or --local) for each command.

## Running Tests

You can run tests using the following command:

```bash
npm test
```

## Backend Services

To run the backend services required for this project, the easiest way is to download and run the docker-compose file available at [word-counter-deployment](https://github.com/vnikhra/word-counter-deployment). Alternatively, you can set up the services individually from [word-counter-api](https://github.com/vnikhra/word-counter-api) and [word-counter-worker](https://github.com/vnikhra/word-counter-worker). These services require Postgres, any AMQ (Advanced Message Queuing Protocol), and S3 to run.

As I have included an instance on minio to mimic S3 in the docker compose, it requires you to add the following entry in your /etc/hosts file to work properly.
```shell
127.0.0.1 host.docker.internal
```

Feel free to reach out if you encounter any issues or have any questions!

