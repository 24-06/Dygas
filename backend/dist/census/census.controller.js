"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CensusController = void 0;
const common_1 = require("@nestjs/common");
const census_service_1 = require("./census.service");
let CensusController = class CensusController {
    service;
    constructor(service) {
        this.service = service;
    }
    verify(document) {
        return this.service.verify(document);
    }
    getStats() {
        return this.service.getStats();
    }
    findAll() {
        return this.service.findAll();
    }
    create(body) {
        return this.service.create(body);
    }
};
exports.CensusController = CensusController;
__decorate([
    (0, common_1.Get)('verify/:document'),
    __param(0, (0, common_1.Param)('document')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CensusController.prototype, "verify", null);
__decorate([
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CensusController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CensusController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CensusController.prototype, "create", null);
exports.CensusController = CensusController = __decorate([
    (0, common_1.Controller)('census'),
    __metadata("design:paramtypes", [census_service_1.CensusService])
], CensusController);
//# sourceMappingURL=census.controller.js.map