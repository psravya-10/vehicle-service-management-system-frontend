import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PartsRequest } from './parts-request';

describe('PartsRequest', () => {
    let component: PartsRequest;
    let fixture: ComponentFixture<PartsRequest>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PartsRequest]
        })
            .compileComponents();

        fixture = TestBed.createComponent(PartsRequest);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
