import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ServiceBays } from './service-bays';

describe('ServiceBays', () => {
    let component: ServiceBays;
    let fixture: ComponentFixture<ServiceBays>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ServiceBays]
        }).compileComponents();

        fixture = TestBed.createComponent(ServiceBays);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
