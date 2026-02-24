# Feature Specification: Connector Health Dashboard

**Feature Branch**: `001-mr-dashboard`  
**Created**: February 23, 2026  
**Status**: Draft  
**Input**: User description: "Provide a website to display a list of all currently deployed connectors and their status: name, when last checked, health status (good, slow, broken). The user must be able able to request all or selected connectors are checked again. The user must be able to request the system to determine what has changed to break a particular connector and get recommendations to fix it. Create the new spec in a new branch of the main branch called 'MRDashboard'."

## User Scenarios & Testing *(mandatory)*

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.
  
  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - View Connector Health (Priority: P1)

As an operations user, I want to see a list of all deployed connectors with their current health so I can quickly assess system stability.

**Why this priority**: Visibility into connector health is the foundation for any response or remediation action.

**Independent Test**: Can be fully tested by opening the dashboard and verifying that the list shows connector name, last checked time, and health status for all deployed connectors.

**Acceptance Scenarios**:

1. **Given** connectors are deployed, **When** I open the dashboard, **Then** I see every connector with its name, last checked time, and a health status of good, slow, or broken.
2. **Given** no connectors are deployed, **When** I open the dashboard, **Then** I see an empty state that clearly indicates there are no connectors to display.

---

### User Story 2 - Recheck Connector Health (Priority: P2)

As an operations user, I want to request a recheck for all or selected connectors so I can confirm whether issues persist or have been resolved.

**Why this priority**: Rechecking is the primary way to validate real-time status without waiting for scheduled checks.

**Independent Test**: Can be fully tested by selecting one or more connectors (or all) and requesting a recheck, then confirming the last checked time and status update.

**Acceptance Scenarios**:

1. **Given** a subset of connectors is selected, **When** I request a recheck, **Then** the system acknowledges the request and updates the selected connectors when the recheck completes.
2. **Given** no connectors are selected, **When** I request a recheck for all, **Then** the system rechecks every connector and updates their last checked times.

---

### User Story 3 - Investigate Broken Connector (Priority: P3)

As an operations user, I want to request a change analysis for a broken connector so I can understand what changed and get recommended fixes.

**Why this priority**: Root cause and recommended actions reduce downtime and support burden.

**Independent Test**: Can be fully tested by selecting a broken connector, requesting analysis, and verifying the system returns a change summary and recommendations or a clear reason when unavailable.

**Acceptance Scenarios**:

1. **Given** a connector is broken, **When** I request change analysis, **Then** I receive a summary of what changed that likely caused the break and a list of recommended fixes.
2. **Given** a connector is broken but analysis data is unavailable, **When** I request change analysis, **Then** I see a clear explanation of why analysis could not be produced.

---

[Add more user stories as needed, each with an assigned priority]

### Edge Cases

- Recheck requests are made while a previous recheck is still in progress.
- A connector transitions from broken to good between list refresh and analysis request.
- A connector has never been checked and has no last-checked time.
- Multiple connectors are broken with different probable causes.

## Requirements *(mandatory)*

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right functional requirements.
-->

### Functional Requirements

- **FR-001**: System MUST display all deployed connectors in a single list view with connector name, last checked time, and health status.
- **FR-002**: System MUST classify health status into exactly three states: good, slow, and broken.
- **FR-003**: Users MUST be able to request a health recheck for all connectors.
- **FR-004**: Users MUST be able to request a health recheck for a selected subset of connectors.
- **FR-005**: System MUST show the progress or completion state of a recheck request to the user.
- **FR-006**: System MUST allow users to request change analysis for a specific connector that is broken.
- **FR-007**: System MUST provide a change summary and recommended fixes when analysis is available.
- **FR-008**: System MUST explain when change analysis cannot be produced and what data is missing.
- **FR-009**: System MUST record the time each connector was last checked and make it visible in the list view.
- **FR-010**: System MUST preserve a viewable history of health checks for each connector for at least 18 months for operational review.

### Key Entities *(include if feature involves data)*

- **Connector**: A deployed integration endpoint with a name and current health status.
- **Health Check Result**: A timestamped outcome for a connector health check, including status and response notes.
- **Recheck Request**: A user-initiated request to refresh health for all or selected connectors.
- **Change Analysis**: A summary of likely causes for a broken connector based on recent changes and signals.
- **Recommendation**: Actionable guidance to restore or improve connector health.

## Success Criteria *(mandatory)*

<!--
  ACTION REQUIRED: Define measurable success criteria.
  These must be technology-agnostic and measurable.
-->

### Measurable Outcomes

- **SC-001**: 95% of users can view the connector list with statuses within 5 seconds of opening the dashboard.
- **SC-002**: Users can submit a recheck request for all connectors in under 30 seconds, end to end.
- **SC-003**: Updated health statuses are visible within 10 minutes for 90% of recheck requests.
- **SC-004**: 80% of broken connectors receive a change summary and at least one recommended fix within 15 minutes of request.
- **SC-005**: Mean time to identify the likely cause of a broken connector is reduced by 50% compared to current operations.

## Assumptions

- The dashboard is intended for internal operations users responsible for connector health.
- Health checks already exist and can be triggered on demand.
- Change analysis leverages existing monitoring and change tracking signals available to the organization.
