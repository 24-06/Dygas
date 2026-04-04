"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepartmentsService = void 0;
const common_1 = require("@nestjs/common");
const colombia_data_1 = require("../data/colombia.data");
let DepartmentsService = class DepartmentsService {
    findAll() {
        return colombia_data_1.COLOMBIA_DATA.map(({ id, name, code, municipalities }) => ({
            id,
            name,
            code,
            municipalityCount: municipalities.length,
        }));
    }
    findMunicipalities(id) {
        const dept = colombia_data_1.COLOMBIA_DATA.find((d) => d.id === id);
        if (!dept)
            return null;
        return {
            departmentId: dept.id,
            departmentName: dept.name,
            municipalities: dept.municipalities,
        };
    }
};
exports.DepartmentsService = DepartmentsService;
exports.DepartmentsService = DepartmentsService = __decorate([
    (0, common_1.Injectable)()
], DepartmentsService);
//# sourceMappingURL=departments.service.js.map