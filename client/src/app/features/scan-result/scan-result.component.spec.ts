import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScanResultComponent } from './scan-result.component';

describe('ScanResultComponent', () => {
  let component: ScanResultComponent;
  let fixture: ComponentFixture<ScanResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScanResultComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ScanResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
