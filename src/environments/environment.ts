export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:8080/api/v1',

  useKeycloak: true,

  keycloak: {
    url: 'https://auth.cmaconsulting.org',
    realm: 'fohrealm',
    clientId: 'portal-empleador',
  },

  features: {
    enableApprovals: true,
    enableReports: true,
    maxFileSize: 10485760,
    maxEmployeesPerBatch: 1000
  }
};
