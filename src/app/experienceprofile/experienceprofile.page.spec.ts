import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperienceProfilePage } from './experienceprofile.page';

describe('ExperienceProfilePage', () => {
  let component: ExperienceProfilePage;
  let fixture: ComponentFixture<ExperienceProfilePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExperienceProfilePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExperienceProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
