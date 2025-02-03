// import { Injectable } from '@angular/core';
// import Ajv from 'ajv';
// import addFormats from 'ajv-formats';
// import taskSchema from '../schemas/task-schema.json';
// import { Task } from '../interfaces/task.interface';

// @Injectable({
//   providedIn: 'root'
// })
// export class ValidatorService {
//   private ajv: Ajv;

//   constructor() {
//     this.ajv = new Ajv({ allErrors: true });
//     addFormats(this.ajv);
//     this.ajv.addSchema(taskSchema, 'taskSchema');
//   }

//   validateTask(data: Task, method: string): boolean {
//     const validate = this.ajv.getSchema('taskSchema');
//     if (!validate) {
//       throw new Error('Schema not found');
//     }

//     let valid: boolean;
//     if (method === 'POST') {
//       // Para creación, no requerimos 'id'
//       const dataWithoutId = { ...data };
//       delete dataWithoutId.id;
//       valid = validate(dataWithoutId) as boolean;
//     } else {
//       valid = validate(data) as boolean;
//     }

//     if (!valid) {
//       console.error('Validation errors:', validate.errors);
//     }

//     return valid;
//   }
// }
