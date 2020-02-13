import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperienceSearchPage } from './experiencesearch.page';

describe('ExperienceSearchPage', () => {
  let component: ExperienceSearchPage;
  let fixture: ComponentFixture<ExperienceSearchPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExperienceSearchPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExperienceSearchPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
