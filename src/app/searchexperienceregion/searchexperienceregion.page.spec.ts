import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchExperienceRegionPage } from './searchexperienceregion.page';

describe('SearchExperienceRegionPage', () => {
  let component: SearchExperienceRegionPage;
  let fixture: ComponentFixture<SearchExperienceRegionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchExperienceRegionPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchExperienceRegionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
