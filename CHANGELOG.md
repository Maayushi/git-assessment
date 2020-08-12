# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed
- Loading spinner will always be cleared when transitioning from 'Run A Job' page to 'Dashboard'. Added missing condition check for 'Queued' datawolf state [CCROP-270](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-270)
- Handled cases when the user has no jobs and when selected job failed, so the Dashboard will show appropriate message instead of spinning indefinitely [CCROP-281](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-281)
- Fertilizer amount units to show lb/acre in both Crop History & Summary tabs, but it's updates through PATCH endpoint will get converted to kg/ha [CCROP-279](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-279)

### Changed
- Replaced decomposition mock data with real api call [CCROP-282](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-282)

## [0.6.0] - 2020-05-29

### Added
- Graphs showing individual cover crop parameter results (N Loss, N Uptake etc.) [CCROP-233](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-233)
- Feature to use Cropland Data Layer for gathering crop rotation history. [CCROP-210](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-210)
- Keycloak for authentication and user registration. This obsoletes authentication through datawolf [CCROP-221](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-221)
- Mockup decomposition results including graph, with a config flag to hide it from dashboard [CCROP-255](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-255)

### Fixed
- Dashboard now shows correct numbers even when the selected date had a change due to daylight savings. [CCROP-253](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-253)
- Map tiles now loaded over https to fix mixed content warnings. [CCROP-257](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-257)
- Added no-cache directive to all api calls to workaround a bug that was not updating 'Crop History' in real-time [CCROP-260](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-260)
- Missing cultivar detail in the summary page after updating crop details. [CCROP-267](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-267)
- Improved the condition to check if a crop is cash crop. Now first fallow will not show on Summary tab [CCROP-261](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-261)
- Adding or updating cover crops from 'My Farm' page [CCROP-265](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-265)
- Incorrect calculation of day of the year when the current date is different in local time and GMT. [CCROP-268](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-269)
- Summary page will now display more than 10 crops [CCROP-269](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-268)

### Updated
- Headers of all APIs to use keycloak token for authentication [CCROP-254](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-254)

## [0.5.0] - 2020-03-05

### Added
- Slider selection on dashboard to pick the cover crop harvest date. [CCROP-240](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-240)
- Added loading spinners on Dashboard and "Runs" selection event [CCROP-242](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-242)

### Changed
- Text on analysis page related to date selection. [CCROP-246](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-246)
- Calculate cover crop termination date based on cash crop planting date. [CCROP-244](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-244)
- Refactored dashboard components to make graph more legible [CCROP-245](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-245)

### Removed
- Flexible dates check box from analysis page, related handler methods, and relevant code. [CCROP-246](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-246)

## [0.4.0] - 2019-11-22

### Added
- Dashboard page that displays results of C:N and Biomass in time series. Other results on the harvest date are shown in a table. [CCROP-209](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-209)

### Changed
- Included Tillage information in Crop History section of summary page [CCROP-188](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-188)
- Disabled Job History Page
- Replaced hashHistory with browserHistory [CCROP-217](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-217)

### Fixed
- Show planting and harvest dates on job cards used in dashboard [CROP-219](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-219)

## [0.3.0] - 2019-03-06

### Added

- User can view and modify tillage on MyFarm crop history page [CCROP-180](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-180)
- User can add new fertilizer entry on MyFarm crop history page and modify planting, harvest, etc [CCROP-156](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-156)
- Populate default farm data when user adds a CLU [CCROP-134](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-134)

### Changed
- Download link on My Farm Summary page to point to the DSSAT sequence file (.SQX) of the field. [CCROP-179](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-179)
- Summary page built from SQX data associated with a farm using service SQX endpoint [CCROP-148](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-148)

### Fixed
- When a user logs in, redirect to the start a job page [CCROP-159](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-159)
- Run simulation button not responding to button press [CCROP-165](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-165)

## [0.2.0] - 2018-10-12

### Added
- User can run any field with default template data
- Display farm data on MyFarm page [CCROP-102](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-102)
- User can modify fertilizer application on MyFarm page [CCROP-115](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-115)
- Added Cover crop selection to simulation page [CCROP-114](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-114)

### Changed

- Map is now responsive to user's defined fields [CCROP-107](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-107)
- History page uses pagination [CCROP-110](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-110)
- User is warned if they have already defined a field [CCROP-96](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-96)
- Updated to use shared resources [CCROP-101](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-101)
- Updated dependencies [CCROP-127](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-127)


### Fixed

## [0.1.0] - 2018-03-09

Initial release of Cover Crop.
