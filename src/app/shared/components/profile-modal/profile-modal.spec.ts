import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileModal } from './profile-modal';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ProfileModal', () => {
    let component: ProfileModal;
    let fixture: ComponentFixture<ProfileModal>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ProfileModal, HttpClientTestingModule]
        }).compileComponents();

        fixture = TestBed.createComponent(ProfileModal);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should emit closed event on close', () => {
        spyOn(component.closed, 'emit');
        component.onClose();
        expect(component.closed.emit).toHaveBeenCalled();
    });
});
