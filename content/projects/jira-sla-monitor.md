# Jira SLA Monitoring Tool

## Problem
An internal tool used by a support/ops team to track SLA compliance across Jira tickets, so the team doesn't have to manually check deadlines ticket-by-ticket. It pulls ticket data from Jira and presents it as a dashboard showing which tickets are on track, at risk, or in breach of their SLA.

## My Role
I was a contributor to this existing internal tool, not its original author or owner. My specific contribution was fixing the Jira integration after Jira changed the response schema of its REST API: fields in the ticket JSON that the tool depended on to compute SLA status had been renamed/restructured upstream, which broke the tool's ability to correctly pull and parse ticket data. I traced which fields had moved or been renamed and updated the parsing/field-extraction logic in the Flask backend to match Jira's new response format, restoring SLA tracking on the dashboard without changes to the rest of the system.

## Architecture
The tool is a Flask backend that calls Jira's REST API to fetch ticket data (status, timestamps, priority, and related fields) needed to compute SLA metrics — such as time-to-first-response and time-to-resolution — for tickets in the team's Jira project(s). Raw Jira ticket responses are parsed and mapped into the tool's internal SLA data model, which is then surfaced through a dashboard for the support/ops team to review ticket-level SLA status. My work was scoped to this Jira-response-parsing layer: when Jira restructured the field names/shape of its ticket JSON, the existing mapping from raw Jira response to the internal SLA fields silently produced incorrect or missing data, so the dashboard's SLA calculations broke. I updated the field-extraction logic to align with Jira's new schema, which required identifying the renamed/restructured fields in the new API responses and correcting the mapping without altering the downstream SLA calculation or dashboard logic that consumed it.

## Tech Stack
- Python, Flask (backend)
- Jira REST API (ticket data source)
- Internal dashboard UI for SLA visibility (served by the Flask app)

## Impact / Results
This was a maintenance contribution to an existing internal tool rather than a new build, so there are no adoption/scale metrics to report. Concretely, it restored SLA monitoring that had broken for the support/ops team as a result of an external, upstream change to Jira's API, without requiring a larger rewrite of the tool — keeping an internal process the team relied on functional after a breaking dependency change outside the team's control.

## Links
Internal company tool; not publicly available.
