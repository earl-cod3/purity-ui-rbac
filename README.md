# [Purity UI Dashboard](https://demos.creative-tim.com/purity-ui-dashboard) [![Tweet](https://img.shields.io/twitter/url/http/shields.io.svg?style=social&logo=twitter)](https://twitter.com/intent/tweet?url=https%3A%2F%2Fdemos.creative-tim.com%2Fpurity-ui-dashboard%2F&text=Check%20Purity%20UI%20Dashboard%20made%20by%20%40CreativeTim%20%26%20%40simmmple_web)

![version](https://img.shields.io/badge/version-1.0.1-blue.svg) ![license](https://img.shields.io/badge/license-MIT-blue.svg) [![GitHub issues open](https://img.shields.io/github/issues/creativetimofficial/purity-ui-dashboard.svg?maxAge=2592000)](https://github.com/creativetimofficial/purity-ui-dashboard/issues?q=is%3Aopen+is%3Aissue) [![GitHub issues closed](https://img.shields.io/github/issues-closed-raw/creativetimofficial/purity-ui-dashboard.svg?maxAge=2592000)](https://github.com/creativetimofficial/purity-ui-dashboard/issues?q=is%3Aissue+is%3Aclosed)

![Product Gif](https://i.ibb.co/7NXMZQS/Cover-Purity-Chakra-FREE-Thumbnail.png)





[<img src="https://github.com/creativetimofficial/public-assets/blob/master/logos/react-logo.jpg?raw=true" width="60" height="60" />](https://www.creative-tim.com/product/purity-ui-dashboard?ref=readme-pud)[<img src="https://github.com/creativetimofficial/public-assets/blob/master/logos/figma-logo.jpg?raw=true" width="60" height="60" />](https://www.creative-tim.com/product/purity-ui-dashboard?ref=readme-pud)

| React                                                                                                                                                                                        | Figma                                                                                                                                                                                   |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [![Purity Free ReactJS Chakra Dashboard](https://i.ibb.co/Ct9RvRZ/Cover-Purity-Chakra-FREE-Thumbnail-React-JS.png)](https://www.creative-tim.com/product/purity-ui-dashboard?ref=readme-pud) | [![Purity Free Figma Chakra Dashboard](https://i.ibb.co/wRK0jbK/Cover-Purity-Chakra-FREE-Thumbnail-Figma.png)](https://www.creative-tim.com/product/purity-ui-dashboard?ref=readme-pud) |


## File Structure

Within the download you'll find the following directories and files:

```
purity-ui-dashboard/
├── .gitattributes
├── .gitigonore
├── CHANGELOG.md
├── commit.sh
├── gulpfile.js
├── ISSUE_TEMPLATE.md
├── jsconfig.json
├── package-lock.json
├── package.json
├── README.md
├── documentation
├── node_modules
├── public
│   ├── favicon.ico
│   ├── index.html
│   └── manifest.json
└── src
    ├── assets
    │   ├── img
    │   └── svg
    ├── components
    │   ├── Card
    │   │   ├── Card.js
    │   │   ├── CardBody.js
    │   │   └── CardHeader.js
    │   ├── Charts
    │   │   ├── BarChart.js
    │   │   └── LineChart.js
    │   ├── Configurator
    │   │   └── Configurator.js
    │   ├── FixedPlugin
    │   │   └── FixedPlugin.js
    │   ├── Footer
    │   │   └── Footer.js
    │   ├── Icons
    │   │   ├── IconBox.js
    │   │   └── Icons.js
    │   ├── Layout
    │   │   ├── MainPanel.js
    │   │   ├── PanelContainer.js
    │   │   └── PanelContent.js
    │   ├── Menu
    │   │   └── ItemContent.js
    │   ├── Navbars
    │   │   ├── Searchbar
    │   │   │   └── SearchBar.js
    │   │   ├── AdminNavbar.js
    │   │   ├── AdminNavbarLinks.js
    │   │   └── AuthNavbar.js
    │   ├── Other
    │   │   ├── BillingRow.js
    │   │   ├── InvoicesRow.js
    │   │   └── TransactionRow.js
    │   ├── Separator
    │   │   └── Separator.js
    │   ├── Sidebar
    │   │   ├── Sidebar.js
    │   │   └── SidebarHelp.js
    │   └── Tables
    │       ├── BillingRow.js
    │       ├── DashboardTableRow.js
    │       ├── InvoicesRow.js
    │       ├── TablesProjectRow.js
    │       ├── TablesTableRow.js
    │       ├── TimelineRow.js
    │       └── TransactionRow.js
    ├── layouts
    │   ├── Admin.js
    │   ├── Auth.js
    │   └── RTL.js
    ├── theme
    │   ├── additions
    │   │   ├── card
    │   │   │   ├── Card.js
    │   │   │   ├── CardBody.js
    │   │   │   └── CardHeader.js
    │   │   ├── layout
    │   │   │   ├── MainPanel.js
    │   │   │   ├── PanelContainer.js
    │   │   │   └── PanelContent.js
    │   ├── components
    │   │   ├── button.js
    │   │   ├── link.js
    │   │   └── drawer.js
    │   ├── foundations
    │   │   ├── breakpoints.js
    │   │   └── text.js
    │   ├── styles.js
    │   └── theme.js
    ├── variables
    │   ├── charts.js
    │   └── general.js
    ├── views
    │   ├── Dashboard
    │   │   ├── Billing.js
    │   │   ├── Dashboard.js
    │   │   ├── Profile.js
    │   │   └── Tables.js
    │   ├── Pages
    │       ├── SignIn.js
    │       └── SignUp.js
    │   └── RTL
    │       └── RTLPage.js
    ├── index.js
    └── routes.js

```

## Browser Support

At present, we officially aim to support the last two versions of the following browsers:

<img src="https://github.com/creativetimofficial/public-assets/blob/master/logos/chrome-logo.png?raw=true" width="64" height="64"> <img src="https://raw.githubusercontent.com/creativetimofficial/public-assets/master/logos/firefox-logo.png" width="64" height="64"> <img src="https://raw.githubusercontent.com/creativetimofficial/public-assets/master/logos/edge-logo.png" width="64" height="64"> <img src="https://raw.githubusercontent.com/creativetimofficial/public-assets/master/logos/safari-logo.png" width="64" height="64"> <img src="https://raw.githubusercontent.com/creativetimofficial/public-assets/master/logos/opera-logo.png" width="64" height="64">


