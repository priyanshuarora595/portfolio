# Self-Service File Processing Configuration Service

## Problem
In a healthcare data-processing pipeline, incoming files from different customers need per-customer/per-file-type configuration (how a file should be parsed, validated, and routed for processing). Previously, setting up or changing this configuration meant manually dropping a config file into an S3 bucket, which an SQS-triggered process would then pick up — with no UI, no way to directly view/edit/delete an existing config, and no immediate feedback if something was wrong. This project replaced that workflow with a self-service backend powering a management dashboard, so configs for incoming file processing could be created, updated, and deleted directly by users rather than through manual file drops.

## My Role
I solo-built the FastAPI backend service that powers this self-service application: the CRUD API for managing configurations, the DynamoDB data model behind it, and the config import/export functionality. A separate frontend dashboard consumes this API; my ownership was the backend service itself.

## Architecture
The service is a FastAPI application exposing REST endpoints for the full CRUD lifecycle of file-processing configurations — create, read, update, and delete — replacing the previous flow where a config change meant manually dropping a file into S3 and waiting for an SQS-triggered consumer to process it. DynamoDB stores the configuration records, giving low-latency key-based lookups per customer/file-type config and fitting the serverless deployment model. The service is deployed as AWS Lambda functions behind API Gateway, so it scales automatically with no idle infrastructure cost, consistent with the rest of the team's serverless AWS architecture.

The import/export feature operates on the configuration objects themselves: a user can export one or more configs to a file (for backup, review, or promoting a tested config from one environment to another) and re-import a previously exported file to recreate or update configs directly, instead of re-entering every field through the dashboard UI by hand.

By moving config management behind a proper API with validation and direct CRUD operations, the service removed the round-trip of manually authoring a config file, uploading it to S3, and waiting for asynchronous SQS-based processing just to make or verify a change — turning what used to be a multi-step, engineer-mediated process into an immediate, self-service one.

## Tech Stack
- Python, FastAPI (REST API)
- AWS Lambda, API Gateway (serverless deployment)
- AWS DynamoDB (configuration data store)
- AWS S3, SQS (part of the prior/adjacent file-drop workflow this service replaced for configuration management)

## Impact / Results
This reduced the time to onboard or configure a new incoming file type or customer for processing by roughly 10x, by replacing a manual S3-file-drop-and-SQS-processing workflow with direct, immediate self-service CRUD operations. It removed the need for engineering involvement in routine configuration changes and currently supports configuration management for dozens of customers/file-type configs.

## Links
Internal company system built for a healthcare client; not publicly available.
