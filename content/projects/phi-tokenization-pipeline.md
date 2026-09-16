# PHI Tokenization Pipeline for US Healthcare Data Exchange

## Problem
A US healthcare provider needed to share patient data with downstream systems without exposing raw Protected Health Information (PHI), in order to meet HIPAA data-handling requirements. The organization used Datavant, a third-party health-data tokenization provider, to convert PHI into de-identified "tokens" and then exchange those tokens for internal "site tokens" usable within the company's own systems. Datavant's tokenization logic runs as a proprietary executable that must be kept within the receiving organization's own infrastructure rather than called as an external API, so the company needed an internal AWS pipeline to feed data into that executable, manage the request/response cycle, and route the results back into its systems securely and reliably.

## My Role
I was a core contributor on the team that built this pipeline, at Spark Eighteen Pvt. Ltd. (Apr 2024–Present). My specific ownership was the AWS orchestration and infrastructure layer that moved data through each stage of the pipeline — the S3 buckets, SQS event wiring, Glue table structure, and the EC2 environment hosting Datavant's tokenizer executable — rather than the tokenization business logic itself, which other team members owned.

## Architecture
The pipeline is event-driven and moves data through the following stages:
1. Incoming files (containing PHI or PHI tokens to be exchanged) land in an S3 bucket.
2. The data is loaded into AWS Glue tables, giving the pipeline a structured, queryable record of each batch as it moves through processing.
3. An SQS message is published to signal that new data is ready.
4. A Lambda function consumes the SQS message, reads the latest records from the Glue table, and transforms them into the input file format expected by Datavant's tokenizer executable.
5. That input file is handed off to an EC2 instance running the Datavant executable, which performs the actual token exchange (PHI → Datavant token, or Datavant token → internal site token) inside the company's own infrastructure, as required by the vendor's security model.
6. The tokenizer's output file lands in a separate S3 bucket, which triggers another S3 event.
7. A second Lambda function picks up that event and loads the resulting site tokens into another Glue table, making the de-identified, exchange-ready data available to downstream systems.

Keeping the vendor's tokenizer isolated on a dedicated EC2 instance (instead of, say, invoking it as a shared service) was a deliberate constraint from Datavant's security requirements, and the SQS-driven, stage-by-stage design decouples ingestion, transformation, tokenization, and output so each part can be retried, monitored, and scaled independently — important given the pipeline handles regulated healthcare data where auditability of each stage matters.

## Tech Stack
- Python (Lambda functions, data transformation logic)
- AWS S3 (file landing zones for input and output)
- AWS SQS (event-driven triggering between pipeline stages)
- AWS Glue (structured tables tracking data at each processing stage)
- AWS Lambda (transformation and routing logic between stages)
- AWS EC2 (hosting the Datavant tokenizer executable within owned infrastructure)
- Datavant (third-party PHI tokenization/token-exchange vendor)

## Impact / Results
The pipeline enabled the provider to exchange patient data with a third-party tokenization vendor without exposing raw PHI outside a controlled boundary, satisfying the vendor's requirement that its tokenizer run only inside the company's own infrastructure. The event-driven, staged design (S3 → Glue → SQS → Lambda → EC2 → S3 → Glue) made the tokenization process auditable at each step and decoupled enough that individual stages could be monitored and reprocessed independently, rather than relying on a single monolithic job. No hard throughput or performance metrics are available for this specific pipeline.

## Links
Private/internal system built for a healthcare client; not publicly available.
