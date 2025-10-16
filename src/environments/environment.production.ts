export const environment = {
  production: true,
  apiBaseUrl: 'https://api.financieraoh.com/api/v1',

  useKeycloak: true,

  keycloak: {
    url: 'https://auth.financieraoh.com/auth',
    realm: 'financiera-oh',
    clientId: 'portal-empleador',
  },

  features: {
    enableApprovals: true,
    enableReports: true,
    maxFileSize: 10485760,
    maxEmployeesPerBatch: 1000
  }
};
