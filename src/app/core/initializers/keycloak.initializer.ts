import { APP_INITIALIZER, Provider } from '@angular/core';
import Keycloak from 'keycloak-js';
import { environment } from '../../../environments/environment';

let keycloakInstance: Keycloak | null = null;

export function initializeKeycloak(): () => Promise<boolean> {
  return () => {
    if (!environment.useKeycloak) {
      return Promise.resolve(true);
    }

    keycloakInstance = new Keycloak({
      url: environment.keycloak.url,
      realm: environment.keycloak.realm,
      clientId: environment.keycloak.clientId,
    });

    return keycloakInstance.init({
      onLoad: 'check-sso',
      silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html',
      checkLoginIframe: false,
    }).then((authenticated) => {
      console.log('Keycloak initialized. Authenticated:', authenticated);
      return true;
    }).catch((error) => {
      console.error('Keycloak initialization error:', error);
      return true;
    });
  };
}

export function getKeycloakInstance(): Keycloak | null {
  return keycloakInstance;
}

export const keycloakInitializerProvider: Provider = {
  provide: APP_INITIALIZER,
  useFactory: initializeKeycloak,
  multi: true
};
