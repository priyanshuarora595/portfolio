# Cross-Account S3 Migration & Consolidation Pipeline

## Problem
The production environment ran across two AWS accounts: a legacy account holding all customer files, split into one S3 bucket per customer (35 customers live), and a second account that ran all data processing but had to reach across accounts to read files from those 35 separate buckets. This created ongoing cross-account IAM/bucket-policy management for every customer and unnecessary storage/infrastructure cost from maintaining 35 separate buckets. The goal was to consolidate all customer data into a single bucket in the processing account, with zero downtime for the customers whose files were being actively processed throughout the migration.

## My Role
I designed and built this migration system solo, end-to-end: the event-driven sync pipeline, the historical backfill mechanism, cross-account access setup, and the cutover process.

## Architecture
The migration had two parts, run in parallel:

**Historical backfill:** a batch job listed and copied each legacy per-customer bucket's existing objects into a single consolidated data bucket in the processing account, keyed/namespaced per customer so 35 customers' data could safely coexist in one bucket. This ran once per legacy bucket to catch up already-existing files without touching live traffic.

**Real-time event-driven sync (for anything created during/after the backfill):** every new object created in a legacy bucket triggered an S3 event notification, which was published to an SQS queue. A dedicated file-sync Lambda consumed messages off that queue and copied each new file cross-account from its legacy customer bucket into the corresponding customer path in the new consolidated bucket. Using SQS as a buffer between S3 events and the Lambda decoupled ingestion from processing — upload bursts across any of the 35 customers wouldn't overwhelm the sync service, and a failed copy could be retried from the queue instead of silently dropping data.

Cross-account access was granted via IAM roles/bucket policies letting the sync Lambda (running in the processing account) read from all 35 legacy buckets and write to the single new bucket, so one Lambda served every customer instead of requiring per-customer wiring.

Because the event-driven pipeline kept the new bucket continuously in sync with anything landing in the legacy account — on top of the backfilled history — cutover for each customer was just repointing the processing account's downstream services to read from the new consolidated bucket instead of their old dedicated one. No pause in file processing was required for any customer during the switch. Once all 35 customers were confirmed migrated and consistent, the legacy buckets and the cross-account access built to reach them were decommissioned.

## Tech Stack
- AWS S3 (event notifications, source and destination storage)
- AWS SQS (buffering/decoupling ingestion from sync processing)
- AWS Lambda, Python (the file-sync service)
- AWS IAM (cross-account roles/bucket policies)

## Impact / Results
The migration eliminated the need to manage cross-account access and bucket policies per customer, replacing 35 individually managed customer buckets with a single consolidated bucket and reducing the associated infrastructure/storage overhead. All 35 live customers were migrated with zero downtime — file ingestion and processing continued uninterrupted throughout the backfill, sync, and cutover.

## Links
Internal company system; not publicly available.
