import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllNewsArticles } from './all-news-articles';

describe('AllNewsArticles', () => {
  let component: AllNewsArticles;
  let fixture: ComponentFixture<AllNewsArticles>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllNewsArticles]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllNewsArticles);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
