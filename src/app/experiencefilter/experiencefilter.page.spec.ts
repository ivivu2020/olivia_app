import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperienceFilterPage } from './experiencefilter.page';

describe('ExperienceFilterPage', () => {
  let component: ExperienceFilterPage;
  let fixture: ComponentFixture<ExperienceFilterPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExperienceFilterPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExperienceFilterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
