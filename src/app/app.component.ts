import { Component, OnInit } from '@angular/core';
import { Tree } from './shell/services/tree.service';

@Component({
  selector: 'app-root',
  template: `
    <ngx-loading-bar color="#ff5252" [includeSpinner]="false"></ngx-loading-bar>
    <router-outlet></router-outlet>
  `
})
export class AppComponent implements OnInit {
  constructor(private tree: Tree) {}

  ngOnInit() {
    this.tree.load([
      {
        key: 'root',
        title: 'RIL Transport',
        url: '/',
        children: [
          {
            key: 'system-administration',
            title: 'System Administration',
            url: '/system-administration',
            children: [
              {
                key: 'user-interface',
                title: 'User Interface',
                url: '/system-administration/user-interface',
                children: [
                  {
                    key: 'color',
                    title: 'Color',
                    url: '/system-administration/user-interface/color',
                    isLeaf: true
                  }
                ]
              },
              {
                key: 'security',
                title: 'Security',
                url: '/system-administration/security',
                children: [
                  {
                    key: 'user',
                    title: 'User',
                    url: '/system-administration/security/user',
                    isLeaf: true
                  },
                  {
                    key: 'role',
                    title: 'Role',
                    url: '/system-administration/security/role',
                    isLeaf: true
                  },
                  {
                    key: 'activity',
                    title: 'Activity',
                    url: '/system-administration/security/activity',
                    isLeaf: true
                  },
                  {
                    key: 'session',
                    title: 'Session',
                    url: '/system-administration/security/session',
                    isLeaf: true
                  }
                ]
              }
            ]
          },
          {
            key: 'common-objects',
            title: 'Common Objects',
            url: '/common-objects',
            children: [
              {
                key: 'core-object',
                title: 'Core Object',
                url: '/common-objects/core-object',
                children: [
                  {
                    key: 'category-type',
                    title: 'Category Type',
                    url: '/common-objects/core-object/category-type',
                    isLeaf: true
                  },
                  {
                    key: 'status-type',
                    title: 'Status Type',
                    url: '/common-objects/core-object/status-type',
                    isLeaf: true
                  },
                  {
                    key: 'association-type',
                    title: 'Association Type',
                    url: '/common-objects/core-object/association-type',
                    isLeaf: true
                  },
                  {
                    key: 'role-type',
                    title: 'Role Type',
                    url: '/common-objects/core-object/role-type',
                    isLeaf: true
                  }
                ]
              },
              {
                key: 'party',
                title: 'Party',
                url: '/common-objects/party',
                children: [
                  {
                    key: 'person',
                    title: 'Person',
                    url: '/common-objects/party/person',
                    isLeaf: true
                  },
                  {
                    key: 'organization',
                    title: 'Organization',
                    url: '/common-objects/party/organization',
                    isLeaf: true
                  }
                ]
              },
              {
                key: 'fixed-asset',
                title: 'Fixed Asset',
                url: '/common-objects/fixed-asset',
                children: [
                  {
                    key: 'chassis',
                    title: 'Chassis',
                    url: '/common-objects/fixed-asset/chassis',
                    isLeaf: true
                  },
                  {
                    key: 'container',
                    title: 'Container',
                    url: '/common-objects/fixed-asset/container',
                    isLeaf: true
                  },
                  {
                    key: 'Tractor',
                    title: 'Tractor',
                    url: '/common-objects/fixed-asset/tractor',
                    isLeaf: true
                  }
                ]
              },
              {
                key: 'measurement-unit',
                title: 'Measurement Unit',
                url: '/common-objects/measurement-unit',
                children: [
                  {
                    key: 'exchange-rate-type',
                    title: 'Exchange Rate Type',
                    url: '/common-objects/measurement-unit/exchange-rate-type',
                    isLeaf: true
                  }
                ]
              },
              {
                key: 'place',
                title: 'Place',
                url: '/common-objects/place',
                children: [
                  {
                    key: 'area',
                    title: 'Area',
                    url: '/common-objects/place/area',
                    children: [
                      {
                        key: 'political-area',
                        title: 'Political Area',
                        url: '/common-objects/place/area/political-area',
                        children: [
                          {
                            key: 'country',
                            title: 'Country',
                            url:
                              '/common-objects/place/area/political-area/country',
                            isLeaf: true
                          },
                          {
                            key: 'province',
                            title: 'Province',
                            url:
                              '/common-objects/place/area/political-area/province',
                            isLeaf: true
                          },
                          {
                            key: 'city',
                            title: 'City',
                            url:
                              '/common-objects/place/area/political-area/city',
                            isLeaf: true
                          },
                          {
                            key: 'municipality',
                            title: 'Municipality',
                            url:
                              '/common-objects/place/area/political-area/municipality',
                            isLeaf: true
                          },
                          {
                            key: 'barangay',
                            title: 'Barangay',
                            url:
                              '/common-objects/place/area/political-area/barangay',
                            isLeaf: true
                          }
                        ]
                      },
                      {
                        key: 'telecom-area',
                        title: 'Telecom Area',
                        url: '/common-objects/place/area/telecom-area',
                        children: [
                          {
                            key: 'itu-country',
                            title: 'ITU Country',
                            url:
                              '/common-objects/place/area/telecom-area/itu-country',
                            isLeaf: true
                          },
                          {
                            key: 'itu-area',
                            title: 'ITU Area',
                            url:
                              '/common-objects/place/area/telecom-area/itu-area',
                            isLeaf: true
                          },
                          {
                            key: 'mobile-area',
                            title: 'Mobile Area',
                            url:
                              '/common-objects/place/area/telecom-area/mobile-area',
                            isLeaf: true
                          }
                        ]
                      },
                      {
                        key: 'business-territory',
                        title: 'Business Territory',
                        url: '/common-objects/place/area/business-territory',
                        children: [
                          {
                            key: 'postal-zone',
                            title: 'Postal Zone',
                            url:
                              '/common-objects/place/area/business-territory/postal-zone',
                            isLeaf: true
                          },
                          {
                            key: 'sales-territory',
                            title: 'Sales Territory',
                            url:
                              '/common-objects/place/area/business-territory/sales-territory',
                            isLeaf: true
                          },
                          {
                            key: 'service-territory',
                            title: 'Service Territory',
                            url:
                              '/common-objects/place/area/business-territory/service-territory',
                            isLeaf: true
                          }
                        ]
                      }
                    ]
                  },
                  {
                    key: 'address',
                    title: 'Address',
                    url: '/common-objects/place/address',
                    isLeaf: true
                  },
                  {
                    key: 'location',
                    title: 'Location',
                    url: '/common-objects/place/location',
                    isLeaf: true
                  }
                ]
              },
              {
                key: 'product',
                title: 'Product',
                url: '/common-objects/product',
                children: [
                  {
                    key: 'good-type',
                    title: 'Good Type',
                    url: '/common-objects/product/good-type',
                    isLeaf: true
                  },
                  {
                    key: 'service-type',
                    title: 'Service Type',
                    url: '/common-objects/product/service-type',
                    isLeaf: true
                  },
                  {
                    key: 'pricing',
                    title: 'Pricing',
                    url: '/common-objects/product/pricing',
                    isLeaf: true
                  }
                ]
              }
            ]
          },
          {
            key: 'transport-service',
            title: 'Transport Service',
            url: '/transport-service',
            children: [
              {
                key: 'booking',
                title: 'Booking',
                url: '/transport-service/booking',
                children: [
                  {
                    key: 'booking-slip',
                    title: 'Booking Slip',
                    url: '/transport-service/booking/booking-slip',
                    isLeaf: true
                  },
                  {
                        key: 'booking-batch',
                        title: 'Booking Batch',
                        url: '/transport-service/booking/booking-batch',
                        isLeaf: true
                  }

                ]
              },
              {
                key: 'scheduling',
                title: 'Scheduling',
                url: '/transport-service/scheduling',
                children: [
                  {
                    key: 'dispatch-slip',
                    title: 'Dispatch Slip',
                    url: '/transport-service/scheduling/dispatch-slip',
                    isLeaf: true
                  }
                ]
              },
              {
                key: 'service-base-object',
                title: 'Service Base Object',
                url: '/transport-service/service-base-object',
                children: [
                  {
                    key: 'route',
                    title: 'Route',
                    url: '/transport-service/service-base-object/route',
                    isLeaf: true
                  },
                  {
                    key: 'trip',
                    title: 'Trip',
                    url: '/transport-service/service-base-object/trip',
                    isLeaf: true
                  }
                ]
              }
            ]
          }
        ]
      }
    ]);
  }
}
