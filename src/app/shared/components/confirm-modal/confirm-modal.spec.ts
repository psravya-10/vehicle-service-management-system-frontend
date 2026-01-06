import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmModal } from './confirm-modal';

describe('ConfirmModal', () => {
    let component: ConfirmModal;
    let fixture: ComponentFixture<ConfirmModal>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ConfirmModal]
        }).compileComponents();

        fixture = TestBed.createComponent(ConfirmModal);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should emit confirmed event on confirm', () => {
        spyOn(component.confirmed, 'emit');
        component.onConfirm();
        expect(component.confirmed.emit).toHaveBeenCalled();
    });

    it('should emit cancelled event on cancel', () => {
        spyOn(component.cancelled, 'emit');
        component.onCancel();
        expect(component.cancelled.emit).toHaveBeenCalled();
    });
});
