import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UsersPage } from './users.page';
import { authGuard } from 'src/app/guards/authentication.guard';

const routes: Routes = [
  {
    path: '',
    // canActivateChild: [authGuard],
    component: UsersPage,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'cool-notification',
        loadChildren: () => import('./pages/cool-notification/cool-notification.module').then(m => m.CoolNotificationPageModule)
      },
      {
        path: 'home',
        loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule)
      },
      {
        path: 'events',
        loadChildren: () => import('./pages/events/events.module').then(m => m.EventsPageModule)
      },
      {
        path: 'events-list',
        loadChildren: () => import('./pages/events-list/events-list.module').then(m => m.EventsListPageModule)
      },
      {
        path: 'event-detail/:id',
        loadChildren: () => import('./pages/event-detail/event-detail.module').then(m => m.EventDetailPageModule)
      },
      {
        path: 'club-detail/:id',
        loadChildren: () => import('./pages/club-detail/club-detail.module').then(m => m.ClubDetailPageModule)
      },
      {
        path: 'profile',
        canActivate: [authGuard],
        loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfilePageModule)
      },
      {
        path: 'profile/:id',
        loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfilePageModule)
      },
      {
        path: 'full-immersion',
        loadChildren: () => import('./pages/full-immersion/full-immersion.module').then(m => m.FullImmersionPageModule)
      },
      {
        path: 'search',
        loadChildren: () => import('./pages/search/search.module').then(m => m.SearchPageModule)
      },
      {
        path: 'stories',
        loadChildren: () => import('./pages/stories/stories.module').then( m => m.StoriesPageModule)
      },
      {
        path: 'map',
        loadChildren: () => import('./pages/map/map.module').then( m => m.MapPageModule)
      },
      {
        path: 'story',
        loadChildren: () => import('./pages/story/story.module').then( m => m.StoryPageModule)
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersPageRoutingModule { }
