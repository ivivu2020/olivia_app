import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdddiscountPage } from './adddiscount.page';

describe('AdddiscountPage', () => {
  let component: AdddiscountPage;
  let fixture: ComponentFixture<AdddiscountPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdddiscountPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdddiscountPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
