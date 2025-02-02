import { TestBed } from '@angular/core/testing';

import { ValidatorService } from './task-validation-service.service';

describe('TaskValidationServiceService', () => {
  let service: ValidatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValidatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
