# udata-datasets-batch-create

Create datasets on an udata instance based on an Excel file describing those datasets.

## Template

A template for the Excel file is available in the file `datasets-template.xlsx`. The resulting file should be named `datasets.xlsx`.

## Configuration

Copy the `.env.example` file into a file named `.env`. Adjust the following variables to your needs:

- odpURL: URL of the udata instance
- odpAPIKey: API key needed to access the udata API
- odpOrgId: organization ID
- callRateNrCalls: this setting and the following are related to rate limiting. This is the max number of calls per period. By default 1.
- callRateDuration: this setting defines the duration of the period for rate limiting in milliseconds. By default 1000ms.
- debug: should we display debug information?
- extraDesc: optional, text added at the end of the description of all datasets
- extraTags: optional, tags added to all datasets. They should be separated by semicolons
- private: optional, if true, the datasets will be created in private mode.

## Run

```npm run main```

## License
This software is (c) [Information and press service](https://sip.gouvernement.lu/en.html) of the luxembourgish government and licensed under the MIT license.
