import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PartsInventory } from './parts-inventory';

describe('PartsInventory', () => {
    let component: PartsInventory;
    let fixture: ComponentFixture<PartsInventory>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PartsInventory]
        }).compileComponents();

        fixture = TestBed.createComponent(PartsInventory);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
