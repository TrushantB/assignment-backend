var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
/*
  Interface for authentication service,
  allows for the creation, verification and invalidation of JSON webtoken for authentication.

  The payload should contain:
  - A user field, with user ID, name and title information as well as user role
  (superuser, organization administrator, user) at minimum. More information is allowed.
  - A permissions field, which is a nested object structure that describes what permissions a user has.
  Example:
  {
    user: {
      _id: '1234567890ab',
      name: 'Test Testsson',
      signature: 'TeTe',
      title: 'Caretaker',
      role: 'user',
      orgId: '0123456789a',
    },
    permissions: {
      notes: {
        cdef01234567: {
          create: false,
          read: true,
          update: true,
          delete: false,
        },
        890123456789: {
          create: true,
          read: true,
          update: true,
          delete: true
        }
      }
    }
  }
  Example gives user permissions to specific journal IDs.
*/
let IAuthenticationService = class IAuthenticationService {
};
IAuthenticationService = __decorate([
    inversify_1.injectable()
], IAuthenticationService);
exports.default = IAuthenticationService;
//# sourceMappingURL=authentication.js.map