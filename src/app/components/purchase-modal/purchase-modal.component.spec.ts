import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PurchaseModalComponent } from './purchase-modal.component';

describe('PurchaseModalComponent', () => {
  let component: PurchaseModalComponent;
  let fixture: ComponentFixture<PurchaseModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [PurchaseModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PurchaseModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
