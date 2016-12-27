// Modules
import { ModuleWithProviders } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
// Components
import { PtsContentComponent } from "./components/pts-content/pts-content.component";
import { PtsContentAdminComponent } from "./components/pts-content-admin/pts-content-admin.component";
import { PtsContentDeejayComponent } from "./components/pts-content-deejay/pts-content-deejay.component";

// define routes Object
const appRoutes: Routes = [
  {
    path: "",
    redirectTo: "/",
    pathMatch: "full"
  },
  {
    path: "",
    component: PtsContentComponent
  },
  {
    path: "admin",
    component: PtsContentAdminComponent
  },
  {
    path: "deejay",
    component: PtsContentDeejayComponent
  }
];

// export routing Object
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);