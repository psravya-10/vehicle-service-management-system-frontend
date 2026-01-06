import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PartRequests } from './part-requests';

describe('PartRequests', () => {
    let component: PartRequests;
    let fixture: ComponentFixture<PartRequests>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PartRequests]
        }).compileComponents();

        fixture = TestBed.createComponent(PartRequests);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
