/*!

=========================================================
* Purity UI Dashboard - v1.0.1
=========================================================

* Product Page: https://www.creative-tim.com/product/purity-ui-dashboard
* Copyright 2021 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/purity-ui-dashboard/blob/master/LICENSE.md)

* Design by Creative Tim & Coded by Simmmple

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
/*!
... (license header unchanged)
*/
/*!
... (license header unchanged)
*/
import React from "react";
import ReactDOM from "react-dom";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";

import AuthLayout from "layouts/Auth.js";
import AdminLayout from "layouts/Admin.js";
import RTLLayout from "layouts/RTL.js";

import { AuthProvider } from "auth/AuthContext";
import RequireAuth from "auth/RequireAuth";
// NOTE: Keep RequireRole for page-level guards in routes.js if you want,
// but don't gate the whole /admin layout with it here.

ReactDOM.render(
  <HashRouter>
    <AuthProvider>
      <Switch>
        {/* Public auth pages */}
        <Route path={`/auth`} component={AuthLayout} />

        {/* Admin layout for ALL authenticated roles; 
            RBAC is handled by Sidebar filtering + per-page RequireRole in routes.js */}
        <Route
          path={`/admin`}
          render={(props) => (
            <RequireAuth>
              <AdminLayout {...props} />
            </RequireAuth>
          )}
        />

        {/* Optional */}
        <Route path={`/rtl`} component={RTLLayout} />

        {/* Land signed-in users on the dashboard by default */}
        <Redirect from={`/`} to="/admin/dashboard" />
      </Switch>
    </AuthProvider>
  </HashRouter>,
  document.getElementById("root")
);
