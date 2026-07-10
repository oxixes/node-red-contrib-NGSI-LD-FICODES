## node-red-contrib-ngsi-ld-ficodes v0.4.7 - 10 July, 2026

-   Add `join` and `joinLevel` support to entity retrieval and entity queries.

## node-red-contrib-ngsi-ld-ficodes v0.4.6 - 9 July, 2026

-   Fix NGSI-LD entities pagination by reading the total-count header through Axios' normalized response headers.
-   Add unit and E2E coverage for paginating 202 entities across offsets 0, 100, and 200.
-   Update test tooling and CI to run on current Node.js versions, including Node.js 26.
-   Update E2E setup to use Node-RED 5.0.1.

## node-red-contrib-ngsi-ld-ficodes v0.4.5 - 19 February, 2026

-   Update repository and issue tracker metadata to point to the FICODES fork.
-   Bump package version for the FICODES publishing release.

## node-red-contrib-ngsi-ld-ficodes v0.4.3 - 19 February, 2026

-   Rename package distribution to node-red-contrib-ngsi-ld-ficodes for FICODES publishing.
-   Move E2E tests to Scorpio Broker and update the E2E Docker Compose setup.
-   Fix E2E expectations and unit tests for Scorpio-compatible NGSI-LD behavior.
-   Send `count` as a query parameter instead of an NGSI-LD `options` value.
-   Update GitHub workflow branch filters and Node.js/Scorpio test versions.

## node-red-contrib-letsfiware-NGSI v0.4.2

- Fix shared buffer in entities node (#30)

## node-red-contrib-letsfiware-NGSI v0.4.0-next

-   Update copyright date (#28)
-   ADD prettier command (#27)
-   Update node.js dependencies (#26)
-   ADD GitHub action to close inactive issues (#25)
-   ADD E2E test for encode / decode node (#24)

## node-red-contrib-letsfiware-NGSI v0.4.0 - 10 May, 2023

-   Add feature for encoding and decoding forbidden chars (#20)
-   ADD encode / decode node (#19)
-   Update Github Actions for E2E test (#17)

## node-red-contrib-letsfiware-NGSI v0.3.0 - 30 April, 2023

-   ADD tutorial (#13)
-   Improve output data (#11)
-   ADD E2E test (#10)
-   ADD hyperlink in documentations (#9)

## node-red-contrib-NGSI-LD v0.2.0 - 14 April, 2023

-   ADD GitHub Discussions badge (#6)

## node-red-contrib-NGSI-LD v0.1.0 - 13 April, 2023

-   Enable Coveralls (#2)
-   ADD documentation (#1)

## node-red-contrib-NGSI-LD v0.0.1 - 13 April, 2023

-   Initial release
